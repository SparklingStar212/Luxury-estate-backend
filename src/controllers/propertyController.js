import Property from '../models/Property.js'

export const getProperties = async (req, res, next) => {
  const { query = '', type = '', minPrice, maxPrice } = req.query

  const filter = {}

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { address: { $regex: query, $options: 'i' } },
      { city: { $regex: query, $options: 'i' } },
      { neighborhood: { $regex: query, $options: 'i' } },
    ]
  }

  if (type) {
    filter.type = String(type).trim().toLowerCase()
  }

  if (minPrice || maxPrice) {
    filter.price = {}

    if (minPrice) {
      filter.price.$gte = Number(minPrice)
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice)
    }
  }

  try {
    const results = await Property.find(filter).sort({ featured: -1, createdAt: -1 }).lean()

    return res.json({
      count: results.length,
      results,
    })
  } catch (error) {
    return next(error)
  }
}

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).lean()

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    return res.json(property)
  } catch (error) {
    return next(error)
  }
}
