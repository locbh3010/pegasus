'use client'

import { supabase } from '@/lib/supabase/client'
import { User } from '@/types'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_, session) => {
      try {
        if (session?.access_token) {
          const response = await supabase.auth.getUser()

          if (response?.error) throw response.error

          setUser(response.data.user as unknown as User)
        } else setUser(null)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  const value = {
    user,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
