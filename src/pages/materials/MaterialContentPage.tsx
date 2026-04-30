import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CaretDoubleLeft, CaretLeft, CaretRight, CheckCircle,
  Flag, Info, Crosshair, GraduationCap, MagnifyingGlass,
  YoutubeLogo, SealCheck, X, CircleNotch
} from '@phosphor-icons/react'
import { ROUTES } from '@/lib/constants'
import { getMateriById } from '@/data/materiData'
import { useMaterialContent } from '@/features/materials/useMaterialContent'
import { useAuth } from '@/features/auth/AuthContext'
import { useProgress } from '@/features/progress/useProgress'
import { useMaterialNav } from '@/features/materials/MaterialNavContext'
import materiSatu from '@/assets/materiSatu.jpg'
import materiDua from '@/assets/materiDua.jpg'
import materiTiga from '@/assets/materiTiga.jpeg'

const BIG_IDEA_IMAGES: Record<number, string> = {
  1: materiSatu,
  2: materiDua,
  3: materiTiga,
}

// ─── Total sections ────────────────────────────────────────────────────────────
const TOTAL_SECTIONS = 8

const SECTION_LABELS = [
  'Capaian & Tujuan Pembelajaran',
  'Big Idea',
  'Essential Question',
  'The Challenge',
  'Guiding Activities',
  'Guiding Questions',
  'Guiding Resources',
  'Solutions',
] as const

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getYoutubeEmbedId(url: string): string {
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&"'>]+)/
  const match = url.match(regExp)
  return match ? match[1] : ''
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

// ─── Icon Badge ────────────────────────────────────────────────────────────────
function IconBadge({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ color }}>{children}</div>
    </div>
  )
}

// ─── Section Card (wrapper) ────────────────────────────────────────────────────
function SectionCard({ icon, title, children, sectionRef }: { icon: React.ReactNode; title: string; children: React.ReactNode; sectionRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.div
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ backgroundColor: '#fff', borderRadius: 20, border: '1.5px solid #E5E7EB', padding: '28px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon}
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#34393F', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#6B7280', lineHeight: 1.75 }}>
        {children}
      </div>
    </motion.div>
  )
}

