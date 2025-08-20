import { createSsr } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage() {
  const server = await createSsr()

  const { data, error } = await server.auth.getSession()

  if (error) {
    return redirect('/auth/signin?error=callback_error')
  }

  if (data.session) {
    return redirect('/dashboard')
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="border-primary border-t-primary/20 mx-auto h-8 w-8 animate-spin rounded-full border-4" />
        <h2 className="text-foreground text-xl font-semibold">Processing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  )
}
