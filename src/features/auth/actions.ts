'use server'

import { createSsr } from '@/lib/supabase/server'
import { Provider } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { RegisterCredentials } from './types'

export const login = async (email: string, password: string) => {
    const server = await createSsr()

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/auth', 'layout')

    return await server.auth.signInWithPassword({ email, password })
}

export const logout = async () => {
    const server = await createSsr()

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/auth', 'layout')
    return await server.auth.signOut()
}

export const loginOAuth = async (provider: Provider) => {
    const origin = await headers().then((headers) => headers.get('origin'))
    const server = await createSsr()

    const { error, data } = await server.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${origin}/auth/callback` },
    })

    if (error) throw new Error(error.message)

    return redirect(data.url)
}

export const register = async (credentials: RegisterCredentials) => {
    const server = await createSsr()

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/auth', 'layout')

    return await server.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: { username: credentials.username, full_name: credentials.username },
        },
    })
}
