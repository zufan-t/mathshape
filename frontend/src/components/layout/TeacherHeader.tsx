import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, UserCircle, SignOut } from '@phosphor-icons/react'
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

export default function TeacherHeader() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const userRole = user?.user_metadata?.role || 'student'
  const isTeacher = userRole === 'teacher'

  return (
    <div className="fixed top-4 left-4 right-4 z-50 justify-center flex">
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
        {/* Logo / Brand - NOT a Link, does not navigate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '22px',
              background: 'linear-gradient(to right, #6fb4ff, #007BFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
              display: 'inline-block',
              letterSpacing: '-0.025em',
            }}
          >
            Mathshape
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#007BFF',
              backgroundColor: 'var(--color-primary-light)',
              padding: '2px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Guru
          </span>
        </div>

        {/* Right side actions */}
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

          {/* User Auth Info */}
          {user && isTeacher ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to={ROUTES.TEACHER_ACCOUNT}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', transition: 'opacity 200ms' }}
                className="hover:opacity-80"
                title="Akun Guru"
              >
                <div style={{ display: 'flex' }}>
                  <UserCircle size={28} weight="fill" color="#007BFF" />
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
                  color: 'var(--color-text)', maxWidth: '120px', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user?.user_metadata?.full_name
                    ? user.user_metadata.full_name.split(' ')[0]
                    : user?.email?.split('@')[0]}
                </span>
              </Link>
              <button
                onClick={() => signOut()}
                title="Keluar"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', padding: '4px',
                  color: '#6C759E', transition: 'color 200ms', borderRadius: '50%',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#EF4444' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#6C759E' }}
              >
                <SignOut size={22} weight="bold" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to={ROUTES.TEACHER_REGISTER} style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--register-text)',
                    backgroundColor: 'var(--register-bg)',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: '1.5px solid var(--register-border)',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--register-hover-bg)'
                    e.currentTarget.style.color = 'var(--register-hover-text)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'var(--register-bg)'
                    e.currentTarget.style.color = 'var(--register-text)'
                  }}
                >
                  Daftar
                </button>
              </Link>
              <Link to={ROUTES.TEACHER_LOGIN} style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#ffffff',
                    backgroundColor: '#007BFF',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0266D2' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#007BFF' }}
                >
                  Masuk
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
