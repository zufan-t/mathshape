/**
 * config/db.ts — Koneksi ke Supabase
 * Gunakan @supabase/supabase-js di backend dengan service role key.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('[db] SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diisi di .env')
}

/** Client Supabase dengan hak akses penuh (service role). */
export const supabase = createClient(supabaseUrl, supabaseServiceKey)
