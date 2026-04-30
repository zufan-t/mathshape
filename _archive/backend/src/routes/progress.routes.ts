/** routes/progress.routes.ts */
import { Router } from 'express'
import { getProgress, updateProgress } from '../controllers/progress.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', authMiddleware, getProgress)
router.put('/:materialId', authMiddleware, updateProgress)

export default router
