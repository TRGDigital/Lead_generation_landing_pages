import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = ((request.headers.get('host') || '').toLowerCase().split(':')[0]) || ''

  // ── CareAssura location subdomains: <area>.careassura.com -> /lp/<area> ──
  if (host === 'careassura.com' || host.endsWith('.careassura.com')) {
    const sub = host.replace(/\.?careassura\.com$/, '')
    if (!sub || sub === 'www') {
      return NextResponse.redirect('https://careassura.co.uk')
    }
    // Only rewrite the landing root; let /api, /_next and assets pass through.
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone()
      url.pathname = `/lp/${sub}`
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/portal')) {
    return NextResponse.next()
  }

  // Supabase stores auth tokens in a cookie named sb-<ref>-auth-token
  const hasSession = request.cookies.getAll().some((c) => c.name.includes('-auth-token'))

  if (!hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/sign-in'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
