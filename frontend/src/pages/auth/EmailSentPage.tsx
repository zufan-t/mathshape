import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Envelope, CircleNotch, CheckCircle, ArrowLeft } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { ROUTES } from '@/lib/constants'

// ─── Auth Variant 4: Email Terkirim ───────────────────────────────────────────
export default function EmailSentPage() {
  const location = useLocation()
  const { email, type = 'signup' } = (location.state as { email?: string; type?: 'signup' | 'recovery' }) || {}
  
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [resentError, setResentError] = useState<string | null>(null)

  const handleResend = async () => {
    if (!email) {
      setResentError('Email tidak ditemukan. Silakan ulangi proses dari awal.')
      return
    }

    setResending(true)
    setResentError(null)

    const { error } = await supabase.auth.resend({
      type: type as 'signup' | 'signup' | 'invite' | 'magiclink' | 'recovery',
      email,
    })

    setResending(false)
    if (error) {
      setResentError('Gagal mengirim ulang email. Coba lagi dalam beberapa menit.')
    } else {
      setResent(true)
    }
  }

  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background)',
        padding: '24px 16px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: '100%', maxWidth: '440px' }}
      >
        {/* Card */}
        <div
          style={{
            backgroundColor: 'var(--color-card-bg)',
            borderRadius: '20px',
            padding: '40px 32px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: '1px solid var(--color-border)',
            textAlign: 'center',
          }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              width: '72px',
              height: '72px',
              backgroundColor: 'var(--color-primary-light)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <Envelope size={36} color="#007BFF" weight="fill" />
          </motion.div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '12px',
            }}
          >
            Email terkirim
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
              lineHeight: 1.65,
              marginBottom: '28px',
            }}
          >
            Silakan cek kotak masuk (atau folder spam) email kamu. Klik link yang ada di dalam email tersebut untuk melanjutkan.
          </p>

          {/* Resend section */}
          {resent ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <CheckCircle size={20} color="#22C55E" weight="fill" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#15803D', fontWeight: 600 }}>
                Email verifikasi sudah dikirim ulang!
              </span>
            </div>
          ) : (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-text-light)', margin: 0 }}>
              Tidak menerima email?{' '}
              <button
                onClick={handleResend}
                disabled={resending}
                style={{
                  background: 'none', border: 'none', cursor: resending ? 'default' : 'pointer',
                  color: '#007BFF', fontWeight: 600, fontFamily: 'var(--font-body)',
                  fontSize: '15px', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 4,
                }}
              >
                {resending
                  ? <><CircleNotch className="animate-spin" size={14} /> Mengirim...</>
                  : 'Kirim ulang'}
              </button>
            </p>
          )}

          {resentError && (
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#EF4444', margin: 0 }}>
                {resentError}
              </p>
              <Link
                to={ROUTES.LOGIN}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '14px', color: '#007BFF',
                  textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                <ArrowLeft size={16} /> Kembali ke Beranda
              </Link>
            </div>
          )}

          {!resentError && (
             <Link
                to={ROUTES.LOGIN}
                style={{
                  marginTop: 32,
                  fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-light)',
                  textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                <ArrowLeft size={16} /> Kembali ke Login
              </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}
