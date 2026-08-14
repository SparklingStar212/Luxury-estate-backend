import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { roles } from '../config/roles.js'
import {
  addInquiryMessage,
  assignInquiry,
  createInquiry,
  getInquiryById,
  getInquiryStats,
  getRecentLeads,
  listInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController.js'

const router = Router()

router.get('/stats', authenticate, authorize(roles.agent, roles.admin), getInquiryStats)
router.get('/recent', authenticate, authorize(roles.agent, roles.admin), getRecentLeads)
router.get('/:id', authenticate, authorize(roles.agent, roles.admin), getInquiryById)
router.patch('/:id/status', authenticate, authorize(roles.agent, roles.admin), updateInquiryStatus)
router.patch('/:id/assign', authenticate, authorize(roles.admin), assignInquiry)
router.post('/:id/messages', authenticate, authorize(roles.agent, roles.admin), addInquiryMessage)
router.get('/', authenticate, authorize(roles.agent, roles.admin), listInquiries)
router.post('/', createInquiry)

export default router