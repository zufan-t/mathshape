import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Material {
  id: number
  title: string
  description: string
  pertemuan_label: string
  order_number: number
  thumbnail_url: string | null
}

/**
 * Hook untuk mengambil daftar materi dari database
 */
export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .order('order_number', { ascending: true })

        if (error) throw error
        setMaterials(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  return { materials, loading, error }
}
