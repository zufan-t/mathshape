import { createClient } from '@supabase/supabase-js'

/**
 * Konfigurasi Supabase
 * Variabel ini diambil dari file .env di root folder.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validasi sederhana: pastikan URL dan Key sudah diisi dan bukan placeholder
const isConfigValid = 
  supabaseUrl && 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey && 
  supabaseAnonKey.length > 50

if (!isConfigValid && import.meta.env.DEV) {
  // Hanya tampil di development — tidak bocor ke production browser console
  console.warn(
    '[Supabase] URL atau Anon Key belum dikonfigurasi. ' +
    'Pastikan file .env sudah diisi dengan benar.'
  )
}

/**
 * Supabase Client Instance
 * Hanya diinisialisasi jika konfigurasinya valid untuk mencegah aplikasi hang.
 */
export const supabase = isConfigValid
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any
