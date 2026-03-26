const express = require('express');
const router = express.Router();
const artController = require('../controllers/artController');
const rateLimit = require('express-rate-limit');

// ─── Rate Limiter ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment.' },
});

// Art endpoints
router.post('/generate', limiter, artController.generate);
router.get('/history/:userId', artController.getHistory);
router.get('/proxy-image', artController.proxyImage);
router.get('/health', artController.healthCheck);

module.exports = router;
