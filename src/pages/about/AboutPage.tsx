import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import najwa from "../../assets/najwa.jpg"
import salsa from "../../assets/salsa.jpg"
import rafi from "../../assets/rafi.jpg"
import zufan from "../../assets/zufan.jpg"

// ─── Team data ─────────────────────────────────────────────────────────────────
const teamMembers = [
  {
    name: 'Zufan Taufiqurrohman',
    prodi: 'Statistika Terapan dan Komputasi',
    roles: ['UI/UX Designer', 'Fullstack Developer'],
    photo: zufan,
  },
  {
    name: 'Rafi Rahmatulloh',
    prodi: 'Pendidikan Matematika',
    roles: ['Pengembang materi'],
    photo: rafi,
  },
  {
    name: 'Najwa Qoirun Nisa',
    prodi: 'Pendidikan Matematika',
    roles: ['Pengembang materi'],
    photo: najwa,
  },
  {
    name: 'Salsa Bila Titiana',
    prodi: 'Pendidikan Matematika',
    roles: ['Pengembang materi'],
    photo: salsa,
  },
]

// ─── Member Card ───────────────────────────────────────────────────────────────
function MemberCard({ member, index }: { member: typeof teamMembers[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #E5E7EB',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Photo Container */}
      <div
        style={{
          width: 'calc(100% - 24px)',
          aspectRatio: '1 / 1',
          backgroundColor: '#f3f4f6',
          borderRadius: '16px',
          margin: '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              imageRendering: 'auto',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          />
        ) : (
          /* Placeholder if no photo */
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#0d0d0d',
            }}
          />
        )}
      </div>

      {/* Text content */}
      <div
        style={{
          padding: '0 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Name — Heading-4 = 20px */}
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--color-text)',
            margin: 0,
          }}
        >
          {member.name}
        </h3>

        {/* Prodi — Body text-1 = 16px */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            color: 'var(--color-text-light)',
            margin: 0,
          }}
        >
          {member.prodi}
        </p>

        {/* Role badges — Body text-3 = 12px, blue-background, full-rounded */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
          {member.roles.map((role) => (
            <span
              key={role}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--color-primary)',
                backgroundColor: '#D9ECFF',
                borderRadius: '9999px',
                padding: '4px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main style={{ backgroundColor: 'var(--color-background)', minHeight: '100svh' }}>
      <div
        className="section-container"
        style={{ paddingTop: '100px', paddingBottom: '64px', display: 'flex', flexDirection: 'column', gap: '48px' }}
      >
        {/* Header — no animation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
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
            Berdedikasi untuk masa depan pendidikan
          </h1>
          {/* Body text-1 = 16px */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text-light)',
              maxWidth: '600px',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Kami hadir untuk menjembatani kesenjangan antara teori matematika dan pemahaman
            siswa melalui inovasi teknologi yang interaktif dan mudah diakses.
          </p>
        </div>

        {/* Team cards grid — 2 cols on md+, 1 col on mobile */}
        <div className="about-grid">
          {teamMembers.map((member, index) => (
            <MemberCard key={`${member.name}-${index}`} member={member} index={index} />
          ))}
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 420px) {
          .about-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 700px) {
          .about-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
        @media (min-width: 1000px) {
          .about-grid {
            grid-template-columns: 1fr 1fr 1fr 1fr;
          }
        }
      `}</style>
    </main>
  )
}
