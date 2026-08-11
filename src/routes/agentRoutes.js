import { Router } from 'express'
import { listAgents, listFeaturedAgents, getAgentById, getAgentByUserId, getAdvisoryStats } from '../controllers/agentController.js'

const router = Router()

router.get('/featured', listFeaturedAgents)
router.get('/stats', getAdvisoryStats)
router.get('/user/:userId', getAgentByUserId)
router.get('/:id', getAgentById)
router.get('/', listAgents)

export default router
