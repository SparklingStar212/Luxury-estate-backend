import { Router } from 'express'
import { getAgentById } from '../controllers/agentController.js'

const router = Router()

router.get('/:id', getAgentById)

export default router
