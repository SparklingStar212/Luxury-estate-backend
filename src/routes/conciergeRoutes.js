import { Router } from 'express'
import { getConciergeServiceBySlug, listConciergeServices } from '../controllers/conciergeController.js'

const router = Router()

// router.get('/stats', getConciergeStats)
// router.get('/contact', getConciergeContact)
router.get('/:slug', getConciergeServiceBySlug)
router.get('/', listConciergeServices)

export default router
