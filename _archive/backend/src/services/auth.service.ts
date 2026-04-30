/** services/auth.service.ts — Logika bisnis autentikasi */
import { supabase } from '../config/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class AuthService {
  async register({ fullName, email, password }: { fullName: string; email: string; password: string }) {
    // Cek apakah email sudah terdaftar
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single()
    if (existing) throw new Error('Email sudah terdaftar.')

    const hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
      .from('users')
      .insert({ full_name: fullName, email, password_hash: hash })
      .select('id, email, full_name')
      .single()

    if (error) throw new Error(error.message)
    return { user: data }
  }

  async login({ email, password }: { email: string; password: string }) {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, password_hash')
      .eq('email', email)
      .single()

    if (error || !user) throw new Error('Email atau kata sandi salah.')

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) throw new Error('Email atau kata sandi salah.')

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET ?? '', {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    } as jwt.SignOptions)

    return { token, user: { id: user.id, email: user.email, fullName: user.full_name } }
  }

  async forgotPassword(email: string) {
    // TODO: buat token reset, simpan ke tabel password_resets, kirim email
    // Sementara ini gunakan Supabase built-in:
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    })
    if (error) throw new Error(error.message)
  }

  async resetPassword({ token, password }: { token: string; password: string }) {
    // TODO: verifikasi token dari tabel password_resets, update password_hash
    const hash = await bcrypt.hash(password, 10)
    // Contoh menggunakan Supabase user management:
    const { error } = await supabase.auth.admin.updateUserById(token, { password: hash })
    if (error) throw new Error(error.message)
  }
}
