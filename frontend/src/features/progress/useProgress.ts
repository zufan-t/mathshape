import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth/AuthContext'

export interface UserProgress {
  material_id: number
  is_completed: boolean
  current_section: number   // 0–7, kolom ini ada setelah ALTER TABLE dijalankan
}

/**
 * Hook untuk mengambil progres belajar user dari tabel user_progress.
 */
export function useProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProgress([])
      setLoading(false)
      return
    }

    async function fetchProgress() {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_progress')
        .select('material_id, is_completed, current_section')
        .eq('user_id', user!.id)

      if (!error && data) {
        setProgress(data)
      }
      setLoading(false)
    }

    fetchProgress()
  }, [user])

  const getProgressByMaterialId = (id: number): UserProgress | null =>
    progress.find((p) => p.material_id === id) ?? null

  const isCompleted = (materialId: number): boolean =>
    getProgressByMaterialId(materialId)?.is_completed === true

  /** Progress 0–100 berdasarkan current_section (0–7) dari 8 total */
  const getProgressPercent = (materialId: number): number => {
    const p = getProgressByMaterialId(materialId)
    if (!p) return 0
    if (p.is_completed) return 100
    return Math.round(((p.current_section + 1) / 8) * 100)
  }

  return { progress, loading, getProgressByMaterialId, isCompleted, getProgressPercent }
}

