/** routes/materials.routes.ts */
import { Router } from 'express'
import { getMaterials, getMaterialById } from '../controllers/materials.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', authMiddleware, getMaterials)
router.get('/:id', authMiddleware, getMaterialById)

export default router
