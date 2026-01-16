import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protected Routes Logic
  const protectedPaths = ['/dashboard', '/library', '/article', '/create', '/settings', '/faq']
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  // Auth Routes Logic (Login/Signup)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')

  // Landing Page Logic
  const isLandingPage = pathname === '/'

  // Redirect unauthenticated users away from protected routes to landing page
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect authenticated users away from auth routes or landing page to dashboard
  if (user && (isAuthRoute || isLandingPage)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/n8n (allow public access to webhooks if needed)
     * - .png, .jpg, .jpeg, .gif, .svg (images)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/n8n|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
