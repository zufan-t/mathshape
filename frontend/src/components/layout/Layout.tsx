import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/*
        pt-20 (80px) accounts for the fixed pill navbar:
        - top: 16px (navbar position from viewport top)
        - height: 60px desktop / 52px mobile
        = ~76px needed, use 80px for breathing room
      */}
      <main className="flex-1 pt-28 md:pt-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
