const aiService = require('../services/aiService');
const { STYLE_PROMPTS, INTENSITY_MODIFIERS } = require('../utils/constants');
const Clipart = require('../models/Clipart');

/**
 * Endpoint to generate clipart based on user image and style preferences.
 */
module.exports.generate = async (req, res) => {
  let { image, styleId, customPrompt, styleIntensity, userId } = req.body;

  // 1. Cleanup base64 image
  if (image && image.includes('base64,')) {
    image = image.split('base64,')[1];
  }

  if (!image || !styleId || !STYLE_PROMPTS[styleId]) {
    return res.status(400).json({ error: 'Missing or invalid fields (image/styleId).' });
  }

  // Sanitize inputs
  customPrompt = customPrompt?.trim()?.substring(0, 120) || '';
  const intensity = Math.max(1, Math.min(5, parseInt(styleIntensity) || 3));
  const intensityModifier = INTENSITY_MODIFIERS[intensity - 1];

  try {
    console.log(`[artController] styleId=${styleId} | Starting generation for subject...`);

    // 1. Get visual description from AI Service
    const subjectDescription = await aiService.getSubjectDescription(image);
    console.log(`[artController] Visual Description: ${subjectDescription}`);

    // 2. Prepare final prompt
    const stylePrompt = STYLE_PROMPTS[styleId];
    const customSuffix = customPrompt ? `, ${customPrompt}` : '';
    const finalPrompt = `${stylePrompt} of ${subjectDescription}${customSuffix}, ${intensityModifier}, minimalist, clean vector, white background, no text, no watermark`;

    // 3. Generate clipart via AI Service
    const imageUrl = await aiService.generateClipart(finalPrompt);

    // 4. Save to Database (if userId provided)
    if (userId) {
      try {
        await Clipart.create({
          userId,
          styleId,
          originalPrompt: subjectDescription,
          finalPrompt,
          imageUrl,
          styleIntensity: intensity
        });
        console.log(`[artController] Generation saved to DB for user: ${userId}`);
      } catch (dbErr) {
        console.error(`[artController] Database Save Failure:`, dbErr.message);
      }
    }

    return res.json({ imageUrl });

  } catch (err) {
    console.error(`[artController] Error:`, err.message);
    return res.status(500).json({
      error: 'Generation failed. Please try again.',
      detail: err.message,
    });
  }
};

/**
 * Endpoint to fetch all generated art for a specific user.
 */
module.exports.getHistory = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'UserId is required' });
  }

  try {
    const history = await Clipart.find({ userId }).sort({ createdAt: -1 });
    res.json({ history });
  } catch (err) {
    console.error(`[artController] History Error:`, err.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

/**
 * Proxy for handling image requests and avoiding CORS/protocol issues.
 */
module.exports.proxyImage = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL is required.');

  try {
    const axios = require('axios');
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'] || 'image/png';
    res.set('Content-Type', contentType);
    res.send(response.data);
  } catch (err) {
    console.error(`[artController] Proxy Error:`, err.message);
    res.status(500).send('Failed to proxy image.');
  }
};

/**
 * Health check endpoint.
 */
module.exports.healthCheck = (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};
