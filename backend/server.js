require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

// Ensure generated folder exists
const generatedPath = path.join(__dirname, 'generated');
if (!fs.existsSync(generatedPath)) {
  fs.mkdirSync(generatedPath);
}

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/generated', express.static(generatedPath));

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
  '3d': '3D render clipart, Pixar style, soft ambient lighting, high detail, volumetric shadows, clean white background',
  minimalist: 'minimalist line art clipart, continuous line drawing, simple elegant shapes, clean white background, modern aesthetic',
  retro: 'retro vintage clipart, 1950s style, nostalgic color palette, textured paper look, clean white background',
  graffiti: 'graffiti street art clipart, urban style, bold spray paint strokes, vibrant neon colors, clean white background',
};

// ─── Simple Vision Cache ──────────────────────────────────────
const visionCache = new Map();

// ─── POST /generate ───────────────────────────────────────────
app.post('/generate', async (req, res) => {
  let { image, styleId, customPrompt } = req.body;

  // 1. Cleanup: strip data URI prefix (e.g., 'data:image/jpeg;base64,') if present
  if (image && image.includes('base64,')) {
    image = image.split('base64,')[1];
  }

  if (!image || !styleId || !STYLE_PROMPTS[styleId]) {
    return res
      .status(400)
      .json({ error: 'Missing or invalid fields (image/styleId).' });
  }

  // Sanitize customPrompt
  if (customPrompt && typeof customPrompt === 'string') {
    customPrompt = customPrompt.trim().substring(0, 120); // enforce max 120 chars
  } else {
    customPrompt = '';
  }

  try {
    console.log(
      `[generate] styleId=${styleId} | Starting generation for subject...`,
    );

    // 1. USE Gemini for visual description (with caching & deduplication)
    let subjectDescription = '';
    const imageHash = image.substring(0, 100); // Simple hash (first 100 chars of base64)

    if (visionCache.has(imageHash)) {
      console.log(`[generate] Visual Description (WAITING FOR CACHE): styleId=${styleId}`);
      subjectDescription = await visionCache.get(imageHash);
    } else {
      console.log(`[generate] Calling Gemini 2.5 Flash for description...`);
      
      const geminiTask = (async () => {
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

        // Exponential backoff retry logic for 429
        const MAX_RETRIES = 3;
        let delay = 2000; // start with 2s

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
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

            return visionResponse.data.candidates[0].content.parts[0].text
              .trim()
              .replace(/[.,;]$/, '');
          } catch (err) {
            if (err.response && err.response.status === 429 && attempt < MAX_RETRIES) {
              console.warn(`[generate] Gemini 429! Retry ${attempt}/${MAX_RETRIES} in ${delay}ms...`);
              await new Promise(r => setTimeout(r, delay));
              delay *= 2; // exponential backoff
              continue;
            }
            throw err; // final attempt failed or other error
          }
        }
      })();

      // Store the Promise itself in the cache to avoid race conditions
      visionCache.set(imageHash, geminiTask);
      
      try {
        subjectDescription = await geminiTask;
        console.log(`[generate] Visual Description (Gemini): ${subjectDescription}`);
        
        // Cleanup cache after 15 minutes
        setTimeout(() => {
          if (visionCache.get(imageHash) === geminiTask) {
             visionCache.delete(imageHash);
          }
        }, 15 * 60 * 1000);
      } catch (err) {
        visionCache.delete(imageHash); // Don't cache failures
        throw err;
      }
    }

    // 2. Combine description with the requested clipart style (+ optional user customization)
    const stylePrompt = STYLE_PROMPTS[styleId];
    const customSuffix = customPrompt ? `, ${customPrompt}` : '';
    const finalPrompt = `${stylePrompt} of ${subjectDescription}${customSuffix}, minimalist, clean vector, white background, no text, no watermark`;
    console.log(`[generate] Final Prompt: ${finalPrompt}`);

    // 3. Generate with Hugging Face (FLUX.1-schnell) - SUPERIOR QUALITY
    console.log(`[generate] styleId=${styleId} | Calling Hugging Face...`);
    let hfResponse;
    try {
      hfResponse = await axios.post(
        'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
        { inputs: finalPrompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
            Accept: 'image/png',
          },
          responseType: 'arraybuffer',
        },
      );
    } catch (err) {
      if (err.response && err.response.data) {
        const errorDetail = Buffer.from(err.response.data).toString();
        console.error(`[generate] Hugging Face API Error Details:`, errorDetail);
      }
      throw err;
    }

    const contentType = hfResponse.headers['content-type'] || 'image/png';
    const base64Image = Buffer.from(hfResponse.data).toString('base64');
    const dataUri = `data:${contentType};base64,${base64Image}`;

    console.log(`[generate] styleId=${styleId} | DONE (Content-Type: ${contentType}, length: ${base64Image.length})`);
    return res.json({ imageUrl: dataUri });
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
