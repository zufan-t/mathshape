// ─── Tipe Data Isi Materi (CBL - Challenge Based Learning) ────────────────────

export interface MateriPertemuan {
  id: number
  pertemuanLabel: string
  judul: string
  cp: string
  tp: string
  gambarSrc?: string
  bigIdea: string
  essentialQuestions: string[]
  theChallenge: {
    deskripsi: string
    poin: string[]
  }
  guidingActivities: string[]
  guidingQuestions: string[]
  guidingResources: {
    type: 'youtube' | 'link'
    url: string
    label?: string
  }[]
  solutions: string[]
}

// ─── Data Statis 3 Pertemuan (Sesuai revisi-materi.md) ─────────────────────────

const COMMON_CP = 'Murid dapat menggunakan hubungan antar-sudut yang terbentuk oleh dua garis yang berpotongan, dan oleh dua garis sejajar yang dipotong sebuah garis transversal untuk menyelesaikan masalah (termasuk menentukan jumlah besar sudut dalam sebuah segitiga, menentukan besar sudut yang belum diketahui pada sebuah segitiga); menjelaskan sifat-sifat kekongruenan dan kesebangunan pada segitiga dan segiempat, dan menggunakannya untuk menyelesaikan masalah.'

export const MATERI_DATA: MateriPertemuan[] = [
  {
    id: 1,
    pertemuanLabel: 'Pertemuan 1',
    judul: 'Kedudukan Garis',
    cp: COMMON_CP,
    tp: 'Melalui model challenge-based deep learning, murid dapat menentukan hubungan antarsudut pada garis berpotongan.',
    bigIdea: 'Perhatikan gambar di bawah ini! Gambar ini menunjukkan bagaimana konsep garis sejajar dan transversal diterapkan secara nyata dalam konstruksi bangunan. Big Idea kita kali ini adalah memahami bahwa presisi sudut bukan hanya soal angka di atas kertas, melainkan dasar utama dari keamanan dan kekuatan sebuah struktur bangunan.',
    essentialQuestions: [
      'Bagaimana para tukang bangunan memastikan setiap sudut pada rangka atap presisi agar mampu menahan beban ribuan genteng yang berat?',
    ],
    theChallenge: {
      deskripsi: 'Kamu adalah seorang arsitek yang diminta untuk merancang kerangka atap perumahan. Ada beberapa syarat yang harus kamu penuhi dalam merancang kerangka atap perumahan.',
      poin: [
        'Dua batang utama yang sejajar (sebagai tumpuan bawah/plafon).',
        'Dua batang transversal (diagonal) yang memotong tumpuan tersebut.',
        'Kamu harus menunjukkan kepada tukang bangunan bahwa sudut-sudut sehadap pada sambungan baut memiliki besar yang sama agar beban terbagi rata!',
      ],
    },
    guidingActivities: [
      'Gunakan aplikasi GeoGebra (versi web/aplikasi) untuk melakukan eksplorasi berikut:',
      'Buat dua garis sejajar menggunakan tool Line dan pastikan sejajar dengan tool Parallel Line.',
      'Buat satu garis transversal yang memotong kedua garis sejajar tersebut.',
      'Tandai titik-titik perpotongan, lalu gunakan tool Angle untuk mengukur seluruh sudut yang terbentuk pada kedua titik perpotongan (akan ada 8 sudut).',
      'Catat pasangan sudut yang besarnya sama dan kelompokkan berdasarkan jenis hubungannya (sehadap, dalam berseberangan, luar berseberangan, atau berpelurus).',
      'Geser (drag) garis transversal untuk mengubah kemiringannya, lalu amati apakah hubungan antarsudut yang sudah kamu kelompokkan tadi tetap berlaku atau berubah.',
      'Ambil tangkapan layar (screenshot) hasil eksplorasimu sebagai bukti untuk mendukung jawaban pada Guiding Questions dan Solution.',
    ],
    guidingQuestions: [
      'Jika dua batang kayu sejajar dipotong oleh satu batang diagonal, hubungan apa yang terbentuk di antara sudut-sudut pada titik persambungannya?',
      'Apa yang terjadi pada besar sudut-sudut tersebut jika kemiringan (gradien) batang transversal diubah?',
      'Bagaimana cara membuktikan bahwa sudut di sambungan bawah dan atas benar-benar sama besar?',
      'Gambarkan rancangan atapmu secara rapi! Berikan label nama sudut agar para tukang bangunan tidak bingung ketika ingin memasang atap!',
    ],
    guidingResources: [
      {
        type: 'link',
        url: 'https://canva.link/1z7412vsb8lx02h',
        label: 'Canva: Rangka Atap Ruko',
      },
    ],
    solutions: [
      'Diskusikanlah dengan anggota kelompok kalian untuk menyelesaikan tantangan yang telah dirumuskan pada bagian Challenge.',
      'Gunakan Guiding Resources, Guiding Questions, dan Guiding Activities sebagai panduan dalam proses diskusi dan pemecahan masalah.',
      'Tuliskan hasil kerja kelompok pada lembar yang telah disediakan, kemudian siapkan hasil tersebut untuk dipresentasikan dan didiskusikan bersama di kelas.',
    ],
  },
  {
    id: 2,
    pertemuanLabel: 'Pertemuan 2',
    judul: 'Hubungan Antar Sudut',
    cp: COMMON_CP,
    tp: 'Melalui model challenge-based deep learning, murid dapat menggunakan hubungan sudut pada dua garis sejajar yang dipotong oleh garis transversal untuk menentukan besar sudut yang belum diketahui dengan tepat.',
    bigIdea: 'Perhatikan gambar diatas, tahukah kamu saat kita melihat rangka atap rumah, sebenarnya ada dua balok yang sejajar (berwarna merah) dan satu balok miring yang memotongnya (berwarna kuning). Dalam matematika balok yang ditandai warna merah dapat disebut garis sejajar dan balok yang ditandai warna kuning dapat disebut garis transversal. Dari situ terbentuk beberapa sudut yang saling berhubungan. Dengan memahami hubungan antar sudut tersebut, kita bisa mengetahui besar sudut yang belum diketahui tanpa harus mengukurnya langsung. Pengetahuan ini membantu kita memahami bagaimana bangunan bisa dibuat dengan tepat dan kuat.',
    essentialQuestions: [
      'Coba perhatikan gambar kerangka atap rumah yang kalian buat. Menurut kalian, garis mana yang sejajar? Garis mana yang miring dan memotong keduanya (garis transversal)?',
      'Bagaimana cara kalian menentukan besar sudut-sudut lainnya tanpa mengukur langsung?',
      'Hubungan sudut apa yang bisa kalian gunakan?',
      'Dari semua hubungan itu, bisakah kalian mulai menentukan satu per satu sudut yang belum diketahui?',
      'Bagaimana kalian bisa yakin bahwa jawaban kalian benar walaupun tidak mengukur langsung?',
    ],
    theChallenge: {
      deskripsi: 'Seorang tukang sedang merancang rangka atap rumah. Ia memasang dua balok kayu yang sejajar sebagai penopang utama, lalu menambahkan satu balok miring untuk memperkuat atap. Sekarang, kalian diminta membantu tukang tersebut merancang bentuk kerangka atap dengan sudut yang kalian tentukan.',
      poin: [
        'Gunakan pemahaman kalian tentang dua garis sejajar yang dipotong oleh garis transversal untuk menemukan jawabannya dan jelaskan alasan kalian.',
      ],
    },
    guidingActivities: [
      'Akses lembar aktivitas digital melalui tautan Canva berikut: https://canva.link/qkfj9h32u2vyjt7',
    ],
    guidingQuestions: [
      'Coba perhatikan gambar rangka atapnya. Menurut kalian, garis mana yang sejajar? Garis mana yang miring dan memotong keduanya?',
      'Dari sudut yang diketahui itu, apakah ada sudut lain yang posisinya “mirip” atau sehadap? Kalau ada, menurut kalian apakah besarnya sama atau berbeda?',
      'Adakah sudut yang saling berhadapan (bertolak belakang)? Menurut kalian, bagaimana hubungan nilainya?',
      'Coba cari sudut yang berada pada satu garis lurus. Jika dijumlahkan, harus berapa derajat?',
      'Dari semua hubungan itu, bisakah kalian mulai menentukan satu per satu sudut yang belum diketahui?',
      'Bagaimana kalian bisa yakin bahwa jawaban kalian benar walaupun tidak mengukur langsung?',
    ],
    guidingResources: [
      {
        type: 'link',
        url: 'https://www.canva.com/design/DAHOHjLV7CU/a13v0yJoiS6yEVrQfD_h9g/edit',
        label: 'Canva: Hubungan Antar Sudut',
      },
    ],
    solutions: [
      'Diskusikanlah dengan anggota kelompok kalian untuk menyelesaikan tantangan yang telah dirumuskan pada bagian Challenge.',
      'Gunakan Guiding Resources, Guiding Questions, dan Guiding Activities sebagai panduan dalam proses diskusi dan pemecahan masalah.',
      'Tuliskan hasil kerja kelompok pada lembar yang telah disediakan, kemudian siapkan hasil tersebut untuk dipresentasikan dan didiskusikan bersama di kelas.',
    ],
  },
  {
    id: 3,
    pertemuanLabel: 'Pertemuan 3',
    judul: 'Kesebangunan Segitiga',
    cp: COMMON_CP,
    tp: 'Melalui model challenge-based deep learning, murid dapat menentukan kesebangunan segitiga dan menyelesaikan masalah sehari-hari yang berkaitan dengan kesebangunan dengan tepat.',
    bigIdea: 'Perhatikan gambar di atas! Tahukah kamu bahwa tinggi suatu benda tidak selalu dapat ditentukan dengan cara mengukurnya secara langsung? Dalam kehidupan sehari-hari, terdapat berbagai objek yang sulit dijangkau, seperti pohon, tiang bendera, atau gedung yang tinggi. Meskipun demikian, tinggi objek tersebut tetap dapat ditentukan melalui cara yang lebih sederhana dengan memanfaatkan bayangan yang terbentuk akibat sinar matahari. Dalam matematika, hubungan antara tinggi suatu benda dan panjang bayangannya dapat dijelaskan melalui konsep kesebangunan segitiga. Dengan memahami konsep tersebut, kita dapat menentukan tinggi suatu objek tanpa harus mengukurnya secara langsung. Big Idea kita kali ini adalah memahami bahwa kesebangunan segitiga dapat digunakan sebagai strategi untuk menyelesaikan permasalahan nyata yang berkaitan dengan pengukuran tinggi suatu benda secara tidak langsung.',
    essentialQuestions: [
      'Mengapa tinggi suatu benda tidak selalu dapat diukur secara langsung?',
      'Bagaimana bayangan yang terbentuk akibat sinar matahari dapat dimanfaatkan untuk membantu menentukan tinggi suatu benda?',
      'Mengapa dua segitiga yang terbentuk dari benda dan bayangannya dapat dikatakan sebangun?',
      'Bagaimana konsep kesebangunan segitiga dapat digunakan untuk menentukan tinggi pohon tanpa harus mengukurnya secara langsung?',
      'Mengapa hasil pengukuran akan lebih akurat jika pengukuran tinggi benda dan panjang bayangan dilakukan pada waktu yang sama?',
    ],
    theChallenge: {
      deskripsi: 'Di lingkungan sekolah terdapat sebuah pohon besar yang tingginya belum diketahui. Pihak sekolah memerlukan informasi mengenai tinggi pohon tersebut untuk mendukung perawatan dan menjaga keamanan lingkungan sekolah. Namun, tinggi pohon tidak dapat diukur secara langsung karena keterbatasan alat ukur. Guru memberikan ilustrasi mengenai tinggi benda pembanding dan panjang bayangan yang terbentuk akibat sinar matahari. Berdasarkan informasi tersebut, tentukan tinggi pohon dengan memanfaatkan konsep kesebangunan segitiga. Sajikan proses penyelesaian, perhitungan, serta kesimpulan yang diperoleh secara sistematis.',
      poin: [
        'Amati ilustrasi yang diberikan.',
        'Buat sketsa yang merepresentasikan situasi pada permasalahan.',
        'Identifikasi segitiga-segitiga yang sebangun.',
        'Gunakan perbandingan sisi-sisi yang bersesuaian untuk menentukan tinggi pohon.',
        'Jelaskan alasan penggunaan konsep kesebangunan segitiga dalam penyelesaian masalah.',
        'Tuliskan hasil perhitungan dan kesimpulan secara sistematis.',
      ],
    },
    guidingActivities: [
      'Akses lembar aktivitas digital melalui tautan Canva berikut: https://canva.link/xvd9c93x1nr2kww',
    ],
    guidingQuestions: [
      'Perhatikan ilustrasi yang diberikan. Bangun datar apa yang terbentuk oleh pohon, benda pembanding, dan bayangannya?',
      'Mengapa segitiga yang terbentuk dari pohon dan benda pembanding dapat dikatakan sebangun?',
      'Sisi-sisi mana yang saling bersesuaian pada kedua segitiga tersebut?',
      'Bagaimana menentukan perbandingan sisi-sisi yang bersesuaian pada kedua segitiga?',
      'Bagaimana menggunakan perbandingan tersebut untuk menentukan tinggi pohon?',
      'Menurut kalian, mengapa pengukuran bayangan harus dilakukan pada waktu yang sama agar hasil perhitungan tetap akurat?',
    ],
    guidingResources: [
      {
        type: 'link',
        url: 'https://canva.link/ylmtjc74qdrd5wc',
        label: 'Canva: Kesebangunan Segitiga',
      },
    ],
    solutions: [
      'Diskusikanlah dengan anggota kelompok kalian untuk menyelesaikan tantangan yang telah dirumuskan pada bagian Challenge.',
      'Gunakan Guiding Resources, Guiding Questions, dan Guiding Activities sebagai panduan dalam proses diskusi dan pemecahan masalah.',
      'Tuliskan hasil kerja kelompok pada lembar yang telah disediakan, kemudian siapkan hasil tersebut untuk dipresentasikan dan didiskusikan bersama di kelas.',
    ],
  },
]

// ─── Helper: Cari data materi berdasarkan ID ───────────────────────────────────
export function getMateriById(id: number): MateriPertemuan | undefined {
  return MATERI_DATA.find((m) => m.id === id)
}
