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

const normalizeProperty = (property) => {
  if (!property) return null
  const item = property.toObject ? property.toObject() : property
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    price: item.price,
    amount: item.price ? `$${item.price.toLocaleString('en-US')}` : '$0',
    address: item.address,
    city: item.city,
    state: item.state,
    country: item.country,
    beds: item.beds,
    baths: item.baths,
    areaSqft: item.areaSqft,
    propertyType: item.propertyType,
    status: item.status,
    featured: item.featured,
    image: item.heroImageUrl,
    heroImageUrl: item.heroImageUrl,
    galleryImages: item.galleryImages || [],
    floorPlans: item.floorPlans || [],
    amenities: item.amenities || [],
    overview: item.overview,
    latitude: item.latitude,
    longitude: item.longitude,
    agentId: item.agentId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

// --- CONTROLLER FUNCTIONS ---

export const listProperties = async (req, res) => {
  try {
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

    const query = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { propertyType: { $regex: search, $options: 'i' } },
      ]
    }

    if (type) query.propertyType = type
    if (status) query.status = status
    if (featured !== undefined) query.featured = toBoolean(featured)

    if (minPrice !== null || maxPrice !== null) {
      query.price = {}
      if (minPrice !== null) query.price.$gte = minPrice
      if (maxPrice !== null) query.price.$lte = maxPrice
    }

    if (beds !== null) {
      query.beds = { $gte: beds }
    }

    let sortOption = { featured: -1, price: -1 }
    if (sort === 'price_asc') {
      sortOption = { price: 1 }
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 }
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 }
    }

    const total = await Property.countDocuments(query)
    const totalPages = Math.max(Math.ceil(total / limit), 1)
    const offset = (page - 1) * limit

    const properties = await Property.find(query)
      .sort(sortOption)
      .skip(offset)
      .limit(limit)

    res.json({
      items: properties.map(normalizeProperty),
      page,
      limit,
      total,
      totalPages,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message })
  }
}

export const listFeaturedProperties = async (_req, res) => {
  try {
    const properties = await Property.find({ featured: true })
    res.json({ items: properties.map(normalizeProperty) })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured properties', error: error.message })
  }
}

export const getPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug })

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    const related = await Property.find({
      id: { $ne: property.id },
      $or: [{ city: property.city }, { propertyType: property.propertyType }],
    }).limit(3)

    return res.json({
      property: normalizeProperty(property),
      related: related.map(normalizeProperty),
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching property', error: error.message })
  }
}

export const getPropertyById = async (req, res) => {
  try {
    const propertyId = Number(req.params.id)
    const property = await Property.findOne({ id: propertyId })

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    return res.json({ property: normalizeProperty(property) })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching property', error: error.message })
  }
}

export const createProperty = async (req, res) => {
  try {
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

    const existingSlug = await Property.findOne({ slug })
    if (existingSlug) {
      return res.status(409).json({ message: 'Property slug already exists' })
    }

    const lastProperty = await Property.findOne().sort({ id: -1 })
    const nextId = lastProperty ? lastProperty.id + 1 : 1

    const newProperty = await Property.create({
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
    })

    return res.status(201).json({ property: normalizeProperty(newProperty) })
  } catch (error) {
    return res.status(500).json({ message: 'Error creating property', error: error.message })
  }
}

export const updateProperty = async (req, res) => {
  try {
    const propertyId = Number(req.params.id)
    const property = await Property.findOne({ id: propertyId })

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    const updates = req.body

    if (updates.slug && updates.slug !== property.slug) {
      const existingSlug = await Property.findOne({ slug: updates.slug })
      if (existingSlug) {
        return res.status(409).json({ message: 'Property slug already exists' })
      }
    }

    const updatedData = {
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
    }

    const updatedProperty = await Property.findOneAndUpdate(
      { id: propertyId },
      updatedData,
      { new: true }
    )

    return res.json({ property: normalizeProperty(updatedProperty) })
  } catch (error) {
    return res.status(500).json({ message: 'Error updating property', error: error.message })
  }
}

export const deleteProperty = async (req, res) => {
  try {
    const propertyId = Number(req.params.id)
    const deletedProperty = await Property.findOneAndDelete({ id: propertyId })

    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found' })
    }

    return res.json({
      message: 'Property deleted',
      property: normalizeProperty(deletedProperty),
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting property', error: error.message })
  }
}

export const getPropertyStats = async (_req, res) => {
  try {
    const [total, featured, active, pending, sold] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ featured: true }),
      Property.countDocuments({ status: 'active' }),
      Property.countDocuments({ status: 'pending' }),
      Property.countDocuments({ status: 'sold' }),
    ])

    res.json({
      total,
      featured,
      active,
      pending,
      sold,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property stats', error: error.message })
  }
}

export const propertyMiddleware = {
  authenticate,
  authorize,
  roles,
}