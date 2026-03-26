const mongoose = require('mongoose');

const clipartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  styleId: { type: String, required: true },
  originalPrompt: { type: String },
  finalPrompt: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Data URI or URL to storage
  styleIntensity: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now },
});

const Clipart = mongoose.model('Clipart', clipartSchema);

module.exports = Clipart;
