import mongoose from 'mongoose'
import { env } from './env.js'

export const connectDB = async () => {
  try {
    // Uses MONGO_URI from env.js (or process.env.MONGO_URI)
    const conn = await mongoose.connect(env.mongoUri || process.env.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}