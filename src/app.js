import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import authRoutes from './routes/authRoutes.js'
import propertyRoutes from './routes/propertyRoutes.js'
import agentRoutes from './routes/agentRoutes.js'
import collectionRoutes from './routes/collectionRoutes.js'
import conciergeRoutes from './routes/conciergeRoutes.js'
import membershipRoutes from './routes/membershipRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import policyRoutes from './routes/policyRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.clientUrl, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'luxury-estate-backend' })
})

app.use('/auth', authRoutes)
app.use('/properties', propertyRoutes)
app.use('/agents', agentRoutes)
app.use('/collections', collectionRoutes)
app.use('/concierge', conciergeRoutes)
app.use('/membership', membershipRoutes)
app.use('/inquiries', inquiryRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/content', policyRoutes)
app.use('/uploads', uploadRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
