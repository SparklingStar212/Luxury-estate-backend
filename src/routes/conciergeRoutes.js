import { Router } from 'express'
import { getConciergeContact, getConciergeServiceBySlug, getConciergeStats, listConciergeServices } from '../controllers/conciergeController.js'

const router = Router()

router.get('/stats', getConciergeStats)
router.get('/contact', getConciergeContact)
router.get('/:slug', getConciergeServiceBySlug)
router.get('/', listConciergeServices)

export default router
