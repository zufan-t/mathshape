/** controllers/progress.controller.ts */
import type { Request, Response } from 'express'
import { ProgressService } from '../services/progress.service'

const progressService = new ProgressService()

export async function getProgress(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as string
    const progress = await progressService.getByUser(userId)
    res.json(progress)
  } catch (err: unknown) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export async function updateProgress(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as string
    const { materialId } = req.params
    const { completedPages, score } = req.body
    const result = await progressService.update({ userId, materialId, completedPages, score })
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ message: (err as Error).message })
  }
}
