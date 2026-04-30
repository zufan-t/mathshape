import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop
 * Setiap kali route berubah, scroll window ke posisi paling atas (0, 0).
 * Harus dirender di dalam <BrowserRouter> agar useLocation berfungsi.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
