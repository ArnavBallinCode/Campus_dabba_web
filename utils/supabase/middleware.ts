import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicRoutes = ['/', '/auth/login', '/auth/register', '/browse','/cook/register','/student/register','/search',"/cart"]

function isPublicRoute(path: string) {
  // Check exact matches first
  if (publicRoutes.includes(path)) return true
  
  // Check if path starts with /cooks/
  if (path.startsWith('/cooks/')) return true
  
  return false
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Check if the route requires authentication
  

  if (!session && !isPublicRoute) {
    // Redirect to login if accessing protected route without session
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}