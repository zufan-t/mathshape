import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SignOut, Sun, Moon, Presentation } from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/AuthContext'
import { useTheme } from '@/hooks/useTheme'
import { ROUTES } from '@/lib/constants'

const glassCSS = {
  background: 'var(--glass-bg)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '4px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow)'
}

export default function TeacherLayout() {
  const { signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate(ROUTES.TEACHER_LOGIN)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* ─── Dedicated Teacher Header ─── */}
      <header className="fixed top-4 left-4 right-4 z-50">
        <div
          style={{
            ...glassCSS,
            borderRadius: '9999px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Logo / Brand */}
          <div
            onClick={() => navigate(ROUTES.TEACHER_DASHBOARD)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#007BFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Presentation size={20} color="#ffffff" weight="bold" />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--color-text)',
                letterSpacing: '-0.025em',
              }}
            >
              Mathshape <span style={{ color: '#007BFF' }}>Guru</span>
            </span>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'light' ? 'Ubah ke Mode Gelap' : 'Ubah ke Mode Terang'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                color: 'var(--color-text)',
                transition: 'background-color 200ms, color 200ms',
                padding: 0
              }}
              className="hover:bg-black/5 dark:hover:bg-white/10"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{ display: 'flex' }}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </motion.div>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              title="Keluar"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 200ms'
              }}
              className="hover:bg-[#EF4444] hover:text-white"
            >
              <SignOut size={16} weight="bold" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content (No Footer) ─── */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
    </div>
  )
}
