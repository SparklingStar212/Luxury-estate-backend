import Agent from '../models/Agent.js'

export const getAgentById = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id).lean()

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' })
    }

    return res.json(agent)
  } catch (error) {
    return next(error)
  }
}
