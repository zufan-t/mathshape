/** middlewares/error.middleware.ts — Global error handler Express */
import type { Request, Response, NextFunction } from 'express'

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[error]', err.message)
  res.status(500).json({ message: err.message ?? 'Terjadi kesalahan pada server.' })
}
