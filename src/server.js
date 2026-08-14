import app from './app.js'
import { env } from './config/env.js'
import { connectDB } from './config/database.js'

connectDB()

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`)
})
  