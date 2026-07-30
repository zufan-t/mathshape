import { Outlet, useParams, useSearchParams, Navigate } from 'react-router-dom'
import Header from './Header'
import { getMateriById } from '@/data/materiData'
import { useAuth } from '@/features/auth/AuthContext'
import { ROUTES } from '@/lib/constants'

/**
 * Layout khusus halaman isi materi.
 * Meneruskan judul materi ke Header agar muncul di navbar.
 */
export default function MaterialLayout() {
  const { user, loading } = useAuth()
  const userRole = user?.user_metadata?.role || 'student'
  const isTeacher = userRole === 'teacher'

  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  
  let materialId = parseInt(id || '')
  if (isNaN(materialId)) {
    // Falls back to read 'from' query parameter if it's ApresiasiPage
    materialId = parseInt(searchParams.get('from') || '1')
  }
  
  const materi = getMateriById(materialId)

  if (loading) return null

  // Account Guru cannot access Siswa pages
  if (user && isTeacher) {
    return <Navigate to={ROUTES.TEACHER_DASHBOARD} replace />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header materialTitle={materi?.judul} />
      <main style={{ flex: 1, paddingTop: '110px' }}>
        <Outlet />
      </main>
    </div>
  )
}
