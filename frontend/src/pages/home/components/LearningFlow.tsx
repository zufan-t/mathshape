import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { HashStraight, CornersIn, BoundingBox, Brain } from '@phosphor-icons/react'

// ─── Data ──────────────────────────────────────────────────────────────────────
const materials = [
  {
    label: 'PERTEMUAN 1',
    icon: HashStraight,
    title: 'Konsep garis dan sudut',
    desc: 'Membangun fondasi awal dengan memahami bagaimana garis-garis saling berinteraksi dalam satu bidang.',
    progress: 33,   // 1/3
  },
  {
    label: 'PERTEMUAN 2',
    icon: CornersIn,
    title: 'Hubungan antar sudut',
    desc: 'Mempelajari berbagai jenis sudut dan menghitung besaran sudut yang belum diketahui.',
    progress: 67,   // 2/3
  },
  {
    label: 'PERTEMUAN 3',
    icon: BoundingBox,
    title: 'Kesebangunan',
    desc: 'Memahami perbandingan kesamaan bentuk dan ukuran pada bentuk objek.',
    progress: 100,  // 3/3
  },
]

// ─── Animated Progress Bar ─────────────────────────────────────────────────────
function ProgressBar({ percent, inView }: { percent: number; inView: boolean }) {
  return (
    <div
      style={{
        width: '100%',
        height: '6px',
        borderRadius: '9999px',
        backgroundColor: '#D3D6E2',
        overflow: 'hidden',
        marginTop: 'auto',
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: inView ? `${percent}%` : 0 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        style={{
          height: '100%',
          borderRadius: '9999px',
          backgroundColor: 'var(--color-primary)',
        }}
      />
    </div>
  )
}

// ─── Material Card ─────────────────────────────────────────────────────────────
function MaterialCard({
  item,
  index,
}: {
  item: typeof materials[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const Icon = item.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
      style={{
        backgroundColor: 'var(--color-card-bg)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1.5px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: '220px',
      }}
    >
      {/* Baris atas: label + icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* PERTEMUAN label — Body text-1 bold, color primary */}
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '0.02em',
          }}
        >
          {item.label}
        </span>

        {/* Icon — rounded square, green bg */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#EBF7ED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={22} color="#279827" weight="regular" />
        </div>
      </div>

      {/* Judul — Heading-3 = 24px */}
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: 0,
          lineHeight: 1.25,
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
          margin: 0,
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {item.desc}
      </p>

      {/* Progress bar */}
      <ProgressBar percent={item.progress} inView={isInView} />
    </motion.div>
  )
}

// ─── Kognitif Card — no animation ────────────────────────────────────────────
function KognitifCard() {
  return (
    <div
      style={{
        backgroundColor: '#D3D6E2',
        borderRadius: '16px',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '20px',
      }}
    >
      {/* Icon otak — bg color primary, icon putih */}
      <div
        style={{
          flexShrink: 0,
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Brain size={28} color="#ffffff" weight="regular" />
      </div>

      {/* Teks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Judul — Body text-1 bold = 16px bold */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            fontWeight: 700,
            color: '#1A202C',
            margin: 0,
          }}
        >
          Analisis kognitif &amp; pedagogi
        </p>
        {/* Deskripsi — Body text-1 = 16px */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            color: '#1A202C',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Setiap modul disusun dengan prinsip beban kognitif yang terukur, memastikan materi
          menantang namun tetap dapat dicapai oleh kemampuan siswa.
        </p>
      </div>
    </div>
  )
}

// ─── Main Section ──────────────────────────────────────────────────────────────
export default function LearningFlow() {
  return (
    <section
      id="alur-belajar"
      style={{ backgroundColor: 'var(--color-background)', padding: '64px 0' }}
    >
      <div className="section-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* ── Header — no animation ── */}
        <div style={{ textAlign: 'center' }}>
          {/* Judul — Heading-3 = 24px */}
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '12px',
            }}
          >
            Materi berbasis riset
          </h2>
          {/* Deskripsi — Body text-1 = 16px */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Setiap pertemuan dirancang dengan metodologi pedagogi untuk memastikan
            efektivitas pemahaman konsep.
          </p>
        </div>

        {/* ── Cards Grid: 3 col desktop / 1 col mobile+tab ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {materials.map((item, index) => (
            <MaterialCard key={item.label} item={item} index={index} />
          ))}
        </div>

        {/* ── Kognitif Card ── */}
        <KognitifCard />

      </div>
    </section>
  )
}
