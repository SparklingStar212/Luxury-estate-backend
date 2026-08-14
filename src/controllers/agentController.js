import { Agent } from '../data/schema.js'

const formatAgent = (agent) => {
  if (!agent) return null
  const item = agent.toObject ? agent.toObject() : agent
  return {
    id: item.id,
    userId: item.userId,
    name: item.name,
    title: item.title,
    bio: item.bio,
    photoUrl: item.photoUrl,
    email: item.email,
    phone: item.phone,
    featured: item.featured,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

export const listAgents = async (req, res) => {
  try {
    const featuredOnly = req.query.featured === 'true' || req.query.featured === '1'
    const filter = featuredOnly ? { featured: true } : {}
    const agents = await Agent.find(filter)
    res.json({ items: agents.map(formatAgent), total: agents.length })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agents', error: error.message })
  }
}

export const listFeaturedAgents = async (_req, res) => {
  try {
    const agents = await Agent.find({ featured: true })
    res.json({ items: agents.map(formatAgent) })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured agents', error: error.message })
  }
}

export const getAgentById = async (req, res) => {
  try {
    const agentId = Number(req.params.id)
    const agent = await Agent.findOne({ id: agentId })

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' })
    }

    res.json({ agent: formatAgent(agent) })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agent', error: error.message })
  }
}

export const getAgentStats = async (_req, res) => {
  try {
    const [total, featured] = await Promise.all([
      Agent.countDocuments(),
      Agent.countDocuments({ featured: true }),
    ])

    res.json({ total, featured })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agent stats', error: error.message })
  }
}