import DashboardLayout from '@/features/layouts/components/DashboardLayout'
import { createSsr } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function layout({ children }: React.PropsWithChildren) {
  // const server = await createSsr()

  // const { data, error } = await server.auth.getUser()

  // if (error || !data) return redirect('/auth/signin')

  return <DashboardLayout>{children}</DashboardLayout>
}
