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
    tp:
      'Setelah mengikuti pembelajaran, peserta didik mampu: (1) Menjelaskan konsep garis sejajar dan transversal dalam konteks nyata, (2) Mengidentifikasi sudut-sudut yang terbentuk (sehadap, bertolak belakang, dalam berseberangan, luar berseberangan), (3) Membuktikan kesamaan besar sudut sehadap.',
    bigIdea:
      'Perhatikan gambar di atas! Gambar ini menunjukkan bagaimana konsep garis sejajar dan transversal diterapkan secara nyata dalam konstruksi bangunan. Big Idea kita kali ini adalah memahami bahwa presisi sudut bukan hanya soal angka di atas kertas, melainkan dasar utama dari keamanan dan kekuatan sebuah struktur bangunan.',
    essentialQuestions: [
      'Bagaimana para tukang bangunan memastikan setiap sudut pada rangka atap presisi agar mampu menahan beban ribuan genteng yang berat?',
    ],
    theChallenge: {
      deskripsi:
        'Kamu adalah seorang arsitek yang diminta untuk merancang kerangka atap perumahan. Ada beberapa syarat yang harus kamu penuhi dalam merancang kerangka atap perumahan:',
      poin: [
        '1. Dua batang utama yang sejajar (sebagai tumpuan bawah/plafon).',
        '2. Dua batang transversal (diagonal) yang memotong tumpuan tersebut.',
        '3. Kamu harus menunjukkan kepada tukang bangunan bahwa sudut-sudut sehadap pada sambungan baut memiliki besar yang sama agar beban terbagi rata!',
      ],
    },
    guidingActivities: [
      'Lakukan observasi lapangan dengan mencari bangunan di sekitar lingkungan sekolah.',
      'Dokumentasikan hasilnya.',
      'Kelompokkan mana yang merupakan garis sejajar dan mana yang merupakan garis transversal.',
    ],
    guidingQuestions: [
      '1. Jika kamu memiliki dua batang kayu yang sejajar, lalu meletakkan satu batang diagonal di atasnya, hubungan apa yang terbentuk di antara titik-titik persambungannya?',
      '2. Apa yang terjadi pada besar sudut-sudut jika kamu mengubah kemiringan (gradien) dari batang transversal tersebut? Apakah besar sudut akan ikut berubah?',
      '3. Lihat kembali foto bangunan yang kamu potret. Mana sambungan baut yang posisinya menghadap ke arah yang sama? Kenapa kamu yakin jika itu disebut sudut sehadap?',
      '4. Cari sambungan yang saling membelakangi (bertolak belakang). Bayangkan jika baut di satu sisi lepas karena beban terlalu berat, menurutmu apakah sisi di seberangnya akan ikut goyang atau tetap aman? Berikan alasanmu ya!',
      '5. Sebelum Pak Tukang mulai memasang baut di kayu yang asli, bagaimana cara kamu membuktikan jika sudut di sambungan bawah dan atas itu besarnya sudah benar-benar sama? Alat apa yang kamu pakai?',
    ],
    guidingResources: [
      {
        type: 'youtube',
        url: 'https://youtu.be/_vmaVr4QKYE?si=3LzcqVlKrZUt3bWX',
        label: 'Video 1',
      }
    ],
    solutions: [
      '1. Sebagai arsitek, menurutmu apa hubungannya antara sudut yang besarnya sama dengan beban atap yang terbagi rata?',
      '2. Apa yang akan terjadi apabila besar sudutnya berbeda?',
      '3. Apakah atapnya rawan runtuh?',
      '4. Gambarkan rancangan atapmu secara rapi!',
      '5. Berikan label nama sudut agar para tukang bangunan tidak bingung ketika ingin memasang atap!',
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
      '1. Pernahkah kalian memperhatikan bentuk rangka atap rumah? Menurut kalian, mengapa bentuknya tidak sembarang, tetapi memiliki sudut tertentu?',
      '2. Jika dua balok atap dibuat sejajar dan dipotong oleh satu balok miring, apakah sudut-sudut yang terbentuk memiliki hubungan? Mengapa demikian?',
      '3. Bagaimana cara menentukan besar suatu sudut pada rangka atap tanpa harus mengukurnya langsung?',
      '4. Menurut kalian, apa yang akan terjadi jika sudut pada rangka atap tidak tepat atau tidak sesuai perhitungan?',
      '5. Apakah hubungan antar sudut ini hanya berlaku pada atap rumah, atau juga bisa ditemukan pada situasi lain di sekitar kita?',
    ],
    theChallenge: {
      deskripsi:
        'Seorang tukang sedang merancang rangka atap rumah. Ia memasang dua balok kayu yang sejajar sebagai penopang utama, lalu menambahkan satu balok miring untuk memperkuat atap. Ia menyadari bahwa sudut-sudut yang terbentuk sangat penting agar atap kuat. Tukang tersebut hanya mengetahui satu sudut sebesar 50°, sementara sudut-sudut lainnya belum diketahui.',
      poin: [
        'Bagaimana cara kalian menentukan besar sudut-sudut lainnya tanpa mengukur langsung?',
      ],
    },
    guidingActivities: [
      'Akses dan kerjakan lembar aktivitas digital melalui tautan Canva berikut: https://drive.google.com/file/d/1aGR-yVDdicqrSFrJzSu4_9BNfYEDNVL8/view?usp=sharing',
      'Amati gambar rangka atap yang tersedia dan identifikasi garis-garis yang ada.',
      'Tandai sudut-sudut yang terbentuk dan tentukan hubungan antar sudut tersebut.',
    ],
    guidingQuestions: [
      '1. Garis mana yang sejajar dan garis mana yang menjadi transversal (pemotong)?',
      '2. Tunjukkan sudut mana saja yang besarnya sama (sudut sehadap)?',
      '3. Mana yang disebut sudut dalam berseberangan dan luar berseberangan?',
      '4. Apa yang bisa disimpulkan tentang besar sudut yang bertolak belakang?',
      '5. Berapa jumlah sudut yang berada pada satu garis lurus?',
    ],
    guidingResources: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=9xr-8CViKrg',
        label: 'Video: Hubungan Antar Sudut pada Garis Sejajar',
      },
    ],
    solutions: [
      '1. Kumpulkan hasil pengerjaan The Challenge dan presentasikan di depan kelas.',
      '2. Jelaskan langkah-langkah cara menentukan besar setiap sudut berdasarkan hubungan yang ditemukan.',
      '3. Buktikan hubungan antar sudut menggunakan sifat-sifat yang telah dipelajari.',
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
      '1. Bagaimana cara mengetahui tinggi pohon tanpa mengukurnya secara langsung?',
      '2. Mengapa bayangan bisa digunakan untuk membantu pengukuran?',
      '3. Bagaimana hubungan antara tinggi benda dan panjang bayangannya?',
      '4. Mengapa pengukuran harus dilakukan pada waktu yang sama?',
    ],
    theChallenge: {
      deskripsi:
        '1. Tentukan tinggi pohon di lingkungan sekolah dengan memanfaatkan penggaris 30 cm dan bayangan yang terbentuk oleh sinar matahari.',
      poin: [
        '2. Gunakan benda pembanding (tongkat/teman), ukur tinggi dan bayangannya pada waktu yang sama.',
        '3. Lalu gunakan perbandingan untuk menghitung tinggi pohon.',
        '4. Catat semua data pengukuran secara teliti dan sistematis.',
      ],
    },
    guidingActivities: [
      '1. Observasi langsung di sekolah, mencari pohon yang cukup tinggi sebagai objek pengukuran.',
      '2. Pilih benda pembanding yang mudah diukur tingginya (tongkat, teman sekelas).',
      '3. Ukur tinggi benda pembanding dan panjang bayangannya pada saat yang bersamaan.',
      '4. Ukur panjang bayangan pohon pada saat yang sama.',
      '5. Buat sketsa segitiga yang menggambarkan situasi pengukuran.',
    ],
    guidingQuestions: [
      '1. Seperti apa bentuk segitiga yang terbentuk oleh pohon dan bayangannya?',
      '2. Mengapa segitiga tersebut dikatakan sebangun?',
      '3. Berapa perbandingan antara tinggi benda pembanding dan panjang bayangannya?',
      '4. Apa yang terjadi jika pengukuran dilakukan pada waktu yang berbeda?',
    ],
    guidingResources: [
      {
        type: 'youtube',
        url: 'https://youtu.be/ZKcXE9LQkNo?si=-bVsseoB-DnVEtPi',
        label: 'Video: Kesebangunan Segitiga',
      },
    ],
    solutions: [
      '1. Jelaskan bagaimana bayangan digunakan untuk mengukur tinggi pohon secara tidak langsung.',
      '2. Tunjukkan perhitungan perbandingan tinggi pohon menggunakan rumus kesebangunan.',
      '3. Analisis konsep kesebangunan segitiga yang diterapkan dalam kegiatan ini.',
      '4. Buat laporan sederhana berisi data pengukuran, perhitungan, dan kesimpulan.',
    ],
  },
]

// ─── Helper: Cari data materi berdasarkan ID ───────────────────────────────────
export function getMateriById(id: number): MateriPertemuan | undefined {
  return MATERI_DATA.find((m) => m.id === id)
}
