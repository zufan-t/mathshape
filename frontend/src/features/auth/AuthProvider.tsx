import React, { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthContext } from './AuthContext'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const syncProfile = async (currentUser: User | null) => {
      if (!currentUser || !supabase) return
      const fullName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User'
      const role = currentUser.user_metadata?.role || 'student'
      try {
        await supabase.from('profiles').upsert({
          id: currentUser.id,
          full_name: fullName,
          email: currentUser.email || '',
          role: role,
        }, { onConflict: 'id' })
      } catch (err) {
        console.warn('Profile sync error:', err)
      }
    }

    // 1. Ambil sesi saat ini
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session)
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setLoading(false)
      if (currentUser) syncProfile(currentUser)
    })

    // 2. Berlangganan perubahan status auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        setSession(session)
        const currentUser = session?.user ?? null
        setUser(currentUser)
        setLoading(false)
        if (currentUser) syncProfile(currentUser)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
