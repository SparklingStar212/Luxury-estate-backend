import { Router } from 'express'
import { getProperties, getPropertyById } from '../controllers/propertyController.js'

const router = Router()

router.get('/', getProperties)
router.get('/:id', getPropertyById)

export default router
