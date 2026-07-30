import { Outlet, Navigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useAuth } from '@/features/auth/AuthContext'
import { ROUTES } from '@/lib/constants'

export default function Layout() {
  const { user, loading } = useAuth()
  const userRole = user?.user_metadata?.role || 'student'
  const isTeacher = userRole === 'teacher'

  if (loading) return null

  // Account Guru cannot access Siswa pages
  if (user && isTeacher) {
    return <Navigate to={ROUTES.TEACHER_DASHBOARD} replace />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main style={{ flex: 1, paddingTop: '110px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
