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
app.use(express.json({ limit: '10mb' }));
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
