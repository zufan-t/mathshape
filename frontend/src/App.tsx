import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import MaterialLayout from '@/components/layout/MaterialLayout'
import TeacherLayout from '@/components/layout/TeacherLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import HomePage from '@/pages/home/HomePage'
import AboutPage from '@/pages/about/AboutPage'
import MaterialListPage from '@/pages/materials/MaterialListPage'
import MaterialContentPage from '@/pages/materials/MaterialContentPage'
import GuidePage from '@/pages/guide/GuidePage'
import FAQPage from '@/pages/faq/FAQPage'
import AccountPage from '@/pages/account/AccountPage'
import ApresiasiPage from '@/pages/apresiasi/ApresiasiPage'
import TeacherDashboardPage from '@/pages/teacher/TeacherDashboardPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import EmailSentPage from '@/pages/auth/EmailSentPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import PasswordChangedPage from '@/pages/auth/PasswordChangedPage'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { MaterialNavProvider } from '@/features/materials/MaterialNavContext'
import ScrollToTop from '@/components/layout/ScrollToTop'
import { ROUTES } from '@/lib/constants'

function App() {
  return (
    <MaterialNavProvider>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.MATERIALS} element={<MaterialListPage />} />
            <Route path={ROUTES.GUIDE} element={<GuidePage />} />
            <Route path={ROUTES.FAQ} element={<FAQPage />} />
            <Route path={ROUTES.ACCOUNT} element={<AccountPage />} />
          </Route>

          {/* Teacher dashboard — uses TeacherLayout with custom header, no footer */}
          <Route element={<TeacherLayout />}>
            <Route path={ROUTES.TEACHER_DASHBOARD} element={<TeacherDashboardPage />} />
          </Route>

          {/* Material content — pakai MaterialLayout agar navbar tampilkan judul */}
          <Route element={<MaterialLayout />}>
            <Route path={ROUTES.MATERIAL_CONTENT} element={<MaterialContentPage />} />
            <Route path={ROUTES.APRESIASI} element={<ApresiasiPage />} />
          </Route>

          {/* Auth routes — Header login-page (varian 7/8/9) + Footer */}
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.TEACHER_LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.TEACHER_REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.EMAIL_SENT} element={<EmailSentPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route path={ROUTES.PASSWORD_CHANGED} element={<PasswordChangedPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </MaterialNavProvider>
  )
}

export default App
