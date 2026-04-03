import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// CSP directives — single source of truth
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live",
  "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://res.cloudinary.com https://dpbdoikeyikqhojgctks.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://vercel.com https://vercel.live",
  "font-src 'self' data: https://fonts.gstatic.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "connect-src 'self' https://dpbdoikeyikqhojgctks.supabase.co wss://dpbdoikeyikqhojgctks.supabase.co https://api.cloudinary.com https://res.cloudinary.com https://www.google-analytics.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://vercel.live https://vitals.vercel-insights.com ws://localhost:3000 wss://localhost:3000",
  "frame-src 'self' https://www.youtube.com https://vercel.live",
].join('; ');

/** Apply all security headers to a response */
function setSecurityHeaders(response: NextResponse) {
  response.headers.set('Content-Security-Policy', cspDirectives)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - essential for avoiding "Invalid Refresh Token" errors
  await supabase.auth.getUser()

  // Always apply security headers AFTER the response object is finalized
  setSecurityHeaders(response)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

