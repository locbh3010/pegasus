'use server'

import { createSsr } from '@/lib/supabase/server'
import { Provider } from '@supabase/supabase-js'
import { RegisterCredentials } from './types'

export const login = async (email: string, password: string) => {
  const server = await createSsr()

  return await server.auth.signInWithPassword({ email, password })
}

export const logout = async () => {
  const server = await createSsr()

  return await server.auth.signOut()
}

export const loginOAuth = async (provider: Provider) => {
  const server = await createSsr()

  return await server.auth.signInWithOAuth({ provider })
}

export const register = async (credentials: RegisterCredentials) => {
  const server = await createSsr()

  return await server.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: { username: credentials.username, full_name: credentials.username },
    },
  })
}

export const getUser = async () => {
  const server = await createSsr()

  return await server.auth.getUser()
}
