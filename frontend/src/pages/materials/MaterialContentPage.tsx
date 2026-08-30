import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CaretDoubleLeft, CaretLeft, CaretRight, CheckCircle,
  Flag, Info, Crosshair, GraduationCap, MagnifyingGlass,
  YoutubeLogo, SealCheck, X, CircleNotch,
  UploadSimple, FilePdf, Image, Trash,
  Eye, DownloadSimple
} from '@phosphor-icons/react'
import { ROUTES } from '@/lib/constants'
import { getMateriById } from '@/data/materiData'
import { supabase } from '@/lib/supabase'
import { downloadStudentFile } from '@/lib/fileDownload'
import FilePreviewModal from '@/components/ui/FilePreviewModal'
import { useMaterialContent } from '@/features/materials/useMaterialContent'
import { useAuth } from '@/features/auth/AuthContext'
import { useProgress } from '@/features/progress/useProgress'
import { useMaterialNav } from '@/features/materials/MaterialNavContext'
import { API_URL } from '@/lib/config'
import materiSatu from '@/assets/materiSatu.jpg'
import materiDua from '@/assets/materiDua.jpg'
import materiTiga from '@/assets/materiTiga.jpg'

const BIG_IDEA_IMAGES: Record<number, string> = {
  1: materiSatu,
  2: materiDua,
  3: materiTiga,
}

const TOTAL_SECTIONS = 10

const SECTION_LABELS = [
  'Capaian & Tujuan Pembelajaran',
  'Big Idea',
  'Essential Question',
  'The Challenge',
  'Guiding Resources',
  'Guiding Activities',
  'Guiding Questions',
  'Solutions & Publishing',
  'Kuis',
  'Refleksi',
] as const

// ─── Kuis SVG Diagrams ────────────────────────────────────────────────────────
function KuisDiagram({ materialId }: { materialId: number }) {
  if (materialId === 1) {
    return (
      <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'center' }}>
        <svg width="100%" height="200" viewBox="0 0 400 200" style={{ maxWidth: 450, backgroundColor: 'var(--color-input-bg, #F8FAFC)', borderRadius: 12, border: '1.5px solid var(--color-neutral-light)' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-text)" />
            </marker>
          </defs>
          <line x1="50" y1="100" x2="350" y2="100" stroke="var(--color-text)" strokeWidth="3" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <line x1="120" y1="30" x2="280" y2="170" stroke="var(--color-text)" strokeWidth="3" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <circle cx="200" cy="100" r="4" fill="#007BFF" />
          <text x="170" y="80" fontFamily="var(--font-heading)" fontSize="16" fontWeight="bold" fill="#EF4444" textAnchor="middle">a</text>
          <text x="230" y="80" fontFamily="var(--font-heading)" fontSize="16" fontWeight="bold" fill="#10B981" textAnchor="middle">b</text>
          <text x="170" y="130" fontFamily="var(--font-heading)" fontSize="16" fontWeight="bold" fill="#F59E0B" textAnchor="middle">d</text>
          <text x="230" y="130" fontFamily="var(--font-heading)" fontSize="16" fontWeight="bold" fill="#3B82F6" textAnchor="middle">c</text>
        </svg>
      </div>
    )
  }
  if (materialId === 2) {
    return (
      <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'center' }}>
        <svg width="100%" height="220" viewBox="0 0 400 220" style={{ maxWidth: 450, backgroundColor: 'var(--color-input-bg, #F8FAFC)', borderRadius: 12, border: '1.5px solid var(--color-neutral-light)' }}>
          <defs>
            <marker id="arrow2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-text)" />
            </marker>
          </defs>
          <line x1="50" y1="65" x2="350" y2="65" stroke="var(--color-text)" strokeWidth="3" markerStart="url(#arrow2)" markerEnd="url(#arrow2)" />
          <line x1="50" y1="145" x2="350" y2="145" stroke="var(--color-text)" strokeWidth="3" markerStart="url(#arrow2)" markerEnd="url(#arrow2)" />
          <line x1="120" y1="20" x2="280" y2="190" stroke="var(--color-text)" strokeWidth="3" markerStart="url(#arrow2)" markerEnd="url(#arrow2)" />
          <circle cx="168.5" cy="65" r="4" fill="#007BFF" />
          <circle cx="231.5" cy="145" r="4" fill="#007BFF" />
          <text x="140" y="50" fontFamily="var(--font-heading)" fontSize="14" fontWeight="bold" fill="#EF4444" textAnchor="middle">a</text>
          <text x="195" y="50" fontFamily="var(--font-heading)" fontSize="14" fontWeight="bold" fill="#10B981" textAnchor="middle">b</text>
          <text x="140" y="90" fontFamily="var(--font-heading)" fontSize="14" fontWeight="bold" fill="#F59E0B" textAnchor="middle">d</text>
          <text x="195" y="90" fontFamily="var(--font-heading)" fontSize="14" fontWeight="bold" fill="#3B82F6" textAnchor="middle">c</text>
          <text x="205" y="130" fontFamily="var(--font-heading)" fontSize="14" fontWeight="bold" fill="#7C299D" textAnchor="middle">e</text>
          <text x="260" y="130" fontFamily="var(--font-heading)" fontSize="14" fontWeight="bold" fill="#EC4899" textAnchor="middle">f</text>
          <text x="205" y="170" fontFamily="var(--font-heading)" fontSize="14" fontWeight="bold" fill="#14B8A6" textAnchor="middle">h</text>
          <text x="260" y="170" fontFamily="var(--font-heading)" fontSize="14" fontWeight="bold" fill="#6366F1" textAnchor="middle">g</text>
        </svg>
      </div>
    )
  }
  if (materialId === 3) {
    return (
      <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'center' }}>
        <svg width="100%" height="240" viewBox="0 0 420 240" style={{ maxWidth: 450, backgroundColor: 'var(--color-input-bg, #F8FAFC)', borderRadius: 12, border: '1.5px solid var(--color-neutral-light)' }}>
          <line x1="30" y1="180" x2="390" y2="180" stroke="var(--color-text)" strokeWidth="2" />
          <circle cx="50" cy="180" r="4" fill="var(--color-text)" />
          <line x1="50" y1="180" x2="40" y2="180" stroke="var(--color-text)" strokeWidth="2" />
          <line x1="110" y1="180" x2="110" y2="100" stroke="#F59E0B" strokeWidth="3" />
          <rect x="108" y="100" width="4" height="80" fill="#F59E0B" opacity={0.3} />
          <line x1="350" y1="180" x2="350" y2="20" stroke="var(--color-text)" strokeWidth="4" />
          <circle cx="350" cy="20" r="6" fill="#EAB308" />
          <path d="M340,20 Q350,10 360,20" fill="none" stroke="var(--color-text)" strokeWidth="2" />
          <line x1="50" y1="180" x2="350" y2="20" stroke="#EF4444" strokeWidth="2" strokeDasharray="4,4" />
          <path d="M110,170 L120,170 L120,180" fill="none" stroke="var(--color-text)" strokeWidth="1" />
          <path d="M350,170 L340,170 L340,180" fill="none" stroke="var(--color-text)" strokeWidth="1" />
          <text x="125" y="145" fontFamily="var(--font-body)" fontSize="12" fill="var(--color-text)" fontWeight="bold">4 m</text>
          <text x="365" y="100" fontFamily="var(--font-body)" fontSize="12" fill="var(--color-text)" fontWeight="bold">Tinggi = ?</text>
          <text x="80" y="195" fontFamily="var(--font-body)" fontSize="12" fill="var(--color-text)" textAnchor="middle" fontWeight="bold">3 m</text>
          <text x="230" y="195" fontFamily="var(--font-body)" fontSize="12" fill="var(--color-text)" textAnchor="middle" fontWeight="bold">12 m</text>
          <text x="70" y="130" fontFamily="var(--font-body)" fontSize="12" fill="#EF4444" fontWeight="bold" transform="rotate(-23 70 130)">5 m</text>
          <text x="200" y="80" fontFamily="var(--font-body)" fontSize="12" fill="#EF4444" fontWeight="bold" transform="rotate(-23 200 80)">20 m</text>
        </svg>
      </div>
    )
  }
  return null
}

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

