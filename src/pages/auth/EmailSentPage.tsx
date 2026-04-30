import { useState } from 'react'
import { motion } from 'framer-motion'
import { Envelope, CircleNotch, CheckCircle } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'

// ─── Auth Variant 4: Email Terkirim ───────────────────────────────────────────
export default function EmailSentPage() {
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [resentError, setResentError] = useState<string | null>(null)

  const handleResend = async () => {
    setResending(true)
    setResentError(null)

    // Ambil email dari session yang sedang aktif (user baru saja daftar tapi belum login)
    const { data: { session } } = await supabase.auth.getSession()
    const email = session?.user?.email

    if (!email) {
      // Tidak bisa mendapatkan email — tampilkan pesan generik
      setResentError('Tidak dapat menemukan sesi. Silakan daftar ulang.')
      setResending(false)
      return
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
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
        backgroundColor: '#F5F8FF',
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
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '40px 32px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: '1px solid #EDF1F7',
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
              backgroundColor: '#D9ECFF',
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
              color: '#34393F',
              marginBottom: '12px',
            }}
          >
            Email terkirim
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: '#6B7280',
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
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#6B7280', margin: 0 }}>
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
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#EF4444', marginTop: 10 }}>
              {resentError}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
