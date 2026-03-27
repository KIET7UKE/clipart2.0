const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const artRoutes = require('./routes/artRoutes');

const app = express();
const PORT = config.PORT;

// Ensure generated folder exists
const generatedPath = path.join(__dirname, '..', 'generated');
if (!fs.existsSync(generatedPath)) {
  fs.mkdirSync(generatedPath);
}

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use('/generated', express.static(generatedPath));

// ─── Routes ───────────────────────────────────────────────────
app.use('/', artRoutes);

// ─── Database Connection ──────────────────────────────────────
if (config.MONGO_URI) {
  const mongoose = require('mongoose');
  mongoose.connect(config.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Image too large. Please use a smaller image (max ~18MB).' });
  }
  console.error('[server] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});
