import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  DownloadSimple,
  FilePdf,
  Image as ImageIcon,
  FileText,
  CircleNotch,
  Warning,
} from '@phosphor-icons/react'
import { DownloadFileInfo, downloadStudentFile, getFilePreviewUrl } from '@/lib/fileDownload'

interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileObj: DownloadFileInfo | null
  onDownload?: () => void
}

export default function FilePreviewModal({
  isOpen,
  onClose,
  fileObj,
  onDownload,
}: FilePreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  // Resolve preview URL whenever fileObj or isOpen changes
  useEffect(() => {
    if (!isOpen || !fileObj) {
      setPreviewUrl(null)
      setLoading(true)
      setError(null)
      return
    }

    let isMounted = true
    setLoading(true)
    setError(null)

    async function loadUrl() {
      try {
        if (!fileObj) return
        const url = await getFilePreviewUrl(fileObj)
        if (isMounted) {
          setPreviewUrl(url)
          setLoading(false)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Gagal memuat pratinjau berkas.')
          setLoading(false)
        }
      }
    }

    loadUrl()

    return () => {
      isMounted = false
    }
  }, [isOpen, fileObj])

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!fileObj) return null

  const fileName = fileObj.fileName || 'Berkas Siswa'
  const isImage =
    fileObj.fileType?.includes('image') ||
    Boolean(fileName.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i))
  const isPdf =
    fileObj.fileType?.includes('pdf') ||
    Boolean(fileName.match(/\.pdf$/i))

  const formatSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return ''
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleDownload = async () => {
    if (onDownload) {
      onDownload()
      return
    }
    setDownloading(true)
    try {
      await downloadStudentFile(fileObj)
    } catch (err: any) {
      alert(err.message || 'Gagal mengunduh berkas.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: isPdf ? '1000px' : '860px',
              maxHeight: '92vh',
              backgroundColor: 'var(--color-card-bg, #ffffff)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1.5px solid var(--color-border, #E5E7EB)',
              zIndex: 10000,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1.5px solid var(--color-border, #E5E7EB)',
                backgroundColor: 'var(--color-card-bg, #ffffff)',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isImage
                      ? 'rgba(16, 185, 129, 0.1)'
                      : isPdf
                      ? 'rgba(239, 68, 68, 0.1)'
                      : 'rgba(0, 123, 255, 0.1)',
                    color: isImage ? '#10B981' : isPdf ? '#EF4444' : '#007BFF',
                    flexShrink: 0,
                  }}
                >
                  {isImage ? (
                    <ImageIcon size={24} weight="fill" />
                  ) : isPdf ? (
                    <FilePdf size={24} weight="fill" />
                  ) : (
                    <FileText size={24} weight="fill" />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span
                    title={fileName}
                    style={{
                      fontFamily: 'var(--font-heading, sans-serif)',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--color-text, #1F2937)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {fileName}
                  </span>
                  {fileObj.fileSize ? (
                    <span
                      style={{
                        fontFamily: 'var(--font-body, sans-serif)',
                        fontSize: '12px',
                        color: 'var(--color-text-light, #6B7280)',
                      }}
                    >
                      {formatSize(fileObj.fileSize)}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  title="Unduh berkas asli"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 10,
                    backgroundColor: '#007BFF',
                    color: '#ffffff',
                    border: 'none',
                    fontFamily: 'var(--font-body, sans-serif)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: downloading ? 'not-allowed' : 'pointer',
                    opacity: downloading ? 0.8 : 1,
                    transition: 'all 150ms',
                    boxShadow: '0 2px 8px rgba(0, 123, 255, 0.25)',
                  }}
                  onMouseEnter={(e) => {
                    if (!downloading) e.currentTarget.style.backgroundColor = '#0266D2'
                  }}
                  onMouseLeave={(e) => {
                    if (!downloading) e.currentTarget.style.backgroundColor = '#007BFF'
                  }}
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

                <button
                  type="button"
                  onClick={onClose}
                  title="Tutup pop-up (Esc)"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--color-input-bg, #F3F4F6)',
                    border: 'none',
                    color: 'var(--color-text, #4B5563)',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB'
                    e.currentTarget.style.color = '#111827'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-input-bg, #F3F4F6)'
                    e.currentTarget.style.color = 'var(--color-text, #4B5563)'
                  }}
                >
                  <X size={20} weight="bold" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: isImage ? '24px' : '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isImage ? 'var(--color-background, #F9FAFB)' : '#2D3748',
                minHeight: isPdf ? '75vh' : '360px',
                maxHeight: 'calc(92vh - 76px)',
              }}
            >
              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    padding: '48px',
                    color: 'var(--color-text, #4B5563)',
                  }}
                >
                  <CircleNotch size={36} className="animate-spin" color="#007BFF" />
                  <span style={{ fontFamily: 'var(--font-body, sans-serif)', fontSize: 14, fontWeight: 500 }}>
                    Memuat pratinjau berkas...
                  </span>
                </div>
              ) : error ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    padding: '48px 24px',
                    textAlign: 'center',
                  }}
                >
                  <Warning size={48} color="#EF4444" weight="fill" />
                  <h4
                    style={{
                      fontFamily: 'var(--font-heading, sans-serif)',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--color-text, #1F2937)',
                      margin: 0,
                    }}
                  >
                    Tidak Dapat Menampilkan Pratinjau
                  </h4>
                  <p
                    style={{
                      fontFamily: 'var(--font-body, sans-serif)',
                      fontSize: 14,
                      color: 'var(--color-text-light, #6B7280)',
                      maxWidth: 420,
                      margin: 0,
                    }}
                  >
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={handleDownload}
                    style={{
                      marginTop: 8,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 20px',
                      borderRadius: 10,
                      backgroundColor: '#007BFF',
                      color: '#ffffff',
                      border: 'none',
                      fontFamily: 'var(--font-body, sans-serif)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <DownloadSimple size={18} weight="bold" /> Unduh Berkas Langsung
                  </button>
                </div>
              ) : isImage && previewUrl ? (
                /* IMAGE PREVIEW IN POPUP */
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <img
                    src={previewUrl}
                    alt={fileName}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 'calc(80vh - 80px)',
                      objectFit: 'contain',
                      borderRadius: 14,
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                      border: '1px solid var(--color-border, #E5E7EB)',
                    }}
                  />
                </div>
              ) : isPdf && previewUrl ? (
                /* PDF PREVIEW EMBED IN POPUP */
                <iframe
                  src={`${previewUrl}#toolbar=1&navpanes=0`}
                  title={fileName}
                  style={{
                    width: '100%',
                    height: '78vh',
                    border: 'none',
                    display: 'block',
                  }}
                />
              ) : (
                /* OTHER FILE TYPES */
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    padding: '48px',
                    textAlign: 'center',
                  }}
                >
                  <FileText size={64} color="#007BFF" weight="duotone" />
                  <div>
                    <h4
                      style={{
                        fontFamily: 'var(--font-heading, sans-serif)',
                        fontSize: 18,
                        fontWeight: 700,
                        color: 'var(--color-text, #1F2937)',
                        margin: 0,
                      }}
                    >
                      {fileName}
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--font-body, sans-serif)',
                        fontSize: 14,
                        color: 'var(--color-text-light, #6B7280)',
                        margin: '4px 0 0',
                      }}
                    >
                      Format berkas ini dapat dilihat dengan mengunduhnya.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownload}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 20px',
                      borderRadius: 10,
                      backgroundColor: '#007BFF',
                      color: '#ffffff',
                      border: 'none',
                      fontFamily: 'var(--font-body, sans-serif)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <DownloadSimple size={18} weight="bold" /> Unduh Berkas
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
