import { Router } from 'express'
import multer from 'multer'
import { uploadAsset } from '../controllers/uploadController.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { roles } from '../config/roles.js'

const upload = multer({ storage: multer.memoryStorage() })
const router = Router()

router.post('/asset', authenticate, authorize(roles.agent, roles.admin), upload.single('file'), uploadAsset)

export default router