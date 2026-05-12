// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
const isPublicOnlyRoute = createRouteMatcher(['/'])

export default clerkMiddleware(async (auth, req) => {
  // Protect /dashboard — redirects unauthenticated users to sign-in automatically
  if (isProtectedRoute(req)) await auth.protect()

  // Redirect authenticated users away from / to /dashboard
  const { userId } = await auth()
  if (userId && isPublicOnlyRoute(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}