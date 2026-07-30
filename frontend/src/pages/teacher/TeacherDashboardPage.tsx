import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Notebook,
  MagnifyingGlass,
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
  const { user, session, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const userRole = user?.user_metadata?.role || 'student'
  const isTeacher = userRole === 'teacher'

  // Sort View Mode: 'nama' or 'pertemuan' with sessionStorage persistence
  const [sortBy, setSortBy] = useState<'nama' | 'pertemuan'>(() => {
    return (sessionStorage.getItem('teacher_sortBy') as 'nama' | 'pertemuan') || 'nama'
  })

  // States
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(() => {
    return sessionStorage.getItem('teacher_selectedStudentId') || null
  })
  const [selectedMaterialId, setSelectedMaterialId] = useState<number>(() => {
    const saved = sessionStorage.getItem('teacher_selectedMaterialId')
    return saved ? parseInt(saved, 10) : 1
  })
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loadingAnswers, setLoadingAnswers] = useState(false)
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem('teacher_searchQuery') || ''
  })

  // Sync states to sessionStorage for persistence on refresh
  useEffect(() => {
    sessionStorage.setItem('teacher_sortBy', sortBy)
  }, [sortBy])

  useEffect(() => {
    if (selectedStudentId) {
      sessionStorage.setItem('teacher_selectedStudentId', selectedStudentId)
    } else {
      sessionStorage.removeItem('teacher_selectedStudentId')
    }
  }, [selectedStudentId])

  useEffect(() => {
    sessionStorage.setItem('teacher_selectedMaterialId', selectedMaterialId.toString())
  }, [selectedMaterialId])

  useEffect(() => {
    sessionStorage.setItem('teacher_searchQuery', searchQuery)
  }, [searchQuery])

  // Route guard: only allow logged-in teachers (wait for authLoading)
  useEffect(() => {
    if (!authLoading && user === null) {
      navigate(ROUTES.TEACHER_LOGIN, { replace: true })
    }
  }, [user, authLoading, navigate])

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

  // Access Denied View if not teacher
  if (!isTeacher) {
    return (
      <div style={{ minHeight: 'calc(100svh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'var(--color-background)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ maxWidth: 460, textAlign: 'center', backgroundColor: 'var(--color-card-bg)', border: '1.5px solid var(--color-border)', padding: '40px 32px', borderRadius: 24 }}
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
    <div style={{ minHeight: 'calc(100svh - 176px)', backgroundColor: 'var(--color-background)', padding: '24px 32px 48px' }}>
      <div style={{ display: 'flex', width: '100%', gap: 32, maxWidth: 1400, margin: '0 auto', alignItems: 'flex-start' }}>

        {/* ── SIDEBAR ── */}
        <aside
          style={{
            width: 320,
            flexShrink: 0,
            backgroundColor: 'var(--color-card-bg)',
            borderRadius: 24,
            border: '1.5px solid var(--color-border)',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
          className="teacher-sidebar"
        >
          {/* Header text */}
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--color-text)',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Urutkan berdasarkan
          </h3>

          {/* Toggle buttons: Nama / Pertemuan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => setSortBy('nama')}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 9999,
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 200ms',
                backgroundColor: sortBy === 'nama' ? '#007BFF' : 'transparent',
                color: sortBy === 'nama' ? '#ffffff' : 'var(--color-text)',
                border: sortBy === 'nama' ? 'none' : '1.5px solid var(--color-border)',
              }}
            >
              Nama
            </button>
            <button
              onClick={() => setSortBy('pertemuan')}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 9999,
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 200ms',
                backgroundColor: sortBy === 'pertemuan' ? '#007BFF' : 'transparent',
                color: sortBy === 'pertemuan' ? '#ffffff' : 'var(--color-text)',
                border: sortBy === 'pertemuan' ? 'none' : '1.5px solid var(--color-border)',
              }}
            >
              Pertemuan
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginTop: 4 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              style={{
                width: '100%',
                padding: '10px 16px 10px 42px',
                borderRadius: 9999,
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--color-input-bg)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <MagnifyingGlass
              size={20}
              color="#9CA3AF"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Divider */}
          <div style={{ borderBottom: '1.5px solid var(--color-border)' }} />

          {/* Student List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: 'calc(100vh - 360px)' }}>
            {loadingStudents ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                <CircleNotch className="animate-spin" size={24} color="#007BFF" />
              </div>
            ) : sortBy === 'nama' ? (
              /* VIEW BY NAMA */
              filteredStudents.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-light)', padding: '12px 0', margin: 0 }}>
                  Tidak ada siswa ditemukan
                </p>
              ) : (
                filteredStudents.map((s) => {
                  const isSelected = s.id === selectedStudentId
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudentId(s.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        padding: '6px 4px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: 16,
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? '#007BFF' : 'var(--color-text)',
                        transition: 'color 150ms',
                      }}
                    >
                      {s.full_name}
                    </button>
                  )
                })
              )
            ) : (
              /* VIEW BY PERTEMUAN */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[1, 2, 3].map((pNum) => {
                  const isCurrentGroupActive = selectedMaterialId === pNum
                  return (
                    <div key={pNum} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {/* Pertemuan Header / Pill */}
                      <button
                        onClick={() => {
                          setSelectedMaterialId(pNum)
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          borderRadius: 12,
                          textAlign: 'left',
                          fontFamily: 'var(--font-heading)',
                          fontSize: 15,
                          fontWeight: 700,
                          cursor: 'pointer',
                          backgroundColor: isCurrentGroupActive ? '#22C55E' : 'transparent',
                          color: isCurrentGroupActive ? '#ffffff' : 'var(--color-text)',
                          border: isCurrentGroupActive ? 'none' : 'none',
                          transition: 'all 200ms',
                        }}
                      >
                        Pertemuan {pNum}
                      </button>

                      {/* List of Students under Pertemuan */}
                      {isCurrentGroupActive && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 12 }}>
                          {filteredStudents.map((s) => {
                            const isSelected = s.id === selectedStudentId && selectedMaterialId === pNum
                            return (
                              <button
                                key={s.id}
                                onClick={() => {
                                  setSelectedStudentId(s.id)
                                  setSelectedMaterialId(pNum)
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  padding: '4px 0',
                                  cursor: 'pointer',
                                  fontFamily: 'var(--font-body)',
                                  fontSize: 15,
                                  fontWeight: isSelected ? 700 : 500,
                                  color: isSelected ? '#007BFF' : 'var(--color-text)',
                                  transition: 'color 150ms',
                                }}
                              >
                                {s.full_name}
                              </button>
                            )
                          })}
                          <div style={{ borderBottom: '1.5px solid var(--color-border)', marginTop: 8 }} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {!selectedStudentId || !selectedStudent ? (
            /* UNSELECTED STATE: "Pilih nama" */
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                backgroundColor: 'transparent',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#6B7280',
                  margin: 0,
                }}
              >
                Pilih nama
              </h2>
            </div>
          ) : (
            /* SELECTED STUDENT STATE */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Student Header */}
              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    margin: 0,
                  }}
                >
                  {selectedStudent.full_name}
                </h1>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    color: 'var(--color-text-light)',
                    margin: '4px 0 0 0',
                  }}
                >
                  {selectedStudent.email}
                </p>
              </div>

              {/* Section Header depending on sortBy view */}
              {sortBy === 'nama' ? (
                /* BY NAMA: Centered "Pertemuan" + 3 Pill Buttons (1, 2, 3) */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      margin: 0,
                    }}
                  >
                    Pertemuan
                  </h3>

                  <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 700, justifyContent: 'center' }}>
                    {[1, 2, 3].map((pNum) => {
                      const isSelected = selectedMaterialId === pNum
                      return (
                        <button
                          key={pNum}
                          onClick={() => setSelectedMaterialId(pNum)}
                          style={{
                            flex: 1,
                            padding: '12px 24px',
                            borderRadius: 9999,
                            fontFamily: 'var(--font-body)',
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 200ms',
                            backgroundColor: isSelected ? '#007BFF' : 'transparent',
                            color: isSelected ? '#ffffff' : 'var(--color-text)',
                            border: isSelected ? 'none' : '1.5px solid var(--color-border)',
                          }}
                        >
                          {pNum}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                /* BY PERTEMUAN: Centered "Pertemuan X" title */
                <div style={{ textAlign: 'center' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 20,
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      margin: 0,
                    }}
                  >
                    Pertemuan {selectedMaterialId}
                  </h3>
                </div>
              )}

              {/* Horizontal Divider Line */}
              <div style={{ borderBottom: '1.5px solid var(--color-border)', width: '100%' }} />

              {/* Answers Content View */}
              {loadingAnswers ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                  <CircleNotch className="animate-spin" size={32} color="#007BFF" />
                </div>
              ) : currentMaterial ? (
                <motion.div
                  key={`${selectedStudentId}_${selectedMaterialId}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
                >
                  {/* Render sections for current material */}
                  {[
                    { title: 'Essential Questions', key: 'essentialQuestions', secIdx: 2, type: 'text', items: currentMaterial.essentialQuestions },
                    { title: 'Guiding Activities', key: 'guidingActivities', secIdx: 5, type: 'file', items: ['Upload Laporan Aktivitas (PDF)'] },
                    { title: 'Guiding Questions', key: 'guidingQuestions', secIdx: 6, type: 'text', items: currentMaterial.guidingQuestions },
                    { title: 'Solutions & Publishing', key: 'solutions', secIdx: 7, type: 'file', items: ['Upload Hasil Challenge (PDF)'] },
                    { title: 'Kuis', key: 'kuis', secIdx: 8, type: 'text', items: [...currentMaterial.kuis.pertanyaan, 'Upload Kuis (PDF/Foto)'] },
                    { title: 'Refleksi', key: 'refleksi', secIdx: 9, type: 'text', items: [currentMaterial.refleksi] },
                  ].map((sec) => (
                    <div
                      key={sec.key}
                      style={{
                        backgroundColor: 'var(--color-card-bg)',
                        borderRadius: 20,
                        border: '1.5px solid var(--color-border)',
                        padding: 24,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 18,
                          fontWeight: 700,
                          color: 'var(--color-text)',
                          borderBottom: '1.5px solid var(--color-border)',
                          paddingBottom: 10,
                          marginBottom: 16,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <Notebook size={22} color="#007BFF" />
                        {sec.title}
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {sec.items.map((prompt, qIdx) => {
                          const answerKey = `${sec.secIdx}_${qIdx}`
                          const answerText = answers[answerKey]

                          const isFile =
                            sec.type === 'file' ||
                            (sec.secIdx === 6 && selectedMaterialId === 1 && qIdx === 3) ||
                            (sec.secIdx === 2 && selectedMaterialId === 2 && qIdx === 0) ||
                            (sec.secIdx === 8 && qIdx === currentMaterial.kuis.pertanyaan.length)

                          let fileObj: { fileName: string; fileSize: number; fileType: string; fileData?: string; fileUrl?: string } | null = null
                          if (isFile && answerText) {
                            try {
                              fileObj = JSON.parse(answerText)
                            } catch (e) {
                              // Fallback to raw text
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
                                <span
                                  style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 13,
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
                                  }}
                                >
                                  {qIdx + 1}
                                </span>
                                <p
                                  style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 15,
                                    color: 'var(--color-text)',
                                    margin: 0,
                                    lineHeight: 1.5,
                                    fontWeight: 500,
                                  }}
                                >
                                  {prompt}
                                </p>
                              </div>

                              {/* Student Answer Box */}
                              <div
                                style={{
                                  backgroundColor: 'var(--color-background)',
                                  borderRadius: 14,
                                  border: '1.5px solid var(--color-border)',
                                  padding: '14px 18px',
                                  marginTop: 4,
                                }}
                              >
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
                                          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                                          padding: '6px 14px',
                                          borderRadius: 8,
                                          backgroundColor: 'rgba(0, 123, 255, 0.1)',
                                          transition: 'background-color 200ms',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.2)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.1)')}
                                      >
                                        Unduh / Buka
                                      </a>
                                    </div>
                                  ) : (
                                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontStyle: 'italic', color: '#9CA3AF', margin: 0 }}>
                                      Belum ada file diunggah oleh siswa
                                    </p>
                                  )
                                ) : answerText ? (
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--color-text)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {answerText}
                                  </p>
                                ) : (
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontStyle: 'italic', color: '#9CA3AF', margin: 0 }}>
                                    Belum ada jawaban dari siswa
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : null}
            </div>
          )}
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
