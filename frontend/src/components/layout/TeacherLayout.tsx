import { Outlet, Navigate } from 'react-router-dom'
import TeacherHeader from './TeacherHeader'
import { useAuth } from '@/features/auth/AuthContext'
import { ROUTES } from '@/lib/constants'

export default function TeacherLayout() {
  const { user, loading } = useAuth()
  const userRole = user?.user_metadata?.role || 'student'
  const isTeacher = userRole === 'teacher'

  if (loading) return null

  // Account Siswa or Guest cannot access Guru page
  if (!user) {
    return <Navigate to={ROUTES.TEACHER_LOGIN} replace />
  }
  if (!isTeacher) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <TeacherHeader />

      {/* ─── Main Content (No Footer) ─── */}
      <main style={{ flex: 1, paddingTop: '136px' }}>
        <Outlet />
      </main>
    </div>
  )
}
