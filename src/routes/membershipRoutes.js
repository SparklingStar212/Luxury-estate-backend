import { Router } from 'express'
import { getMembershipComparison, getMembershipHero, getMembershipPlanBySlug, listMembershipPlans } from '../controllers/membershipController.js'

const router = Router()

router.get('/hero', getMembershipHero)
router.get('/comparison', getMembershipComparison)
router.get('/:slug', getMembershipPlanBySlug)
router.get('/', listMembershipPlans)

export default router