// ─── Exit Modal ────────────────────────────────────────────────────────────────
function ExitModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}
    >
      <button onClick={onCancel} style={{ position: 'absolute', top: 24, right: 24, width: 48, height: 48, borderRadius: '50%', backgroundColor: '#EF4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}>
        <X size={24} color="#fff" />
      </button>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: '#34393F', margin: 0, textAlign: 'center', maxWidth: 480, lineHeight: 1.3 }}>
        Apakah anda yakin ingin keluar dari materi?
      </h2>
      <div style={{ display: 'flex', gap: 16 }}>
        <button onClick={onConfirm} style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: '#fff', backgroundColor: '#007BFF', padding: '12px 48px', borderRadius: 9999, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,123,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0266D2')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#007BFF')}>Ya</button>
        <button onClick={onCancel} style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: '#34393F', backgroundColor: '#fff', padding: '12px 48px', borderRadius: 9999, border: '2px solid #000', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#34393F' }}>Batal</button>
      </div>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function MaterialContentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { markCompleted, saveCurrentSection, saving: savingProgress, saveError } = useMaterialContent(id)
  const { getProgressByMaterialId, loading: progressLoading } = useProgress()
  const { setNavData } = useMaterialNav()
  const windowWidth = useWindowWidth()

  const isMobile = windowWidth < 640
  const isTablet = windowWidth >= 640 && windowWidth < 1024

  const materialId = parseInt(id || '1')
  const materi = getMateriById(materialId)

  // revealedUpTo = index section terakhir yang sudah ditampilkan (0 = section pertama saja)
  const [revealedUpTo, setRevealedUpTo] = useState(0)
  const [progressRestored, setProgressRestored] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [showExitModal, setShowExitModal] = useState(false)
  const [done, setDone] = useState(false)

  // Refs untuk setiap section agar bisa di-scroll
  const sectionRefs = useRef<(HTMLDivElement | null)[]>(Array(TOTAL_SECTIONS).fill(null))

  // Auth guard
  useEffect(() => {
    if (user === null) navigate(ROUTES.LOGIN, { replace: true })
  }, [user, navigate])

  // Tutup sidebar otomatis di mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  // Restore progress: langsung ke section terakhir yang sudah dibuka
  useEffect(() => {
    if (progressRestored || progressLoading) return
    const prog = getProgressByMaterialId(materialId)
    if (prog) {
      if (prog.is_completed) {
        setRevealedUpTo(TOTAL_SECTIONS - 1)
        setDone(true)
      } else if (prog.current_section > 0) {
        setRevealedUpTo(prog.current_section)
      }
    }
    setProgressRestored(true)
  }, [progressLoading, progressRestored, getProgressByMaterialId, materialId])

  // Sync navData ke context (untuk mobile sidebar di navbar)
  useEffect(() => {
    const progressPct = Math.round(((revealedUpTo + 1) / TOTAL_SECTIONS) * 100)
    setNavData({
      sectionLabels: [...SECTION_LABELS],
      revealedUpTo,
      progressPercent: progressPct,
      onSectionClick: (idx: number) => {
        sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      },
      onExit: () => setShowExitModal(true),
    })
    return () => setNavData(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealedUpTo])

  if (!materi || user === undefined) return null
  if (user === null) return null

  const m = materi
  const isLast = revealedUpTo === TOTAL_SECTIONS - 1
  // Progress: berapa section sudah terlihat dari total
  const progressPercent = Math.round(((revealedUpTo + 1) / TOTAL_SECTIONS) * 100)

  const handleNext = async () => {
    if (!isLast) {
      const nextIdx = revealedUpTo + 1
      setRevealedUpTo(nextIdx)
      // Simpan current_section ke DB (non-blocking)
      saveCurrentSection(nextIdx)
      // TIDAK auto-scroll — section baru muncul di bawah, view tetap di tempat
    } else {
      // Section terakhir — tandai selesai
      const ok = await markCompleted()
      if (ok) {
        setDone(true)
        setTimeout(() => navigate(`${ROUTES.APRESIASI}?from=${materialId}`), 900)
      }
    }
  }

  const handleConfirmExit = () => navigate(ROUTES.MATERIALS)

  // ─── Render single section by index ─────────────────────────────────────────
  function renderSection(idx: number) {
    const ref = { current: sectionRefs.current[idx] } as React.RefObject<HTMLDivElement | null>
    const setRef = (el: HTMLDivElement | null) => { sectionRefs.current[idx] = el }

    switch (idx) {
      case 0:
        return (
          <motion.div
            key="cp-tp" ref={setRef as unknown as React.RefObject<HTMLDivElement>}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: '#007BFF', borderRadius: 24, padding: 28, color: '#fff' }}
          >
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, margin: '0 0 4px' }}>{m.pertemuanLabel}</p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 20px', lineHeight: 1.2 }}>{m.judul}</h1>
            <div className="cp-tp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <GraduationCap size={20} color="#fff" />
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: '#fff' }}>Capaian Pembelajaran (CP)</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.65 }}>{m.cp}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Flag size={20} color="#fff" />
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: '#fff' }}>Tujuan Pembelajaran (TP)</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.65 }}>{m.tp}</p>
              </div>
            </div>
          </motion.div>
        )
      case 1: {
        const bigIdeaImg = BIG_IDEA_IMAGES[materialId]
        return (
          <motion.div key="big-idea" ref={setRef as unknown as React.RefObject<HTMLDivElement>}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ backgroundColor: '#fff', borderRadius: 20, border: '1.5px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ width: '100%', aspectRatio: '16/8', backgroundColor: '#0d0d0d', overflow: 'hidden' }}>
              {bigIdeaImg && (
                <img
                  src={bigIdeaImg}
                  alt={`Big Idea Materi ${materialId}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              )}
            </div>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: '#34393F', margin: '0 0 12px' }}>Big Idea</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#6B7280', lineHeight: 1.75, margin: 0 }}>{m.bigIdea}</p>
            </div>
          </motion.div>
        )
      }
      case 2:
        return (
          <SectionCard key="eq" sectionRef={ref} icon={<IconBadge bg="#D9ECFF" color="#007BFF"><Info size={22} /></IconBadge>} title="Essential Question">
            {m.essentialQuestions.map((q, i) => (
              <p key={i} style={{ margin: i > 0 ? '8px 0 0' : 0 }}>
                {m.essentialQuestions.length > 1 && <strong style={{ color: '#34393F' }}>{i + 1}.&nbsp;</strong>}{q}
              </p>
            ))}
          </SectionCard>
        )
      case 3:
        return (
          <SectionCard key="challenge" sectionRef={ref} icon={<IconBadge bg="#E49FFF" color="#7C299D"><Crosshair size={22} /></IconBadge>} title="The Challenge">
            <p style={{ margin: '0 0 12px' }}>{m.theChallenge.deskripsi}</p>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {m.theChallenge.poin.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </SectionCard>
        )
      case 4:
        return (
          <SectionCard key="activities" sectionRef={ref} icon={<IconBadge bg="#F7FFA1" color="#DEA30D"><GraduationCap size={22} /></IconBadge>} title="Guiding Activities">
            <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {m.guidingActivities.map((a, i) => <li key={i}>{a}</li>)}
            </ol>
          </SectionCard>
        )
      case 5:
        return (
          <SectionCard key="questions" sectionRef={ref} icon={<IconBadge bg="#F7FFA1" color="#DEA30D"><MagnifyingGlass size={22} /></IconBadge>} title="Guiding Questions">
            <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {m.guidingQuestions.map((q, i) => <li key={i}>{q}</li>)}
            </ol>
          </SectionCard>
        )
      case 6:
        return (
          <SectionCard key="resources" sectionRef={ref} icon={<IconBadge bg="#FEDCDC" color="#B51F29"><YoutubeLogo size={22} /></IconBadge>} title="Guiding Resources">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {m.guidingResources.map((r, i) => {
                const embedId = getYoutubeEmbedId(r.url)
                return (
                  <div key={i}>
                    {r.label && <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: '#34393F', margin: '0 0 8px' }}>{r.label}</p>}
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: 10, overflow: 'hidden', backgroundColor: '#000' }}>
                      <iframe src={`https://www.youtube.com/embed/${embedId}`} title={r.label || 'Video Materi'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        )
      case 7:
        return (
          <SectionCard key="solutions" sectionRef={ref} icon={<IconBadge bg="#EBF7ED" color="#279827"><SealCheck size={22} /></IconBadge>} title="Solutions">
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {m.solutions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </SectionCard>
        )
      default:
        return null
    }
  }

  // ─── Sidebar widths ─────────────────────────────────────────────────────────
  const sidebarWidth = isTablet ? 200 : 240
  const contentPadding = isTablet ? '20px 16px' : '32px 24px'

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div style={{ display: 'flex', minHeight: 'calc(100svh - 80px)' }}>

        {/* ── SIDEBAR (Desktop + Tablet) ───────────────────────────────────── */}
        {!isMobile && (
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                key="sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: sidebarWidth, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{
                  backgroundColor: '#fff', borderRight: '1px solid #E5E7EB',
                  overflow: 'hidden', flexShrink: 0,
                  position: 'sticky', top: 80, height: 'calc(100svh - 80px)',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', flex: 1 }}>
                  {/* Collapse button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                    <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4, display: 'flex' }} title="Tutup sidebar">
                      <CaretDoubleLeft size={18} />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 12, padding: '0 4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#6B7280' }}>Progres</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: '#007BFF' }}>{progressPercent}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
                      <motion.div animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', backgroundColor: '#007BFF', borderRadius: 999 }} />
                    </div>
                  </div>

                  {/* Section list — klik = scroll ke section yang sudah terbuka */}
                  {SECTION_LABELS.map((label, idx) => {
                    const isRevealed = idx <= revealedUpTo
                    const isCurrent = idx === revealedUpTo
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (isRevealed) sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '9px 10px', borderRadius: 10, border: 'none',
                          cursor: isRevealed ? 'pointer' : 'default',
                          backgroundColor: isCurrent ? '#EFF6FF' : 'transparent',
                          fontFamily: 'var(--font-body)', fontSize: isTablet ? 13 : 14, fontWeight: isCurrent ? 700 : 400,
                          color: isCurrent ? '#007BFF' : isRevealed ? '#34393F' : '#C4C9D4',
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={e => { if (isRevealed && !isCurrent) e.currentTarget.style.backgroundColor = '#F3F4F6' }}
                        onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        {label}
                      </button>
                    )
                  })}

                  <div style={{ flex: 1 }} />

                  {/* Keluar */}
                  <button
                    onClick={() => setShowExitModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#007BFF', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 10px', borderRadius: 10, width: '100%', textAlign: 'left', transition: 'background 150ms' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF6FF' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <CaretLeft size={16} /> Keluar dari materi
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        )}

        {/* Sidebar open button (desktop/tablet, when closed) */}
        {!isMobile && !sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 30, background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '8px 6px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} title="Buka sidebar">
            <CaretRight size={16} color="#6B7280" />
          </button>
        )}

        {/* ── CONTENT AREA ─────────────────────────────────────────────────── */}
        <main style={{ flex: 1, padding: contentPadding, overflowX: 'hidden' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Mobile: progress bar + section indicator di atas konten */}
            {isMobile && (
              <div style={{ padding: '0 0 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280' }}>
                    Bagian {revealedUpTo + 1} dari {TOTAL_SECTIONS}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#007BFF' }}>{progressPercent}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', backgroundColor: '#007BFF', borderRadius: 999 }} />
                </div>
                {/* Section label saat ini */}
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', margin: '4px 0 0' }}>
                  {SECTION_LABELS[revealedUpTo]}
                </p>
              </div>
            )}

            {/* Render semua section yang sudah terbuka (stacked) */}
            {Array.from({ length: revealedUpTo + 1 }, (_, idx) => (
              <div key={idx} ref={el => { sectionRefs.current[idx] = el }}>
                {renderSection(idx)}
              </div>
            ))}

            {/* ── Tombol Navigasi di bawah section terakhir ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingBottom: 60 }}>
              <motion.button
                onClick={handleNext}
                disabled={done || savingProgress}
                whileHover={{ scale: (done || savingProgress) ? 1 : 1.04 }}
                whileTap={{ scale: (done || savingProgress) ? 1 : 0.95 }}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500,
                  color: '#fff',
                  backgroundColor: done ? '#22C55E' : '#007BFF',
                  padding: '12px 52px', borderRadius: 9999,
                  border: 'none', cursor: (done || savingProgress) ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(0,123,255,0.35)',
                  transition: 'background-color 300ms',
                  opacity: savingProgress ? 0.75 : 1,
                }}
              >
                {savingProgress
                  ? <><CircleNotch className="animate-spin" size={20} /> Menyimpan...</>
                  : done
                    ? <><CheckCircle size={20} /> Selesai!</>
                    : isLast
                      ? <><CheckCircle size={20} /> Tandai Selesai</>
                      : <>Selanjutnya <CaretRight size={18} /></>
                }
              </motion.button>
              {saveError && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#EF4444', margin: 0 }}>
                  {saveError} — coba klik &quot;Selesai&quot; lagi.
                </p>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* ── Exit Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showExitModal && (
          <ExitModal onConfirm={handleConfirmExit} onCancel={() => setShowExitModal(false)} />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .cp-tp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
