import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Lock, CircleNotch } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useMaterials } from '@/features/materials/useMaterials'
import { useProgress } from '@/features/progress/useProgress'
import { useAuth } from '@/features/auth/AuthContext'
import { ROUTES } from '@/lib/constants'
import materiSatu from '@/assets/materiSatu.jpg'
import materiDua from '@/assets/materiDua.jpg'
import materiTiga from '@/assets/materiTiga.jpeg'

const BIG_IDEA_IMAGES: Record<number, string> = {
  1: materiSatu,
  2: materiDua,
  3: materiTiga,
}

function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return w
}

// ─── Individual Card ───────────────────────────────────────────────────────────
function MaterialCard({
  item,
  index,
  progressPerc = 0,
  isLocked = true
}: {
  item: any;
  index: number;
  progressPerc?: number;
  isLocked?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #E5E7EB',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        opacity: isLocked ? 0.75 : 1,
        filter: isLocked ? 'grayscale(0.4)' : 'none',
      }}
    >
      {/* Photo: gunakan gambar Big Idea lokal */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: '#0d0d0d',
          backgroundImage: BIG_IDEA_IMAGES[item.id] ? `url(${BIG_IDEA_IMAGES[item.id]})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isLocked && <Lock size={48} color="rgba(255,255,255,0.4)" weight="fill" />}
      </div>

      {/* Card body */}
      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {item.pertemuan_label}
        </p>

        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--color-text)',
            margin: 0,
          }}
        >
          {item.title}
        </p>

        {isLocked ? (
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="var(--color-text-light)" weight="fill" />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-light)' }}>
              Selesaikan materi sebelumnya
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-text-light)' }}>
                Progres
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-text-light)' }}>
                {progressPerc}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: '#E5E7EB',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${progressPerc}%` } : { width: 0 }}
                transition={{ duration: 0.8, delay: index * 0.12 + 0.3, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-primary)',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MaterialListPage() {
  const { user } = useAuth()
  const { materials, loading: mLoading } = useMaterials()
  const { loading: pLoading, isCompleted, getProgressPercent } = useProgress()
  const windowWidth = useWindowWidth()
  const isMobile = windowWidth < 640

  if (mLoading || pLoading) {
    return (
      <div style={{ height: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircleNotch className="animate-spin" size={48} color="var(--color-primary)" />
      </div>
    )
  }

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100svh' }}>
      <div
        className="section-container"
        style={{ paddingTop: '100px', paddingBottom: '64px', display: 'flex', flexDirection: 'column', gap: '40px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Daftar Materi Pembelajaran
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-text-light)', margin: 0, lineHeight: 1.7, maxWidth: '600px' }}>
            Selesaikan setiap pertemuan secara berurutan untuk membuka materi berikutnya. Klik pada kartu materi yang aktif untuk mulai belajar.
          </p>
        </div>

        {/* Banner untuk user yang belum login */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              padding: isMobile ? '20px 24px' : '16px 32px',
              borderRadius: '20px',
              backgroundColor: '#EFF6FF',
              border: '1.5px solid #BFDBFE',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: isMobile ? 'center' : 'space-between',
              textAlign: isMobile ? 'center' : 'left',
              gap: 16,
            }}
          >
            <span style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '16px', 
              fontWeight: 500, 
              color: '#1D4ED8',
              lineHeight: 1.5 
            }}>
              Login untuk mulai belajar dan menyimpan progres kamu.
            </span>
            <Link
              to={ROUTES.LOGIN}
              style={{
                fontFamily: 'var(--font-body)', 
                fontSize: '15px', 
                fontWeight: 700,
                color: '#fff', 
                backgroundColor: '#007BFF',
                padding: '10px 28px', 
                borderRadius: '9999px', 
                textDecoration: 'none',
                transition: 'all 200ms',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007BFF')}
            >
              Masuk
            </Link>
          </motion.div>
        )}

        <div className="material-grid">
          {materials.map((item, index) => {
            // Materi 1 selalu terbuka untuk semua (termasuk guest)
            // Materi berikutnya terbuka jika: user login DAN materi sebelumnya selesai
            const prevMaterialId = index > 0 ? materials[index - 1]?.id : null

            let isLocked: boolean
            if (index === 0) {
              // Materi pertama: terbuka HANYA jika user sudah login
              isLocked = !user
            } else {
              // Materi 2+: terbuka jika login DAN materi sebelumnya selesai
              isLocked = !user || !isCompleted(prevMaterialId!)
            }

            // Progress: gunakan getProgressPercent yang baca current_section dari DB
            const progressPerc = getProgressPercent(item.id)

            return (
              <Link
                key={item.id}
                to={isLocked ? '#' : `/materi/${item.id}`}
                style={{ textDecoration: 'none', pointerEvents: isLocked ? 'none' : 'auto' }}
              >
                <MaterialCard
                  item={item}
                  index={index}
                  isLocked={isLocked}
                  progressPerc={progressPerc}
                />
              </Link>
            )
          })}
        </div>
      </div>

      <style>{`
        .material-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 640px) {
          .material-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .material-grid { grid-template-columns: 1fr 1fr 1fr; }
        }
      `}</style>
    </main>
  )
}
