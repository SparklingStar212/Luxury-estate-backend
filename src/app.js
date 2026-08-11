import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import apiRouter from './routes/index.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'luxury-estate-api' })
})

app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
