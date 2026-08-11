import { Router } from 'express'
import { createInquiry, listInquiries } from '../controllers/inquiryController.js'

const router = Router()

router.get('/', listInquiries)
router.post('/', createInquiry)

export default router
