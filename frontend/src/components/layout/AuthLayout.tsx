import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

/**
 * AuthLayout — digunakan untuk semua halaman auth (masuk, daftar, lupa-password, dll)
 * Navbar varian 7/8/9 (prompt.txt): "login-page" — ada nav links, TIDAK ada tombol Login/user icon
 * Footer tetap tampil di semua halaman
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main style={{ flex: 1, paddingTop: '110px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
