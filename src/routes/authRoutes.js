import { Router } from 'express'
import { login, logout, me } from '../controllers/authController.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { roles } from '../config/roles.js'

const router = Router()

router.post('/login', login)
router.get('/me', authenticate, me)
router.post('/logout', authenticate, logout)
router.get('/admin-check', authenticate, authorize(roles.admin), (_req, res) => {
  res.json({ message: 'Admin access granted' })
})

export default router