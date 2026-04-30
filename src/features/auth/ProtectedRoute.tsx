import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { ROUTES } from '@/lib/constants'

/**
 * ProtectedRoute Wrapper
 * Mencegah akses ke halaman yang membutuhkan login
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ 
        height: '100svh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text-light)'
      }}>
        Memuat...
      </div>
    )
  }

  if (!user) {
    // Redirect ke login tapi simpan lokasi asal
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <>{children}</>
}
