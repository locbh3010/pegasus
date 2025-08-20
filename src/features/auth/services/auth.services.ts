import { supabase } from '@/lib/supabase/client'
import { Provider } from '@supabase/supabase-js'
import { RegisterCredentials } from '../types'

export const authServices = {
  register: async (credentials: RegisterCredentials) =>
    await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { username: credentials.username, full_name: credentials.username },
      },
    }),

  login: async (email: string, password: string) =>
    await supabase.auth.signInWithPassword({ email, password }),

  logout: async () => await supabase.auth.signOut(),

  loginOAuth: async (provider: Provider) =>
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    }),
}
