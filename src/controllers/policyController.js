import { PolicyPage } from '../data/schema.js'

const formatPolicy = (policy) => ({
  id: policy.id,
  slug: policy.slug,
  title: policy.title,
  body: policy.body,
  updatedAt: policy.updatedAt,
})

export const listPolicyPages = (_req, res) => {
  const items = store.policyPages.map(formatPolicy)
  res.json({ items, total: items.length })
}

export const getPolicyPageBySlug = (req, res) => {
  const policy = store.policyPages.find((item) => item.slug === req.params.slug)

  if (!policy) {
    return res.status(404).json({ message: 'Policy page not found' })
  }

  return res.json({ policy: formatPolicy(policy) })
}

export const updatePolicyPage = (req, res) => {
  const policy = store.policyPages.find((item) => item.slug === req.params.slug)

  if (!policy) {
    return res.status(404).json({ message: 'Policy page not found' })
  }

  const { title, body } = req.body

  if (title) policy.title = title
  if (body) policy.body = body
  policy.updatedAt = new Date().toISOString()

  return res.json({ policy: formatPolicy(policy) })
}

export const getSiteContent = (_req, res) => {
  res.json({
    hero: {
      title: 'Luxe Estate',
      subtitle: 'Curated private real estate experiences for discerning clients.',
    },
    policies: store.policyPages.map(formatPolicy),
  })
}