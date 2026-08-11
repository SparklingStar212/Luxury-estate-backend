import { Router } from 'express'
import propertyRoutes from './propertyRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import agentRoutes from './agentRoutes.js'
import inquiryRoutes from './inquiryRoutes.js'

const router = Router()

router.use('/properties', propertyRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/agents', agentRoutes)
router.use('/inquiries', inquiryRoutes)

export default router
