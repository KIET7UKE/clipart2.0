const axios = require('axios');
const config = require('../config/config');

// ─── Simple Vision Cache ──────────────────────────────────────
const visionCache = new Map();

/**
 * Get visual description from Gemini with caching and retry logic.
 */
module.exports.getSubjectDescription = async (image) => {
  const imageHash = image.substring(0, 100);

  if (visionCache.has(imageHash)) {
    console.log(`[aiService] Returning cached visual description...`);
    return await visionCache.get(imageHash);
  }

  console.log(`[aiService] Requesting Gemini description...`);
  const geminiTask = (async () => {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.GEMINI_API_KEY}`;
    
    const geminiPayload = {
      contents: [
        {
          parts: [
            { text: 'Describe the main subject in 5 words maximum (e.g., boy in red hat). Only output the description.' },
            { inline_data: { mime_type: 'image/jpeg', data: image } },
          ],
        },
      ],
    };

    const MAX_RETRIES = 3;
    let delay = 2000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await axios.post(geminiUrl, geminiPayload, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
          throw new Error('Gemini API returned an empty response.');
        }

        return response.data.candidates[0].content.parts[0].text.trim().replace(/[.,;]$/, '');
      } catch (err) {
        if (err.response && err.response.status === 429 && attempt < MAX_RETRIES) {
          console.warn(`[aiService] Gemini 429! Retry ${attempt}/${MAX_RETRIES} in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
          continue;
        }
        throw err;
      }
    }
  })();

  visionCache.set(imageHash, geminiTask);
  
  try {
    const description = await geminiTask;
    // Cache cleanup after 15 mins
    setTimeout(() => {
      if (visionCache.get(imageHash) === geminiTask) visionCache.delete(imageHash);
    }, 15 * 60 * 1000);
    return description;
  } catch (err) {
    visionCache.delete(imageHash);
    throw err;
  }
};

/**
 * Generate clipart using Hugging Face (FLUX.1-schnell).
 */
module.exports.generateClipart = async (finalPrompt) => {
  console.log(`[aiService] Generating with Hugging Face...`);
  const response = await axios.post(
    'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
    { inputs: finalPrompt },
    {
      headers: {
        Authorization: `Bearer ${config.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'image/png',
      },
      responseType: 'arraybuffer',
    },
  );

  const contentType = response.headers['content-type'] || 'image/png';
  const base64Image = Buffer.from(response.data).toString('base64');
  return `data:${contentType};base64,${base64Image}`;
};
