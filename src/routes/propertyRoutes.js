import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { roles } from '../config/roles.js'
import {
  createProperty,
  deleteProperty,
  getPropertyById,
  getPropertyBySlug,
  getPropertyStats,
  listFeaturedProperties,
  listProperties,
  updateProperty,
} from '../controllers/propertyController.js'

const router = Router()

router.get('/', listProperties)
router.get('/featured', listFeaturedProperties)
router.get('/stats', authenticate, authorize(roles.admin), getPropertyStats)
router.get('/slug/:slug', getPropertyBySlug)
router.get('/:id', getPropertyById)
router.post('/', authenticate, authorize(roles.agent, roles.admin), createProperty)
router.patch('/:id', authenticate, authorize(roles.agent, roles.admin), updateProperty)
router.delete('/:id', authenticate, authorize(roles.admin), deleteProperty)

export default router
