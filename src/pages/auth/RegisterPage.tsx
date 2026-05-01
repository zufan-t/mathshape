import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeClosed, CircleNotch, Warning } from '@phosphor-icons/react'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import {
  validateEmail,
  validatePassword,
} from '@/lib/authValidation'

// ─── Password Strength Bar ────────────────────────────────────────────────────
function StrengthBar({ label, color, percent }: {
  label: string; color: string; percent: number
}) {
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 4, borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${percent}%`, backgroundColor: color }}
          transition={{ duration: 0.4 }}
          style={{ height: '100%', borderRadius: 999 }}
        />
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color, margin: '3px 0 0 2px' }}>
        Kekuatan kata sandi: <strong>{label}</strong>
      </p>
    </div>
  )
}

// ─── Auth: Daftar (Register) ──────────────────────────────────────────────────
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Per-field errors
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<ReturnType<typeof validatePassword> | null>(null)

  const navigate = useNavigate()

  // ── Field handlers ────────────────────────────────────────────────────────
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) {
      const r = validateEmail(e.target.value)
      if (r.valid) setEmailError(null)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setPassword(val)
    if (val.length > 0) {
      const result = validatePassword(val)
      setPasswordStrength(result)
      setPasswordError(result.valid ? null : (result.message ?? null))
    } else {
      setPasswordStrength(null)
      setPasswordError(null)
    }
    // Re-validate confirm jika sudah diisi
    if (confirmPassword) {
      setConfirmError(val !== confirmPassword ? 'Kata sandi tidak cocok.' : null)
    }
  }

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setConfirmError(e.target.value !== password ? 'Kata sandi tidak cocok.' : null)
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validasi semua field sebelum hit API
    const emailV = validateEmail(email)
    const passwordV = validatePassword(password)
    const confirmV = password === confirmPassword

    let hasError = false
    if (!emailV.valid) { setEmailError(emailV.message ?? null); hasError = true }
    if (!passwordV.valid) { setPasswordError(passwordV.message ?? null); hasError = true }
    if (!confirmV) { setConfirmError('Kata sandi tidak cocok.'); hasError = true }
    if (!fullName.trim()) { setError('Nama lengkap wajib diisi.'); hasError = true }
    if (hasError) return

    setLoading(true)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName.trim() } },
    })

    if (authError) {
      const msg = authError.message.toLowerCase()
      const status = (authError as { status?: number }).status

      if (status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
        // Rate limit Supabase — terlalu banyak percobaan
        setError('Terlalu banyak percobaan pendaftaran. Silakan tunggu beberapa menit lalu coba lagi.')
      } else if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user_already_exists')) {
        setEmailError('Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.')
      } else if (msg.includes('invalid email') || msg.includes('email address')) {
        setEmailError('Format email tidak diterima server. Gunakan email yang valid.')
      } else if (msg.includes('password')) {
        setPasswordError('Kata sandi tidak memenuhi syarat server. Gunakan minimal 6 karakter.')
      } else if (msg.includes('signups not allowed') || msg.includes('signup disabled')) {
        setError('Pendaftaran sedang dinonaktifkan. Hubungi administrator.')
      } else {
        // Fallback — tampilkan pesan asli dalam dev mode agar mudah debug
        setError(`Gagal mendaftar: ${authError.message}`)
      }
      setLoading(false)
    } else {
      // Paksa logout agar tidak auto-login sebelum verifikasi email
      await supabase.auth.signOut()
      navigate(ROUTES.EMAIL_SENT, { state: { email, type: 'signup' } })
    }
  }

  // ─── Shared styles ────────────────────────────────────────────────────────
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: `1.5px solid ${hasError ? '#EF4444' : '#E5E7EB'}`,
    backgroundColor: '#F0F2F8', fontFamily: 'var(--font-body)',
    fontSize: '16px', color: '#34393F', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 200ms',
  })

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
    color: '#34393F', display: 'block', marginBottom: '6px',
  }

  const fieldErrorStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: '12px',
    color: '#EF4444', margin: '4px 0 0 4px',
  }

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', backgroundColor: '#F5F8FF', padding: '24px 16px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: '100%', maxWidth: '440px' }}
      >
        {/* Card */}
        <div style={{
          backgroundColor: '#fff', borderRadius: '20px', padding: '36px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #EDF1F7',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700,
            color: '#34393F', textAlign: 'center', marginBottom: '28px',
          }}>Daftar</h1>

          {/* Global error */}
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

            {/* Nama Lengkap */}
            <div>
              <label htmlFor="reg-fullname" style={labelStyle}>Nama Lengkap</label>
              <input
                id="reg-fullname" type="text" autoComplete="name"
                value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                style={inputStyle(false)}
                onFocus={e => { e.target.style.borderColor = '#007BFF' }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB' }}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" style={labelStyle}>Email</label>
              <input
                id="reg-email" type="email" autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => {
                  const r = validateEmail(email)
                  setEmailError(r.valid ? null : (r.message ?? null))
                }}
                placeholder="nama@email.com"
                style={inputStyle(!!emailError)}
                onFocus={e => { if (!emailError) e.target.style.borderColor = '#007BFF' }}
              />
              {emailError && <p style={fieldErrorStyle}>{emailError}</p>}
            </div>

            {/* Kata Sandi */}
            <div>
              <label htmlFor="reg-password" style={labelStyle}>Kata Sandi</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Minimal 8 karakter"
                  style={{ ...inputStyle(!!passwordError), paddingRight: '48px' }}
                  onFocus={e => { if (!passwordError) e.target.style.borderColor = '#007BFF' }}
                  onBlur={e => { if (!passwordError) e.target.style.borderColor = '#E5E7EB' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#6C759E', display: 'flex', padding: 0,
                  }}>
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
              </div>
              {passwordError && <p style={fieldErrorStyle}>{passwordError}</p>}
              {/* Keterangan syarat password */}
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {([
                  { label: 'Huruf kapital (A–Z)', test: /[A-Z]/.test(password) },
                  { label: 'Huruf kecil (a–z)', test: /[a-z]/.test(password) },
                  { label: 'Angka (0–9)', test: /[0-9]/.test(password) },
                  { label: 'Simbol (@, #, %, *, ^, dsb.)', test: /[^a-zA-Z0-9]/.test(password) },
                  { label: 'Minimal 8 karakter', test: password.length >= 8 },
                ] as { label: string; test: boolean }[]).map((req) => (
                  <div key={req.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, color: req.test ? '#22C55E' : '#9CA3AF', lineHeight: 1 }}>
                      {req.test ? '✓' : '•'}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: 12,
                      color: req.test ? '#15803D' : '#9CA3AF',
                    }}>{req.label}</span>
                  </div>
                ))}
              </div>
              {/* Strength bar */}
              {passwordStrength?.strength && !passwordError && (
                <StrengthBar
                  label={passwordStrength.strengthLabel!}
                  color={passwordStrength.strengthColor!}
                  percent={passwordStrength.strengthPercent!}
                />
              )}
            </div>

            {/* Konfirmasi Kata Sandi */}
            <div>
              <label htmlFor="reg-confirm" style={labelStyle}>Konfirmasi Kata Sandi</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={handleConfirmChange}
                  placeholder="Ulangi kata sandi"
                  style={{ ...inputStyle(!!confirmError), paddingRight: '48px' }}
                  onFocus={e => { if (!confirmError) e.target.style.borderColor = '#007BFF' }}
                  onBlur={e => { if (!confirmError) e.target.style.borderColor = '#E5E7EB' }}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#6C759E', display: 'flex', padding: 0,
                  }}>
                  {showConfirmPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
              </div>
              {confirmError && <p style={fieldErrorStyle}>{confirmError}</p>}
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#6B7280', textAlign: 'center', margin: 0 }}>
              Sudah punya akun?{' '}
              <Link to={ROUTES.LOGIN} style={{ color: '#007BFF', fontWeight: 600 }}>Masuk di sini</Link>
            </p>

            <Button variant="primary" fullWidth type="submit" disabled={loading}>
              {loading ? <CircleNotch className="animate-spin" size={20} /> : 'Daftar'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
