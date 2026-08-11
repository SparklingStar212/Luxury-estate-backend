import { store } from '../data/store.js'

const formatService = (service) => ({
  id: service.id,
  slug: service.slug,
  title: service.title,
  description: service.description,
  icon: service.icon,
  sortOrder: service.sortOrder,
  published: service.published,
  createdAt: service.createdAt,
  updatedAt: service.updatedAt,
})

export const listConciergeServices = (_req, res) => {
  const items = [...store.conciergeServices]
    .filter((service) => service.published)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(formatService)

  res.json({ items, total: items.length })
}

export const getConciergeServiceBySlug = (req, res) => {
  const service = store.conciergeServices.find((item) => item.slug === req.params.slug)

  if (!service) {
    return res.status(404).json({ message: 'Concierge service not found' })
  }

  return res.json({ service: formatService(service) })
}

export const getConciergeContact = (_req, res) => {
  res.json({
    priorityLine: '+1 (800) LUXE-PRESTIGE',
    directEmail: 'concierge@luxuryestate.test',
    hours: '24/7',
    messagePrompt: 'Request a confidential consultation today.',
  })
}

export const getConciergeStats = (_req, res) => {
  const totalServices = store.conciergeServices.filter((service) => service.published).length
  res.json({ totalServices })
}
