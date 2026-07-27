import { Outlet } from 'react-router-dom'
import TeacherHeader from './TeacherHeader'

export default function TeacherLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <TeacherHeader />

      {/* ─── Main Content (No Footer) ─── */}
      <main className="flex-1 pt-36">
        <Outlet />
      </main>
    </div>
  )
}
