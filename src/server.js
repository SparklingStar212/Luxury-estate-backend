import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './config/db.js'

dotenv.config()

const PORT = process.env.PORT

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Luxury Estate API running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start API:', error.message)
    process.exit(1)
  }
}

startServer()
