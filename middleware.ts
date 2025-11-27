/**
 * Next.js Middleware
 * Protects /admin routes - requires authentication
 * Public routes (/,  /articles, etc.) remain accessible
 */
import { auth } from '@/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isOnAdmin = nextUrl.pathname.startsWith('/admin');

  // Protect admin routes
  if (isOnAdmin && !isLoggedIn) {
    return Response.redirect(new URL('/auth/signin', nextUrl));
  }

  return undefined; // Allow request to proceed
});

// Only run middleware on admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
