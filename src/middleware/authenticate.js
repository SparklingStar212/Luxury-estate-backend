import { User } from '../data/schema.js'
import { sanitizeUser, verifyAuthToken } from '../utils/auth.js'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const payload = verifyAuthToken(token)

    if (!payload) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    // Look up user in MongoDB by numeric ID matching token payload
    const user = await User.findOne({ id: payload.sub })

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.auth = payload
    req.user = sanitizeUser(user.toObject ? user.toObject() : user)
    next()
  } catch (error) {
    return res.status(500).json({ message: 'Authentication failed', error: error.message })
  }
}