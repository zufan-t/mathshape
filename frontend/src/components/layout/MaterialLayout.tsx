import { Outlet, useParams, useSearchParams } from 'react-router-dom'
import Header from './Header'
import { getMateriById } from '@/data/materiData'

/**
 * Layout khusus halaman isi materi.
 * Meneruskan judul materi ke Header agar muncul di navbar.
 */
export default function MaterialLayout() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  
  let materialId = parseInt(id || '')
  if (isNaN(materialId)) {
    // Falls back to read 'from' query parameter if it's ApresiasiPage
    materialId = parseInt(searchParams.get('from') || '1')
  }
  
  const materi = getMateriById(materialId)

  return (
    <div className="min-h-screen flex flex-col">
      <Header materialTitle={materi?.judul} />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
    </div>
  )
}
