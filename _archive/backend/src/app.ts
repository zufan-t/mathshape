/**
 * app.ts — Entry point Express backend MathLearn
 */
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import materialsRoutes from './routes/materials.routes'
import progressRoutes from './routes/progress.routes'
import { errorMiddleware } from './middlewares/error.middleware'

const app = express()
const PORT = process.env.PORT ?? 3000

// ── Middleware global ─────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173', credentials: true }))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────
app.use('/v1/auth', authRoutes)
app.use('/v1/materials', materialsRoutes)
app.use('/v1/progress', progressRoutes)

// ── Error handler ─────────────────────────────────────────
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`[server] berjalan di http://localhost:${PORT}`)
})

export default app
