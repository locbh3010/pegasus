import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthUser } from '@/features/auth/types'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // TODO: Replace with actual authentication logic
        // This is a placeholder implementation
        try {
          // Here you would typically:
          // 1. Validate credentials against your database
          // 2. Hash and compare passwords
          // 3. Return user data if valid

          // For now, we'll use a simple mock
          if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
            return {
              id: '1',
              email: credentials.email,
              name: 'Demo User',
              image: null,
            } as NextAuthUser
          }

          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/', // We'll handle auth via modals, not separate pages
    error: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const user = session.user as {
          id?: string
          name?: string | null
          email?: string | null
          image?: string | null
        }
        user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
}
