/** controllers/materials.controller.ts */
import type { Request, Response } from 'express'
import { MaterialsService } from '../services/materials.service'

const materialsService = new MaterialsService()

export async function getMaterials(_req: Request, res: Response) {
  try {
    const materials = await materialsService.getAll()
    res.json(materials)
  } catch (err: unknown) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export async function getMaterialById(req: Request, res: Response) {
  try {
    const material = await materialsService.getById(req.params.id)
    if (!material) return res.status(404).json({ message: 'Materi tidak ditemukan.' })
    res.json(material)
  } catch (err: unknown) {
    res.status(500).json({ message: (err as Error).message })
  }
}
