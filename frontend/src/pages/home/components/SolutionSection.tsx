import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  SquaresFour,
  BookOpen,
  Translate,
  NotePencil,
  CheckCircle,
} from '@phosphor-icons/react'

// ─── Icon Grid items (2×2 layout) ─────────────────────────────────────────────
const iconItems = [
  { icon: SquaresFour, iconColor: '#7C299D', iconBg: '#E49FFF' },  // Purple
  { icon: Translate, iconColor: '#DEA30D', iconBg: '#F7FFA1' },  // Yellow  (was lightbulb)
  { icon: BookOpen, iconColor: '#007BFF', iconBg: '#D9ECFF' },  // Blue
  { icon: NotePencil, iconColor: '#279827', iconBg: '#EBF7ED' },  // Green
]

// ─── Feature list items ────────────────────────────────────────────────────────
const features = [
  {
    title: 'Menu simpel & antiribet',
    desc: 'Tampilan website yang bersih memudahkan anda menemukan materi atau fitur tanpa harus bingung mencari tombol.',
  },
  {
    title: 'Alur belajar terstruktur',
    desc: 'Materi berurutan memastikan anda menguasai dasar-dasarnya terlebih dahulu sebelum lanjut ke tahap berikutnya.',
  },
  {
    title: 'Bahasa yang Simpel',
    desc: 'Penjelasan materi dikemas dengan bahasa yang simpel dan visual menarik agar konsep yang sulit jadi terasa lebih ringan.',
  },
  {
    title: 'Uji Pemahaman Langsung',
    desc: 'Tersedia soal di setiap materi untuk memastikan anda benar-benar paham sebelum membuka materi baru.',
  },
]

// ─── Icon Grid (animated individually) ────────────────────────────────────────
function IconGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.25 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        flexShrink: 0,
      }}
    >
      {iconItems.map((item, i) => {
        const Icon = item.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              minWidth: '120px',
              maxWidth: '160px',
              borderRadius: '20px',
              backgroundColor: item.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={44} color={item.iconColor} weight="regular" />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ─── Main Section ──────────────────────────────────────────────────────────────
export default function SolutionSection() {
  return (
    <section
      id="solusi"
      style={{ backgroundColor: 'var(--color-background)', padding: '64px 0' }}
    >
      <div
        className="section-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '48px',
        }}
      >
        {/*
         * Layout:
         *   Mobile / Tablet  → column (icons stacked, then text list)
         *   Desktop (lg+)    → row (icons left, text right)
         */}
        <div
          className="solution-inner"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '48px',
            width: '100%',
          }}
        >
          {/* ── Left: 2×2 Icon Grid ── */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <IconGrid />
          </div>

          {/* ── Right: Heading + feature list ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1,
              width: '100%',
            }}
          >
            {/* Heading — Heading-2 = 28px, no animation */}
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--color-text)',
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              Disini belajar menjadi lebih terarah dan menyenangkan
            </h2>

            {/* Feature list — no text animation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {features.map((feature) => (
                <div
                  key={feature.title}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}
                >
                  {/* Check icon — circle container with blue-background */}
                  <div
                    style={{
                      flexShrink: 0,
                      marginTop: '2px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle
                      size={18}
                      color="var(--color-primary)"
                      weight="regular"
                    />
                  </div>
                  {/* Text */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        margin: 0,
                      }}
                    >
                      {feature.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '16px',
                        color: 'var(--color-text-light)',
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 1024px) {
          .solution-inner {
            flex-direction: row !important;
            align-items: flex-start !important;
          }
          .solution-inner > div:first-child {
            width: auto !important;
          }
        }
      `}</style>
    </section>
  )
}
