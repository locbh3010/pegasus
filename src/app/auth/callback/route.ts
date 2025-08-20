import { createSsr } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
    const code = request.nextUrl.searchParams.get('code')
    if (!code) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    const ssr = await createSsr()
    const { error, data } = await ssr.auth.exchangeCodeForSession(code)
    if (error) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    if (data.session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.redirect(new URL('/', request.url))
}
