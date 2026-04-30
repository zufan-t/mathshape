/** controllers/auth.controller.ts */
import type { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'

const authService = new AuthService()

export async function register(req: Request, res: Response) {
  try {
    const { fullName, email, password } = req.body
    const result = await authService.register({ fullName, email, password })
    res.status(201).json(result)
  } catch (err: unknown) {
    res.status(400).json({ message: (err as Error).message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const result = await authService.login({ email, password })
    res.json(result)
  } catch (err: unknown) {
    res.status(401).json({ message: (err as Error).message })
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body
    await authService.forgotPassword(email)
    res.json({ message: 'Email reset kata sandi telah dikirim.' })
  } catch (err: unknown) {
    res.status(400).json({ message: (err as Error).message })
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body
    await authService.resetPassword({ token, password })
    res.json({ message: 'Kata sandi berhasil diperbarui.' })
  } catch (err: unknown) {
    res.status(400).json({ message: (err as Error).message })
  }
}
