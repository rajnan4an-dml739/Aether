const mongoose = require('mongoose');

const globalForMongoose = globalThis;

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const err = new Error('MONGODB_URI is not configured for this site');
    err.statusCode = 503;
    throw err;
  }

  let cached = globalForMongoose.__aetherMongoose;
  if (!cached) {
    cached = globalForMongoose.__aetherMongoose = { conn: null, promise: null };
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectDb };
