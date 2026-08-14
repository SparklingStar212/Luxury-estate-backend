import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { roles } from '../config/roles.js'
import { validate } from '../middleware/validate.js'
import { getPolicyPageBySlug, getSiteContent, listPolicyPages, updatePolicyPage } from '../controllers/policyController.js'

const router = Router()

router.get('/site-content', getSiteContent)
router.get('/policies', listPolicyPages)
router.get('/policies/:slug', getPolicyPageBySlug)
router.patch('/policies/:slug', authenticate, authorize(roles.admin), validate({ title: { type: 'string' }, body: { type: 'string' } }), updatePolicyPage)

export default router