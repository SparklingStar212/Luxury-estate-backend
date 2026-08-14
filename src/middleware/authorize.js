import { roles } from '../config/roles.js'

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    if (req.user.role === roles.superAdmin) {
      return next()
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    return next()
  }
}