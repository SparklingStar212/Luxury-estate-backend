export const properties = [
  {
    id: 'prop_001',
    title: 'The Glass House Reserve',
    address: '742 Park Avenue, Upper East Side, NY',
    city: 'New York',
    neighborhood: 'Upper East Side',
    type: 'penthouse',
    price: 12450000,
    beds: 5,
    baths: 6,
    area: 4200,
    featured: true,
  },
  {
    id: 'prop_002',
    title: 'Chelsea Heights Duplex',
    address: 'West 22nd Street, Manhattan, NY',
    city: 'New York',
    neighborhood: 'Chelsea',
    type: 'duplex',
    price: 8900000,
    beds: 4,
    baths: 4,
    area: 3150,
    featured: false,
  },
  {
    id: 'prop_003',
    title: 'The Sovereign Estate',
    address: 'Hudson Yards, Manhattan, NY',
    city: 'New York',
    neighborhood: 'Hudson Yards',
    type: 'estate',
    price: 15200000,
    beds: 6,
    baths: 8,
    area: 5800,
    featured: false,
  },
]

export const dashboardOverview = {
  totalListings: 1248,
  monthlyBookings: 84,
  revenue: 1200000,
  activeLeads: 312,
}

export const dashboardActivity = [
  {
    id: 'act_001',
    client: 'Julianne Deville',
    email: 'julianne@vanguard.com',
    property: 'Azure Penthouse, Monaco',
    inquiryType: 'Viewing Request',
    status: 'CONFIRMED',
  },
  {
    id: 'act_002',
    client: 'Marcus Rossi',
    email: 'm.rossi@luxe.ch',
    property: "Villa d'Este Estate, Como",
    inquiryType: 'Financing Inquiry',
    status: 'PENDING REVIEW',
  },
  {
    id: 'act_003',
    client: 'Sarah Landeau',
    email: 's.landeau@paris.me',
    property: '6th Arr. Duplex, Paris',
    inquiryType: 'Purchase Offer',
    status: 'ACTION REQUIRED',
  },
]

export const agents = [
  {
    id: 'agent_001',
    name: 'Alexander Vance',
    title: 'Senior Advisory Partner',
    email: 'vance@luxeestate.com',
    phone: '+1 (212) 555-0198',
  },
]

export const inquiries = [
  {
    id: 'inq_001',
    name: 'Ava Martin',
    email: 'ava@example.com',
    subject: 'Private Consultation',
    message: 'Interested in off-market opportunities in Manhattan.',
    createdAt: '2026-06-08T10:00:00.000Z',
  },
]
