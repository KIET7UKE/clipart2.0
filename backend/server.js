require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Rate Limiter ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment.' },
});
app.use('/generate', limiter);

// ─── Gemini Configuration ─────────────────────────────────────
// GEMINI_API_KEY is loaded from .env and used directly in axios calls.

// ─── Style → Prompt Map ───────────────────────────────────────
const STYLE_PROMPTS = {
  cartoon:
    'cartoon clipart illustration, bold outlines, vibrant colors, clean white background, digital art style',
  flat: 'flat design clipart, minimalist vector art, solid colors, clean white background, modern geometric aesthetic',
  anime:
    'anime style clipart, Japanese animation aesthetic, clean line art, soft cel shading, clean white background',
  pixel:
    '16-bit pixel art clipart, retro video game sprite, clean white background, vibrant simplified palette',
  sketch:
    'pencil sketch clipart, hand-drawn graphite illustration, fine line work, black and white on clean white background',
};

// ─── Simple Vision Cache ──────────────────────────────────────
const visionCache = new Map();

// ─── POST /generate ───────────────────────────────────────────
app.post('/generate', async (req, res) => {
  let { image, styleId } = req.body;

  // 1. Cleanup: strip data URI prefix (e.g., 'data:image/jpeg;base64,') if present
  if (image && image.includes('base64,')) {
    image = image.split('base64,')[1];
  }

  if (!image || !styleId || !STYLE_PROMPTS[styleId]) {
    return res
      .status(400)
      .json({ error: 'Missing or invalid fields (image/styleId).' });
  }

  try {
    console.log(
      `[generate] styleId=${styleId} | Starting generation for subject...`,
    );

    // 1. USE Gemini for visual description (with caching)
    let subjectDescription = '';
    const imageHash = image.substring(0, 100); // Simple hash (first 100 chars of base64)

    if (visionCache.has(imageHash)) {
      subjectDescription = visionCache.get(imageHash);
      console.log(`[generate] Visual Description (CACHED): ${subjectDescription}`);
    } else {
      console.log(`[generate] Calling Gemini 2.5 Flash for description...`);
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      const geminiPayload = {
        contents: [
          {
            parts: [
              {
                text: 'Describe the main subject in 5 words maximum (e.g., boy in red hat). Only output the description.',
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: image,
                },
              },
            ],
          },
        ],
      };

      const visionResponse = await axios.post(geminiUrl, geminiPayload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (
        !visionResponse.data ||
        !visionResponse.data.candidates ||
        visionResponse.data.candidates.length === 0
      ) {
        throw new Error('Gemini API returned an empty response.');
      }

      subjectDescription = visionResponse.data.candidates[0].content.parts[0].text
        .trim()
        .replace(/[.,;]$/, '');
      
      visionCache.set(imageHash, subjectDescription);
      console.log(`[generate] Visual Description (Gemini): ${subjectDescription}`);
      
      // Cleanup cache after 5 minutes to prevent memory leaks
      setTimeout(() => visionCache.delete(imageHash), 5 * 60 * 1000);
    }

    // 2. Combine description with the requested clipart style
    const stylePrompt = STYLE_PROMPTS[styleId];
    const finalPrompt = `${stylePrompt} of ${subjectDescription}, minimalist, clean vector, white background, no text, no watermark`;
    console.log(`[generate] Final Prompt: ${finalPrompt}`);

    // 3. Generate with Pollinations.ai (FREE / Authenticated)
    const seed = Math.floor(Math.random() * 999999);
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const pollKeyPart = process.env.POLLINATIONS_API_KEY ? `key=${process.env.POLLINATIONS_API_KEY}&` : '';
    // Switching to 'z-image-turbo' as it's the correct name for the free turbo model
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${pollKeyPart}width=512&height=512&seed=${seed}&nologo=true&model=z-image-turbo`;

    console.log(`[generate] styleId=${styleId} | done → ${imageUrl}`);
    
    // 4. Return as a PROXY URL to bypass mobile image loading issues
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const proxiedUrl = `${protocol}://${host}/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    
    return res.json({ imageUrl: proxiedUrl });
  } catch (err) {
    console.error(`[generate] Error:`, err.message);
    return res.status(500).json({
      error: 'Generation failed. Please try again.',
      detail: err.message,
    });
  }
});

// ─── GET /proxy-image ─────────────────────────────────────────
app.get('/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL is required.');

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'] || 'image/png';
    res.set('Content-Type', contentType);
    res.send(response.data);
  } catch (err) {
    console.error(`[proxy] Error:`, err.message);
    res.status(500).send('Failed to proxy image.');
  }
});

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
