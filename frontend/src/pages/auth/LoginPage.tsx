import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeClosed, CircleNotch, Envelope, Warning } from '@phosphor-icons/react'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import {
  validateEmail,
  normalizeLoginError,
  EMAIL_NOT_VERIFIED_MARKER,
} from '@/lib/authValidation'

// ─── Auth: Masuk (Login) ──────────────────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [emailError, setEmailError]     = useState<string | null>(null)
  const [unverified, setUnverified]     = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isTeacherPage = location.pathname === ROUTES.TEACHER_LOGIN

  // ── Validasi email saat blur ──────────────────────────────────────────────
  const handleEmailBlur = () => {
    const result = validateEmail(email)
    setEmailError(result.valid ? null : (result.message ?? null))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) {
      // Clear error saat user mulai mengetik kembali
      const result = validateEmail(e.target.value)
      if (result.valid) setEmailError(null)
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setUnverified(false)

    // Validasi email sebelum hit API
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      setEmailError(emailValidation.message ?? null)
      return
    }
    if (!password) {
      setError('Kata sandi wajib diisi.')
      return
    }

    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      // ── Anti-enumeration: normalisasi semua error ──────────────────────
      const normalized = normalizeLoginError(authError.message)

      if (normalized === EMAIL_NOT_VERIFIED_MARKER) {
        // Email belum diverifikasi — beri pesan informatif, BUKAN error generik
        await supabase.auth.signOut() // pastikan tidak ada sesi tersimpan
        setUnverified(true)
      } else {
        setError(normalized)
      }
      setLoading(false)
      return
    }

    if (data.user) {
      const userRole = data.user.user_metadata?.role || 'student'
      
      if (isTeacherPage) {
        if (userRole !== 'teacher') {
          await supabase.auth.signOut()
          setError('Akses ditolak: Akun ini terdaftar sebagai siswa. Silakan masuk melalui halaman login siswa.')
          setLoading(false)
          return
        }
        navigate(ROUTES.TEACHER_DASHBOARD)
      } else {
        if (userRole === 'teacher') {
          await supabase.auth.signOut()
          setError('Akses ditolak: Akun ini terdaftar sebagai guru. Silakan masuk melalui halaman login guru.')
          setLoading(false)
          return
        }
        navigate(ROUTES.HOME)
      }
    }
  }

  // ── Resend verification email ─────────────────────────────────────────────
  const handleResendVerification = async () => {
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (!error) navigate(ROUTES.EMAIL_SENT)
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', backgroundColor: 'var(--color-background)', padding: '24px 16px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: '100%', maxWidth: '440px' }}
      >
        {/* Card */}
        <div style={{
          backgroundColor: 'var(--color-card-bg)', borderRadius: '20px', padding: '36px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--color-border)',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700,
            color: 'var(--color-text)', textAlign: 'center', marginBottom: '8px',
          }}>Masuk</h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-text-light)',
            textAlign: 'center', marginBottom: '28px', lineHeight: 1.6,
          }}>Masukkan email dan kata sandi untuk melanjutkan</p>

          {/* Banner: Email belum diverifikasi */}
          <AnimatePresence>
            {unverified && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: '14px 16px', borderRadius: '12px',
                  backgroundColor: '#FFF7ED', border: '1.5px solid #FED7AA',
                  marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Envelope size={18} color="#F59E0B" weight="fill" />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700, color: '#92400E' }}>
                    Email belum diverifikasi
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                  Silakan cek kotak masuk email kamu dan klik link verifikasi.
                </p>
                <button
                  onClick={handleResendVerification}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700,
                    color: '#007BFF', textAlign: 'left',
                  }}
                >
                  Kirim ulang email verifikasi →
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error generik (anti-enumeration) */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: '12px 16px', borderRadius: '10px', display: 'flex',
                  alignItems: 'center', gap: 8,
                  backgroundColor: '#FEE2E2', marginBottom: '20px',
                }}
              >
                <Warning size={16} color="#DC2626" weight="fill" style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#DC2626' }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
                color: 'var(--color-text)', display: 'block', marginBottom: '6px',
              }}>Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Masukkan email anda"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  border: `1.5px solid ${emailError ? '#EF4444' : 'var(--color-border)'}`,
                  backgroundColor: 'var(--color-input-bg)', fontFamily: 'var(--font-body)',
                  fontSize: '16px', color: 'var(--color-text)', outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 200ms',
                }}
                onFocus={e => { if (!emailError) e.target.style.borderColor = '#007BFF' }}
                onBlur={e => { handleEmailBlur(); if (!emailError) e.target.style.borderColor = 'var(--color-border)' }}
              />
              {emailError && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#EF4444', margin: '4px 0 0 4px' }}>
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
                color: 'var(--color-text)', display: 'block', marginBottom: '6px',
              }}>Kata Sandi</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  style={{
                    width: '100%', padding: '12px 48px 12px 16px', borderRadius: '12px',
                    border: '1.5px solid var(--color-border)', backgroundColor: 'var(--color-input-bg)',
                    fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-text)',
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 200ms',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#007BFF' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--color-border)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#6C759E',
                    display: 'flex', padding: 0,
                  }}
                >
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
              </div>
            </div>

            {/* Lupa password */}
            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
              <Link to={ROUTES.FORGOT_PASSWORD} style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', color: '#007BFF', fontWeight: 500,
              }}>
                Lupa Kata Sandi?
              </Link>
            </div>

            <Button variant="primary" fullWidth type="submit" disabled={loading}>
              {loading ? <CircleNotch className="animate-spin" size={20} /> : 'Masuk'}
            </Button>
          </form>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#6B7280', textAlign: 'center', marginTop: '20px' }}>
            Belum punya akun?{' '}
            <Link to={isTeacherPage ? ROUTES.TEACHER_REGISTER : ROUTES.REGISTER} style={{ color: '#007BFF', fontWeight: 600 }}>Daftar di sini</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
