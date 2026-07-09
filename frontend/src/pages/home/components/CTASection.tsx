import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import Button from '@/components/ui/Button'
import { ShieldCheck, Binoculars, ShieldCheckered, StarIcon } from '@phosphor-icons/react'

// Feature badges with middle-dot separator
const features = [
  { icon: StarIcon, label: 'Akses gratis' },
  { icon: ShieldCheckered, label: 'Konten terjamin' },
  { icon: ShieldCheck, label: 'Aman & terpercaya' },
]

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.25 })

  return (
    <section
      id="cta"
      ref={ref}
      style={{ backgroundColor: 'var(--color-background)', padding: '64px 0' }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '32px',
          }}
        >
          {/* Purple icon container */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              backgroundColor: 'var(--color-bg-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Binoculars size={36} color="var(--color-icon-purple)" weight="regular" />
          </div>

          {/* Heading — Heading-2 = 28px */}
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--color-text)',
              lineHeight: 1.3,
              margin: 0,
              maxWidth: '560px',
            }}
          >
            Siap mulai perjalanan belajarmu?
          </h2>

          {/* Description — Body text-1 = 16px */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
              lineHeight: 1.7,
              margin: 0,
              maxWidth: '480px',
            }}
          >
            Daftarkan dirimu sekarang dan mulai perjalanan belajar matematika
            yang menyenangkan bersama Mathshape!
          </p>

          {/* Buttons — First + Outline (Second) */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to={ROUTES.REGISTER}>
              <Button variant="primary" size="lg">
                Mulai sekarang
              </Button>
            </Link>
            <Link to={ROUTES.GUIDE}>
              <Button variant="outline" size="lg">
                Lihat panduan
              </Button>
            </Link>
          </div>

          {/* Feature badges with middle-dot separator — Body text-3 = 12px */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0',
            }}
          >
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <span
                  key={feat.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'var(--color-text-light)',
                  }}
                >
                  {/* middle dot separator */}
                  {i > 0 && (
                    <span style={{ margin: '0 10px', fontSize: '16px', lineHeight: 2, color: 'var(--color-neutral-light)' }}>
                      ·
                    </span>
                  )}
                  <Icon size={14} color="var(--color-neutral)" weight="regular" />
                  {feat.label}
                </span>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
