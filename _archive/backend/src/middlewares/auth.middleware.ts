/** middlewares/auth.middleware.ts — Verifikasi JWT */
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Tidak ada token. Silakan masuk terlebih dahulu.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? '') as { userId: string }
    ;(req as any).userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' })
  }
}
