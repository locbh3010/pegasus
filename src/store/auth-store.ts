import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { AuthUser } from '@/features/auth/types'

interface AuthState {
  // State
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  lastLoginTime: number | null
  sessionExpiry: number | null

  // Actions
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  setSessionExpiry: (expiry: number | null) => void
  login: (user: AuthUser) => void
  logout: () => void
  updateUser: (updates: Partial<AuthUser>) => void
  isSessionValid: () => boolean
  clearAuthData: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        lastLoginTime: null,
        sessionExpiry: null,

        // Actions
        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
            },
            false,
            'auth/setUser'
          ),

        setLoading: (loading) =>
          set(
            { isLoading: loading },
            false,
            'auth/setLoading'
          ),

        setSessionExpiry: (expiry) =>
          set(
            { sessionExpiry: expiry },
            false,
            'auth/setSessionExpiry'
          ),

        login: (user) =>
          set(
            {
              user,
              isAuthenticated: true,
              isLoading: false,
              lastLoginTime: Date.now(),
              sessionExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            },
            false,
            'auth/login'
          ),

        logout: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
              isLoading: false,
              lastLoginTime: null,
              sessionExpiry: null,
            },
            false,
            'auth/logout'
          ),

        updateUser: (updates) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...updates } : null,
            }),
            false,
            'auth/updateUser'
          ),

        isSessionValid: () => {
          const { sessionExpiry } = get()
          return sessionExpiry ? Date.now() < sessionExpiry : false
        },

        clearAuthData: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
              isLoading: false,
              lastLoginTime: null,
              sessionExpiry: null,
            },
            false,
            'auth/clearAuthData'
          ),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          lastLoginTime: state.lastLoginTime,
          sessionExpiry: state.sessionExpiry,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)
