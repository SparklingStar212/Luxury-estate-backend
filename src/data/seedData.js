export const properties = [
  {
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
    image: '/src/assets/primary-estate-view.png',
  },
  {
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
    image: '/src/assets/villa-azure.png',
  },
  {
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
    image: '/src/assets/historic.png',
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
    client: 'Julianne Deville',
    email: 'julianne@vanguard.com',
    property: 'Azure Penthouse, Monaco',
    inquiryType: 'Viewing Request',
    status: 'CONFIRMED',
  },
  {
    client: 'Marcus Rossi',
    email: 'm.rossi@luxe.ch',
    property: "Villa d'Este Estate, Como",
    inquiryType: 'Financing Inquiry',
    status: 'PENDING REVIEW',
  },
  {
    client: 'Sarah Landeau',
    email: 's.landeau@paris.me',
    property: '6th Arr. Duplex, Paris',
    inquiryType: 'Purchase Offer',
    status: 'ACTION REQUIRED',
  },
]

export const agents = [
  {
    name: 'Alexander Vance',
    title: 'Senior Advisory Partner',
    email: 'vance@luxeestate.com',
    phone: '+1 (212) 555-0198',
    bio: 'Advisory partner specializing in off-market luxury acquisitions.',
  },
]

export const inquiries = [
  {
    name: 'Ava Martin',
    email: 'ava@example.com',
    subject: 'Private Consultation',
    message: 'Interested in off-market opportunities in Manhattan.',
    status: 'new',
  },
]
