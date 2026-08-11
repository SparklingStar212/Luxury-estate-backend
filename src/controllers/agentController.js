import { store } from '../data/store.js'

const formatAgent = (agent) => ({
  id: agent.id,
  userId: agent.userId,
  name: agent.name,
  title: agent.title,
  bio: agent.bio,
  photoUrl: agent.photoUrl,
  email: agent.email,
  phone: agent.phone,
  featured: agent.featured,
  createdAt: agent.createdAt,
  updatedAt: agent.updatedAt,
})

const formatProperty = (property) => ({
  id: property.id,
  slug: property.slug,
  title: property.title,
  description: property.description,
  price: property.price,
  amount: `$${property.price.toLocaleString('en-US')}`,
  address: property.address,
  city: property.city,
  state: property.state,
  country: property.country,
  beds: property.beds,
  baths: property.baths,
  areaSqft: property.areaSqft,
  propertyType: property.propertyType,
  status: property.status,
  featured: property.featured,
  image: property.heroImageUrl,
  heroImageUrl: property.heroImageUrl,
  galleryImages: property.galleryImages || [],
  floorPlans: property.floorPlans || [],
  amenities: property.amenities || [],
  overview: property.overview,
  agentId: property.agentId,
  createdAt: property.createdAt,
  updatedAt: property.updatedAt,
})

const getAgentProperties = (agentId, statuses = []) => {
  return store.properties
    .filter((property) => property.agentId === agentId && (statuses.length === 0 || statuses.includes(property.status)))
    .map(formatProperty)
}

export const listAgents = (req, res) => {
  const search = String(req.query.search || req.query.q || '').toLowerCase()
  const featuredOnly = req.query.featured === 'true' || req.query.featured === '1'
  const title = String(req.query.title || '').toLowerCase()

  let items = [...store.agents]

  if (search) {
    items = items.filter((agent) => [agent.name, agent.title, agent.bio, agent.email, agent.phone].filter(Boolean).join(' ').toLowerCase().includes(search))
  }

  if (title) {
    items = items.filter((agent) => agent.title.toLowerCase().includes(title))
  }

  if (featuredOnly) {
    items = items.filter((agent) => agent.featured)
  }

  res.json({
    items: items.map(formatAgent),
    total: items.length,
  })
}

export const listFeaturedAgents = (_req, res) => {
  const items = store.agents.filter((agent) => agent.featured).map(formatAgent)
  res.json({ items })
}

export const getAgentById = (req, res) => {
  const agentId = Number(req.params.id)
  const agent = store.agents.find((item) => item.id === agentId)

  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' })
  }

  const activeListings = getAgentProperties(agent.id, ['active', 'pending'])
  const soldListings = getAgentProperties(agent.id, ['sold'])

  return res.json({
    agent: formatAgent(agent),
    activeListings,
    soldListings,
    stats: {
      activeListings: activeListings.length,
      soldListings: soldListings.length,
      totalTransactions: activeListings.length + soldListings.length,
    },
  })
}

export const getAgentByUserId = (req, res) => {
  const userId = Number(req.params.userId)
  const agent = store.agents.find((item) => item.userId === userId)

  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' })
  }

  const activeListings = getAgentProperties(agent.id, ['active', 'pending'])
  const soldListings = getAgentProperties(agent.id, ['sold'])

  return res.json({
    agent: formatAgent(agent),
    activeListings,
    soldListings,
  })
}

export const getAdvisoryStats = (_req, res) => {
  const featuredAgents = store.agents.filter((agent) => agent.featured).length
  const activeAgents = store.agents.length
  const totalListings = store.properties.length
  const soldListings = store.properties.filter((property) => property.status === 'sold').length

  res.json({
    featuredAgents,
    activeAgents,
    totalListings,
    soldListings,
  })
}
