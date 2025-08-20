import AuthLayout from '@/features/layouts/components/AuthLayout'
import { createSsr } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function layout({ children }: { children: React.ReactNode }) {
  // const server = await createSsr()

  // const { data } = await server.auth.getUser()

  // if (data?.user) return redirect('/dashboard')

  return <AuthLayout>{children}</AuthLayout>
}
