import { PolicyPage } from '../data/schema.js'

const formatPolicy = (policy) => {
  if (!policy) return null
  const item = policy.toObject ? policy.toObject() : policy
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    body: item.body,
    updatedAt: item.updatedAt,
  }
}

export const listPolicyPages = async (_req, res) => {
  try {
    const policies = await PolicyPage.find({})
    const items = policies.map(formatPolicy)
    res.json({ items, total: items.length })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching policy pages', error: error.message })
  }
}

export const getPolicyPageBySlug = async (req, res) => {
  try {
    const policy = await PolicyPage.findOne({ slug: req.params.slug })

    if (!policy) {
      return res.status(404).json({ message: 'Policy page not found' })
    }

    return res.json({ policy: formatPolicy(policy) })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching policy page', error: error.message })
  }
}

export const updatePolicyPage = async (req, res) => {
  try {
    const { title, body } = req.body
    const updateData = {}

    if (title !== undefined) updateData.title = title
    if (body !== undefined) updateData.body = body

    const updatedPolicy = await PolicyPage.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true }
    )

    if (!updatedPolicy) {
      return res.status(404).json({ message: 'Policy page not found' })
    }

    return res.json({ policy: formatPolicy(updatedPolicy) })
  } catch (error) {
    return res.status(500).json({ message: 'Error updating policy page', error: error.message })
  }
}

export const getSiteContent = async (_req, res) => {
  try {
    const policies = await PolicyPage.find({})
    res.json({
      hero: {
        title: 'Luxe Estate',
        subtitle: 'Curated private real estate experiences for discerning clients.',
      },
      policies: policies.map(formatPolicy),
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching site content', error: error.message })
  }
}