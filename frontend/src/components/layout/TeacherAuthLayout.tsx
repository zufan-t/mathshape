import { Outlet } from 'react-router-dom'
import TeacherHeader from './TeacherHeader'
import Footer from './Footer'

export default function TeacherAuthLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <TeacherHeader />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
