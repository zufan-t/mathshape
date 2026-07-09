import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth/AuthContext'

/**
 * Hook untuk mengelola progress materi satu user.
 * - markCompleted(): upsert is_completed = true
 * - saveCurrentSection(idx): upsert current_section = idx (non-blocking)
 */
export function useMaterialContent(materialId: string | undefined) {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    setSaving(false)
    setSavedOk(false)
    setSaveError(null)
  }, [materialId])

  /** Simpan section yang sedang aktif ke DB (fire-and-forget, tidak blok UI) */
  const saveCurrentSection = useCallback(async (sectionIndex: number) => {
    if (!user || !materialId) return
    // Jangan tunggu hasilnya — ini non-critical, tidak perlu loading state
    supabase
      .from('user_progress')
      .upsert(
        { user_id: user.id, material_id: parseInt(materialId), current_section: sectionIndex },
        { onConflict: 'user_id,material_id' }
      )
      .then((result: { error: { message: string } | null }) => {
        if (result.error && import.meta.env.DEV) {
          console.warn('[useMaterialContent] saveCurrentSection failed:', result.error.message)
        }
      })
  }, [user, materialId])

  /** Tandai materi sebagai selesai (is_completed = true) */
  const markCompleted = useCallback(async (): Promise<boolean> => {
    if (!user || !materialId) return false

    setSaving(true)
    setSaveError(null)

    const { error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: user.id,
          material_id: parseInt(materialId),
          is_completed: true,
          current_section: 7, // semua section selesai
        },
        { onConflict: 'user_id,material_id' }
      )

    setSaving(false)

    if (error) {
      console.error('[useMaterialContent] markCompleted failed:', error.message)
      setSaveError('Gagal menyimpan progres. Silakan coba lagi.')
      return false
    }

    setSavedOk(true)
    return true
  }, [user, materialId])

  return { markCompleted, saveCurrentSection, saving, savedOk, saveError }
}
