import { store } from '../data/store.js'
import { sanitizeUser, verifyAuthToken } from '../utils/auth.js'

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  const payload = verifyAuthToken(token)

  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }

  const user = store.users.find((item) => item.id === payload.sub)

  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  req.auth = payload
  req.user = sanitizeUser(user)
  next()
}