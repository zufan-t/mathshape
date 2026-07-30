/** App-wide constants */

export const APP_NAME = 'Mathshape'
export const APP_DESCRIPTION = 'Website Pembelajaran Matematika SMP Kelas 8'

/** Route paths */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/tentang',
  MATERIALS: '/materi',
  MATERIAL_CONTENT: '/materi/:id',
  GUIDE: '/petunjuk',
  FAQ: '/faq',
  ACCOUNT: '/akun',
  APRESIASI: '/apresiasi',
  LOGIN: '/masuk',
  REGISTER: '/daftar',
  FORGOT_PASSWORD: '/lupa-password',
  EMAIL_SENT: '/email-terkirim',
  RESET_PASSWORD: '/reset-password',
  PASSWORD_CHANGED: '/password-berhasil',
  TEACHER_DASHBOARD: '/guru/dasbor',
  TEACHER_ACCOUNT: '/guru/akun',
  TEACHER_LOGIN: '/guru/masuk',
  TEACHER_REGISTER: '/guru/daftar',
} as const

/** Navigation links for header */
export const NAV_LINKS = [
  { label: 'Beranda', path: ROUTES.HOME },
  { label: 'Tentang Kami', path: ROUTES.ABOUT },
  { label: 'Materi', path: ROUTES.MATERIALS },
  { label: 'Panduan', path: ROUTES.GUIDE },
  { label: 'FAQ', path: ROUTES.FAQ },
] as const

/** Breakpoints matching Tailwind defaults */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const

/** Material/meeting count */
export const TOTAL_MATERIALS = 3
