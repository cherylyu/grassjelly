import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('請提供 MONGODB_URI 環境變數');
}

// Augment the global namespace with the mongoose property
declare global {
  var mongoose: any | undefined; // eslint-disable-line no-var, @typescript-eslint/no-explicit-any
}

// Cache the Mongoose connection, especially useful in dev mode's hot-reload environment
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to the MongoDB
 * @returns Mongoose connection instance
 */
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB 連線成功');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB 連線失敗:', e);
    throw e;
  }

  return cached.conn;
}
