require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const stepperRoutes = require('./routes/stepperRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const configuredOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function isLocalDevOrigin(origin) {
  if (!origin) return false;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const prod = process.env.NODE_ENV === 'production';
  const allowOrigin =
    origin &&
    (configuredOrigins.includes(origin) || (!prod && isLocalDevOrigin(origin)));
  if (allowOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 });
});

app.use('/api/onboarding', stepperRoutes);

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in environment');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
  } catch (err) {
    const msg = String(err?.message || err);
    if (msg.includes('bad auth') || err?.code === 8000) {
      console.error(
        '\nMongoDB authentication failed. Fix backend/.env MONGODB_URI (Atlas database user + password), and ensure that user exists under Database Access. Also check Atlas Network Access allows your IP (or 0.0.0.0/0 for testing only).\n'
      );
    }
    throw err;
  }
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
