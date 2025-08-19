import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(_request: NextRequest) {
  // Đơn giản hóa middleware - chỉ xử lý routing cơ bản
  // Authentication sẽ được xử lý hoàn toàn ở client-side

  // Cho phép tất cả requests đi qua
  // Authentication guards sẽ được xử lý trong components
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
