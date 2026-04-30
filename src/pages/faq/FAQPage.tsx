import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CaretDown, WhatsappLogo, Envelope } from '@phosphor-icons/react'
import Button from '@/components/ui/Button'

// ─── FAQ Data (from FAQ.txt) ───────────────────────────────────────────────────
const faqCategories = [
  {
    category: 'Tentang website',
    items: [
      {
        q: 'Apa itu Mathshape?',
        a: 'Mathshape adalah website pembelajaran matematika interaktif yang dibuat untuk siswa SMP. Website ini menyediakan materi terstruktur, soal latihan, dan tracking progres belajar.',
      },
      {
        q: 'Apakah Mathshape gratis?',
        a: 'Ya, Mathshape sepenuhnya gratis. Anda hanya perlu mendaftar akun untuk mengakses materi yang tersedia.',
      },
    ],
  },
  {
    category: 'Pendaftaran & Akun',
    items: [
      {
        q: 'Bagaimana cara mendaftar akun baru?',
        a: 'Pilih menu "Daftar" dan masukan data diri dengan benar.',
      },
      {
        q: 'Saya lupa kata sandi, bagaimana cara memulihkannya?',
        a: 'Klik "Lupa Password" pada halaman login. Masukkan email Anda, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi ke kotak masuk (cek folder Spam jika tidak ada).',
      },
      {
        q: 'Apakah saya bisa mengubah alamat email atau nama profil setelah mendaftar?',
        a: 'Anda hanya bisa mengubah nama profil dan kata sandi saja.',
      },
    ],
  },
  {
    category: 'Teknis & Akses Pembelajaran',
    items: [
      {
        q: 'Perangkat apa saja yang mendukung untuk mengakses materi?',
        a: 'Anda dapat mengakses materi melalui browser di PC/Laptop, tab, dan smartphone.',
      },
      {
        q: 'Apakah materi bisa diakses secara offline?',
        a: 'Tidak. Anda tidak bisa mengakses materi untuk dipelajari secara offline.',
      },
      {
        q: 'Berapa lama masa akses materi?',
        a: 'Kami memberikan akses selamanya. Anda bisa mengulang materi kapan pun meski kursus tersebut telah Anda selesaikan.',
      },
      {
        q: 'Video tidak mau berputar/buffering terus, apa yang harus saya lakukan?',
        a: 'Pastikan koneksi internet stabil, hapus cache browser Anda, atau coba muat ulang halaman.',
      },
    ],
  },
]

// ─── Single accordion item ─────────────────────────────────────────────────────
function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      style={{
        border: '1.5px solid #E5E7EB',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          gap: '16px',
          textAlign: 'left',
        }}
      >
        {/* Question — Body text-1 bold = 16px 700 */}
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--color-text)',
            flex: 1,
          }}
        >
          {q}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
          <CaretDown size={20} color="var(--color-neutral)" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            {/* Answer — Body text-1 = 16px */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'var(--color-text-light)',
                padding: '0 24px 20px',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>(null)

  return (
    <main style={{ backgroundColor: 'var(--color-background)', minHeight: '100svh' }}>
      <div
        className="section-container"
        style={{ paddingTop: '100px', paddingBottom: '64px', display: 'flex', flexDirection: 'column', gap: '48px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center', alignItems: 'center' }}>
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
            Pertanyaan yang sering ditanyakan
          </h1>
          {/* Deskripsi — Body text-1 = 16px, center */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
              margin: 0,
              lineHeight: 1.7,
              textAlign: 'center',
            }}
          >
            Temukan jawaban untuk pertanyaan umum tentang Mathshape.
          </p>
        </div>

        {/* FAQ Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {faqCategories.map((cat) => (
            <div key={cat.category} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Subjudul pertanyaan — Heading-4 = 20px */}
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                {cat.category}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`
                  return (
                    <FAQItem
                      key={key}
                      q={item.q}
                      a={item.a}
                      isOpen={openKey === key}
                      onToggle={() => setOpenKey(openKey === key ? null : key)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* "Belum menemukan jawaban" — Heading-1 = 32px, centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            paddingTop: '16px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: 0,
            }}
          >
            Belum menemukan jawaban?
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            Hubungi kami langsung melalui WhatsApp atau email.
          </p>

          {/* Buttons — Third (WhatsApp/success) + Second (Email/outline) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
            <a
              href="https://wa.me/6289504573745"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="success" size="lg">
                <WhatsappLogo size={20} weight="fill" />
                WhatsApp
              </Button>
            </a>
            <a href="mailto:mathshape67@gmail.com">
              <Button variant="outline" size="lg">
                <Envelope size={20} weight="regular" />
                Email
              </Button>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
