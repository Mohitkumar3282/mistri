import mongoose from 'mongoose';

/**
 * Connect to MongoDB Database
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mistri_db');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.warn(`ℹ️ Operating with in-memory fallback dataset for smooth instant testing.`);
    return false;
  }
};

export default connectDB;
