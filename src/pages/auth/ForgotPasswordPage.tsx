import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CircleNotch } from '@phosphor-icons/react'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { validateEmail } from '@/lib/authValidation'

// ─── Auth: Lupa Kata Sandi ────────────────────────────────────────────────────
//
// PRINSIP KEAMANAN (Anti-Enumeration):
//   Halaman ini selalu menampilkan pesan sukses dan navigate ke EMAIL_SENT
//   meskipun email tidak terdaftar di database.
//   Ini mencegah penyerang mengetahui apakah suatu email terdaftar atau tidak.
//
export default function ForgotPasswordPage() {
  const [email, setEmail]           = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [loading, setLoading]       = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi format email sebelum hit API
    const emailV = validateEmail(email)
    if (!emailV.valid) {
      setEmailError(emailV.message ?? null)
      return
    }

    setLoading(true)

    // Kirim reset email — kita ignore hasilnya (error atau tidak)
    // agar tidak bocorkan apakah email terdaftar
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${ROUTES.RESET_PASSWORD}`,
    })

    // ── ANTI-ENUMERATION: selalu navigate ke halaman sukses ──────────────
    // Tidak peduli apakah email ada atau tidak, response ke user sama.
    navigate(ROUTES.EMAIL_SENT, { state: { email, type: 'recovery' } })
  }

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
            color: '#34393F', textAlign: 'center', marginBottom: '12px',
          }}>Atur ulang kata sandi</h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '14px', color: '#6B7280',
            textAlign: 'center', marginBottom: '28px', lineHeight: 1.6,
          }}>
            Masukkan email yang terdaftar. Kami akan mengirimkan instruksi ke email kamu untuk membuat kata sandi baru.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} noValidate>
            <div>
              <label htmlFor="forgot-email" style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
                color: '#34393F', display: 'block', marginBottom: '6px',
              }}>Email</label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  if (emailError) {
                    const r = validateEmail(e.target.value)
                    if (r.valid) setEmailError(null)
                  }
                }}
                onBlur={() => {
                  const r = validateEmail(email)
                  setEmailError(r.valid ? null : (r.message ?? null))
                }}
                placeholder="nama@email.com"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  border: `1.5px solid ${emailError ? '#EF4444' : '#E5E7EB'}`,
                  backgroundColor: '#F0F2F8', fontFamily: 'var(--font-body)',
                  fontSize: '16px', color: '#34393F', outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 200ms',
                }}
                onFocus={e => { if (!emailError) e.target.style.borderColor = '#007BFF' }}
              />
              {emailError && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#EF4444', margin: '4px 0 0 4px' }}>
                  {emailError}
                </p>
              )}
            </div>

            <Button variant="primary" fullWidth type="submit" disabled={loading}>
              {loading ? <CircleNotch className="animate-spin" size={20} /> : 'Kirim'}
            </Button>
          </form>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#6B7280', textAlign: 'center', marginTop: '20px' }}>
            Ingat kata sandimu?{' '}
            <Link to={ROUTES.LOGIN} style={{ color: '#007BFF', fontWeight: 600 }}>Kembali ke Masuk</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
