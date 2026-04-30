import { motion } from 'framer-motion'
import { Medal } from '@phosphor-icons/react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { ROUTES, TOTAL_MATERIALS } from '@/lib/constants'

export default function ApresiasiPage() {
  const [searchParams] = useSearchParams()
  // Baca materialId dari query string, misal /apresiasi?from=1
  const fromId = parseInt(searchParams.get('from') || '1')
  const nextId = fromId + 1
  const hasNext = nextId <= TOTAL_MATERIALS

  return (
    <main
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="section-container"
        style={{ paddingTop: '80px', paddingBottom: '80px' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
          }}
        >
          {/* Medal icon in blue circle */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Medal size={56} color="#ffffff" weight="light" />
          </motion.div>

          {/* Heading-1 = 32px */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--color-text)',
                margin: 0,
              }}
            >
              Selamat!
            </h1>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--color-text)',
                margin: 0,
              }}
            >
              Anda telah menyelesaikan materi ini
            </h1>
          </div>

          {/* Body text-1 = 16px */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
              margin: 0,
              lineHeight: 1.7,
              maxWidth: '480px',
            }}
          >
            Anda telah menuntaskan seluruh sesi pada pertemuan ini. Progres belajarmu sudah tersimpan.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            {/* Tombol Kembali → ke List Materi */}
            <Link to={ROUTES.MATERIALS}>
              <Button variant="success" size="lg">
                Ke List Materi
              </Button>
            </Link>

            {/* Review materi saat ini */}
            <Link to={ROUTES.MATERIAL_CONTENT.replace(':id', String(fromId))}>
              <Button variant="outline" size="lg">
                Review materi
              </Button>
            </Link>

            {/* Materi selanjutnya → langsung masuk materi, hanya tampil jika ada */}
            {hasNext && (
              <Link to={ROUTES.MATERIAL_CONTENT.replace(':id', String(nextId))}>
                <Button variant="primary" size="lg">
                  Materi selanjutnya
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