function renderTextWithLinks(text: string) {
  const urlRegex = /((?:https?:\/\/)[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#007BFF', textDecoration: 'underline', wordBreak: 'break-all' }}
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      )
    }
    return part
  })
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
      style={{ backgroundColor: 'var(--color-card-bg)', borderRadius: 20, border: '1.5px solid var(--color-neutral-light)', padding: '28px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon}
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-text-light)', lineHeight: 1.75 }}>
        {children}
      </div>
    </motion.div>
  )
}

// ─── Answer Input Component ───────────────────────────────────────────────────
interface AnswerInputProps {
  id?: string
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

function AnswerInput({ id, disabled, value, onChange }: AnswerInputProps) {
  return (
    <div style={{ marginTop: 12 }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-light)', marginBottom: 6 }}>
        Jawaban Anda:
      </label>
      <textarea
        id={id}
        rows={4}
        disabled={disabled}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={disabled ? "Materi sudah selesai, jawaban tidak dapat diubah." : "Tuliskan jawaban Anda di sini..."}
        className="answer-textarea"
      />
    </div>
  )
}

// ─── File Upload Area Component ───────────────────────────────────────────────
function FileUploadArea({
  id,
  disabled,
  value,
  onChange,
  instructionText = "Upload your challenge work here.",
  userId,
  materialId,
  sectionIndex,
  acceptType = 'all',
}: {
  id: string
  disabled: boolean
  value: string
  onChange: (val: string) => void
  instructionText?: string
  userId: string
  materialId: number
  sectionIndex: number
  acceptType?: 'pdf' | 'all'
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [downloading, setDownloading] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  let fileObj: { fileName: string; fileSize: number; fileType: string; fileData?: string; fileUrl?: string; filePath?: string } | null = null
  try {
    if (value) {
      fileObj = JSON.parse(value)
    }
  } catch (e) {
    // Treat as raw string
  }

  const handleDownloadUploadedFile = async () => {
    if (!fileObj) return
    setDownloading(true)
    try {
      await downloadStudentFile(fileObj)
    } catch (err: any) {
      alert(err.message || 'Gagal mengunduh berkas.')
    } finally {
      setDownloading(false)
    }
  }

  const handleViewUploadedFile = () => {
    if (!fileObj) return
    setShowPreviewModal(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const processFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 5MB.')
      return
    }

    if (acceptType === 'pdf' && !file.type.includes('pdf')) {
      alert('Format file tidak sesuai. Harap unggah file dalam bentuk PDF.')
      return
    }

    if (!supabase) {
      alert('Supabase client tidak terkonfigurasi. Periksa file .env Anda.')
      return
    }

    setUploading(true)
    try {
      const cleanedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${userId}/${materialId}/${sectionIndex}/${Date.now()}_${cleanedName}`

      const { error } = await supabase.storage
        .from('materials')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('materials')
        .getPublicUrl(filePath)

      const fileJSON = JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: urlData.publicUrl,
        filePath: filePath
      })

      onChange(fileJSON)
    } catch (err: any) {
      console.error('[FileUploadArea] Error uploading file:', err)
      alert('Gagal mengunggah file: ' + (err.message || 'Terjadi kesalahan'))
    } finally {
      setUploading(false)
    }
  }

  const handleFileDelete = async () => {
    if (!fileObj) {
      onChange('')
      return
    }

    if (fileObj.filePath && supabase) {
      try {
        await supabase.storage
          .from('materials')
          .remove([fileObj.filePath])
      } catch (err) {
        console.warn('[FileUploadArea] Failed to delete file from storage bucket:', err)
      }
    }
    onChange('')
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div style={{ marginTop: 16 }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        {instructionText}
      </label>
      
      {fileObj ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderRadius: 12,
          backgroundColor: 'var(--color-input-bg, #F0F2F8)',
          border: '1.5px solid var(--color-neutral-light)',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            {fileObj.fileType.includes('pdf') ? (
              <div style={{ color: '#EF4444', display: 'flex' }}><FilePdf size={28} weight="fill" /></div>
            ) : (
              <div style={{ color: '#10B981', display: 'flex' }}><Image size={28} weight="fill" /></div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {fileObj.fileName}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-light)' }}>
                {formatSize(fileObj.fileSize)}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={handleViewUploadedFile}
              title="Buka atau lihat berkas di tab baru"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-text)',
                padding: '6px 12px',
                borderRadius: 8,
                backgroundColor: 'var(--color-card-bg)',
                border: '1.5px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-input-bg)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-card-bg)'}
            >
              <Eye size={16} /> Lihat
            </button>

            <button
              type="button"
              onClick={handleDownloadUploadedFile}
              disabled={downloading}
              title="Unduh berkas asli dari Supabase Storage"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 13,
                fontWeight: 600,
                color: '#007BFF',
                padding: '6px 12px',
                borderRadius: 8,
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                border: 'none',
                cursor: downloading ? 'not-allowed' : 'pointer',
                transition: 'background-color 200ms',
              }}
              onMouseEnter={e => { if (!downloading) e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.2)' }}
              onMouseLeave={e => { if (!downloading) e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.1)' }}
            >
              {downloading ? (
                <>
                  <CircleNotch size={16} className="animate-spin" /> Mengunduh...
                </>
              ) : (
                <>
                  <DownloadSimple size={16} weight="bold" /> Unduh
                </>
              )}
            </button>
            {!disabled && (
              <button
                onClick={handleFileDelete}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#EF4444',
                  padding: 8,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 200ms'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Hapus file"
              >
                <Trash size={18} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); if (!disabled && !uploading) setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            if (disabled || uploading) return
            const file = e.dataTransfer.files?.[0]
            if (file) processFile(file)
          }}
          onClick={() => { if (!disabled && !uploading) fileInputRef.current?.click() }}
          style={{
            border: dragging ? '2px dashed #007BFF' : '2px dashed var(--color-neutral-light)',
            borderRadius: 16,
            padding: '24px 16px',
            textAlign: 'center',
            cursor: (disabled || uploading) ? 'default' : 'pointer',
            backgroundColor: dragging ? 'var(--color-primary-light)' : 'transparent',
            transition: 'all 200ms ease',
            opacity: (disabled || uploading) ? 0.6 : 1,
          }}
          onMouseEnter={e => { if (!disabled && !dragging && !uploading) e.currentTarget.style.borderColor = '#007BFF' }}
          onMouseLeave={e => { if (!disabled && !dragging && !uploading) e.currentTarget.style.borderColor = 'var(--color-neutral-light)' }}
        >
          <input
            type="file"
            id={id}
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptType === 'pdf' ? 'application/pdf' : 'application/pdf, image/*'}
            style={{ display: 'none' }}
            disabled={disabled || uploading}
          />
          {uploading ? (
            <>
              <div style={{ color: '#007BFF', display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <CircleNotch className="animate-spin" size={32} />
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>
                Mengunggah file...
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-light)', margin: 0 }}>
                Mohon tunggu beberapa saat.
              </p>
            </>
          ) : (
            <>
              <div style={{ color: dragging ? '#007BFF' : 'var(--color-text-light)', display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <UploadSimple size={32} />
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>
                Klik atau seret file ke sini untuk mengunggah
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-light)', margin: 0 }}>
                {acceptType === 'pdf' ? 'PDF (Maks. 5MB)' : 'PDF atau Foto (Maks. 5MB)'}
              </p>
            </>
          )}
        </div>
      )}

      {/* In-App File Preview Modal */}
      <FilePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        fileObj={fileObj}
      />
    </div>
  )
}

// ─── Exit Modal ────────────────────────────────────────────────────────────────
function ExitModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        style={{
          backgroundColor: 'var(--color-card-bg)',
          borderRadius: 24,
          border: '1.5px solid var(--color-neutral-light)',
          padding: '32px 24px',
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 20,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        }}
      >
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: 'var(--color-neutral-light)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text)',
            opacity: 0.8,
            transition: 'opacity 200ms',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
        >
          <X size={18} />
        </button>

        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(239, 68, 68, 0.15)',
          }}
        >
          <X size={32} color="#EF4444" weight="bold" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            Keluar dari Halaman Materi?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--color-text-light)',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Tenang saja, seluruh progres belajar Anda saat ini akan disimpan secara otomatis.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              backgroundColor: '#EF4444',
              padding: '12px 24px',
              borderRadius: 9999,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
              transition: 'background-color 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DC2626'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EF4444'}
          >
            Keluar
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--button-outline-text, #000000)',
              backgroundColor: 'var(--button-outline-bg, #ffffff)',
              padding: '12px 24px',
              borderRadius: 9999,
              border: '2px solid var(--button-outline-border, #000000)',
              cursor: 'pointer',
              transition: 'all 200ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--button-outline-hover-bg, #000000)'
              e.currentTarget.style.color = 'var(--button-outline-hover-text, #ffffff)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--button-outline-bg, #ffffff)'
              e.currentTarget.style.color = 'var(--button-outline-text, #000000)'
            }}
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Submit Modal ─────────────────────────────────────────────────────────────
function SubmitModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        style={{
          backgroundColor: 'var(--color-card-bg)',
          borderRadius: 24,
          border: '1.5px solid var(--color-neutral-light)',
          padding: '32px 24px',
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 20,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        }}
      >
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#EF4444',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 8px rgba(239, 68, 68, 0.2)',
            transition: 'background-color 200ms',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DC2626'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EF4444'}
        >
          <X size={18} weight="bold" />
        </button>

        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#D1FAE5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.15)',
          }}
        >
          <CheckCircle size={36} color="#10B981" weight="bold" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            Selesaikan Materi Ini?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--color-text-light)',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Setelah selesai, semua jawaban yang Anda kirimkan akan dikunci secara permanen dan tidak dapat diubah lagi (hanya dapat dilihat saja).
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              backgroundColor: '#007BFF',
              padding: '12px 24px',
              borderRadius: 9999,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 123, 255, 0.25)',
              transition: 'background-color 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0266D2'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007BFF'}
          >
            Ya, Selesaikan
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--button-outline-text, #000000)',
              backgroundColor: 'var(--button-outline-bg, #ffffff)',
              padding: '12px 24px',
              borderRadius: 9999,
              border: '2px solid var(--button-outline-border, #000000)',
              cursor: 'pointer',
              transition: 'all 200ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--button-outline-hover-bg, #000000)'
              e.currentTarget.style.color = 'var(--button-outline-hover-text, #ffffff)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--button-outline-bg, #ffffff)'
              e.currentTarget.style.color = 'var(--button-outline-text, #000000)'
            }}
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Warning Modal ─────────────────────────────────────────────────────────────
interface UnfilledAnswer {
  sectionIndex: number
  sectionLabel: string
  questionIndex: number
  questionText: string
}

function WarningModal({
  unfilledList,
  onCancel,
  onGoToQuestion,
}: {
  unfilledList: UnfilledAnswer[]
  onCancel: () => void
  onGoToQuestion: (sectionIndex: number, questionIndex: number) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        style={{
          backgroundColor: 'var(--color-card-bg)',
          borderRadius: 24,
          border: '1.5px solid var(--color-neutral-light)',
          padding: '32px 24px',
          width: '100%',
          maxWidth: 560,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          maxHeight: '90vh',
        }}
      >
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: 'var(--color-neutral-light)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text)',
            opacity: 0.8,
            transition: 'opacity 200ms',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(251, 191, 36, 0.2)',
            }}
          >
            <Info size={36} color="#D97706" weight="bold" />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            Jawaban Belum Lengkap!
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--color-text-light)',
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 420,
            }}
          >
            Anda memiliki <strong>{unfilledList.length}</strong> pertanyaan yang belum dijawab. Harap lengkapi semua jawaban sebelum menyelesaikan materi.
          </p>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxHeight: '320px',
            paddingRight: 6,
            margin: '8px 0',
          }}
        >
          {unfilledList.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onGoToQuestion(item.sectionIndex, item.questionIndex)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                padding: 16,
                borderRadius: 16,
                backgroundColor: 'var(--color-input-bg, #F0F2F8)',
                border: '1px solid var(--color-neutral-light)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = '#007BFF'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = 'var(--color-neutral-light)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#007BFF',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {item.sectionLabel}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--color-text-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  Lengkapi <CaretRight size={12} />
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--color-text)',
                  margin: 0,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.questionText}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              backgroundColor: '#007BFF',
              padding: '12px 24px',
              borderRadius: 9999,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
              textAlign: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0266D2'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007BFF'}
          >
            Lengkapi Sekarang
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const slideVariants = {
  enter: (dir: 'forward' | 'backward') => ({
    x: dir === 'forward' ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: 'forward' | 'backward') => ({
    x: dir === 'forward' ? -100 : 100,
    opacity: 0,
  }),
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function MaterialContentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, session, loading: authLoading } = useAuth()
  const { markCompleted, saveCurrentSection, saving: savingProgress, saveError } = useMaterialContent(id)
  const { getProgressByMaterialId, loading: progressLoading } = useProgress()
  const { setNavData } = useMaterialNav()
  const windowWidth = useWindowWidth()

  const isMobile = windowWidth < 640
  const isTablet = windowWidth >= 640 && windowWidth < 1024

  const materialId = parseInt(id || '1')
  const materi = getMateriById(materialId)

  const [revealedUpTo, setRevealedUpTo] = useState(0)
  const [activeSectionIndex, setActiveSectionIndex] = useState(() => {
    const saved = sessionStorage.getItem(`material_${materialId}_activeSection`)
    return saved ? parseInt(saved, 10) : 0
  })
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  useEffect(() => {
    sessionStorage.setItem(`material_${materialId}_activeSection`, activeSectionIndex.toString())
  }, [materialId, activeSectionIndex])

  const changeSectionIndex = (newIdx: number) => {
    if (newIdx > activeSectionIndex) {
      setDirection('forward')
    } else if (newIdx < activeSectionIndex) {
      setDirection('backward')
    }
    setActiveSectionIndex(newIdx)
  }

  const [progressRestored, setProgressRestored] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [showExitModal, setShowExitModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [unfilledList, setUnfilledList] = useState<UnfilledAnswer[]>([])
  const [done, setDone] = useState(false)

  // Answers State: key is `${sectionIndex}_${questionIndex}`
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loadingAnswers, setLoadingAnswers] = useState(false)

  const sectionRefs = useRef<(HTMLDivElement | null)[]>(Array(TOTAL_SECTIONS).fill(null))

  // Auth guard
  useEffect(() => {
    if (!authLoading && user === null) navigate(ROUTES.LOGIN, { replace: true })
  }, [user, authLoading, navigate])

  // Tutup sidebar otomatis di mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  // Load answers from Supabase / backend when mounting or material changes
  useEffect(() => {
    const currentUserId = user?.id
    if (!currentUserId || !materialId) return

    async function fetchAnswers() {
      setLoadingAnswers(true)
      try {
        // 1. Ambil langsung dari Supabase Database (Utama)
        if (supabase) {
          const { data: sbData, error: sbError } = await supabase
            .from('user_answers')
            .select('section_index, question_index, answer_text')
            .eq('material_id', materialId)
            .eq('user_id', currentUserId)

          if (!sbError && sbData && sbData.length > 0) {
            const loadedAnswers: Record<string, string> = {}
            sbData.forEach((ans: { section_index: number; question_index: number; answer_text: string }) => {
              loadedAnswers[`${ans.section_index}_${ans.question_index}`] = ans.answer_text
            })
            setAnswers(loadedAnswers)
            setLoadingAnswers(false)
            return
          }
        }

        // 2. Fallback jika ada server backend Express
        if (session?.access_token) {
          const response = await fetch(`${API_URL}/answers?materialId=${materialId}`, {
            headers: {
              'Authorization': `Bearer ${session?.access_token}`
            }
          })
          if (response.ok) {
            const data = await response.json()
            const loadedAnswers: Record<string, string> = {}
            data.forEach((ans: { section_index: number; question_index: number; answer_text: string }) => {
              loadedAnswers[`${ans.section_index}_${ans.question_index}`] = ans.answer_text
            })
            setAnswers(loadedAnswers)
          }
        }
      } catch (err) {
        console.error('[MaterialContentPage] Error fetching answers:', err)
      } finally {
        setLoadingAnswers(false)
      }
    }

    fetchAnswers()
  }, [materialId, user, session])

  // Restore progress: langsung ke section terakhir yang sudah dibuka
  useEffect(() => {
    if (progressRestored || progressLoading) return
    const prog = getProgressByMaterialId(materialId)
    if (prog) {
      if (prog.is_completed) {
        setRevealedUpTo(TOTAL_SECTIONS - 1)
        setActiveSectionIndex(0) // Start from the beginning if they open it again, or they can click around
        setDone(true)
      } else if (prog.current_section > 0) {
        setRevealedUpTo(prog.current_section)
        setActiveSectionIndex(prog.current_section)
      }
    }
    setProgressRestored(true)
  }, [progressLoading, progressRestored, getProgressByMaterialId, materialId])

  const saveAnswersForSection = async (sectionIndex: number) => {
    const currentUserId = user?.id
    if (!currentUserId) return

    // Find all answers associated with this sectionIndex
    const sectionAnswers = Object.entries(answers)
      .filter(([key]) => key.startsWith(`${sectionIndex}_`))
      .map(([key, value]) => {
        const questionIndex = parseInt(key.split('_')[1])
        return {
          materialId,
          sectionIndex,
          questionIndex,
          answerText: value
        }
      })

    if (sectionAnswers.length === 0) return

    // 1. Simpan langsung ke Supabase user_answers (Utama)
    if (supabase) {
      const payload = sectionAnswers.map(ans => ({
        user_id: currentUserId,
        material_id: ans.materialId,
        section_index: ans.sectionIndex,
        question_index: ans.questionIndex,
        answer_text: ans.answerText || '',
        updated_at: new Date().toISOString()
      }))

      try {
        const { error: sbError } = await supabase
          .from('user_answers')
          .upsert(payload, { onConflict: 'user_id,material_id,section_index,question_index' })

        if (sbError) {
          console.warn('[MaterialContentPage] Supabase upsert error:', sbError.message)
        }
      } catch (sbErr) {
        console.warn('[MaterialContentPage] Supabase upsert exception:', sbErr)
      }
    }

    // 2. Fallback backend Express
    try {
      if (session?.access_token) {
        await fetch(`${API_URL}/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ answers: sectionAnswers })
        })
      }
    } catch (err) {
      // ignore
    }
  }

  // Sync navData ke context (untuk mobile sidebar di navbar)
  useEffect(() => {
    const progressPct = Math.round(((revealedUpTo + 1) / TOTAL_SECTIONS) * 100)
    setNavData({
      sectionLabels: [...SECTION_LABELS],
      revealedUpTo,
      progressPercent: progressPct,
      onSectionClick: async (idx: number) => {
        await saveAnswersForSection(activeSectionIndex)
        changeSectionIndex(idx)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      onExit: () => setShowExitModal(true),
    })
    return () => setNavData(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealedUpTo, activeSectionIndex, answers])

  if (!materi || user === undefined) return null
  if (user === null) return null

  const m = materi
  const isLast = activeSectionIndex === TOTAL_SECTIONS - 1
  const progressPercent = Math.round(((revealedUpTo + 1) / TOTAL_SECTIONS) * 100)

  const prog = getProgressByMaterialId(materialId)
  const isMaterialCompleted = prog?.is_completed === true || done

  const getUnfilledAnswers = () => {
    const unfilled: UnfilledAnswer[] = []
    if (!materi) return unfilled

    // Section 2: Essential Question
    materi.essentialQuestions.forEach((q, i) => {
      const val = answers[`2_${i}`]
      if (!val || !val.trim()) {
        unfilled.push({
          sectionIndex: 2,
          sectionLabel: SECTION_LABELS[2],
          questionIndex: i,
          questionText: (materialId === 2 && i === 0)
            ? 'Unggah gambar/PDF ilustrasi kerangka atap'
            : q
        })
      }
    })

    // Section 5: Guiding Activities
    const val5 = answers[`5_0`]
    if (!val5 || !val5.trim()) {
      unfilled.push({
        sectionIndex: 5,
        sectionLabel: SECTION_LABELS[5],
        questionIndex: 0,
        questionText: 'Unggah laporan aktivitas (PDF)'
      })
    }

    // Section 6: Guiding Questions
    materi.guidingQuestions.forEach((q, i) => {
      const val = answers[`6_${i}`]
      if (!val || !val.trim()) {
        unfilled.push({
          sectionIndex: 6,
          sectionLabel: SECTION_LABELS[6],
          questionIndex: i,
          questionText: (materialId === 1 && i === 3)
            ? 'Unggah gambar/PDF rancangan atap'
            : q
        })
      }
    })

    // Section 7: Solutions
    const val7 = answers[`7_0`]
    if (!val7 || !val7.trim()) {
      unfilled.push({
        sectionIndex: 7,
        sectionLabel: SECTION_LABELS[7],
        questionIndex: 0,
        questionText: 'Unggah hasil challenge (PDF)'
      })
    }

    // Section 8: Kuis questions
    const kuisData = materi.kuis
    kuisData.pertanyaan.forEach((q, i) => {
      const val = answers[`8_${i}`]
      if (!val || !val.trim()) {
        unfilled.push({
          sectionIndex: 8,
          sectionLabel: SECTION_LABELS[8],
          questionIndex: i,
          questionText: q
        })
      }
    })

    // Section 8: Kuis File Upload
    const val8File = answers[`8_${kuisData.pertanyaan.length}`]
    if (!val8File || !val8File.trim()) {
      unfilled.push({
        sectionIndex: 8,
        sectionLabel: SECTION_LABELS[8],
        questionIndex: kuisData.pertanyaan.length,
        questionText: 'Unggah lembar jawaban kuis (PDF atau Foto)'
      })
    }

    // Section 9: Refleksi
    const val9 = answers[`9_0`]
    if (!val9 || !val9.trim()) {
      unfilled.push({
        sectionIndex: 9,
        sectionLabel: SECTION_LABELS[9],
        questionIndex: 0,
        questionText: materi.refleksi
      })
    }

    return unfilled
  }

  const handleGoToQuestion = (sectionIndex: number, questionIndex: number) => {
    setShowWarningModal(false)
    changeSectionIndex(sectionIndex)
    
    // Smooth scroll and focus on the empty input field
    setTimeout(() => {
      const element = document.getElementById(`answer-${sectionIndex}-${questionIndex}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }, 350)
  }

  const handleNext = async () => {
    // Save answers of currently active page/section first
    await saveAnswersForSection(activeSectionIndex)

    if (activeSectionIndex < revealedUpTo) {
      // Just slide/change page to the next section
      changeSectionIndex(activeSectionIndex + 1)
    } else {
      // Viewing the furthest section
      if (activeSectionIndex < TOTAL_SECTIONS - 1) {
        const nextIdx = activeSectionIndex + 1
        setRevealedUpTo(nextIdx)
        changeSectionIndex(nextIdx)
        saveCurrentSection(nextIdx)
      } else {
        // Last section -> show SubmitModal or WarningModal depending on validation
        if (isMaterialCompleted) {
          setShowSubmitModal(true)
        } else {
          const unfilled = getUnfilledAnswers()
          if (unfilled.length > 0) {
            setUnfilledList(unfilled)
            setShowWarningModal(true)
          } else {
            setShowSubmitModal(true)
          }
        }
      }
    }
  }

  const handleConfirmExit = () => navigate(ROUTES.MATERIALS)

  const handleConfirmSubmit = async () => {
    setShowSubmitModal(false)
    const ok = await markCompleted()
    if (ok) {
      setDone(true)
      setTimeout(() => navigate(`${ROUTES.APRESIASI}?from=${materialId}`), 900)
    }
  }

  // ─── Render single section by index ─────────────────────────────────────────
  function renderSection(idx: number) {
    const ref = { current: sectionRefs.current[idx] } as React.RefObject<HTMLDivElement | null>
    const setRef = (el: HTMLDivElement | null) => { sectionRefs.current[idx] = el }

    switch (idx) {
      case 0:
        return (
          <motion.div
            key="cp-tp" ref={setRef as unknown as React.RefObject<HTMLDivElement>}
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
            style={{ backgroundColor: 'var(--color-card-bg)', borderRadius: 20, border: '1.5px solid var(--color-neutral-light)', overflow: 'hidden' }}>
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
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 12px' }}>Big Idea</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-text-light)', lineHeight: 1.75, margin: 0 }}>{m.bigIdea}</p>
            </div>
          </motion.div>
        )
      }
      case 2:
        return (
          <SectionCard key="eq" sectionRef={ref} icon={<IconBadge bg="#D9ECFF" color="#007BFF"><Info size={22} /></IconBadge>} title="Essential Question">
            {m.essentialQuestions.map((q, i) => (
              <div key={i} style={{ marginBottom: i < m.essentialQuestions.length - 1 ? 24 : 0 }}>
                <p style={{ margin: '0 0 8px', fontWeight: 500 }}>
                  {renderTextWithLinks(q)}
                </p>
                {materialId === 2 && i === 0 ? (
                  <FileUploadArea
                    id={`answer-2-${i}`}
                    disabled={isMaterialCompleted}
                    value={answers[`2_${i}`] || ''}
                    onChange={(val) => setAnswers(prev => ({ ...prev, [`2_${i}`]: val }))}
                    userId={user?.id || ''}
                    materialId={materialId}
                    sectionIndex={2}
                    acceptType="all"
                    instructionText="Unggah ilustrasi rancangan kerangka atap Anda di sini (PDF atau Foto):"
                  />
                ) : (
                  <AnswerInput
                    id={`answer-2-${i}`}
                    disabled={isMaterialCompleted}
                    value={answers[`2_${i}`] || ''}
                    onChange={(val) => setAnswers(prev => ({ ...prev, [`2_${i}`]: val }))}
                  />
                )}
              </div>
            ))}
          </SectionCard>
        )
      case 3:
        return (
          <SectionCard key="challenge" sectionRef={ref} icon={<IconBadge bg="#E49FFF" color="#7C299D"><Crosshair size={22} /></IconBadge>} title="The Challenge">
            <p style={{ margin: '0 0 12px', whiteSpace: 'pre-line' }}>{renderTextWithLinks(m.theChallenge.deskripsi)}</p>
            {m.theChallenge.poin.length > 0 && (
              <ul style={{ margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {m.theChallenge.poin.map((p, i) => <li key={i} style={{ whiteSpace: 'pre-line' }}>{renderTextWithLinks(p)}</li>)}
              </ul>
            )}
            <div style={{
              marginTop: 16,
              padding: '12px 16px',
              backgroundColor: 'var(--color-primary-light)',
              borderRadius: 12,
              color: '#007BFF',
              fontWeight: 600,
              fontSize: 14
            }}>
              * Kerjakan challenge berikut dengan kelompok
            </div>
          </SectionCard>
        )
      case 4:
        return (
          <SectionCard key="resources" sectionRef={ref} icon={<IconBadge bg="#FEDCDC" color="#B51F29"><YoutubeLogo size={22} /></IconBadge>} title="Guiding Resources">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {m.guidingResources.map((r, i) => {
                if (r.type === 'youtube') {
                  const embedId = getYoutubeEmbedId(r.url)
                  return (
                    <div key={i}>
                      {r.label && <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 8px' }}>{r.label}</p>}
                      <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: 10, overflow: 'hidden', backgroundColor: '#000' }}>
                        <iframe src={`https://www.youtube.com/embed/${embedId}`} title={r.label || 'Video Materi'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} />
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div key={i}>
                      {r.label && <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 8px' }}>{r.label}</p>}
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '12px 24px',
                          borderRadius: 12,
                          backgroundColor: '#007BFF',
                          color: '#ffffff',
                          fontFamily: 'var(--font-body)',
                          fontSize: 15,
                          fontWeight: 600,
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(0,123,255,0.2)',
                          transition: 'all 200ms ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0266D2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007BFF'}
                      >
                        Buka Tautan Canva
                      </a>
                    </div>
                  )
                }
              })}
            </div>
          </SectionCard>
        )
      case 5:
        return (
          <SectionCard key="activities" sectionRef={ref} icon={<IconBadge bg="#F7FFA1" color="#DEA30D"><GraduationCap size={22} /></IconBadge>} title="Guiding Activities">
            <ol style={{ margin: '0 0 24px', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {m.guidingActivities.map((a, i) => (
                <li key={i} style={{ listStyleType: 'decimal', marginLeft: 20 }}>{renderTextWithLinks(a)}</li>
              ))}
            </ol>
            <FileUploadArea
              id="answer-5-0"
              disabled={isMaterialCompleted}
              value={answers['5_0'] || ''}
              onChange={(val) => setAnswers(prev => ({ ...prev, '5_0': val }))}
              userId={user?.id || ''}
              materialId={materialId}
              sectionIndex={5}
              acceptType="pdf"
              instructionText={
                materialId === 1
                  ? "Selesaikan langkah 1–6 di atas, lalu unggah laporan/bukti pengerjaan Anda di sini dalam bentuk PDF:"
                  : "Unggah hasil pengerjaan aktivitas Anda di sini dalam bentuk PDF:"
              }
            />
          </SectionCard>
        )
      case 6:
        return (
          <SectionCard key="questions" sectionRef={ref} icon={<IconBadge bg="#F7FFA1" color="#DEA30D"><MagnifyingGlass size={22} /></IconBadge>} title="Guiding Questions">
            <ol style={{ margin: 0, paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {m.guidingQuestions.map((q, i) => (
                <div key={i}>
                  <li style={{ listStyleType: 'decimal', marginLeft: 20 }}>{renderTextWithLinks(q)}</li>
                  {materialId === 1 && i === 3 ? (
                    <FileUploadArea
                      id={`answer-6-${i}`}
                      disabled={isMaterialCompleted}
                      value={answers[`6_${i}`] || ''}
                      onChange={(val) => setAnswers(prev => ({ ...prev, [`6_${i}`]: val }))}
                      userId={user?.id || ''}
                      materialId={materialId}
                      sectionIndex={6}
                      acceptType="all"
                      instructionText="Unggah gambar atau PDF rancangan atap Anda di sini:"
                    />
                  ) : (
                    <AnswerInput
                      id={`answer-6-${i}`}
                      disabled={isMaterialCompleted}
                      value={answers[`6_${i}`] || ''}
                      onChange={(val) => setAnswers(prev => ({ ...prev, [`6_${i}`]: val }))}
                    />
                  )}
                </div>
              ))}
            </ol>
          </SectionCard>
        )
      case 7:
        return (
          <SectionCard key="solutions" sectionRef={ref} icon={<IconBadge bg="#EBF7ED" color="#279827"><SealCheck size={22} /></IconBadge>} title="Solutions & Publishing">
            <ul style={{ margin: '0 0 24px', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {m.solutions.map((s, i) => (
                <li key={i} style={{ listStyleType: 'disc', marginLeft: 20 }}>{renderTextWithLinks(s)}</li>
              ))}
            </ul>
            <FileUploadArea
              id="answer-7-0"
              disabled={isMaterialCompleted}
              value={answers['7_0'] || ''}
              onChange={(val) => setAnswers(prev => ({ ...prev, '7_0': val }))}
              userId={user?.id || ''}
              materialId={materialId}
              sectionIndex={7}
              acceptType="pdf"
              instructionText="Unggah hasil pengerjaan challenge Anda di sini dalam bentuk PDF:"
            />
          </SectionCard>
        )
      case 8: {
        const kuisData = m.kuis
        return (
          <SectionCard key="kuis" sectionRef={ref} icon={<IconBadge bg="#FFEADB" color="#FF6A00"><SealCheck size={22} /></IconBadge>} title="Kuis">
            <p style={{ margin: '0 0 12px', whiteSpace: 'pre-line' }}>{renderTextWithLinks(kuisData.deskripsi)}</p>
            <KuisDiagram materialId={materialId} />
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {kuisData.pertanyaan.map((q, i) => (
                <div key={i}>
                  <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{i + 1}. {renderTextWithLinks(q)}</p>
                  <AnswerInput
                    id={`answer-8-${i}`}
                    disabled={isMaterialCompleted}
                    value={answers[`8_${i}`] || ''}
                    onChange={(val) => setAnswers(prev => ({ ...prev, [`8_${i}`]: val }))}
                  />
                </div>
              ))}
            </div>
            <FileUploadArea
              id={`answer-8-${kuisData.pertanyaan.length}`}
              disabled={isMaterialCompleted}
              value={answers[`8_${kuisData.pertanyaan.length}`] || ''}
              onChange={(val) => setAnswers(prev => ({ ...prev, [`8_${kuisData.pertanyaan.length}`]: val }))}
              userId={user?.id || ''}
              materialId={materialId}
              sectionIndex={8}
              acceptType="all"
              instructionText="Kerjakan dalam kertas lalu kumpulkan dalam bentuk foto/pdf di sini:"
            />
          </SectionCard>
        )
      }
      case 9:
        return (
          <SectionCard key="refleksi" sectionRef={ref} icon={<IconBadge bg="#E4FBE9" color="#0EA933"><Info size={22} /></IconBadge>} title="Refleksi">
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>
              {renderTextWithLinks(m.refleksi)}
            </p>
            <AnswerInput
              id="answer-9-0"
              disabled={isMaterialCompleted}
              value={answers['9_0'] || ''}
              onChange={(val) => setAnswers(prev => ({ ...prev, '9_0': val }))}
            />
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
      <div className="isi-materi-root" style={{ display: 'flex', minHeight: 'calc(100svh - 80px)' }}>

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
                  backgroundColor: 'var(--color-card-bg)', borderRight: '1px solid var(--color-neutral-light)',
                  overflow: 'hidden', flexShrink: 0,
                  position: 'sticky', top: 80, height: 'calc(100svh - 80px)',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', flex: 1 }}>
                  {/* Collapse button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                    <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)', padding: 4, display: 'flex' }} title="Tutup sidebar">
                      <CaretDoubleLeft size={18} />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 12, padding: '0 4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-light)' }}>Progres</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: '#007BFF' }}>{progressPercent}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, backgroundColor: 'var(--color-neutral-light)', overflow: 'hidden' }}>
                      <motion.div animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', backgroundColor: '#007BFF', borderRadius: 999 }} />
                    </div>
                  </div>

                  {/* Section list */}
                  {SECTION_LABELS.map((label, idx) => {
                    const isRevealed = idx <= revealedUpTo
                    const isCurrent = idx === activeSectionIndex
                    return (
                      <button
                        key={idx}
                        onClick={async () => {
                          if (isRevealed) {
                            await saveAnswersForSection(activeSectionIndex)
                            changeSectionIndex(idx)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }
                        }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '9px 10px', borderRadius: 10, border: 'none',
                          cursor: isRevealed ? 'pointer' : 'default',
                          backgroundColor: isCurrent ? 'var(--color-primary-light)' : 'transparent',
                          fontFamily: 'var(--font-body)', fontSize: isTablet ? 13 : 14, fontWeight: isCurrent ? 700 : 400,
                          color: isCurrent ? '#007BFF' : isRevealed ? 'var(--color-text)' : '#C4C9D4',
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={e => { if (isRevealed && !isCurrent) e.currentTarget.style.backgroundColor = 'var(--color-neutral-light)' }}
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
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary-light)' }}
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
          <button onClick={() => setSidebarOpen(true)} style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 30, background: 'var(--color-card-bg)', border: '1.5px solid var(--color-neutral-light)', borderRadius: 12, padding: '8px 6px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} title="Buka sidebar">
            <CaretRight size={16} color="var(--color-text-light)" />
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
                    Bagian {activeSectionIndex + 1} dari {TOTAL_SECTIONS}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#007BFF' }}>{progressPercent}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', backgroundColor: '#007BFF', borderRadius: 999 }} />
                </div>
                {/* Section label saat ini */}
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', margin: '4px 0 0' }}>
                  {SECTION_LABELS[activeSectionIndex]}
                </p>
              </div>
            )}

            {/* Render single current active section with slide transition */}
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeSectionIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {renderSection(activeSectionIndex)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Tombol Navigasi / Pagination di bawah ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '24px 0 60px' }}>
              
              {/* Left Chevron (<) - Only render if page exists (activeSectionIndex > 0) */}
              {activeSectionIndex > 0 && (
                <button
                  onClick={async () => {
                    await saveAnswersForSection(activeSectionIndex)
                    changeSectionIndex(activeSectionIndex - 1)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                    borderRadius: '50%',
                    transition: 'background-color 200ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-neutral-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  title="Sebelumnya"
                >
                  <CaretLeft size={24} weight="bold" />
                </button>
              )}

              {/* Central Blue Pill button (Selanjutnya / Selesai) */}
              <motion.button
                onClick={handleNext}
                disabled={savingProgress || loadingAnswers}
                whileHover={{ scale: (savingProgress || loadingAnswers) ? 1 : 1.04 }}
                whileTap={{ scale: (savingProgress || loadingAnswers) ? 1 : 0.95 }}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500,
                  color: '#fff',
                  backgroundColor: (isLast && isMaterialCompleted) ? '#22C55E' : '#007BFF',
                  padding: '12px 52px', borderRadius: 9999,
                  border: 'none', cursor: (savingProgress || loadingAnswers) ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(0,123,255,0.35)',
                  transition: 'background-color 300ms',
                  opacity: (savingProgress || loadingAnswers) ? 0.75 : 1,
                }}
              >
                {savingProgress
                  ? <><CircleNotch className="animate-spin" size={20} /> Menyimpan...</>
                  : isMaterialCompleted && isLast
                    ? <><CheckCircle size={20} /> Selesai!</>
                    : isLast
                      ? <><CheckCircle size={20} /> Tandai Selesai</>
                      : <>Selanjutnya</>
                }
              </motion.button>

              {/* Right Chevron (>) - Only render if page exists (activeSectionIndex < revealedUpTo) */}
              {activeSectionIndex < revealedUpTo && (
                <button
                  onClick={async () => {
                    await saveAnswersForSection(activeSectionIndex)
                    changeSectionIndex(activeSectionIndex + 1)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                    borderRadius: '50%',
                    transition: 'background-color 200ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-neutral-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  title="Berikutnya"
                >
                  <CaretRight size={24} weight="bold" />
                </button>
              )}
            </div>

            {saveError && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#EF4444', textAlign: 'center', margin: '-40px 0 20px' }}>
                {saveError} — coba klik &quot;Selesai&quot; lagi.
              </p>
            )}

          </div>
        </main>
      </div>

      {/* ── Exit Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showExitModal && (
          <ExitModal onConfirm={handleConfirmExit} onCancel={() => setShowExitModal(false)} />
        )}
      </AnimatePresence>

      {/* ── Submit Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSubmitModal && (
          <SubmitModal onConfirm={handleConfirmSubmit} onCancel={() => setShowSubmitModal(false)} />
        )}
      </AnimatePresence>

      {/* ── Warning Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showWarningModal && (
          <WarningModal
            unfilledList={unfilledList}
            onCancel={() => setShowWarningModal(false)}
            onGoToQuestion={handleGoToQuestion}
          />
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
