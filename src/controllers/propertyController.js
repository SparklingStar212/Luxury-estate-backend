import { Property } from '../data/schema.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { roles } from '../config/roles.js'

const toNumber = (value, fallback = null) => {
  if (value === undefined || value === null || value === '') return fallback
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

const toBoolean = (value) => value === true || value === 'true' || value === '1'

const normalizeProperty = (property) => ({
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
  latitude: property.latitude,
  longitude: property.longitude,
  agentId: property.agentId,
  createdAt: property.createdAt,
  updatedAt: property.updatedAt,
})

const matchesSearch = (property, search) => {
  if (!search) return true
  const haystack = [
    property.title,
    property.description,
    property.address,
    property.city,
    property.state,
    property.country,
    property.propertyType,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(search.toLowerCase())
}

const matchesPrice = (property, minPrice, maxPrice) => {
  if (minPrice !== null && property.price < minPrice) return false
  if (maxPrice !== null && property.price > maxPrice) return false
  return true
}

const matchesBeds = (property, beds) => {
  if (beds === null) return true
  return Number(property.beds || 0) >= beds
}

export const listProperties = (req, res) => {
  const search = req.query.search || req.query.q || ''
  const type = req.query.type || req.query.propertyType || ''
  const status = req.query.status || ''
  const featured = req.query.featured
  const minPrice = toNumber(req.query.minPrice)
  const maxPrice = toNumber(req.query.maxPrice)
  const beds = toNumber(req.query.beds)
  const sort = req.query.sort || 'featured'
  const page = Math.max(toNumber(req.query.page, 1), 1)
  const limit = Math.min(Math.max(toNumber(req.query.limit, 12), 1), 100)

  let filtered = [...store.properties]

  filtered = filtered.filter((property) => matchesSearch(property, search))
  filtered = filtered.filter((property) => (!type ? true : property.propertyType === type))
  filtered = filtered.filter((property) => (!status ? true : property.status === status))
  filtered = filtered.filter((property) => (featured === undefined ? true : property.featured === toBoolean(featured)))
  filtered = filtered.filter((property) => matchesPrice(property, minPrice, maxPrice))
  filtered = filtered.filter((property) => matchesBeds(property, beds))

  if (sort === 'price_asc') {
    filtered.sort((left, right) => left.price - right.price)
  } else if (sort === 'price_desc') {
    filtered.sort((left, right) => right.price - left.price)
  } else if (sort === 'newest') {
    filtered.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
  } else {
    filtered.sort((left, right) => Number(right.featured) - Number(left.featured) || right.price - left.price)
  }

  const total = filtered.length
  const totalPages = Math.max(Math.ceil(total / limit), 1)
  const offset = (page - 1) * limit
  const items = filtered.slice(offset, offset + limit).map(normalizeProperty)

  res.json({
    items,
    page,
    limit,
    total,
    totalPages,
  })
}

export const listFeaturedProperties = (_req, res) => {
  const items = store.properties.filter((property) => property.featured).map(normalizeProperty)
  res.json({ items })
}

export const getPropertyBySlug = (req, res) => {
  const property = store.properties.find((item) => item.slug === req.params.slug)

  if (!property) {
    return res.status(404).json({ message: 'Property not found' })
  }

  const related = store.properties
    .filter((item) => item.id !== property.id && (item.city === property.city || item.propertyType === property.propertyType))
    .slice(0, 3)
    .map(normalizeProperty)

  return res.json({
    property: normalizeProperty(property),
    related,
  })
}

export const getPropertyById = (req, res) => {
  const propertyId = Number(req.params.id)
  const property = store.properties.find((item) => item.id === propertyId)

  if (!property) {
    return res.status(404).json({ message: 'Property not found' })
  }

  return res.json({ property: normalizeProperty(property) })
}

export const createProperty = (req, res) => {
  const {
    slug,
    title,
    description,
    price,
    address,
    city,
    state,
    country,
    beds,
    baths,
    areaSqft,
    propertyType,
    status = 'active',
    featured = false,
    latitude,
    longitude,
    heroImageUrl,
    galleryImages = [],
    floorPlans = [],
    amenities = [],
    overview,
    agentId = null,
  } = req.body

  if (!slug || !title || !price || !address) {
    return res.status(400).json({ message: 'slug, title, price, and address are required' })
  }

  if (store.properties.some((item) => item.slug === slug)) {
    return res.status(409).json({ message: 'Property slug already exists' })
  }

  const nextId = Math.max(0, ...store.properties.map((item) => item.id)) + 1
  const now = new Date().toISOString()

  const property = {
    id: nextId,
    slug,
    title,
    description: description || '',
    price: Number(price),
    address,
    city: city || '',
    state: state || '',
    country: country || '',
    beds: beds === undefined || beds === null || beds === '' ? null : Number(beds),
    baths: baths === undefined || baths === null || baths === '' ? null : Number(baths),
    areaSqft: areaSqft === undefined || areaSqft === null || areaSqft === '' ? null : Number(areaSqft),
    propertyType: propertyType || '',
    status,
    featured: Boolean(featured),
    latitude: latitude === undefined || latitude === null || latitude === '' ? null : Number(latitude),
    longitude: longitude === undefined || longitude === null || longitude === '' ? null : Number(longitude),
    heroImageUrl: heroImageUrl || '',
    galleryImages,
    floorPlans,
    amenities,
    overview: overview || '',
    agentId: agentId === null || agentId === '' ? null : Number(agentId),
    createdAt: now,
    updatedAt: now,
  }

  store.properties.push(property)

  return res.status(201).json({ property: normalizeProperty(property) })
}

export const updateProperty = (req, res) => {
  const propertyId = Number(req.params.id)
  const property = store.properties.find((item) => item.id === propertyId)

  if (!property) {
    return res.status(404).json({ message: 'Property not found' })
  }

  const updates = req.body

  if (updates.slug && updates.slug !== property.slug && store.properties.some((item) => item.slug === updates.slug)) {
    return res.status(409).json({ message: 'Property slug already exists' })
  }

  Object.assign(property, {
    slug: updates.slug ?? property.slug,
    title: updates.title ?? property.title,
    description: updates.description ?? property.description,
    price: updates.price === undefined ? property.price : Number(updates.price),
    address: updates.address ?? property.address,
    city: updates.city ?? property.city,
    state: updates.state ?? property.state,
    country: updates.country ?? property.country,
    beds: updates.beds === undefined ? property.beds : Number(updates.beds),
    baths: updates.baths === undefined ? property.baths : Number(updates.baths),
    areaSqft: updates.areaSqft === undefined ? property.areaSqft : Number(updates.areaSqft),
    propertyType: updates.propertyType ?? property.propertyType,
    status: updates.status ?? property.status,
    featured: updates.featured === undefined ? property.featured : Boolean(updates.featured),
    latitude: updates.latitude === undefined ? property.latitude : Number(updates.latitude),
    longitude: updates.longitude === undefined ? property.longitude : Number(updates.longitude),
    heroImageUrl: updates.heroImageUrl ?? property.heroImageUrl,
    galleryImages: updates.galleryImages ?? property.galleryImages,
    floorPlans: updates.floorPlans ?? property.floorPlans,
    amenities: updates.amenities ?? property.amenities,
    overview: updates.overview ?? property.overview,
    agentId: updates.agentId === undefined ? property.agentId : Number(updates.agentId),
    updatedAt: new Date().toISOString(),
  })

  return res.json({ property: normalizeProperty(property) })
}

export const deleteProperty = (req, res) => {
  const propertyId = Number(req.params.id)
  const index = store.properties.findIndex((item) => item.id === propertyId)

  if (index === -1) {
    return res.status(404).json({ message: 'Property not found' })
  }

  const [deletedProperty] = store.properties.splice(index, 1)

  return res.json({
    message: 'Property deleted',
    property: normalizeProperty(deletedProperty),
  })
}

export const getPropertyStats = (_req, res) => {
  const total = store.properties.length
  const featured = store.properties.filter((item) => item.featured).length
  const active = store.properties.filter((item) => item.status === 'active').length
  const pending = store.properties.filter((item) => item.status === 'pending').length
  const sold = store.properties.filter((item) => item.status === 'sold').length

  res.json({
    total,
    featured,
    active,
    pending,
    sold,
  })
}

export const propertyMiddleware = {
  authenticate,
  authorize,
  roles,
}
