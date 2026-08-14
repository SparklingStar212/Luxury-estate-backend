import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { roles } from '../config/roles.js'
import {
  getAdminStats,
  getDashboardOverview,
  getDashboardSummary,
  getHouseRecordings,
  getListingManagement,
  getNetworkLoad,
  getPerformanceStats,
  getRecentActivity,
  getUserActivity,
} from '../controllers/dashboardController.js'

const router = Router()

router.get('/summary', authenticate, authorize(roles.admin), getDashboardSummary)
router.get('/recent-activity', authenticate, authorize(roles.admin), getRecentActivity)
router.get('/performance', authenticate, authorize(roles.admin), getPerformanceStats)
router.get('/listings', authenticate, authorize(roles.admin), getListingManagement)
router.get('/admin-stats', authenticate, authorize(roles.admin), getAdminStats)
router.get('/user-activity', authenticate, authorize(roles.admin), getUserActivity)
router.get('/network-load', authenticate, authorize(roles.admin), getNetworkLoad)
router.get('/recordings', authenticate, authorize(roles.admin), getHouseRecordings)
router.get('/overview', authenticate, authorize(roles.admin), getDashboardOverview)

export default router
