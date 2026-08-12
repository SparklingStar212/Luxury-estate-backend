import { MembershipPlan } from '../data/schema.js'

const formatPlan = (plan) => ({
  id: plan.id,
  slug: plan.slug,
  title: plan.title,
  price: plan.price,
  billingCycle: plan.billingCycle,
  description: plan.description,
  monthlyPrice: plan.monthlyPrice ?? null,
  annualPrice: plan.annualPrice ?? null,
  priceLabel: plan.priceLabel ?? null,
  subLabel: plan.subLabel ?? null,
  features: plan.features || [],
  featured: plan.featured,
  sortOrder: plan.sortOrder,
  published: plan.published,
  createdAt: plan.createdAt,
  updatedAt: plan.updatedAt,
})

export const listMembershipPlans = (_req, res) => {
  const items = [...store.membershipPlans]
    .filter((plan) => plan.published)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(formatPlan)

  res.json({ items, total: items.length })
}

export const getMembershipPlanBySlug = (req, res) => {
  const plan = store.membershipPlans.find((item) => item.slug === req.params.slug)

  if (!plan) {
    return res.status(404).json({ message: 'Membership plan not found' })
  }

  return res.json({ plan: formatPlan(plan) })
}

export const getMembershipComparison = (_req, res) => {
  const items = [
    { name: 'Priority Property Access', individual: true, professional: true, institutional: true },
    { name: 'Off-market Listings', individual: true, professional: true, institutional: true },
    { name: 'HD House Recordings', individual: '5 / month', professional: '20 / month', institutional: 'Unlimited' },
    { name: 'Virtual Reality Tours', individual: false, professional: true, institutional: true },
    { name: 'Market Prediction Engine', individual: false, professional: true, institutional: true },
    { name: 'API Integrations', individual: false, professional: false, institutional: true },
  ]

  res.json({
    items,
    columns: ['Individual', 'Professional', 'Institutional'],
  })
}

export const getMembershipHero = (_req, res) => {
  res.json({
    title: 'Elevate Your Real Estate Portfolio',
    description:
      'Choose a plan that aligns with your ambitions. From private investors to global institutions, Estate Elite provides the data, access, and tools to navigate the world\'s most prestigious markets.',
    billingOptions: ['monthly', 'annual'],
    savingsNote: 'Save 20% on annual billing',
  })
}
