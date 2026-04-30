/** services/progress.service.ts — Logika bisnis progres belajar */
import { supabase } from '../config/db'

interface UpdateProgressParams {
  userId: string
  materialId: string
  completedPages: number
  score?: number
}

export class ProgressService {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('progress')
      .select('id, material_id, completed_pages, score, updated_at')
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
    return data
  }

  async update({ userId, materialId, completedPages, score }: UpdateProgressParams) {
    const { data, error } = await supabase
      .from('progress')
      .upsert(
        { user_id: userId, material_id: materialId, completed_pages: completedPages, score },
        { onConflict: 'user_id,material_id' }
      )
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}
