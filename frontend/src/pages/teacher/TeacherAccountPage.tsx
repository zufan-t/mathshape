import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UserCircle, Eye, EyeClosed, SignOut, CircleNotch, CheckCircle, Warning, PencilSimple, ArrowLeft } from '@phosphor-icons/react'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth/AuthContext'

export default function TeacherAccountPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName]         = useState('')
  const [initName, setInitName]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword]   = useState('')
  const [isEditing, setIsEditing]       = useState(false)

  const [saving, setSaving]             = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [successMsg, setSuccessMsg]     = useState<string | null>(null)
  const [errorMsg, setErrorMsg]         = useState<string | null>(null)

  // Auth Guard
  useEffect(() => {
    if (!authLoading && user === null) {
      navigate(ROUTES.TEACHER_LOGIN, { replace: true })
    }
  }, [user, authLoading, navigate])

  // Fetch profile
  useEffect(() => {
    if (!user) return

    async function fetchProfile() {
      setLoadingProfile(true)
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user!.id)
        .single()

      if (data?.full_name) {
        setFullName(data.full_name)
        setInitName(data.full_name)
      } else if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name)
        setInitName(user.user_metadata.full_name)
      }
      setLoadingProfile(false)
    }

    fetchProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        full_name: fullName.trim(),
        email: user.email || '',
        role: 'teacher'
      })

    if (profileError) {
      setErrorMsg('Gagal menyimpan nama. Silakan coba lagi.')
      setSaving(false)
      return
    }

    // Update password if provided
    if (newPassword.trim().length > 0) {
      if (newPassword.length < 8) {
        setErrorMsg('Kata sandi baru minimal 8 karakter.')
        setSaving(false)
        return
      }
      const { error: passError } = await supabase.auth.updateUser({ password: newPassword })
      if (passError) {
        setErrorMsg('Gagal memperbarui kata sandi. Silakan coba lagi.')
        setSaving(false)
        return
      }
    }

    setInitName(fullName.trim())
    setNewPassword('')
    setSuccessMsg('Perubahan berhasil disimpan.')
    setSaving(false)
    setIsEditing(false)

    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const handleBatal = () => {
    setFullName(initName)
    setNewPassword('')
    setErrorMsg(null)
    setSuccessMsg(null)
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await signOut()
    navigate(ROUTES.TEACHER_LOGIN)
  }

  if (authLoading || loadingProfile) {
    return (
      <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircleNotch className="animate-spin" size={40} color="#007BFF" />
      </div>
    )
  }

  if (!user) return null

  const inputStyle = (editable: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: editable ? '1.5px solid #007BFF' : 'none',
    backgroundColor: editable ? 'var(--color-card-bg)' : 'var(--color-neutral-light)',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    color: 'var(--color-text)',
    outline: 'none',
    width: '100%',
    transition: 'border 200ms, background 200ms',
    cursor: editable ? 'text' : 'default',
  })

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    color: 'var(--color-text)',
    whiteSpace: 'nowrap',
    minWidth: '120px',
  }

  const displayName = fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || '–'
  const displayEmail = user.email || '–'

  return (
    <main style={{ backgroundColor: 'var(--color-background)', minHeight: 'calc(100svh - 130px)', paddingBottom: '64px' }}>
      <div className="section-container" style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Navigation back to Teacher Dashboard */}
        <div style={{ maxWidth: '560px', margin: '0 auto', width: '100%' }}>
          <Link
            to={ROUTES.TEACHER_DASHBOARD}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 600,
              color: '#007BFF',
              textDecoration: 'none',
              transition: 'opacity 200ms',
            }}
          >
            <ArrowLeft size={18} weight="bold" />
            Kembali ke Dasbor Guru
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '24px', maxWidth: '560px', margin: '0 auto', width: '100%',
            backgroundColor: 'var(--color-card-bg)',
            borderRadius: '24px',
            border: '1.5px solid var(--color-border)',
            padding: '36px 28px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#007BFF',
              backgroundColor: 'var(--color-primary-light)',
              padding: '4px 12px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Akun Guru
            </span>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700,
              color: 'var(--color-text)', margin: 0, textAlign: 'center',
            }}>
              Data Diri Guru
            </h1>
          </div>

          {/* Avatar */}
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            backgroundColor: '#007BFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0, 123, 255, 0.2)'
          }}>
            <UserCircle size={72} color="#ffffff" weight="fill" />
          </div>

          {/* Success / Error Banner */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px', display: 'flex',
                  alignItems: 'center', gap: 8,
                  backgroundColor: '#DCFCE7', border: '1px solid #86EFAC',
                }}
              >
                <CheckCircle size={18} color="#16A34A" weight="fill" />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#15803D' }}>{successMsg}</span>
              </motion.div>
            )}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px', display: 'flex',
                  alignItems: 'center', gap: 8,
                  backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5',
                }}
              >
                <Warning size={18} color="#DC2626" weight="fill" />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#DC2626' }}>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>

            {/* Nama lengkap */}
            <div className="account-field-row">
              <label style={labelStyle}>Nama lengkap</label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  style={inputStyle(true)}
                  autoFocus
                />
              ) : (
                <div style={{
                  flex: 1, padding: '12px 16px', borderRadius: '12px',
                  backgroundColor: 'var(--color-input-bg)', fontFamily: 'var(--font-body)',
                  fontSize: '16px', color: 'var(--color-text)', border: '1px solid var(--color-border)'
                }}>
                  {displayName}
                </div>
              )}
            </div>

            {/* Email — read only */}
            <div className="account-field-row">
              <label style={labelStyle}>Email</label>
              <div style={{
                flex: 1, padding: '12px 16px', borderRadius: '12px',
                backgroundColor: 'var(--color-input-bg)', fontFamily: 'var(--font-body)',
                fontSize: '16px', color: 'var(--color-text)', opacity: 0.8, border: '1px solid var(--color-border)'
              }}>
                {displayEmail}
              </div>
            </div>

            {/* Kata sandi baru */}
            {isEditing && (
              <div className="account-field-row">
                <label style={labelStyle}>Kata sandi baru</label>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak ingin ubah"
                    style={{ ...inputStyle(true), paddingRight: '48px' }}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex',
                    }}
                    type="button"
                  >
                    {showPassword
                      ? <Eye size={20} color="var(--color-neutral)" />
                      : <EyeClosed size={20} color="var(--color-neutral)" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            {isEditing ? (
              <>
                <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
                  {saving
                    ? <><CircleNotch className="animate-spin" size={18} /> Menyimpan...</>
                    : 'Simpan perubahan'}
                </Button>
                <Button variant="neutral" size="lg" onClick={handleBatal} disabled={saving}>
                  Batal
                </Button>
              </>
            ) : (
              <Button variant="primary" size="lg" onClick={() => setIsEditing(true)}>
                <PencilSimple size={18} />
                Edit data diri
              </Button>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-border)' }} />

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '16px',
              color: '#EF4444', fontWeight: 600, padding: '4px 0',
              transition: 'opacity 200ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            <SignOut size={22} weight="bold" />
            Keluar dari akun guru
          </button>
        </motion.div>
      </div>

      <style>{`
        .account-field-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        @media (min-width: 480px) {
          .account-field-row {
            flex-direction: row;
            align-items: center;
          }
        }
      `}</style>
    </main>
  )
}
