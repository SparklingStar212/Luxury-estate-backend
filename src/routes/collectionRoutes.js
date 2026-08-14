import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { roles } from '../config/roles.js'
import {
  getCollectionBySlug,
  getCollectionStats,
  getJournalArticleBySlug,
  listCollectionArticles,
  listCollections,
  listFeaturedCollections,
} from '../controllers/collectionController.js'

const router = Router()

router.get('/featured', listFeaturedCollections)
router.get('/stats', authenticate, authorize(roles.admin), getCollectionStats)
router.get('/articles', listCollectionArticles)
router.get('/article/:slug', getJournalArticleBySlug)
router.get('/:slug', getCollectionBySlug)
router.get('/', listCollections)

export default router
