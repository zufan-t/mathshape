/**
 * authValidation.ts
 * ─────────────────────────────────────────────────────────────
 * Kumpulan fungsi validasi dan normalisasi error untuk sistem auth.
 *
 * PRINSIP KEAMANAN yang diterapkan:
 *  1. Validasi ketat di sisi klien SEBELUM hit API (hemat request)
 *  2. Anti-enumeration: semua error login → satu pesan generik
 *  3. Forgot password: selalu tampilkan pesan sukses (tidak bocorkan keberadaan akun)
 */

// ─── 1. Email Validation ──────────────────────────────────────────────────────

/**
 * Regex email yang ketat:
 * - Local part: huruf, angka, dan karakter ._%+-
 * - @ wajib ada satu
 * - Domain: huruf, angka, titik, dan tanda hubung
 * - TLD: minimal 2 karakter huruf
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export interface ValidationResult {
  valid: boolean
  message?: string
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim()
  if (!trimmed) return { valid: false, message: 'Email wajib diisi.' }
  if (trimmed.length > 254) return { valid: false, message: 'Email terlalu panjang.' }
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, message: 'Format email tidak valid. Contoh: nama@email.com' }
  return { valid: true }
}

// ─── 2. Password Validation ───────────────────────────────────────────────────

export type PasswordStrength = 'weak' | 'medium' | 'strong'

export interface PasswordValidationResult extends ValidationResult {
  strength?: PasswordStrength
  strengthLabel?: string
  strengthColor?: string
  strengthPercent?: number
}

export function validatePassword(password: string): PasswordValidationResult {
  if (!password) return { valid: false, message: 'Kata sandi wajib diisi.' }
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Kata sandi minimal 8 karakter.',
      strength: 'weak',
      strengthLabel: 'Lemah',
      strengthColor: '#EF4444',
      strengthPercent: 20,
    }
  }

  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber    = /[0-9]/.test(password)
  const hasSpecial   = /[^a-zA-Z0-9]/.test(password)
  const isLong       = password.length >= 12

  if (!hasLowercase && !hasUppercase) {
    return { valid: false, message: 'Kata sandi harus mengandung minimal satu huruf.' }
  }
  if (!hasNumber) {
    return { valid: false, message: 'Kata sandi harus mengandung minimal satu angka.' }
  }

  // Scoring
  const score = [hasLowercase, hasUppercase, hasNumber, hasSpecial, isLong].filter(Boolean).length

  if (score <= 2) {
    return { valid: true, strength: 'weak',   strengthLabel: 'Lemah',   strengthColor: '#EF4444', strengthPercent: 33 }
  } else if (score <= 3) {
    return { valid: true, strength: 'medium', strengthLabel: 'Sedang',  strengthColor: '#F59E0B', strengthPercent: 66 }
  } else {
    return { valid: true, strength: 'strong', strengthLabel: 'Kuat',    strengthColor: '#22C55E', strengthPercent: 100 }
  }
}

// ─── 3. Anti-Enumeration Error Normalizer ────────────────────────────────────

/**
 * Marker khusus yang dikembalikan saat email belum diverifikasi.
 * Komponen Login harus handle kasus ini secara terpisah dengan pesan yang informatif.
 */
export const EMAIL_NOT_VERIFIED_MARKER = '__EMAIL_NOT_VERIFIED__'

/**
 * Normalisasi semua error login menjadi satu dari dua kemungkinan:
 *  - EMAIL_NOT_VERIFIED_MARKER  → email ada tapi belum dikonfirmasi
 *  - Pesan generik              → email salah ATAU password salah (tidak dibedakan)
 *
 * Ini mencegah penyerang menebak apakah suatu email terdaftar atau tidak.
 */
export function normalizeLoginError(errorMessage: string): string {
  const lower = errorMessage.toLowerCase()

  if (
    lower.includes('email not confirmed') ||
    lower.includes('email_not_confirmed') ||
    lower.includes('not confirmed')
  ) {
    return EMAIL_NOT_VERIFIED_MARKER
  }

  // Semua error credential lain → pesan sama (anti-enumeration)
  return 'Email atau kata sandi salah.'
}

// ─── 4. Forgot Password — Anti-Enumeration ───────────────────────────────────

/**
 * Forgot password selalu sukses dari perspektif user.
 * Fungsi ini mengembalikan true agar komponen selalu navigate ke halaman "email terkirim"
 * meskipun email tidak ditemukan di database.
 */
export function shouldShowForgotPasswordSuccess(): boolean {
  return true // Selalu true — tidak bocorkan apakah email terdaftar
}

// ─── 5. Email Verified Checker ────────────────────────────────────────────────

/**
 * Cek apakah user sudah memverifikasi email mereka.
 * Supabase menyimpan ini di field `email_confirmed_at`.
 */
export function isEmailVerified(user: { email_confirmed_at?: string | null } | null): boolean {
  if (!user) return false
  return !!user.email_confirmed_at
}
