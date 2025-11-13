/**
 * Next.js Middleware - Runs on every request before the page loads
 *
 * This middleware:
 * - Refreshes Supabase auth sessions automatically
 * - Protects routes by redirecting unauthenticated users to /login
 * - Allows public access to /login, /signup, /invite, and / routes
 */
import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
