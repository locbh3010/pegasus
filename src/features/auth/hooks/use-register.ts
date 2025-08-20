'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { register } from '../actions'
import { RegisterCredentials } from '../types'

export function useRegister() {
    const router = useRouter()

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: async (credentials: RegisterCredentials) => {
            const response = await register(credentials)
            if (response.error) {
                throw new Error(response.error.message)
            }
        },
        onSuccess: () => router.replace('/dashboard'),
        retry: false,
    })

    return {
        register: mutate,
        isLoading: isPending,
        isError,
        error,
    }
}
