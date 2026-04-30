import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  UserPlus,
  UserCheck,
  BookOpen,
  Lock,
  NotePencil,
  CheckCircle,
} from '@phosphor-icons/react'

// ─── Step numbers (4 steps at top) ────────────────────────────────────────────
const stepNumbers = [
  { num: '1', bg: '#D9ECFF', color: '#007BFF', label: 'Daftar/masuk akun', sub: 'Daftarkan/masuk ke akun anda' },
  { num: '2', bg: '#EBF7ED', color: '#279827', label: 'Pilih materi', sub: 'Pilih materi yang sudah terbuka' },
  { num: '3', bg: '#E49FFF', color: '#7C299D', label: 'Pelajari materi', sub: 'Baca materi sampai tuntas' },
  { num: '4', bg: '#F7FFA1', color: '#DEA30D', label: 'Kerjakan soal', sub: 'Uji kemampuanmu' },
]

// ─── Detail instruction cards ──────────────────────────────────────────────────
const instructions = [
  {
    icon: UserPlus,
    iconColor: '#007BFF',
    iconBg: '#D9ECFF',
    cardBg: '#D9ECFF',
    title: 'Daftarkan akun (untuk pengguna baru)',
    desc: 'Pilih menu "Daftar" untuk membuat akun baru. Pastikan kamu mengisi data dengan benar, serta jangan lupa mencatat email dan kata sandi di tempat yang aman agar selalu mudah diakses.',
  },
  {
    icon: UserCheck,
    iconColor: '#007BFF',
    iconBg: '#D9ECFF',
    cardBg: '#D9ECFF',
    title: 'Masuk ke akun',
    desc: 'Setelah memiliki akun, silakan pilih menu "Masuk" untuk masuk ke akun anda.',
  },
  {
    icon: BookOpen,
    iconColor: '#279827',
    iconBg: '#EBF7ED',
    cardBg: '#EBF7ED',
    title: 'Akses materi',
    desc: 'Klik tombol "Mulai sekarang" atau ke halaman Materi untuk bisa mengakses materi. Pelajari materi yang tersedia dengan seksama.',
  },
  {
    icon: Lock,
    iconColor: '#279827',
    iconBg: '#EBF7ED',
    cardBg: '#EBF7ED',
    title: 'Akses materi',
    desc: 'Alur belajar disusun secara berurutan. Anda tidak bisa mengakses materi kedua sebelum menyelesaikan materi pertama.',
  },
  {
    icon: NotePencil,
    iconColor: '#7C299D',
    iconBg: '#E49FFF',
    cardBg: '#F3E8FF',
    title: 'Pengerjaan soal',
    desc: 'Di setiap pertemuan, anda akan menghadapi soal. Selesaikan soal ini untuk menguji pemahaman anda.',
  },
  {
    icon: CheckCircle,
    iconColor: '#7C299D',
    iconBg: '#E49FFF',
    cardBg: '#F3E8FF',
    title: 'Progres belajar',
    desc: 'Sistem akan menyimpan setiap langkah belajarmu. Anda bisa berhenti kapan saja dan melanjutkan kembali di lain waktu tanpa kehilangan progres terakhir.',
  },
]

// ─── Instruction Card ──────────────────────────────────────────────────────────
function InstructionCard({ item, index }: { item: typeof instructions[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const Icon = item.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      style={{
        backgroundColor: item.cardBg,
        borderRadius: '20px',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '20px',
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          flexShrink: 0,
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: item.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={28} color={item.iconColor} weight="fill" />
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
            color: 'var(--color-text)',
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

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function GuidePage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100svh' }}>
      <div
        className="section-container"
        style={{ paddingTop: '100px', paddingBottom: '64px', display: 'flex', flexDirection: 'column', gap: '80px' }}
      >
        {/* Header — no animation */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          {/* Heading-1 = 32px */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: 0,
            }}
          >
            Panduan penggunaan platform
          </h1>
          {/* Body text-1 = 16px */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
              maxWidth: '560px',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Ikuti langkah-langkah di bawah ini untuk memulai perjalanan belajarmu dengan lancar dan terstruktur.
          </p>
        </div>

        {/* Step numbers row — 2 cols on mobile, 4 cols on md+ */}
        <div className="guide-steps-grid">
          {stepNumbers.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'center',
              }}
            >
              {/* Number circle */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: step.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: step.color,
                  }}
                >
                  {step.num}
                </span>
              </div>
              {/* Step label Body text-1 bold */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                {step.label}
              </p>
              {/* Sub desc Body text-1 */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  color: 'var(--color-text-light)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {step.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Detail instruction cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {instructions.map((item, index) => (
            <InstructionCard key={item.title + index} item={item} index={index} />
          ))}
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        .guide-steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px 24px;
        }
        @media (min-width: 420px) {
          .guide-steps-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }
        @media (min-width: 860px) {
          .guide-steps-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }
        }
      `}</style>
    </main>
  )
}
