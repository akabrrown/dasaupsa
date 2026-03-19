import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function proxy(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Create a resilient client that won't crash if env vars are missing placeholders
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase_project_url')) {
    return res
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // Use getUser() as it is more secure than getSession() in a server-side context
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = req.nextUrl

  // Protected Admin Routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      console.log(`[Proxy] Unauthenticated access to ${pathname}, redirecting to /admin/login`)
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    console.log(`[Proxy] Authenticated access to ${pathname} as ${user.email}`)
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}



