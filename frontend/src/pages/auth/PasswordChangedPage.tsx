import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'

// ─── Auth Variant 6: Kata Sandi Berhasil Diperbarui ──────────────────────────
export default function PasswordChangedPage() {
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
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '12px',
            }}
          >
            Kata Sandi Berhasil Diperbarui
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
            Sekarang kamu sudah bisa masuk kembali menggunakan kata sandi yang baru.
          </p>

          <Link to={ROUTES.LOGIN}>
            <Button variant="primary" fullWidth>
              Masuk sekarang
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
