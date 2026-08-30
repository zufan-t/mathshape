import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Notebook,
  MagnifyingGlass,
  Warning,
  CircleNotch,
  FilePdf,
  Image as ImageIcon,
  CheckCircle,
  Printer,
  FileDoc,
  DownloadSimple,
  Eye,
} from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/AuthContext'
import { supabase } from '@/lib/supabase'
import { API_URL } from '@/lib/config'
import { ROUTES } from '@/lib/constants'
import { MATERI_DATA } from '@/data/materiData'
import { downloadStudentFile, viewStudentFile } from '@/lib/fileDownload'
import Button from '@/components/ui/Button'

interface StudentProfile {
  id: string
  full_name: string
  email: string
  role: string
  isMock?: boolean
}

interface AnswerRow {
  material_id?: number
  section_index: number
  question_index: number
  answer_text: string
}

// ─── DEMO MOCK ANSWERS FOR RICH DEMONSTRATION ─────────────────────────────────
const MOCK_ANSWERS: Record<string, Record<string, string>> = {
  // Mock Student 1 (Ahmad Rizky) - Completed All 3 Pertemuan
  'mock-1': {
    // Pertemuan 1
    'p1_2_0': 'Para tukang kayu merancang kerangka atap menggunakan garis sejajar untuk tumpuan dan garis miring transversal agar beban genteng terbagi merata pada seluruh titik tumpu.',
    'p1_5_0': JSON.stringify({ fileName: 'Laporan_Eksplorasi_GeoGebra_P1.pdf', fileSize: 1450000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P1.pdf' }),
    'p1_6_0': 'Terbentuk pasangan sudut sehadap, sudut berseberangan, sudut bertolak belakang, sudut sepihak, dan sudut berpelurus.',
    'p1_6_1': 'Besar sudut akan berubah menyesuaikan kemiringan garis transversal, tetapi pasangan sudut sehadap dan berseberangan nilainya selalu sama besar.',
    'p1_6_2': 'Bisa dibuktikan menggunakan busur derajat atau fitur Angle di aplikasi GeoGebra.',
    'p1_6_3': JSON.stringify({ fileName: 'Rancangan_Kerangka_Atap_P1.png', fileSize: 680000, fileType: 'image/png', fileUrl: '/files/sample_image.png' }),
    'p1_7_0': JSON.stringify({ fileName: 'Solusi_Challenge_Kerangka_Atap.pdf', fileSize: 2100000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P1.pdf' }),
    'p1_8_0': 'Pasangan sudut yang saling bertolak belakang adalah ∠A dengan ∠C, serta ∠B dengan ∠D.',
    'p1_8_1': 'Pasangan sudut yang saling berpelurus adalah ∠A dengan ∠B, ∠B dengan ∠C, ∠C dengan ∠D, dan ∠D dengan ∠A.',
    'p1_8_2': 'Sudut bertolak belakang besarnya sama karena berada di seberang titik potong yang sama, sedangkan sudut berpelurus jika dijumlahkan bernilai 180° karena membentuk garis lurus.',
    'p1_8_3': JSON.stringify({ fileName: 'Jawaban_Kuis_Pertemuan1_Ahmad.pdf', fileSize: 1150000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P1.pdf' }),
    'p1_9_0': 'Saya memahami bahwa konsep kedudukan garis sejajar dan transversal sangat penting dalam teknik sipil dan arsitektur bangunan.',

    // Pertemuan 2
    'p2_2_0': JSON.stringify({ fileName: 'Ilustrasi_Atap_Rumah_P2.png', fileSize: 920000, fileType: 'image/png', fileUrl: '/files/sample_image.png' }),
    'p2_2_1': 'Dengan menggunakan sifat sudut sehadap, berseberangan, atau berpelurus jika salah satu besar sudut sudah diketahui.',
    'p2_2_2': 'Hubungan sudut sehadap (sama besar), berseberangan (sama besar), dan berpelurus (jumlahnya 180°).',
    'p2_2_3': 'Ya, dimulai dari sudut yang sehadap atau bertolak belakang dengan sudut yang diketahui.',
    'p2_2_4': 'Yakin karena sifat-sifat hubungan sudut pada garis sejajar berlaku secara mutlak secara geometris.',
    'p2_5_0': JSON.stringify({ fileName: 'LKPD_Pertemuan2_Kelompok1.pdf', fileSize: 1800000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P2.pdf' }),
    'p2_6_0': 'Posisi sehadap memiliki besar sudut yang sama.',
    'p2_6_1': 'Sudut yang bertolak belakang nilainya sama besar.',
    'p2_6_2': 'Sudut pada garis lurus jika dijumlahkan harus bernilai 180°.',
    'p2_6_3': 'Bisa, kita menentukan sudut sehadap dulu, lalu sudut bertolak belakang, kemudian sudut berpelurus.',
    'p2_6_4': 'Yakin karena hasil perhitungan konsisten dengan hukum geometri garis sejajar.',
    'p2_7_0': JSON.stringify({ fileName: 'Hasil_Challenge_Pertemuan2.pdf', fileSize: 2300000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P2.pdf' }),
    'p2_8_0': 'Jika ∠a = 65°, maka:\n• ∠c = 65° (bertolak belakang dengan a)\n• ∠e = 65° (sehadap dengan a)\n• ∠g = 65° (luar berseberangan dengan a)\n• ∠b = 180° - 65° = 115° (berpelurus dengan a)\n• ∠d = 115° (bertolak belakang dengan b)\n• ∠f = 115° (sehadap dengan b)\n• ∠h = 115° (luar berseberangan dengan b)',
    'p2_8_1': 'Gunakan hubungan sudut sehadap untuk mencari ∠e, bertolak belakang untuk ∠c, dan berpelurus (180° - 65°) untuk mencari ∠b.',
    'p2_8_2': 'Langkah 1: Cari ∠b = 180° - 65° = 115°. Langkah 2: Tentukan ∠c, ∠d, ∠e, ∠f, ∠g, ∠h berdasarkan sifat keterhubungan sudut.',
    'p2_8_3': 'Dua rel konveyor harus dipasang sejajar agar sudut transversal penyangga konsisten sehingga sabuk konveyor tidak miring atau macet.',
    'p2_8_4': JSON.stringify({ fileName: 'Lembar_Kuis_Pertemuan2.pdf', fileSize: 1400000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P2.pdf' }),
    'p2_9_0': 'Pembelajaran hari ini membuktikan betapa matematisnya perancangan sistem konveyor industri.',

    // Pertemuan 3
    'p3_2_0': 'Karena beberapa benda seperti pohon atau tiang gedung terlalu tinggi dan berbahaya jika dipanjat.',
    'p3_2_1': 'Bayangan yang dibentuk sinar matahari memiliki sudut elevasi yang sama pada waktu yang sama sehingga membentuk segitiga sebangun.',
    'p3_2_2': 'Karena kedua segitiga memiliki pasangan sudut yang sama besar (sudut siku-siku dan sudut elevasi matahari).',
    'p3_2_3': 'Dengan menggunakan perbandingan sisi: (Tinggi Pohon / Tinggi Tongkat) = (Panjang Bayangan Pohon / Panjang Bayangan Tongkat).',
    'p3_2_4': 'Karena posisi dan sudut datang sinar matahari berubah seiring berjalannya waktu.',
    'p3_5_0': JSON.stringify({ fileName: 'LKPD_Pertemuan3_Kesebangunan.pdf', fileSize: 1650000, fileType: 'application/pdf', fileUrl: '/files/materi.pdf' }),
    'p3_6_0': 'Segitiga siku-siku.',
    'p3_6_1': 'Karena memiliki dua sudut yang sama besar (sudut siku-siku 90° dan sudut elevasi sinar matahari).',
    'p3_6_2': 'Sisi tegak (tinggi objek), sisi alas (panjang bayangan), dan sisi miring (garis sinar matahari).',
    'p3_6_3': 'Dengan rumus perbandingan senilai: a/b = c/d.',
    'p3_6_4': 'Kalikan panjang bayangan pohon dengan (tinggi tongkat / panjang bayangan tongkat).',
    'p3_6_5': 'Agar sudut elevasi matahari tetap sama persis untuk kedua objek.',
    'p3_7_0': JSON.stringify({ fileName: 'Solusi_Tinggi_Pohon_Pertemuan3.pdf', fileSize: 2500000, fileType: 'application/pdf', fileUrl: '/files/materi.pdf' }),
    'p3_8_0': 'Cara 1 (Perbandingan Segitiga Sebangun):\nTinggi / 4 = (12 + 3) / 3 => Tinggi / 4 = 15 / 3 = 5 => Tinggi = 20 meter.\n\nCara 2 (Garis Miring Pandangan):\nTinggi / 4 = 25 / 5 => Tinggi / 4 = 5 => Tinggi = 20 meter.',
    'p3_8_1': 'Posisi 1: Menggunakan bayangan cermin di lantai.\nPosisi 2: Menggunakan bayangan tiang bendera di halaman.',
    'p3_8_2': 'Menggunakan pemantulan cahaya pada permukaan air di dalam wadah kecil di tanah.',
    'p3_8_3': JSON.stringify({ fileName: 'Lembar_Kuis_Pertemuan3.pdf', fileSize: 1300000, fileType: 'application/pdf', fileUrl: '/files/materi.pdf' }),
    'p3_9_0': 'Konsep kesebangunan sangat bermanfaat untuk pengukuran tidak langsung secara praktis dan presisi.',
  },

  // Mock Student 2 (Budi Santoso) - Completed Pertemuan 1 & 2
  'mock-2': {
    'p1_2_0': 'Garis sejajar dipakai untuk penopang bawah atap, dan garis transversal dipasang miring untuk mendistribusikan berat beban genteng.',
    'p1_5_0': JSON.stringify({ fileName: 'Laporan_Geogebra_Budi.pdf', fileSize: 1200000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P1.pdf' }),
    'p1_6_0': 'Hubungan sudut sehadap, sudut berseberangan, dan sudut bertolak belakang.',
    'p1_6_1': 'Besar sudutnya berubah mengikuti kemiringan garis, tetapi perbandingannya tetap konsisten.',
    'p1_6_2': 'Mengukur langsung sudut-sudutnya memakai fitur pengukur sudut GeoGebra.',
    'p1_6_3': JSON.stringify({ fileName: 'Sketsa_Atap_Budi.png', fileSize: 540000, fileType: 'image/png', fileUrl: '/files/sample_image.png' }),
    'p1_7_0': JSON.stringify({ fileName: 'Hasil_Challenge_Budi.pdf', fileSize: 1900000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P1.pdf' }),
    'p1_8_0': '∠A bertolak belakang dengan ∠C, ∠B bertolak belakang dengan ∠D.',
    'p1_8_1': '∠A dan ∠B berpelurus, ∠C dan ∠D berpelurus.',
    'p1_8_2': 'Karena membentuk satu garis lurus 180 derajat.',
    'p1_8_3': JSON.stringify({ fileName: 'Kuis_P1_Budi.pdf', fileSize: 980000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P1.pdf' }),
    'p1_9_0': 'Sangat menarik belajar garis dan sudut langsung dengan contoh rangka atap.',

    'p2_2_0': JSON.stringify({ fileName: 'Ilustrasi_Sudut_Budi.png', fileSize: 810000, fileType: 'image/png', fileUrl: '/files/sample_image.png' }),
    'p2_2_1': 'Dengan menggunakan sudut sehadap yang nilainya sama.',
    'p2_2_2': 'Sudut sehadap, berseberangan, dan berpelurus.',
    'p2_2_3': 'Ya, bisa dihitung satu per satu.',
    'p2_2_4': 'Yakin karena rumus sudut sehadap dan berpelurus pasti benar.',
    'p2_5_0': JSON.stringify({ fileName: 'LKPD_Pertemuan2_Budi.pdf', fileSize: 1400000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P2.pdf' }),
    'p2_6_0': 'Besar sudutnya sama karena sehadap.',
    'p2_6_1': 'Nilainya sama karena bertolak belakang.',
    'p2_6_2': 'Jumlahnya 180 derajat.',
    'p2_6_3': 'Bisa, dimulai dari sudut yang diketahui.',
    'p2_6_4': 'Yakin karena perhitungan sesuai dengan teori.',
    'p2_7_0': JSON.stringify({ fileName: 'Challenge_P2_Budi.pdf', fileSize: 2100000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P2.pdf' }),
    'p2_8_0': '∠a=65°, ∠b=115°, ∠c=65°, ∠d=115°, ∠e=65°, ∠f=115°, ∠g=65°, ∠h=115°.',
    'p2_8_1': 'Sudut sehadap, bertolak belakang, dan berpelurus.',
    'p2_8_2': 'Menghitung 180 - 65 = 115 untuk sudut berpelurus.',
    'p2_8_3': 'Agar posisi conveyor simetris dan beban terbagi rata.',
    'p2_8_4': JSON.stringify({ fileName: 'Kuis_P2_Budi.pdf', fileSize: 1100000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P2.pdf' }),
    'p2_9_0': 'Bagus dan bermanfaat.',
  },

  // Mock Student 3 (Siti Rahmawati) - Completed Pertemuan 1
  'mock-3': {
    'p1_2_0': 'Tukang kayu memastikan sudut presisi dengan siku-siku dan prinsip dua garis sejajar yang dipotong garis diagonal.',
    'p1_5_0': JSON.stringify({ fileName: 'Laporan_Geogebra_Siti.pdf', fileSize: 1350000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P1.pdf' }),
    'p1_6_0': 'Terbentuk sudut sehadap dan sudut berseberangan.',
    'p1_6_1': 'Besar sudut menyesuaikan dengan kemiringan garis diagonal.',
    'p1_6_2': 'Dengan mengukur busur pada titik potong.',
    'p1_6_3': JSON.stringify({ fileName: 'Rancangan_Atap_Siti.png', fileSize: 720000, fileType: 'image/png', fileUrl: '/files/sample_image.png' }),
    'p1_7_0': JSON.stringify({ fileName: 'Challenge_Atap_Siti.pdf', fileSize: 1850000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P1.pdf' }),
    'p1_8_0': '∠A dengan ∠C, ∠B dengan ∠D.',
    'p1_8_1': '∠A dan ∠B berpelurus (180°).',
    'p1_8_2': 'Karena berada pada satu garis lurus.',
    'p1_8_3': JSON.stringify({ fileName: 'Lembar_Kuis_Siti.pdf', fileSize: 1050000, fileType: 'application/pdf', fileUrl: '/files/The_Challenge_P1.pdf' }),
    'p1_9_0': 'Materi kedudukan garis sangat bermanfaat.',
  },
}

const DEFAULT_MOCK_STUDENTS: StudentProfile[] = [
  { id: 'mock-1', full_name: 'Ahmad Rizky', email: 'ahmad.rizky@student.smp8.sch.id', role: 'student', isMock: true },
  { id: 'mock-2', full_name: 'Budi Santoso', email: 'budi.santoso@student.smp8.sch.id', role: 'student', isMock: true },
  { id: 'mock-3', full_name: 'Siti Rahmawati', email: 'siti.rahma@student.smp8.sch.id', role: 'student', isMock: true },
]

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
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null)

  const handleDownloadFile = async (fileObj: any, key: string) => {
    setDownloadingKey(key)
    try {
      await downloadStudentFile(fileObj)
    } catch (err: any) {
      alert(err.message || 'Gagal mengunduh berkas.')
    } finally {
      setDownloadingKey(null)
    }
  }

  const handleViewFile = async (fileObj: any) => {
    try {
      await viewStudentFile(fileObj)
    } catch (err: any) {
      alert(err.message || 'Gagal membuka berkas.')
    }
  }

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

  // Fetch all students (from profiles, user_answers, and storage bucket)
  useEffect(() => {
    if (!isTeacher) return

    async function fetchStudents() {
      setLoadingStudents(true)
      try {
        const studentMap = new Map<string, StudentProfile>()

        // 1. Fetch from profiles table in Supabase
        if (supabase) {
          const { data: profilesData, error: profileErr } = await supabase
            .from('profiles')
            .select('id, full_name, email, role')
            .order('full_name', { ascending: true })

          if (!profileErr && profilesData) {
            profilesData.forEach((p: { id: string; full_name: string; email: string; role: string }) => {
              if (p.id !== user?.id && p.role !== 'teacher') {
                studentMap.set(p.id, {
                  id: p.id,
                  full_name: p.full_name || p.email?.split('@')[0] || 'Siswa',
                  email: p.email || '',
                  role: p.role || 'student',
                  isMock: false,
                })
              }
            })
          }
        }

        // 2. Discover distinct student IDs from user_answers table
        if (supabase) {
          try {
            const { data: ansData } = await supabase
              .from('user_answers')
              .select('user_id')

            if (ansData && ansData.length > 0) {
              ansData.forEach((row: { user_id: string }) => {
                if (row.user_id && row.user_id !== user?.id && !studentMap.has(row.user_id)) {
                  studentMap.set(row.user_id, {
                    id: row.user_id,
                    full_name: `Siswa (${row.user_id.substring(0, 8)})`,
                    email: '',
                    role: 'student',
                    isMock: false,
                  })
                }
              })
            }
          } catch (e) {
            console.warn('user_answers student scan warning:', e)
          }
        }

        // 3. Scan Supabase Storage 'materials' bucket for student folders
        if (supabase) {
          try {
            const { data: storageFolders } = await supabase.storage
              .from('materials')
              .list()

            if (storageFolders && storageFolders.length > 0) {
              storageFolders.forEach((folder: any) => {
                if (folder.name && folder.name.length >= 10 && folder.name !== user?.id && !studentMap.has(folder.name)) {
                  studentMap.set(folder.name, {
                    id: folder.name,
                    full_name: `Siswa (${folder.name.substring(0, 8)})`,
                    email: '',
                    role: 'student',
                    isMock: false,
                  })
                }
              })
            }
          } catch (e) {
            console.warn('storage student scan warning:', e)
          }
        }

        const realStudents = Array.from(studentMap.values())

        // Combine: Real students first, then mock demo students
        const combined = [...realStudents]
        DEFAULT_MOCK_STUDENTS.forEach((mock) => {
          if (!combined.some((s) => s.id === mock.id)) {
            combined.push(mock)
          }
        })

        setStudents(combined)

        // If there are real students, automatically select the first real student!
        if (realStudents.length > 0) {
          setSelectedStudentId((prev) => {
            if (!prev || prev.startsWith('mock-')) {
              return realStudents[0].id
            }
            return prev
          })
        } else if (!selectedStudentId) {
          setSelectedStudentId('mock-1')
        }
      } catch (err) {
        console.error('Error fetching students:', err)
        setStudents(DEFAULT_MOCK_STUDENTS)
      } finally {
        setLoadingStudents(false)
      }
    }

    fetchStudents()
  }, [isTeacher, user?.id])

  // Fetch answers for selected student + material
  useEffect(() => {
    if (!selectedStudentId || !selectedMaterialId) return

    const currentStudentId = selectedStudentId
    const selectedStudent = students.find((s) => s.id === currentStudentId)

    // Handle Mock Student answers
    if (selectedStudent?.isMock || currentStudentId.startsWith('mock-')) {
      const mockSet = MOCK_ANSWERS[currentStudentId] || {}
      const answersMap: Record<string, string> = {}
      const prefix = `p${selectedMaterialId}_`

      Object.entries(mockSet).forEach(([key, val]) => {
        if (key.startsWith(prefix)) {
          const rawKey = key.substring(prefix.length) // e.g. '2_0'
          answersMap[rawKey] = val
        }
      })

      setAnswers(answersMap)
      setLoadingAnswers(false)
      return
    }

    // Handle Real Student answers (Fetch from Supabase DB + Scan Storage Bucket)
    async function fetchStudentAnswers() {
      setLoadingAnswers(true)
      const answersMap: Record<string, string> = {}

      try {
        // Step 1: Query Supabase Database table 'user_answers'
        if (supabase) {
          const { data: dbData, error: dbError } = await supabase
            .from('user_answers')
            .select('section_index, question_index, answer_text')
            .eq('material_id', selectedMaterialId)
            .eq('user_id', currentStudentId)

          if (!dbError && dbData && dbData.length > 0) {
            dbData.forEach((ans: AnswerRow) => {
              answersMap[`${ans.section_index}_${ans.question_index}`] = ans.answer_text
            })
          }
        }

        // Step 2: Direct scan in Supabase Storage bucket 'materials' for this student & material
        if (supabase && !currentStudentId.startsWith('mock-')) {
          try {
            const { data: secList } = await supabase.storage
              .from('materials')
              .list(`${selectedStudentId}/${selectedMaterialId}`)

            if (secList && secList.length > 0) {
              for (const item of secList) {
                const secNum = parseInt(item.name)
                if (!isNaN(secNum)) {
                  const { data: fileList } = await supabase.storage
                    .from('materials')
                    .list(`${selectedStudentId}/${selectedMaterialId}/${item.name}`)

                  if (fileList && fileList.length > 0) {
                    const sortedFiles = [...fileList].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
                    const targetFile = sortedFiles[0]
                    const filePath = `${selectedStudentId}/${selectedMaterialId}/${item.name}/${targetFile.name}`
                    const { data: urlData } = supabase.storage.from('materials').getPublicUrl(filePath)

                    let qIdx = 0
                    if (secNum === 6 && selectedMaterialId === 1) qIdx = 3
                    if (secNum === 8) {
                      qIdx = selectedMaterialId === 2 ? 4 : 3
                    }

                    const fileKey = `${secNum}_${qIdx}`
                    if (!answersMap[fileKey] || !answersMap[fileKey].includes('filePath')) {
                      answersMap[fileKey] = JSON.stringify({
                        fileName: targetFile.name.replace(/^\d+_/, ''),
                        fileSize: targetFile.metadata?.size || 0,
                        fileType: targetFile.metadata?.mimetype || 'application/pdf',
                        fileUrl: urlData.publicUrl,
                        filePath: filePath,
                      })
                    }
                  }
                }
              }
            }
          } catch (storageScanErr) {
            console.warn('[TeacherDashboard] Storage scan error:', storageScanErr)
          }
        }

        // Step 3: Fallback to Express backend if needed
        if (Object.keys(answersMap).length === 0 && session?.access_token) {
          try {
            const response = await fetch(
              `${API_URL}/answers?materialId=${selectedMaterialId}&userId=${selectedStudentId}`,
              {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              }
            )
            if (response.ok) {
              const apiData: AnswerRow[] = await response.json()
              apiData.forEach((ans) => {
                answersMap[`${ans.section_index}_${ans.question_index}`] = ans.answer_text
              })
            }
          } catch (e) {
            // ignore
          }
        }

        setAnswers(answersMap)
      } catch (err) {
        console.error('Error fetching student answers:', err)
        setAnswers({})
      } finally {
        setLoadingAnswers(false)
      }
    }

    fetchStudentAnswers()
  }, [selectedStudentId, selectedMaterialId, session, students])

  // Filter students based on search input
  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedStudent = students.find((s) => s.id === selectedStudentId)
  const currentMaterial = MATERI_DATA.find((m) => m.id === selectedMaterialId)

  // Count answered items
  const filledAnswersCount = Object.values(answers).filter((val) => val && val.trim().length > 0).length

  // Action: Print student answer report
  const handlePrintReport = () => {
    window.print()
  }

  // Action: Export student answer report to Word (.doc / .docx format)
  const handleExportWord = () => {
    if (!selectedStudent || !currentMaterial) return

    const studentName = selectedStudent.full_name
    const studentEmail = selectedStudent.email
    const materialTitle = `Pertemuan ${selectedMaterialId} - ${currentMaterial.judul}`
    const dateStr = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const sections = [
      { title: 'Essential Questions', secIdx: 2, type: 'text', items: currentMaterial.essentialQuestions },
      { title: 'Guiding Activities', secIdx: 5, type: 'file', items: ['Upload Laporan Aktivitas (PDF)'] },
      { title: 'Guiding Questions', secIdx: 6, type: 'text', items: currentMaterial.guidingQuestions },
      { title: 'Solutions & Publishing', secIdx: 7, type: 'file', items: ['Upload Hasil Challenge (PDF)'] },
      { title: 'Kuis', secIdx: 8, type: 'text', items: [...currentMaterial.kuis.pertanyaan, 'Upload Lembar Jawaban Kuis (PDF/Foto)'] },
      { title: 'Refleksi', secIdx: 9, type: 'text', items: [currentMaterial.refleksi] },
    ]

    let bodyHtml = ''

    sections.forEach((sec) => {
      bodyHtml += `<h3 style="color:#007BFF; font-size:13pt; margin-top:20px; margin-bottom:8px; border-bottom:1px solid #007BFF; padding-bottom:4px;">📌 ${sec.title}</h3>`
      bodyHtml += `<div style="margin-bottom:16px;">`

      sec.items.forEach((prompt, qIdx) => {
        const answerKey = `${sec.secIdx}_${qIdx}`
        const answerText = answers[answerKey]

        const isFile =
          sec.type === 'file' ||
          (sec.secIdx === 6 && selectedMaterialId === 1 && qIdx === 3) ||
          (sec.secIdx === 2 && selectedMaterialId === 2 && qIdx === 0) ||
          (sec.secIdx === 8 && qIdx === currentMaterial.kuis.pertanyaan.length)

        let fileObj: { fileName: string; fileSize: number; fileType: string } | null = null
        if (answerText) {
          try {
            const parsed = JSON.parse(answerText)
            if (parsed && typeof parsed === 'object' && (parsed.fileName || parsed.fileUrl || parsed.fileData)) {
              fileObj = parsed
            }
          } catch (e) {
            // plain text
          }
        }

        bodyHtml += `<div style="font-weight:bold; color:#111827; margin-top:10px; margin-bottom:4px;">${qIdx + 1}. ${prompt}</div>`

        if (fileObj) {
          bodyHtml += `<div style="background-color:#EBF5FF; border:1px dashed #007BFF; padding:8px 12px; border-radius:6px; color:#0056b3; font-weight:bold; font-size:10pt; margin-bottom:10px;">📎 Berkas Diunggah: ${fileObj.fileName} (${(fileObj.fileSize / 1024).toFixed(1)} KB)</div>`
        } else if (isFile && !answerText) {
          bodyHtml += `<div style="font-style:italic; color:#9CA3AF; font-size:10pt; margin-bottom:10px;">(Belum ada file diunggah oleh siswa)</div>`
        } else if (answerText) {
          const safeText = answerText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')
          bodyHtml += `<div style="background-color:#F9FAFB; border:1px solid #E5E7EB; padding:10px 14px; border-radius:6px; color:#1F2937; font-size:11pt; margin-bottom:10px;">${safeText}</div>`
        } else {
          bodyHtml += `<div style="font-style:italic; color:#9CA3AF; font-size:10pt; margin-bottom:10px;">(Belum ada jawaban dari siswa)</div>`
        }
      })

      bodyHtml += `</div>`
    })

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Hasil Jawaban - ${studentName}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1f2937; line-height: 1.5; margin: 30px; }
          h1 { font-size: 18pt; color: #007BFF; margin-bottom: 4px; font-weight: bold; }
          h2 { font-size: 13pt; color: #4B5563; margin-top: 0; margin-bottom: 20px; font-weight: normal; }
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .meta-table td { padding: 8px 12px; font-size: 10.5pt; border: 1px solid #D1D5DB; }
          .meta-label { font-weight: bold; background-color: #F3F4F6; width: 160px; color: #374151; }
          .footer { font-size: 9pt; color: #9CA3AF; text-align: center; margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 12px; }
        </style>
      </head>
      <body>
        <h1>LEMBAR HASIL JAWABAN MURID</h1>
        <h2>MathLearn SMP Kelas 8</h2>

        <table class="meta-table">
          <tr>
            <td class="meta-label">Nama Murid</td>
            <td><b>${studentName}</b></td>
          </tr>
          <tr>
            <td class="meta-label">Email</td>
            <td>${studentEmail}</td>
          </tr>
          <tr>
            <td class="meta-label">Materi Pembelajaran</td>
            <td><b>${materialTitle}</b></td>
          </tr>
          <tr>
            <td class="meta-label">Tanggal Unduh</td>
            <td>${dateStr}</td>
          </tr>
        </table>

        ${bodyHtml}

        <div class="footer">
          Dokumen ini dibuat dan diunduh secara otomatis dari Dasbor Guru MathLearn SMP Kelas 8.
        </div>
      </body>
      </html>
    `

    const blob = new Blob(['\ufeff' + docContent], {
      type: 'application/msword;charset=utf-8',
    })

    const cleanName = studentName.replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `Hasil_Jawaban_${cleanName}_Pertemuan${selectedMaterialId}.doc`

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  // Access Denied View if not teacher
  if (!isTeacher) {
    return (
      <div
        style={{
          minHeight: 'calc(100svh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          backgroundColor: 'var(--color-background)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            maxWidth: 460,
            textAlign: 'center',
            backgroundColor: 'var(--color-card-bg)',
            border: '1.5px solid var(--color-border)',
            padding: '40px 32px',
            borderRadius: 24,
          }}
        >
          <Warning size={64} color="#EF4444" weight="fill" style={{ margin: '0 auto 20px' }} />
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: '0 0 12px',
            }}
          >
            Akses Ditolak
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--color-text-light)',
              lineHeight: 1.6,
              margin: '0 0 24px',
            }}
          >
            Maaf, halaman ini dikhususkan untuk akun guru. Silakan login menggunakan akun guru untuk mengakses dasbor.
          </p>
          <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: 'calc(100svh - 176px)',
        backgroundColor: 'var(--color-background)',
        padding: '24px 32px 48px',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          gap: 32,
          maxWidth: 1400,
          margin: '0 auto',
          alignItems: 'flex-start',
        }}
      >
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
            position: 'sticky',
            top: 24,
            maxHeight: 'calc(100vh - 48px)',
          }}
          className="teacher-sidebar no-print"
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
          <div
            className="teacher-student-list-scroll"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: 'calc(100vh - 360px)', paddingRight: 4 }}
          >
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
                        padding: '8px 6px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: 16,
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? '#007BFF' : 'var(--color-text)',
                        transition: 'color 150ms',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: 8,
                      }}
                    >
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.full_name}
                      </span>
                      {s.isMock ? (
                        <span
                          title="Data simulasi contoh"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#6B7280', backgroundColor: 'var(--color-input-bg)', padding: '2px 8px', borderRadius: 9999 }}
                        >
                          Demo
                        </span>
                      ) : (
                        <span
                          title="Siswa terdaftar di Supabase"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#007BFF', backgroundColor: 'rgba(0, 123, 255, 0.1)', padding: '2px 8px', borderRadius: 9999 }}
                        >
                          <CheckCircle size={12} weight="fill" /> Siswa
                        </span>
                      )}
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
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span>{s.full_name}</span>
                                {s.isMock ? (
                                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>Demo</span>
                                ) : (
                                  <CheckCircle size={14} color="#10B981" weight="fill" />
                                )}
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
        <main style={{ flex: 1, minWidth: 0 }} className="print-area">
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
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
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

                {/* Header Action: Word (.docx) Export & Print Report */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }} className="no-print">
                  {filledAnswersCount > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 14px',
                        borderRadius: 9999,
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        fontSize: 13,
                        fontWeight: 700,
                        border: '1px solid #A7F3D0',
                      }}
                    >
                      <CheckCircle size={16} weight="fill" /> {filledAnswersCount} Jawaban Terisi
                    </span>
                  )}
                  <button
                    onClick={handleExportWord}
                    title="Unduh berkas Word (.docx / .doc)"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      borderRadius: 12,
                      backgroundColor: '#007BFF',
                      border: 'none',
                      color: '#ffffff',
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(0, 123, 255, 0.25)',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0266D2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007BFF')}
                  >
                    <FileDoc size={18} weight="bold" /> Unduh Word (.docx)
                  </button>
                  <button
                    onClick={handlePrintReport}
                    title="Cetak atau Simpan PDF via Browser"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      borderRadius: 12,
                      backgroundColor: 'var(--color-card-bg)',
                      border: '1.5px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#007BFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  >
                    <Printer size={18} color="#007BFF" weight="bold" /> Cetak (PDF)
                  </button>
                </div>
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

                  <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 700, justifyContent: 'center' }} className="no-print">
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
                    { title: 'Kuis', key: 'kuis', secIdx: 8, type: 'text', items: [...currentMaterial.kuis.pertanyaan, 'Upload Lembar Jawaban Kuis (PDF/Foto)'] },
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
                        <Notebook size={22} color="#007BFF" weight="bold" />
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
                          if (answerText) {
                            try {
                              const parsed = JSON.parse(answerText)
                              if (parsed && typeof parsed === 'object' && (parsed.fileName || parsed.fileUrl || parsed.fileData)) {
                                fileObj = parsed
                              }
                            } catch (e) {
                              // Plain text answer
                            }
                          }

                          const isImage = fileObj?.fileType?.includes('image') || fileObj?.fileName?.match(/\.(png|jpg|jpeg|gif|webp)$/i)

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
                                {fileObj ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                                        {isImage ? (
                                          <div style={{ color: '#10B981', display: 'flex' }}>
                                            <ImageIcon size={28} weight="fill" />
                                          </div>
                                        ) : (
                                          <div style={{ color: '#EF4444', display: 'flex' }}>
                                            <FilePdf size={28} weight="fill" />
                                          </div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                          <span
                                            style={{
                                              fontFamily: 'var(--font-body)',
                                              fontSize: 14,
                                              fontWeight: 600,
                                              color: 'var(--color-text)',
                                              whiteSpace: 'nowrap',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                            }}
                                          >
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
                                          onClick={() => handleViewFile(fileObj)}
                                          title="Buka atau lihat berkas di tab baru"
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
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
                                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-input-bg)')}
                                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-card-bg)')}
                                        >
                                          <Eye size={16} /> Lihat
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleDownloadFile(fileObj, answerKey)}
                                          disabled={downloadingKey === answerKey}
                                          title="Unduh berkas asli dari Supabase Storage"
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: '#ffffff',
                                            padding: '6px 14px',
                                            borderRadius: 8,
                                            backgroundColor: '#007BFF',
                                            border: 'none',
                                            cursor: downloadingKey === answerKey ? 'not-allowed' : 'pointer',
                                            opacity: downloadingKey === answerKey ? 0.8 : 1,
                                            transition: 'background-color 200ms',
                                          }}
                                          onMouseEnter={(e) => {
                                            if (downloadingKey !== answerKey) e.currentTarget.style.backgroundColor = '#0266D2'
                                          }}
                                          onMouseLeave={(e) => {
                                            if (downloadingKey !== answerKey) e.currentTarget.style.backgroundColor = '#007BFF'
                                          }}
                                        >
                                          {downloadingKey === answerKey ? (
                                            <>
                                              <CircleNotch size={16} className="animate-spin" /> Mengunduh...
                                            </>
                                          ) : (
                                            <>
                                              <DownloadSimple size={16} weight="bold" /> Unduh
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Image Preview if available */}
                                    {isImage && (fileObj.fileData || (fileObj.fileUrl && fileObj.fileUrl !== '#')) && (
                                      <div style={{ marginTop: 8, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--color-border)', maxWidth: 420 }}>
                                        <img
                                          src={fileObj.fileData || fileObj.fileUrl}
                                          alt={fileObj.fileName}
                                          style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block' }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ) : isFile && !answerText ? (
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontStyle: 'italic', color: '#9CA3AF', margin: 0 }}>
                                    Belum ada file diunggah oleh siswa
                                  </p>
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
        .teacher-student-list-scroll {
          scrollbar-width: thin;
          scrollbar-color: #9CA3AF transparent;
        }
        .teacher-student-list-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .teacher-student-list-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 9999px;
        }
        .teacher-student-list-scroll::-webkit-scrollbar-thumb {
          background: #9CA3AF;
          border-radius: 9999px;
          transition: background-color 200ms ease;
        }
        .teacher-student-list-scroll::-webkit-scrollbar-thumb:hover {
          background: #E5E7EB;
        }
        @media (max-width: 768px) {
          .teacher-sidebar { display: none !important; }
        }
        @media print {
          .no-print { display: none !important; }
          .print-area { width: 100% !important; margin: 0 !important; padding: 0 !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  )
}
