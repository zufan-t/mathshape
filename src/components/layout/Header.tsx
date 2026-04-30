import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X, UserCircle, SignOut } from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/AuthContext'
import { NAV_LINKS, ROUTES, APP_NAME } from '@/lib/constants'
import { useMaterialNav } from '@/features/materials/MaterialNavContext'

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
  background: 'rgba(255, 255, 255, 0.20)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '4px solid #FFFFFF',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.10), 0 2px 8px rgba(0, 0, 0, 0.06)'
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
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: '10px 30px',
          borderRadius: '9999px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / .1)',
          border: '1.5px solid #000000',
          cursor: 'pointer',
          transition: 'all 300ms ease-in-out',
          width: fullWidth ? '100%' : undefined,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#000000'
          e.currentTarget.style.color = '#ffffff'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#ffffff'
          e.currentTarget.style.color = '#000000'
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
      color: isActive ? '#007BFF' : '#34393F',
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
      color: isActive ? '#007BFF' : '#34393F',
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

  // Determine current variant based on route and auth status
  let variant: 'guest' | 'logged-in' | 'in-materi' = user ? 'logged-in' : 'guest'
  if (location.pathname.startsWith(`${ROUTES.MATERIALS}/`)) {
    variant = 'in-materi'
  }

  // Close menu on route change
  useEffect(() => { setIsOpen(false) }, [location.pathname])

  const checkActive = (path: string) => location.pathname === path

  return (
    <>
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

          {variant === 'in-materi' && materialTitle && (
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '16px', color: '#34393F' }}>
              {materialTitle}
            </span>
          )}

          {variant !== 'in-materi' && (
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
                      color: '#34393F', maxWidth: '120px', overflow: 'hidden',
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
            </div>
          )}
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
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#34393F', display: 'flex', padding: 0 }}
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
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#34393F', display: 'flex', padding: 0 }}
                >
                  <XMarkIcon />
                </motion.button>
              </div>

              {variant === 'in-materi' ? (
                <>
                  {materialTitle && (
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', color: '#34393F', padding: '6px 20px', margin: 0 }}>
                      {materialTitle}
                    </p>
                  )}
                  {/* Progress bar di mobile */}
                  {navData && (
                    <div style={{ padding: '4px 20px 8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#6B7280' }}>Progres</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: '#007BFF' }}>{navData.progressPercent}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
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
                          backgroundColor: isCurrent ? '#EFF6FF' : 'transparent',
                          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: isCurrent ? 700 : 400,
                          color: isCurrent ? '#007BFF' : isRevealed ? '#34393F' : '#C4C9D4',
                        }}
                      >
                        {label}
                      </button>
                    )
                  })}
                  <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.08)', margin: '8px 20px' }} />
                  <button
                    onClick={() => { navData?.onExit(); setIsOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 20px', color: '#007BFF', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '16px', width: '100%', textAlign: 'left' }}
                  >
                    <ArrowLeftIcon />
                    Keluar dari materi
                  </button>
                </>
              ) : (
                <>
                  {NAV_LINKS.map(link => (
                    <CardNavLink key={link.path} to={link.path} isActive={checkActive(link.path)} onClick={() => setIsOpen(false)}>
                      {link.label}
                    </CardNavLink>
                  ))}

                  {(variant === 'guest' || variant === 'logged-in') && (
                    <>
                      <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.08)', margin: '8px 20px' }} />
                      <div style={{ padding: '8px 20px 0' }}>
                        {variant === 'guest' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <RegisterBtn fullWidth onClick={() => setIsOpen(false)} />
                            <LoginBtn fullWidth onClick={() => setIsOpen(false)} />
                          </div>
                        )}
                        {variant === 'logged-in' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Link to="/akun" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34393F', textDecoration: 'none' }}>
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
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="h-16 lg:h-20" />
    </>
  )
}
