import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Notebook,
  MagnifyingGlass,
  Student,
  Warning,
  CircleNotch,
  FilePdf,
  Image,
} from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/AuthContext'
import { supabase } from '@/lib/supabase'
import { API_URL } from '@/lib/config'
import { ROUTES } from '@/lib/constants'
import { MATERI_DATA } from '@/data/materiData'
import Button from '@/components/ui/Button'

interface StudentProfile {
  id: string
  full_name: string
  email: string
  role: string
}

interface AnswerRow {
  section_index: number
  question_index: number
  answer_text: string
}

export default function TeacherDashboardPage() {
  const { user, session } = useAuth()
  const navigate = useNavigate()
  const userRole = user?.user_metadata?.role || 'student'
  const isTeacher = userRole === 'teacher'

  // States
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [selectedMaterialId, setSelectedMaterialId] = useState<number>(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loadingAnswers, setLoadingAnswers] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Route guard: only allow teachers
  useEffect(() => {
    if (user === null) {
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [user, navigate])

  // Fetch all students (profiles where role = 'student')
  useEffect(() => {
    if (!isTeacher || !session) return

    async function fetchStudents() {
      setLoadingStudents(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .eq('role', 'student')
          .order('full_name', { ascending: true })

        if (error) throw error
        setStudents(data || [])
        if (data && data.length > 0) {
          setSelectedStudentId(data[0].id)
        }
      } catch (err) {
        console.error('Error fetching students:', err)
      } finally {
        setLoadingStudents(false)
      }
    }

    fetchStudents()
  }, [isTeacher, session])

  // Fetch answers for selected student + material
  useEffect(() => {
    if (!selectedStudentId || !selectedMaterialId || !session) return

    async function fetchStudentAnswers() {
      setLoadingAnswers(true)
      try {
        const response = await fetch(
          `${API_URL}/answers?materialId=${selectedMaterialId}&userId=${selectedStudentId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token || ''}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch answers')
        }

        const data: AnswerRow[] = await response.json()
        
        // Convert to key-value record
        const answersMap: Record<string, string> = {}
        data.forEach((ans) => {
          answersMap[`${ans.section_index}_${ans.question_index}`] = ans.answer_text
        })
        setAnswers(answersMap)
      } catch (err) {
        console.error('Error fetching student answers:', err)
        setAnswers({})
      } finally {
        setLoadingAnswers(false)
      }
    }

    fetchStudentAnswers()
  }, [selectedStudentId, selectedMaterialId, session])

  // Filter students based on search input
  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedStudent = students.find((s) => s.id === selectedStudentId)
  const currentMaterial = MATERI_DATA.find((m) => m.id === selectedMaterialId)

  // Access Denied View
  if (!isTeacher) {
    return (
      <div style={{ minHeight: 'calc(100svh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'var(--color-background)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ maxWidth: 460, textAlign: 'center', backgroundColor: 'var(--color-card-bg)', border: '1.5px solid var(--color-neutral-light)', padding: '40px 32px', borderRadius: 24 }}
        >
          <Warning size={64} color="#EF4444" weight="fill" style={{ margin: '0 auto 20px' }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 12px' }}>Akses Ditolak</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--color-text-light)', lineHeight: 1.6, margin: '0 0 24px' }}>
            Maaf, halaman ini dikhususkan untuk akun guru. Silakan login menggunakan akun guru untuk mengakses dasbor.
          </p>
          <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>Kembali ke Beranda</Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: 'calc(100svh - 80px)', display: 'flex', backgroundColor: 'var(--color-background)' }}>
      <div className="section-container" style={{ display: 'flex', width: '100%', gap: 24, paddingTop: 24, paddingBottom: 48, flexDirection: 'row' }}>
        
        {/* ── SIDEBAR: List of Students ── */}
        <aside style={{
          width: 300,
          flexShrink: 0,
          backgroundColor: 'var(--color-card-bg)',
          borderRadius: 20,
          border: '1.5px solid var(--color-neutral-light)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          maxHeight: 'calc(100vh - 128px)',
        }} className="teacher-sidebar">
          
          <div style={{ padding: 16, borderBottom: '1.5px solid var(--color-neutral-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Users size={22} color="var(--color-text-light)" />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
                Daftar Siswa ({students.length})
              </span>
            </div>
            
            {/* Search Box */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau email..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 12,
                  border: '1.5px solid var(--color-neutral-light)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <MagnifyingGlass size={18} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Student list scrollable container */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {loadingStudents ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
                <CircleNotch className="animate-spin" size={24} color="#007BFF" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-light)', textAlign: 'center', padding: '24px 8px', margin: 0 }}>
                Tidak ada siswa ditemukan
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {filteredStudents.map((s) => {
                  const isSelected = s.id === selectedStudentId
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudentId(s.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: 'none',
                        textAlign: 'left',
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 200ms',
                      }}
                      className={isSelected ? '' : 'hover:bg-black/5 dark:hover:bg-white/5'}
                    >
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#007BFF' : 'var(--color-neutral-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Student size={20} color={isSelected ? '#ffffff' : 'var(--color-text)'} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 14,
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#007BFF' : 'var(--color-text)',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {s.full_name}
                        </p>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 11,
                          color: 'var(--color-text-light)',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {s.email}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN AREA: Student Answers ── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Materials selector bar */}
          <div style={{
            backgroundColor: 'var(--color-card-bg)',
            borderRadius: 20,
            border: '1.5px solid var(--color-neutral-light)',
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {MATERI_DATA.map((m) => {
                const isSelected = m.id === selectedMaterialId
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMaterialId(m.id)}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      fontWeight: 600,
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#007BFF' : 'transparent',
                      color: isSelected ? '#ffffff' : 'var(--color-text)',
                      transition: 'all 200ms',
                    }}
                    className={isSelected ? '' : 'hover:bg-black/5 dark:hover:bg-white/5'}
                  >
                    Pertemuan {m.id}
                  </button>
                )
              })}
            </div>
            
            {selectedStudent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-light)' }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Meninjau:</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
                  {selectedStudent.full_name}
                </span>
              </div>
            )}
          </div>

          {/* Answers view */}
          <div style={{ flex: 1 }}>
            <AnimatePresence mode="wait">
              {loadingAnswers ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                  <CircleNotch className="animate-spin" size={32} color="#007BFF" />
                </div>
              ) : !selectedStudentId ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: 'var(--color-card-bg)', borderRadius: 20, border: '1.5px solid var(--color-neutral-light)' }}>
                  <Users size={48} color="var(--color-text-light)" style={{ margin: '0 auto 16px' }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-text-light)', margin: 0 }}>
                    Silakan pilih siswa dari bilah samping untuk meninjau jawaban.
                  </p>
                </div>
              ) : currentMaterial ? (
                <motion.div
                  key={`${selectedStudentId}_${selectedMaterialId}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
                >
                  <div style={{
                    backgroundColor: '#007BFF',
                    borderRadius: 20,
                    padding: 24,
                    color: '#ffffff',
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, margin: '0 0 4px' }}>
                      {currentMaterial.pertemuanLabel}
                    </p>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      {currentMaterial.judul}
                    </h2>
                  </div>

                  {/* Grouped sections */}
                  {[
                    { title: 'Essential Questions', key: 'essentialQuestions', secIdx: 2, type: 'text', items: currentMaterial.essentialQuestions },
                    { title: 'Guiding Activities', key: 'guidingActivities', secIdx: 5, type: 'file', items: ['Upload Laporan Aktivitas (PDF)'] },
                    { title: 'Guiding Questions', key: 'guidingQuestions', secIdx: 6, type: 'text', items: currentMaterial.guidingQuestions },
                    { title: 'Solutions & Publishing', key: 'solutions', secIdx: 7, type: 'file', items: ['Upload Hasil Challenge (PDF)'] },
                    { title: 'Kuis', key: 'kuis', secIdx: 8, type: 'text', items: [...currentMaterial.kuis.pertanyaan, 'Upload Kuis (PDF/Foto)'] },
                    { title: 'Refleksi', key: 'refleksi', secIdx: 9, type: 'text', items: [currentMaterial.refleksi] },
                  ].map((sec) => {
                    return (
                      <div
                        key={sec.key}
                        style={{
                          backgroundColor: 'var(--color-card-bg)',
                          borderRadius: 20,
                          border: '1.5px solid var(--color-neutral-light)',
                          padding: 24,
                        }}
                      >
                        <h3 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 18,
                          fontWeight: 700,
                          color: 'var(--color-text)',
                          borderBottom: '1.5px solid var(--color-neutral-light)',
                          paddingBottom: 10,
                          marginBottom: 16,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <Notebook size={20} color="#007BFF" />
                          {sec.title}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                          {sec.items.map((prompt, qIdx) => {
                            const answerKey = `${sec.secIdx}_${qIdx}`
                            const answerText = answers[answerKey]

                            const isFile = sec.type === 'file' || 
                              (sec.secIdx === 6 && selectedMaterialId === 1 && qIdx === 3) ||
                              (sec.secIdx === 2 && selectedMaterialId === 2 && qIdx === 0) ||
                              (sec.secIdx === 8 && qIdx === currentMaterial.kuis.pertanyaan.length)
                            let fileObj: { fileName: string; fileSize: number; fileType: string; fileData?: string; fileUrl?: string; filePath?: string } | null = null
                            if (isFile && answerText) {
                              try {
                                fileObj = JSON.parse(answerText)
                              } catch (e) {
                                // Treat as raw text
                              }
                            }

                            const formatSize = (bytes: number) => {
                              if (!bytes || bytes === 0) return '0 B'
                              const k = 1024
                              const sizes = ['B', 'KB', 'MB']
                              const i = Math.floor(Math.log(bytes) / Math.log(k))
                              return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
                            }

                            return (
                              <div key={qIdx} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                  <span style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: '#007BFF',
                                    backgroundColor: 'var(--color-primary-light)',
                                    borderRadius: 6,
                                    width: 24,
                                    height: 24,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    marginTop: 2,
                                  }}>
                                    {qIdx + 1}
                                  </span>
                                  <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 15,
                                    color: 'var(--color-text)',
                                    margin: 0,
                                    lineHeight: 1.5,
                                    fontWeight: 500,
                                  }}>
                                    {prompt}
                                  </p>
                                </div>

                                {/* Student Answer Box */}
                                <div style={{
                                  backgroundColor: 'var(--color-background)',
                                  borderRadius: 12,
                                  border: '1.5px solid var(--color-neutral-light)',
                                  padding: '14px 18px',
                                  marginTop: 4,
                                  position: 'relative',
                                }}>
                                  {isFile ? (
                                    fileObj ? (
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
                                        <a
                                          href={fileObj.fileUrl || fileObj.fileData}
                                          download={fileObj.fileName}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: '#007BFF',
                                            textDecoration: 'none',
                                            padding: '6px 12px',
                                            borderRadius: 8,
                                            backgroundColor: 'rgba(0, 123, 255, 0.1)',
                                            transition: 'background-color 200ms'
                                          }}
                                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.2)'}
                                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.1)'}
                                        >
                                          Unduh / Buka
                                        </a>
                                      </div>
                                    ) : (
                                      <p style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: 14,
                                        fontStyle: 'italic',
                                        color: '#9CA3AF',
                                        margin: 0,
                                      }}>
                                        Belum ada file diunggah oleh siswa
                                      </p>
                                    )
                                  ) : answerText ? (
                                    <p style={{
                                      fontFamily: 'var(--font-body)',
                                      fontSize: 15,
                                      color: 'var(--color-text)',
                                      margin: 0,
                                      lineHeight: 1.6,
                                      whiteSpace: 'pre-wrap',
                                    }}>
                                      {answerText}
                                    </p>
                                  ) : (
                                    <p style={{
                                      fontFamily: 'var(--font-body)',
                                      fontSize: 14,
                                      fontStyle: 'italic',
                                      color: '#9CA3AF',
                                      margin: 0,
                                    }}>
                                      Belum ada jawaban dari siswa
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .teacher-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}
