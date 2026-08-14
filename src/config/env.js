import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI,
  authSecret: process.env.AUTH_SECRET || 'luxury-estate-dev-secret',
  authTokenTtlSeconds: Number(process.env.AUTH_TOKEN_TTL_SECONDS || 60 * 60 * 8),
}
