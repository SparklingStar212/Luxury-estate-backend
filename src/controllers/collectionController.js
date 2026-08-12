import { Collection } from '../data/schema.js'

const formatCollection = (collection) => ({
  id: collection.id,
  slug: collection.slug,
  title: collection.title,
  description: collection.description,
  coverImageUrl: collection.coverImageUrl,
  featured: collection.featured,
  propertyIds: collection.propertyIds || [],
  articleIds: collection.articleIds || [],
  published: collection.published,
  createdAt: collection.createdAt,
  updatedAt: collection.updatedAt,
})

const formatArticle = (article) => ({
  id: article.id,
  collectionId: article.collectionId,
  slug: article.slug,
  title: article.title,
  description: article.description,
  imageUrl: article.imageUrl,
  category: article.category,
  published: article.published,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
})

const formatProperty = (property) => ({
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
  agentId: property.agentId,
  createdAt: property.createdAt,
  updatedAt: property.updatedAt,
})

const getCollectionPayload = (collection) => {
  const properties = (collection.propertyIds || [])
    .map((propertyId) => store.properties.find((property) => property.id === propertyId))
    .filter(Boolean)
    .map(formatProperty)

  const articles = (collection.articleIds || [])
    .map((articleId) => store.collectionArticles.find((article) => article.id === articleId))
    .filter(Boolean)
    .map(formatArticle)

  return {
    ...formatCollection(collection),
    properties,
    articles,
  }
}

export const listCollections = (req, res) => {
  const search = String(req.query.search || req.query.q || '').toLowerCase()
  const featuredOnly = req.query.featured === 'true' || req.query.featured === '1'

  let items = [...store.collections]

  if (search) {
    items = items.filter((collection) => [collection.title, collection.description].filter(Boolean).join(' ').toLowerCase().includes(search))
  }

  if (featuredOnly) {
    items = items.filter((collection) => collection.featured)
  }

  res.json({
    items: items.map(formatCollection),
    total: items.length,
  })
}

export const listFeaturedCollections = (_req, res) => {
  const items = store.collections.filter((collection) => collection.featured).map(formatCollection)
  res.json({ items })
}

export const getCollectionBySlug = (req, res) => {
  const collection = store.collections.find((item) => item.slug === req.params.slug)

  if (!collection) {
    return res.status(404).json({ message: 'Collection not found' })
  }

  return res.json({ collection: getCollectionPayload(collection) })
}

export const listCollectionArticles = (_req, res) => {
  const items = store.collectionArticles.filter((article) => article.published).map(formatArticle)
  res.json({ items })
}

export const getJournalArticleBySlug = (req, res) => {
  const article = store.collectionArticles.find((item) => item.slug === req.params.slug)

  if (!article) {
    return res.status(404).json({ message: 'Article not found' })
  }

  return res.json({ article: formatArticle(article) })
}

export const getCollectionStats = (_req, res) => {
  const totalCollections = store.collections.length
  const featuredCollections = store.collections.filter((collection) => collection.featured).length
  const totalArticles = store.collectionArticles.length

  res.json({
    totalCollections,
    featuredCollections,
    totalArticles,
  })
}
