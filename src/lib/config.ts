/**
 * Konfigurasi koneksi ke server dan database.
 * Semua variabel dibaca dari environment variables (Vite: import.meta.env).
 *
 * Cara penggunaan:
 *   import { API_BASE_URL, SUPABASE_URL } from '@/lib/config'
 */

// ─── Supabase (Database & Auth) ───────────────────────────────────────────────

/** URL proyek Supabase. Contoh: https://abcxyz.supabase.co */
export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL ?? ''

/** Kunci anon publik Supabase (aman di sisi klien). */
export const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''


// ─── REST API Backend (Express/FastAPI/dll.) ──────────────────────────────────

/**
 * Base URL server backend.
 * Contoh development : http://localhost:3000
 * Contoh production  : https://api.mathlearn.id
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

/** Versi API yang digunakan (/v1, /v2, dst.) */
export const API_VERSION: string = import.meta.env.VITE_API_VERSION ?? 'v1'

/** URL lengkap beserta versi, siap dipakai di fetcher. */
export const API_URL: string = `${API_BASE_URL}/${API_VERSION}`


// ─── App Environment ──────────────────────────────────────────────────────────

/** 'development' | 'production' | 'staging' */
export const APP_ENV: string = import.meta.env.VITE_APP_ENV ?? 'development'

/** Aktifkan mode debug (log tambahan dll.). */
export const IS_DEBUG: boolean = APP_ENV !== 'production'


// ─── Utilitas fetcher sederhana ───────────────────────────────────────────────

/**
 * Wrapper fetch ke backend dengan base URL otomatis dan header JSON.
 *
 * Contoh:
 *   const user = await apiFetch<User>('/auth/login', {
 *     method: 'POST',
 *     body: JSON.stringify({ email, password }),
 *   })
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    credentials: 'include', // kirim cookie/token sesi secara otomatis
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message: string }).message)
  }

  return res.json() as Promise<T>
}
