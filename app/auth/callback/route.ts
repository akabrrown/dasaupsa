import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as any
  const next = searchParams.get('next') ?? '/admin/dashboard'
  
  // Also check for error parameters from Supabase
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  console.log('--- Auth Callback Started ---')
  console.log('Params:', { code: !!code, token_hash: !!token_hash, type, next, error, error_description })

  if (error) {
    console.error('Supabase Auth Error:', error, error_description)
    return NextResponse.redirect(`${origin}/admin/login?error=${encodeURIComponent(error_description || error)}`)
  }

  const supabase = await createClient()

  if (code) {
    console.log('Exchanging code for session...')
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      console.log('Exchange successful!')
      // If next is set to reset-password, or it's an invite/signup type, go to reset-password
      const isPasswordSetFlow = next.includes('reset-password') || type === 'invite' || type === 'signup' || type === 'recovery'
      
      const targetUrl = isPasswordSetFlow ? `${origin}/admin/reset-password` : `${origin}${next}`
      console.log('Redirecting to:', targetUrl)
      return NextResponse.redirect(targetUrl)
    } else {
      console.error('Exchange error:', exchangeError)
      return NextResponse.redirect(`${origin}/admin/login?error=${encodeURIComponent(exchangeError.message)}`)
    }
  } else if (token_hash && type) {
    console.log('Verifying OTP with token_hash...')
    const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash, type })
    
    if (!verifyError) {
      console.log('Verification successful!')
      const isPasswordSetFlow = next.includes('reset-password') || type === 'invite' || type === 'signup' || type === 'recovery'
      
      const targetUrl = isPasswordSetFlow ? `${origin}/admin/reset-password` : `${origin}${next}`
      console.log('Redirecting to:', targetUrl)
      return NextResponse.redirect(targetUrl)
    } else {
      console.error('Verification error:', verifyError)
      return NextResponse.redirect(`${origin}/admin/login?error=${encodeURIComponent(verifyError.message)}`)
    }
  }

  console.warn('No code or token_hash found in callback')
  return NextResponse.redirect(`${origin}/admin/login?error=Invalid session link`)
}
