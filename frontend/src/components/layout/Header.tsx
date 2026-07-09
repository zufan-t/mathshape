import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X, UserCircle, SignOut, Sun, Moon } from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/AuthContext'
import { NAV_LINKS, ROUTES, APP_NAME } from '@/lib/constants'
import { useMaterialNav } from '@/features/materials/MaterialNavContext'
import { useTheme } from '@/hooks/useTheme'

// ─── Icons ───────────────────────────────────────────────────────────────────

function Bars2Icon() {
  return <List size={24} weight="bold" />
}

function XMarkIcon() {
  return <X size={24} weight="bold" />
}

function UserCircleIcon() {
  return <UserCircle size={28} weight="fill" color="#6C759E" />
}

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  )
}

// ─── Glass Style ─────────────────────────────────────────────────────────────
const glassCSS = {
  background: 'var(--glass-bg)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '4px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow)'
}

// ─── Button First (Masuk) ────────────────────────────────────────────────────
function LoginBtn({ fullWidth = false, onClick }: { fullWidth?: boolean; onClick?: () => void }) {
  return (
    <Link to={ROUTES.LOGIN} onClick={onClick} className={fullWidth ? 'block w-full' : 'inline-block'}>
      <button
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          fontWeight: 500,
          color: '#ffffff',
          backgroundColor: '#007BFF',
          padding: '10px 30px',
          borderRadius: '9999px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / .1)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 300ms ease-in-out',
          width: fullWidth ? '100%' : undefined,
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0266D2' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#007BFF' }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.9)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        Masuk
      </button>
    </Link>
  )
}

// ─── Button Second (Daftar / Outline) ────────────────────────────────────────
function RegisterBtn({ fullWidth = false, onClick }: { fullWidth?: boolean; onClick?: () => void }) {
  return (
    <Link to={ROUTES.REGISTER} onClick={onClick} className={fullWidth ? 'block w-full' : 'inline-block'}>
      <button
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          fontWeight: 500,
          color: 'var(--register-text)',
          backgroundColor: 'var(--register-bg)',
          padding: '10px 30px',
          borderRadius: '9999px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / .1)',
          border: '1.5px solid var(--register-border)',
          cursor: 'pointer',
          transition: 'all 300ms ease-in-out',
          width: fullWidth ? '100%' : undefined,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'var(--register-hover-bg)'
          e.currentTarget.style.color = 'var(--register-hover-text)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'var(--register-bg)'
          e.currentTarget.style.color = 'var(--register-text)'
        }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.9)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        Daftar
      </button>
    </Link>
  )
}

// ─── Desktop NavLink ─────────────────────────────────────────────────────────
const NavLink = ({ to, children, isActive }: { to: string, children: string, isActive: boolean }) => (
  <Link
    to={to}
    style={{
      fontFamily: 'var(--font-body)',
      fontSize: '16px',
      color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
      textDecoration: 'none',
      transition: 'opacity 200ms, transform 200ms',
      display: 'inline-block',
    }}
    onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
    onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.9)' }}
    onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
  >
    {children}
  </Link>
)

