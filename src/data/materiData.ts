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
    type: 'youtube'
    url: string
    label?: string
  }[]
  solutions: string[]
}

// ─── Data Statis 3 Pertemuan ───────────────────────────────────────────────────

export const MATERI_DATA: MateriPertemuan[] = [
  {
    id: 1,
    pertemuanLabel: 'Pertemuan 1',
    judul: 'Kedudukan garis',
    cp: 'Peserta didik dapat mengidentifikasi hubungan antara garis sejajar dan garis transversal serta sifat-sifat sudut yang terbentuk.',
    tp: 'Setelah mengikuti pembelajaran, peserta didik mampu: (1) Menjelaskan konsep garis sejajar dan transversal dalam konteks nyata, (2) Mengidentifikasi sudut-sudut yang terbentuk (sehadap, bertolak belakang, dalam berseberangan, luar berseberangan), (3) Membuktikan kesamaan besar sudut sehadap.',
    bigIdea:
      'Perhatikan gambar di atas! Gambar ini menunjukkan bagaimana konsep garis sejajar dan transversal diterapkan secara nyata dalam konstruksi bangunan. Big Idea kita kali ini adalah memahami bahwa presisi sudut bukan hanya soal angka di atas kertas, melainkan dasar utama dari keamanan dan kekuatan sebuah struktur bangunan.',
    essentialQuestions: [
      'Bagaimana para tukang bangunan memastikan setiap sudut pada rangka atap presisi agar mampu menahan beban ribuan genteng yang berat?',
    ],
    theChallenge: {
      deskripsi:
        'Kamu adalah seorang arsitek yang diminta untuk merancang kerangka atap perumahan. Ada beberapa syarat yang harus kamu penuhi dalam merancang kerangka atap perumahan:',
      poin: [
        'Dua batang utama yang sejajar (sebagai tumpuan bawah/plafon).',
        'Dua batang transversal (diagonal) yang memotong tumpuan tersebut.',
        'Kamu harus menunjukkan kepada tukang bangunan bahwa sudut-sudut sehadap pada sambungan baut memiliki besar yang sama agar beban terbagi rata!',
      ],
    },
    guidingActivities: [
      'Lakukan observasi lapangan dengan mencari bangunan di sekitar lingkungan sekolah.',
      'Dokumentasikan hasilnya.',
      'Kelompokkan mana yang merupakan garis sejajar dan mana yang merupakan garis transversal.',
    ],
    guidingQuestions: [
      'Jika kamu memiliki dua batang kayu yang sejajar, lalu meletakkan satu batang diagonal di atasnya, hubungan apa yang terbentuk di antara titik-titik persambungannya?',
      'Apa yang terjadi pada besar sudut-sudut jika kamu mengubah kemiringan (gradien) dari batang transversal tersebut? Apakah besar sudut akan ikut berubah?',
      'Lihat kembali foto bangunan yang kamu potret. Mana sambungan baut yang posisinya menghadap ke arah yang sama? Kenapa kamu yakin jika itu disebut sudut sehadap?',
      'Cari sambungan yang saling membelakangi (bertolak belakang). Bayangkan jika baut di satu sisi lepas karena beban terlalu berat, menurutmu apakah sisi di seberangnya akan ikut goyang atau tetap aman? Berikan alasanmu ya!',
      'Sebelum Pak Tukang mulai memasang baut di kayu yang asli, bagaimana cara kamu membuktikan jika sudut di sambungan bawah dan atas itu besarnya sudah benar-benar sama? Alat apa yang kamu pakai?',
    ],
    guidingResources: [
      {
        type: 'youtube',
        url: 'https://youtu.be/uFChWnX_LUo?si=u39uvUTBTHE-XTUSy',
        label: 'Video 1',
      },
      {
        type: 'youtube',
        url: 'https://youtu.be/_vmaVr4QKYE?si=3LzcqVIKrZUt3bWX',
        label: 'Video 2',
      },
    ],
    solutions: [
      'Sebagai arsitek, menurutmu apa hubungannya antara sudut yang besarnya sama dengan beban atap yang terbagi rata? Apa yang akan terjadi apabila besar sudutnya berbeda? Apakah atapnya rawan runtuh?',
      'Gambarkan rancangan atapmu secara rapi! Berikan label nama sudut agar para tukang bangunan tidak bingung ketika ingin memasang atap!',
    ],
  },

  {
    id: 2,
    pertemuanLabel: 'Pertemuan 2',
    judul: 'Hubungan Antar Sudut',
    cp: 'Peserta didik dapat memahami hubungan antar sudut yang terbentuk oleh dua garis sejajar yang dipotong oleh sebuah transversal.',
    tp: 'Setelah mengikuti pembelajaran, peserta didik mampu: (1) Mengidentifikasi jenis-jenis hubungan sudut (sehadap, dalam berseberangan, luar berseberangan, bertolak belakang), (2) Menentukan besar sudut yang tidak diketahui berdasarkan hubungan antar sudut, (3) Menerapkan konsep dalam konteks desain rangka atap.',
    bigIdea:
      'Perhatikan gambar di atas. Tahukah kamu saat kita melihat rangka atap rumah, sebenarnya ada dua balok yang sejajar dan satu balok miring yang memotongnya. Dari situ terbentuk beberapa sudut yang saling berhubungan. Dengan memahami hubungan antar sudut tersebut, kita bisa mengetahui besar sudut yang belum diketahui tanpa harus mengukurnya langsung. Pengetahuan ini membantu kita memahami bagaimana bangunan bisa dibuat dengan tepat dan kuat.',
    essentialQuestions: [
      'Pernahkah kalian memperhatikan bentuk rangka atap rumah? Menurut kalian, mengapa bentuknya tidak sembarang, tetapi memiliki sudut tertentu?',
      'Jika dua balok atap dibuat sejajar dan dipotong oleh satu balok miring, apakah sudut-sudut yang terbentuk memiliki hubungan? Mengapa demikian?',
      'Bagaimana cara menentukan besar suatu sudut pada rangka atap tanpa harus mengukurnya langsung?',
      'Menurut kalian, apa yang akan terjadi jika sudut pada rangka atap tidak tepat atau tidak sesuai perhitungan?',
      'Apakah hubungan antar sudut ini hanya berlaku pada atap rumah, atau juga bisa ditemukan pada situasi lain di sekitar kita?',
    ],
    theChallenge: {
      deskripsi:
        'Seorang tukang sedang merancang rangka atap rumah. Ia memasang dua balok kayu yang sejajar sebagai penopang utama, lalu menambahkan satu balok miring untuk memperkuat atap. Ia menyadari bahwa sudut-sudut yang terbentuk sangat penting agar atap kuat. Tukang tersebut hanya mengetahui satu sudut sebesar 50°, sementara sudut-sudut lainnya belum diketahui.',
      poin: [
        'Bagaimana cara kalian menentukan besar sudut-sudut lainnya tanpa mengukur langsung?',
      ],
    },
    guidingActivities: [
      'Akses dan kerjakan lembar aktivitas digital melalui tautan Canva berikut: https://canva.link/qkfj9h32u2vvjt7',
      'Amati gambar rangka atap yang tersedia dan identifikasi garis-garis yang ada.',
      'Tandai sudut-sudut yang terbentuk dan tentukan hubungan antar sudut tersebut.',
    ],
    guidingQuestions: [
      'Garis mana yang sejajar dan garis mana yang menjadi transversal (pemotong)?',
      'Tunjukkan sudut mana saja yang besarnya sama (sudut sehadap)?',
      'Mana yang disebut sudut dalam berseberangan dan luar berseberangan?',
      'Apa yang bisa disimpulkan tentang besar sudut yang bertolak belakang?',
      'Berapa jumlah sudut yang berada pada satu garis lurus?',
    ],
    guidingResources: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=9xr-8CViKrg',
        label: 'Video: Hubungan Antar Sudut pada Garis Sejajar',
      },
    ],
    solutions: [
      'Kumpulkan hasil pengerjaan The Challenge dan presentasikan di depan kelas.',
      'Jelaskan langkah-langkah cara menentukan besar setiap sudut berdasarkan hubungan yang ditemukan.',
      'Buktikan hubungan antar sudut menggunakan sifat-sifat yang telah dipelajari.',
    ],
  },

  {
    id: 3,
    pertemuanLabel: 'Pertemuan 3',
    judul: 'Kesebangunan Segitiga',
    cp: 'Peserta didik dapat memahami konsep kesebangunan segitiga dan menerapkannya untuk menyelesaikan masalah pengukuran tidak langsung dalam kehidupan sehari-hari.',
    tp: 'Setelah mengikuti pembelajaran, peserta didik mampu: (1) Menjelaskan syarat dua segitiga dikatakan sebangun, (2) Menggunakan konsep perbandingan pada segitiga sebangun untuk menghitung panjang sisi yang tidak diketahui, (3) Menerapkan konsep kesebangunan untuk mengukur tinggi benda secara tidak langsung menggunakan bayangan.',
    bigIdea:
      'Menggunakan perbandingan antara tinggi benda dan panjang bayangannya melalui konsep kesebangunan segitiga untuk menyelesaikan masalah sehari-hari seperti mengukur tinggi pohon tanpa harus memanjatnya.',
    essentialQuestions: [
      'Bagaimana cara mengetahui tinggi pohon tanpa mengukurnya secara langsung?',
      'Mengapa bayangan bisa digunakan untuk membantu pengukuran?',
      'Bagaimana hubungan antara tinggi benda dan panjang bayangannya?',
      'Mengapa pengukuran harus dilakukan pada waktu yang sama?',
    ],
    theChallenge: {
      deskripsi:
        'Tentukan tinggi pohon di lingkungan sekolah dengan memanfaatkan penggaris 30 cm dan bayangan yang terbentuk oleh sinar matahari.',
      poin: [
        'Gunakan benda pembanding (tongkat/teman), ukur tinggi dan bayangannya pada waktu yang sama.',
        'Lalu gunakan perbandingan untuk menghitung tinggi pohon.',
        'Catat semua data pengukuran secara teliti dan sistematis.',
      ],
    },
    guidingActivities: [
      'Observasi langsung di sekolah, mencari pohon yang cukup tinggi sebagai objek pengukuran.',
      'Pilih benda pembanding yang mudah diukur tingginya (tongkat, teman sekelas).',
      'Ukur tinggi benda pembanding dan panjang bayangannya pada saat yang bersamaan.',
      'Ukur panjang bayangan pohon pada saat yang sama.',
      'Buat sketsa segitiga yang menggambarkan situasi pengukuran.',
    ],
    guidingQuestions: [
      'Seperti apa bentuk segitiga yang terbentuk oleh pohon dan bayangannya?',
      'Mengapa segitiga tersebut dikatakan sebangun?',
      'Berapa perbandingan antara tinggi benda pembanding dan panjang bayangannya?',
      'Apa yang terjadi jika pengukuran dilakukan pada waktu yang berbeda?',
    ],
    guidingResources: [
      {
        type: 'youtube',
        url: 'https://youtu.be/ZKcXE9LQkNo?si=-bVsseoB-DnVEtPi',
        label: 'Video: Kesebangunan Segitiga',
      },
    ],
    solutions: [
      'Jelaskan bagaimana bayangan digunakan untuk mengukur tinggi pohon secara tidak langsung.',
      'Tunjukkan perhitungan perbandingan tinggi pohon menggunakan rumus kesebangunan.',
      'Analisis konsep kesebangunan segitiga yang diterapkan dalam kegiatan ini.',
      'Buat laporan sederhana berisi data pengukuran, perhitungan, dan kesimpulan.',
    ],
  },
]

// ─── Helper: Cari data materi berdasarkan ID ───────────────────────────────────
export function getMateriById(id: number): MateriPertemuan | undefined {
  return MATERI_DATA.find((m) => m.id === id)
}
