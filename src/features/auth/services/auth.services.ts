import { supabaseService } from '@/lib/supabase/service'
import { Provider } from '@supabase/supabase-js'
import { RegisterCredentials, UserInsert } from '../types'

export const authServices = {
  insert: async (user: UserInsert) => {
    const result = await supabaseService.from('users').insert(user).select('*').single()

    if (result?.error) {
      throw new Error(result.error.message)
    }

    return result.data
  },

  register: async (credentials: RegisterCredentials) => {
    const result = await supabaseService.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { username: credentials.username, full_name: credentials.username },
      },
    })

    if (result?.error || !result.data?.user) {
      throw new Error(result.error?.message || 'Failed to register user')
    }

    const user = await authServices.insert({
      id: result.data.user.id,
      email: result.data.user.email!,
      full_name: result.data.user.user_metadata.full_name,
    })

    return user
  },

  login: async (email: string, password: string) =>
    await supabaseService.auth.signInWithPassword({ email, password }),

  logout: async () => await supabaseService.auth.signOut(),

  loginOAuth: async (provider: Provider) => {
    const result = await supabaseService.auth.signInWithOAuth({ provider })

    if (result.error) {
      throw new Error(result.error.message)
    }

    return result.data
  },
}
