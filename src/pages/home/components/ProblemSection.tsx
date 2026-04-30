import { motion, type Variants } from 'framer-motion'
import { EyeSlash, PuzzlePiece, SmileySad } from '@phosphor-icons/react'

// ─── Data ──────────────────────────────────────────────────────────────────
const problems = [
  {
    icon: EyeSlash,
    iconColor: '#B51F29',       // --color-icon-red
    iconBg: '#FEDCDC',          // --color-bg-red
    title: 'Terlalu abstrak',
    desc: 'Materi terasa sulit dibayangkan karena hanya berupa simbol dan gambar mati yang sulit dihubungkan dengan dunia nyata.',
  },
  {
    icon: PuzzlePiece,
    iconColor: '#279827',       // --color-icon-green
    iconBg: '#EBF7ED',          // --color-bg-green
    title: 'Paham bukan hafalan',
    desc: 'Terjebak dalam menghafal rumus tanpa mengerti alasan di baliknya hanya akan membuat kita bingung saat menghadapi soal yang berbeda.',
  },
  {
    icon: SmileySad,
    iconColor: '#DEA30D',       // --color-icon-yellow
    iconBg: '#F7FFA1',          // --color-bg-yellow
    title: 'Membosankan',
    desc: 'Cara belajar yang monoton seringkali membuat semangat kita padam sebelum sempat memahami isi materinya.',
  },
]

// ─── Animation variants ────────────────────────────────────────────────────
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' as const },
  }),
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function ProblemSection() {
  return (
    <section
      id="pemantik"
      style={{ backgroundColor: 'var(--color-background)', padding: '64px 0' }}
    >
      <div className="section-container">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          {/* Subjudul — Heading-4 = 20px */}
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '16px',
            }}
          >
            Mengapa matematika terasa sulit?
          </h2>

          {/* Deskripsi — Body text-1 = 16px */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Sulitnya memahami matematika sering kali bukan karena kurangnya kemampuan,
            namun ada celah dalam proses belajar yang membuat konsepnya sulit menempel di ingatan.
          </p>
        </motion.div>

        {/* ── Cards Grid: 3 col desktop / 1 col mobile+tablet ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {problems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.25 }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Icon Container */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    backgroundColor: item.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={28} color={item.iconColor} weight="regular" />
                </div>

                {/* Judul — Heading-4 = 20px */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>

                {/* Deskripsi — Body text-1 = 16px */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    color: 'var(--color-text-light)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