// ─── Mobile Menu NavLink ─────────────────────────────────────────────────────
const CardNavLink = ({ to, children, isActive, onClick }: { to: string, children: string, isActive: boolean, onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    style={{
      display: 'block',
      fontFamily: 'var(--font-body)',
      fontSize: '16px',
      color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
      padding: '8px 20px',
      textDecoration: 'none',
      transition: 'opacity 150ms',
    }}
    onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
  >
    {children}
  </Link>
)

export type HeaderVariant = 'guest' | 'logged-in' | 'login-page' | 'in-materi'

export default function Header({
  materialTitle,
}: {
  materialTitle?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()
  const { navData } = useMaterialNav()
  const { theme, toggleTheme, setTheme } = useTheme()

  // Determine current variant based on route and auth status
  let variant: 'guest' | 'logged-in' | 'in-materi' = user ? 'logged-in' : 'guest'
  if (
    location.pathname.startsWith(`${ROUTES.MATERIALS}/`) ||
    location.pathname.startsWith('/apresiasi')
  ) {
    variant = 'in-materi'
  }

  // Close menu on route change
  useEffect(() => { setIsOpen(false) }, [location.pathname])

  const checkActive = (path: string) => location.pathname === path

  if (variant === 'in-materi') {
    return (
      <>
        {/* Backdrop for closing mobile/desktop hamburger on click outside */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 45, // Below z-50 of navbar
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            />
          )}
        </AnimatePresence>

        <div className="fixed top-4 left-4 right-4 z-50">
          <AnimatePresence mode='wait'>
            {!isOpen ? (
              <motion.div
                key="compact-materi"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                style={{
                  ...glassCSS,
                  borderRadius: '9999px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                {/* Desktop layout: Left: Judul materi, Right: Theme toggle button */}
                <div className="hidden lg:flex w-full items-center justify-between">
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '16px', color: 'var(--color-text)' }}>
                    {materialTitle}
                  </span>
                  
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
                      {theme === 'light' ? (
                        <Moon size={20} weight="bold" />
                      ) : (
                        <Sun size={20} weight="bold" />
                      )}
                    </motion.div>
                  </button>
                </div>

                {/* Mobile layout: Left: Hamburger menu, Right: Theme toggle button */}
                <div className="flex lg:hidden w-full items-center justify-between">
                  <button
                    onClick={() => setIsOpen(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', padding: 0 }}
                  >
                    <Bars2Icon />
                  </button>

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
                      {theme === 'light' ? (
                        <Moon size={20} weight="bold" />
                      ) : (
                        <Sun size={20} weight="bold" />
                      )}
                    </motion.div>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="expanded-materi"
                initial={{ opacity: 1, height: '52px' }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 1, height: '52px' }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                  ...glassCSS,
                  borderRadius: '20px',
                  width: '100%',
                  minWidth: 'auto',
                  overflow: 'hidden',
                  paddingBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
                  {/* Left: Close button (X) in expanded menu */}
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', padding: 0 }}
                  >
                    <XMarkIcon />
                  </button>

                  {/* Right: Theme toggle button in expanded menu */}
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
                      {theme === 'light' ? (
                        <Moon size={20} weight="bold" />
                      ) : (
                        <Sun size={20} weight="bold" />
                      )}
                    </motion.div>
                  </button>
                </div>

                {materialTitle && (
                  <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', color: 'var(--color-text)', padding: '6px 20px', margin: 0 }}>
                    {materialTitle}
                  </p>
                )}

                {/* Progress bar */}
                {navData && (
                  <div style={{ padding: '4px 20px 8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#6B7280' }}>Progres</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: '#007BFF' }}>{navData.progressPercent}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, backgroundColor: 'var(--color-neutral-light)', overflow: 'hidden' }}>
                      <motion.div
                        animate={{ width: `${navData.progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                        style={{ height: '100%', backgroundColor: '#007BFF', borderRadius: 999 }}
                      />
                    </div>
                  </div>
                )}

                {/* Section list */}
                {navData && navData.sectionLabels.map((label, idx) => {
                  const isRevealed = idx <= navData.revealedUpTo
                  const isCurrent = idx === navData.revealedUpTo
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (isRevealed) {
                          navData.onSectionClick(idx)
                          setIsOpen(false)
                        }
                      }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '8px 20px', border: 'none',
                        cursor: isRevealed ? 'pointer' : 'default',
                        backgroundColor: isCurrent ? 'var(--color-primary-light)' : 'transparent',
                        fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: isCurrent ? 700 : 400,
                        color: isCurrent ? 'var(--color-primary)' : isRevealed ? 'var(--color-text)' : '#C4C9D4',
                      }}
                    >
                      {label}
                    </button>
                  )
                })}
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 20px' }} />
                <button
                  onClick={() => { navData?.onExit(); setIsOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 20px', color: '#007BFF', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '16px', width: '100%', textAlign: 'left' }}
                >
                  <ArrowLeftIcon />
                  Keluar dari materi
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-16 lg:h-20" />
      </>
    )
  }

  return (
    <>
      {/* Backdrop for closing mobile navbar on click outside */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 45, // Below z-50 of navbar
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />
        )}
      </AnimatePresence>

      <div className="hidden lg:flex fixed top-4 left-4 right-4 z-50 justify-center pointer-events-none">
        <div
          className="pointer-events-auto"
          style={{
            ...glassCSS,
            borderRadius: '9999px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            width: '100%',
          }}
        >
          <Link
            to={ROUTES.HOME}
            style={{ textDecoration: 'none' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '32px',
                background: 'linear-gradient(to right, #6fb4ff, #007BFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
                display: 'inline-block'
              }}
            >
              {APP_NAME}
            </span>
          </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              {NAV_LINKS.map(link => (
                <NavLink key={link.path} to={link.path} isActive={checkActive(link.path)}>
                  {link.label}
                </NavLink>
              ))}

              {variant === 'guest' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <RegisterBtn />
                  <LoginBtn />
                </div>
              )}

              {variant === 'logged-in' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Link
                    to={ROUTES.ACCOUNT}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', transition: 'opacity 200ms' }}
                    className="hover:opacity-80"
                  >
                    <UserCircleIcon />
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
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
              )}

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
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  color: 'var(--color-text)',
                  transition: 'background-color 200ms, color 200ms',
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
                  {theme === 'light' ? (
                    <Moon size={22} weight="bold" />
                  ) : (
                    <Sun size={22} weight="bold" />
                  )}
                </motion.div>
              </button>
            </div>
        </div>
      </div>

      <div className="flex lg:hidden fixed top-4 left-4 right-4 z-50">
        <AnimatePresence mode='wait'>
          {!isOpen ? (
            <motion.div
              key="compact"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              style={{
                ...glassCSS,
                borderRadius: '9999px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                width: '100%',
                overflow: 'hidden'
              }}
            >
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
                  display: 'inline-block'
                }}
              >
                {APP_NAME}
              </span>
              <button
                onClick={() => setIsOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', padding: 0 }}
              >
                <Bars2Icon />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 1, height: '52px' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 1, height: '52px' }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{
                ...glassCSS,
                borderRadius: '20px',
                width: '100%',
                minWidth: 'auto',
                overflow: 'hidden',
                paddingBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
                <motion.span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '22px',
                    background: 'linear-gradient(to right, #6fb4ff, #007BFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1,
                    display: 'inline-block'
                  }}
                >
                  {APP_NAME}
                </motion.span>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', padding: 0 }}
                >
                  <XMarkIcon />
                </motion.button>
              </div>

                <>
                  {NAV_LINKS.map(link => (
                    <CardNavLink key={link.path} to={link.path} isActive={checkActive(link.path)} onClick={() => setIsOpen(false)}>
                      {link.label}
                    </CardNavLink>
                  ))}

                  {(variant === 'guest' || variant === 'logged-in') && (
                    <>
                      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 20px' }} />
                      <div style={{ padding: '8px 20px 0' }}>
                        {variant === 'guest' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <RegisterBtn fullWidth onClick={() => setIsOpen(false)} />
                            <LoginBtn fullWidth onClick={() => setIsOpen(false)} />
                          </div>
                        )}
                        {variant === 'logged-in' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Link to="/akun" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', textDecoration: 'none' }}>
                              <UserCircleIcon />
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>Akun Saya</span>
                            </Link>
                            <button
                              onClick={() => { signOut(); setIsOpen(false); }}
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                              <SignOut size={24} weight="bold" />
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 500 }}>Keluar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              
              {/* Theme Selector inside hamburger menu */}
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 20px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-text-light)' }}>
                  Tema
                </span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--color-neutral-light)', padding: '4px', borderRadius: '9999px', position: 'relative' }}>
                  <button
                    onClick={() => setTheme('light')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      backgroundColor: 'transparent',
                      color: theme === 'light' ? '#ffffff' : 'var(--color-text-light)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: theme === 'light' ? 600 : 400,
                      transition: 'color 200ms ease',
                      cursor: 'pointer',
                      border: 'none',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {theme === 'light' && (
                      <motion.div
                        layoutId="activeTheme"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'var(--color-primary)',
                          borderRadius: '9999px',
                          zIndex: -1,
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Sun size={18} weight={theme === 'light' ? 'fill' : 'bold'} />
                    Terang
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      backgroundColor: 'transparent',
                      color: theme === 'dark' ? '#ffffff' : 'var(--color-text-light)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: theme === 'dark' ? 600 : 400,
                      transition: 'color 200ms ease',
                      cursor: 'pointer',
                      border: 'none',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {theme === 'dark' && (
                      <motion.div
                        layoutId="activeTheme"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'var(--color-primary)',
                          borderRadius: '9999px',
                          zIndex: -1,
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Moon size={18} weight={theme === 'dark' ? 'fill' : 'bold'} />
                    Gelap
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="h-16 lg:h-20" />
    </>
  )
}
