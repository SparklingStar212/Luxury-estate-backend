import { store } from '../data/store.js'

const formatListing = (property) => ({
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
  createdAt: property.createdAt,
  updatedAt: property.updatedAt,
})

const formatActivity = (activity) => ({
  id: activity.id,
  user: activity.user,
  action: activity.action,
  item: activity.item,
  time: activity.time,
  critical: activity.critical,
})

const formatRecording = (recording) => ({
  id: recording.id,
  title: recording.title,
  duration: recording.duration,
  quality: recording.quality,
  status: recording.status,
  imageUrl: recording.imageUrl,
})

const getCurrencyValue = (property) => property.price

export const getDashboardSummary = (_req, res) => {
  const totalListings = store.properties.length
  const monthlyBookings = store.inquiries.length * 21
  const revenue = store.properties.reduce((total, property) => total + getCurrencyValue(property), 0)
  const activeLeads = store.inquiries.filter((inquiry) => inquiry.status !== 'closed').length

  res.json({
    cards: [
      { title: 'Total Listings', value: totalListings.toLocaleString('en-US'), delta: '+12% vs last month' },
      { title: 'Monthly Bookings', value: monthlyBookings.toLocaleString('en-US'), delta: '+5.2% vs last month' },
      { title: 'Revenue', value: `$${(revenue / 1000000).toFixed(1)}M`, delta: '-2.1% seasonal' },
      { title: 'Active Leads', value: activeLeads.toLocaleString('en-US'), delta: '+24% campaign' },
    ],
  })
}

export const getRecentActivity = (_req, res) => {
  const items = store.inquiries
    .slice()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 4)
    .map((inquiry) => ({
      id: inquiry.id,
      name: inquiry.fullName,
      email: inquiry.email,
      property: store.properties.find((property) => property.id === inquiry.propertyId)?.title || inquiry.subject || 'General Inquiry',
      type: inquiry.subject || 'Lead Activity',
      status: inquiry.status.toUpperCase(),
    }))

  res.json({ items })
}

export const getPerformanceStats = (_req, res) => {
  const totalInquiries = store.inquiries.length || 1
  const direct = Math.round((store.inquiries.filter((inquiry) => inquiry.subject?.toLowerCase().includes('view') || inquiry.subject?.toLowerCase().includes('property')).length / totalInquiries) * 100)
  const referrals = Math.round((store.inquiries.filter((inquiry) => inquiry.agentId).length / totalInquiries) * 100)
  const social = Math.max(0, 100 - direct - referrals)

  res.json({
    items: [
      { label: 'Direct Inquiries', pct: direct || 64 },
      { label: 'Agent Referrals', pct: referrals || 28 },
      { label: 'Social Platforms', pct: social || 12 },
    ],
    insight: 'Direct inquiries for Mediterranean properties are up 14% this week. Prioritize Monaco-based listings in next digest.',
  })
}

export const getListingManagement = (_req, res) => {
  const items = store.properties
    .slice()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 3)
    .map(formatListing)

  res.json({
    items,
    totalActive: store.properties.filter((property) => property.status === 'active').length,
    totalPending: store.properties.filter((property) => property.status === 'pending').length,
    totalSold: store.properties.filter((property) => property.status === 'sold').length,
  })
}

export const getAdminStats = (_req, res) => {
  const portfolioValue = store.properties.reduce((sum, property) => sum + property.price, 0)
  const activeListings = store.properties.filter((property) => property.status === 'active').length
  const platformHealth = 99.9
  const conciergeRequests = store.inquiries.length

  res.json({
    cards: [
      { title: 'Total Portfolio Value', value: `$${(portfolioValue / 1000000000).toFixed(2)}B`, delta: '12.4% vs last quarter' },
      { title: 'Active Listings', value: activeListings.toString(), delta: `${Math.max(store.properties.filter((property) => property.status === 'pending').length, 0)} pending approval` },
      { title: 'Platform Health', value: `${platformHealth}%`, delta: 'All systems operational' },
      { title: 'Concierge Requests', value: conciergeRequests.toString(), delta: 'Avg. response: 4m' },
    ],
  })
}

export const getUserActivity = (_req, res) => {
  res.json({ items: store.dashboardActivities.map(formatActivity) })
}

export const getNetworkLoad = (_req, res) => {
  const items = store.networkLoad.map((item) => ({
    region: item.region,
    load: item.load,
    latencyMs: item.latencyMs,
  }))

  res.json({ items, totalRegions: items.length })
}

export const getHouseRecordings = (_req, res) => {
  const items = store.houseRecordings.map(formatRecording)
  res.json({ items })
}

export const getDashboardOverview = (_req, res) => {
  res.json({
    summary: {
      totalListings: store.properties.length,
      activeLeads: store.inquiries.filter((inquiry) => inquiry.status !== 'closed').length,
      totalAgents: store.agents.length,
      totalCollections: store.collections.length,
    },
    recentActivity: store.dashboardActivities.slice(0, 3).map(formatActivity),
    networkLoad: store.networkLoad.map((item) => ({ region: item.region, load: item.load, latencyMs: item.latencyMs })),
    houseRecordings: store.houseRecordings.map(formatRecording),
  })
}
