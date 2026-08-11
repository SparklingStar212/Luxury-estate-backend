import { store } from '../data/store.js'
import { createAuthToken, sanitizeUser, verifyPassword } from '../utils/auth.js'

export const login = (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = store.users.find((item) => item.email.toLowerCase() === String(email).toLowerCase())

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = createAuthToken(user)

  return res.json({
    token,
    user: sanitizeUser(user),
  })
}

export const me = (req, res) => {
  return res.json({ user: req.user })
}

export const logout = (_req, res) => {
  return res.json({ message: 'Logged out' })
}