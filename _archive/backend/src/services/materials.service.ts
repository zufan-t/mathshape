/** services/materials.service.ts — Logika bisnis materi */
import { supabase } from '../config/db'

export class MaterialsService {
  async getAll() {
    const { data, error } = await supabase
      .from('materials')
      .select('id, title, description, meeting_number, content')
      .order('meeting_number', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data
  }
}
