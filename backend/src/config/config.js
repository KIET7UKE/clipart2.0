const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  MONGO_URI: process.env.MONGO_URI || '', // For later database use
};
