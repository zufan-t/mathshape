import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeClosed, CircleNotch, CheckCircle, Warning } from '@phosphor-icons/react'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { validatePassword } from '@/lib/authValidation'

// ─── Auth: Buat Kata Sandi Baru (setelah klik link di email) ──────────────────
//
// Supabase mengirimkan link ke email dengan format:
//   https://your-site.com/reset-password#access_token=...&type=recovery
// Saat halaman ini dimuat, Supabase otomatis membaca hash tersebut dan membuat
// sesi sementara. Kita bisa langsung panggil supabase.auth.updateUser().
//
export default function ResetPasswordPage() {
  const [showPassword, setShowPassword]             = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword]               = useState('')
  const [confirmPassword, setConfirmPassword]       = useState('')
  const [passwordError, setPasswordError]           = useState<string | null>(null)
  const [confirmError, setConfirmError]             = useState<string | null>(null)
  const [loading, setLoading]                       = useState(false)
  const [error, setError]                           = useState<string | null>(null)
  const [sessionReady, setSessionReady]             = useState(false)
  const navigate = useNavigate()

  // ── Cek session dari hash URL yang dikirim Supabase ──────────────────────────
  useEffect(() => {
    // Supabase Auth listener akan otomatis mendeteksi event PASSWORD_RECOVERY
    // dari hash URL saat halaman dimuat
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Handlers field ────────────────────────────────────────────────────────────
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setNewPassword(val)
    if (val.length > 0) {
      const r = validatePassword(val)
      setPasswordError(r.valid ? null : (r.message ?? null))
    } else {
      setPasswordError(null)
    }
    if (confirmPassword) {
      setConfirmError(val !== confirmPassword ? 'Kata sandi tidak cocok.' : null)
    }
  }

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setConfirmError(e.target.value !== newPassword ? 'Kata sandi tidak cocok.' : null)
  }

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validasi
    const passV = validatePassword(newPassword)
    if (!passV.valid) { setPasswordError(passV.message ?? null); return }
    if (newPassword !== confirmPassword) { setConfirmError('Kata sandi tidak cocok.'); return }

    setLoading(true)

    // Update password via Supabase — session sudah ada dari link di email
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })

    if (updateError) {
      setError('Gagal memperbarui kata sandi. Link mungkin sudah kedaluwarsa. Silakan minta link baru.')
      setLoading(false)
      return
    }

    // Sukses — logout dulu agar user login ulang dengan password baru
    await supabase.auth.signOut()
    navigate(ROUTES.PASSWORD_CHANGED)
  }

  // ─── Shared styles ────────────────────────────────────────────────────────────
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%', padding: '12px 48px 12px 16px', borderRadius: '12px',
    border: `1.5px solid ${hasError ? '#EF4444' : '#E5E7EB'}`,
    backgroundColor: '#F0F2F8', fontFamily: 'var(--font-body)',
    fontSize: '16px', color: '#34393F', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 200ms',
  })

  const fieldErrorStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: '12px',
    color: '#EF4444', margin: '4px 0 0 4px',
  }

  // ─────────────────────────────────────────────────────────────────────────────
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
          }}>Buat kata sandi baru</h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '14px', color: '#6B7280',
            textAlign: 'center', marginBottom: '28px', lineHeight: 1.6,
          }}>Pilihlah kata sandi yang kuat dan mudah kamu ingat.</p>

          {/* Banner: session belum siap */}
          {!sessionReady && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
              backgroundColor: '#FFF7ED', border: '1.5px solid #FED7AA',
              fontFamily: 'var(--font-body)', fontSize: '13px', color: '#92400E',
            }}>
              ⏳ Memverifikasi link... pastikan kamu membuka halaman ini dari link di email.
            </div>
          )}

          {/* Error global */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: '12px 16px', borderRadius: '10px', display: 'flex',
                  alignItems: 'center', gap: 8, backgroundColor: '#FEE2E2', marginBottom: '20px',
                }}
              >
                <Warning size={16} color="#DC2626" weight="fill" style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#DC2626' }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} noValidate>

            {/* Kata sandi baru */}
            <div>
              <label htmlFor="new-password" style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
                color: '#34393F', display: 'block', marginBottom: '6px',
              }}>Kata sandi baru</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Minimal 8 karakter, huruf + angka"
                  style={inputStyle(!!passwordError)}
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
            </div>

            {/* Konfirmasi */}
            <div>
              <label htmlFor="confirm-new-password" style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
                color: '#34393F', display: 'block', marginBottom: '6px',
              }}>Konfirmasi kata sandi</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={handleConfirmChange}
                  placeholder="Ulangi kata sandi baru"
                  style={inputStyle(!!confirmError)}
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

            <Button variant="primary" fullWidth type="submit" disabled={loading || !sessionReady}>
              {loading
                ? <><CircleNotch className="animate-spin" size={18} /> Menyimpan...</>
                : <><CheckCircle size={18} /> Simpan kata sandi baru</>}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
