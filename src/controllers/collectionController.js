import { Collection, Property, CollectionArticle } from '../data/schema.js'

// --- HELPER FORMATTERS ---
const formatCollection = (collection) => {
  const item = collection.toObject ? collection.toObject() : collection
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    coverImageUrl: item.coverImageUrl,
    featured: item.featured,
    propertyIds: item.propertyIds || [],
    articleIds: item.articleIds || [],
    published: item.published,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

const formatArticle = (article) => {
  const item = article.toObject ? article.toObject() : article
  return {
    id: item.id,
    collectionId: item.collectionId,
    slug: item.slug,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    category: item.category,
    published: item.published,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

const formatProperty = (property) => {
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
    agentId: item.agentId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

// Helper to assemble full collection with its related properties and articles from MongoDB
const getCollectionPayload = async (collection) => {
  const propertyIds = collection.propertyIds || []
  const articleIds = collection.articleIds || []

  // Fetch related properties and articles asynchronously
  const [propertiesData, articlesData] = await Promise.all([
    propertyIds.length > 0 ? Property.find({ id: { $in: propertyIds } }) : [],
    articleIds.length > 0 ? CollectionArticle.find({ id: { $in: articleIds } }) : [],
  ])

  return {
    ...formatCollection(collection),
    properties: propertiesData.map(formatProperty),
    articles: articlesData.map(formatArticle),
  }
}

// --- CONTROLLER FUNCTIONS ---

export const listCollections = async (req, res) => {
  try {
    const search = String(req.query.search || req.query.q || '').trim()
    const featuredOnly = req.query.featured === 'true' || req.query.featured === '1'

    const filter = {}

    if (featuredOnly) {
      filter.featured = true
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const collections = await Collection.find(filter)

    res.json({
      items: collections.map(formatCollection),
      total: collections.length,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections', error: error.message })
  }
}

export const listFeaturedCollections = async (_req, res) => {
  try {
    const collections = await Collection.find({ featured: true })
    res.json({ items: collections.map(formatCollection) })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured collections', error: error.message })
  }
}

export const getCollectionBySlug = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug })

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' })
    }

    const payload = await getCollectionPayload(collection)
    return res.json({ collection: payload })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching collection', error: error.message })
  }
}

export const listCollectionArticles = async (_req, res) => {
  try {
    const articles = await CollectionArticle.find({ published: true })
    res.json({ items: articles.map(formatArticle) })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message })
  }
}

export const getJournalArticleBySlug = async (req, res) => {
  try {
    const article = await CollectionArticle.findOne({ slug: req.params.slug })

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    return res.json({ article: formatArticle(article) })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching article', error: error.message })
  }
}

export const getCollectionStats = async (_req, res) => {
  try {
    const [totalCollections, featuredCollections, totalArticles] = await Promise.all([
      Collection.countDocuments(),
      Collection.countDocuments({ featured: true }),
      CollectionArticle.countDocuments(),
    ])

    res.json({
      totalCollections,
      featuredCollections,
      totalArticles,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message })
  }
}