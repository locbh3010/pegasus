'use client'

import { supabase } from '@/lib/supabase/client'
import { useIsomorphicEffect } from '@mantine/hooks'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

interface AuthContextType {
    user: User | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['user'],
        queryFn: () => supabase.auth.getUser(),
        retry: false,
        refetchOnWindowFocus: false,
    })

    useIsomorphicEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event) => {
            refetch()
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user: data?.data?.user || null, loading: isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
