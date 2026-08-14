import { ConciergeService } from '../data/schema.js'

const formatService = (service) => {
  if (!service) return null
  const item = service.toObject ? service.toObject() : service
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    icon: item.icon,
    sortOrder: item.sortOrder,
    published: item.published,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

export const listConciergeServices = async (_req, res) => {
  try {
    const services = await ConciergeService.find({ published: true }).sort({ sortOrder: 1 })
    res.json({ items: services.map(formatService), total: services.length })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching concierge services', error: error.message })
  }
}

export const getConciergeServiceBySlug = async (req, res) => {
  try {
    const service = await ConciergeService.findOne({ slug: req.params.slug })

    if (!service) {
      return res.status(404).json({ message: 'Concierge service not found' })
    }

    res.json({ service: formatService(service) })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching concierge service', error: error.message })
  }
}