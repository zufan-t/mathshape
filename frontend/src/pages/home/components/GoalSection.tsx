import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  NumberSquareOne,
  Student,
  Monitor,
  ChalkboardTeacher,
  Rocket,
  TrendUp,
  Lightbulb,
  Brain,
} from '@phosphor-icons/react'

// ─── Impact (goal) list items ──────────────────────────────────────────────────
const impactItems = [
  {
    icon: NumberSquareOne,
    title: 'Literasi numerasi siswa',
    desc: 'Meningkatkan kemampuan berpikir logis dan pemecahan masalah matematika melalui pendekatan yang lebih sederhana.',
  },
  {
    icon: Student,
    title: 'Kemandirian belajar',
    desc: 'Mendorong siswa untuk menjadi pembelajaran aktif yang mampu mengatur ritme belajarnya sendiri secara digital.',
  },
  {
    icon: Monitor,
    title: 'Inovasi media pembelajaran',
    desc: 'Menciptakan inovasi baru dalam penyajian materi geometri yang sistematis untuk menunjang kurikulum sekolah.',
  },
  {
    icon: ChalkboardTeacher,
    title: 'Dukungan guru & pengajar',
    desc: 'Menjadi alat bantu inovatif bagi guru untuk mengetahui perkembangan belajar siswa secara objektif dan transparan.',
  },
  {
    icon: Lightbulb,
    title: 'Kemampuan Berpikir Kreatif',
    desc: 'Kemampuan menghasilkan gagasan, strategi, dan solusi yang baru, fleksibel, serta inovatif untuk menyelesaikan masalah matematika secara unik dan bermakna.',
  },
  {
    icon: Brain,
    title: 'Kemampuan Pemecahan Masalah',
    desc: 'Kemampuan memahami masalah, merancang dan melaksanakan strategi penyelesaian secara logis, serta mengevaluasi hasilnya untuk menemukan solusi yang tepat.',
  },
]

// ─── Goal cards ────────────────────────────────────────────────────────────────
const goalCards = [
  {
    icon: Rocket,
    iconColor: '#007BFF',   // Blue
    iconBg: '#A1CAF3',      // Blue bg
    cardBg: '#D9ECFF',      // Blue card background
    label: 'Menuju generasi emas',
  },
  {
    icon: TrendUp,
    iconColor: '#279827',   // Green
    iconBg: '#C4E8CA',      // Green bg
    cardBg: '#EBF7ED',      // Green card background
    label: 'Mendukung kualitas pendidikan',
  },
]

// ─── Impact Card (animated) ────────────────────────────────────────────────────
function ImpactCard({ item, index }: { item: typeof impactItems[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.25 })
  const Icon = item.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      style={{
        border: '1.5px solid var(--color-border)',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        backgroundColor: 'var(--color-card-bg)',
      }}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <Icon size={24} color="var(--color-text)" weight="regular" />
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
          {item.title}
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
          {item.desc}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Goal Icon Card (animated) ─────────────────────────────────────────────────
function GoalCard({ item, index }: { item: typeof goalCards[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const Icon = item.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
      style={{
        flex: 1,
        backgroundColor: item.cardBg,
        borderRadius: '20px',
        padding: '32px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Circle icon container */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: item.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={32} color={item.iconColor} weight="regular" />
      </div>
      {/* Label */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          fontWeight: 500,
          color: '#0f172a', /* Always dark slate for contrast on light background */
          margin: 0,
          textAlign: 'center',
        }}
      >
        {item.label}
      </p>
    </motion.div>
  )
}

// ─── Main Section ──────────────────────────────────────────────────────────────
export default function GoalSection() {
  return (
    <section
      id="tujuan"
      style={{ backgroundColor: 'var(--color-background)', padding: '64px 0' }}
    >
      <div className="section-container">
        {/*
         * Layout:
         *   Mobile        → column (all stacked)
         *   Tablet (md+)  → left content full, right panel offset right
         *   Desktop (lg+) → row (left: heading+grid, right: goal cards+quote)
         */}
        <div
          className="goal-outer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
          }}
        >
          {/* ── LEFT: Heading + Impact 2×2 grid ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
            className="goal-left"
          >
            {/* Heading + description — no animation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                Bukan sekedar belajar, tapi berkontribusi pada masa depan pendidikan
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  color: 'var(--color-text-light)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Website ini merupakan bagian dari kegiatan pengabdian penelitian untuk meningkatkan
                efektivitas pengajaran matematika melalui teknologi interaktif.
              </p>
            </div>

            {/* Impact cards — 2×2 grid */}
            <div
              className="impact-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px',
              }}
            >
              {impactItems.map((item, index) => (
                <ImpactCard key={item.title} item={item} index={index} />
              ))}
            </div>
          </div>

          {/* ── RIGHT: Goal cards + motivasi quote ── */}
          <div
            className="goal-right"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Two goal icon cards side by side */}
            <div style={{ display: 'flex', gap: '16px' }}>
              {goalCards.map((card, i) => (
                <GoalCard key={card.label} item={card} index={i} />
              ))}
            </div>

            {/* Motivasi quote block */}
            <div
              style={{
                backgroundColor: '#D3D6E2',
                borderRadius: '20px',
                padding: '28px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontStyle: 'italic',
                  color: '#0f172a', /* Always dark slate for contrast on #D3D6E2 background */
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                "Belajarlah tanpa lelah, karena ilmu adalah harta yang tidak akan pernah habis
                meskipun terus dibagikan."
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#475569', /* Dark slate-grey for legibility on light background */
                  margin: 0,
                }}
              >
                B.J. Habibie
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        /* Tablet (md): impact grid → 1 col, right panel starts becoming visible */
        @media (min-width: 768px) {
          .impact-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        /* Desktop (lg): side-by-side layout */
        @media (min-width: 1024px) {
          .goal-outer {
            flex-direction: row !important;
            align-items: flex-start !important;
          }
          .goal-left {
            flex: 1 1 0 !important;
          }
          .goal-right {
            width: 380px !important;
            flex-shrink: 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
