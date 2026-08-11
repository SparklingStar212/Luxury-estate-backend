import crypto from 'node:crypto'
import { env } from '../config/env.js'

const encode = (value) => Buffer.from(value).toString('base64url')
const decode = (value) => Buffer.from(value, 'base64url').toString('utf8')

const sign = (value) => crypto.createHmac('sha256', env.authSecret).update(value).digest('base64url')

export const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex')

export const verifyPassword = (password, passwordHash) => hashPassword(password) === passwordHash

export const createAuthToken = (user) => {
  const issuedAt = Date.now()
  const expiresAt = issuedAt + env.authTokenTtlSeconds * 1000
  const payload = encode(JSON.stringify({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    issuedAt,
    expiresAt,
  }))
  return `${payload}.${sign(payload)}`
}

export const verifyAuthToken = (token) => {
  const [payload, signature] = token.split('.')

  if (!payload || !signature) {
    return null
  }

  const expectedSignature = sign(payload)

  if (expectedSignature.length !== signature.length) {
    return null
  }

  if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))) {
    return null
  }

  const decoded = JSON.parse(decode(payload))

  if (decoded.expiresAt && decoded.expiresAt < Date.now()) {
    return null
  }

  return decoded
}

export const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl,
  phone: user.phone,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})