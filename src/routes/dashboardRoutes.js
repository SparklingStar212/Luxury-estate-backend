import { Router } from 'express'
import { getDashboardOverview, getDashboardActivity } from '../controllers/dashboardController.js'

const router = Router()

router.get('/overview', getDashboardOverview)
router.get('/activity', getDashboardActivity)

export default router
