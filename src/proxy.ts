import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/admin', '/create-profile', '/edit-profile'];

// Routes that require admin/superAdmin role
const adminRoutes = ['/admin'];

// Public routes that don't require authentication
const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/registration'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Check if it's an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !token) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is authenticated but trying to access admin routes without proper role
  if (isAdminRoute && token) {
    const userRole = token.role as string;
    if (userRole !== 'admin' && userRole !== 'superAdmin') {
      // Redirect non-admin users to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If authenticated user tries to access login/signup pages, redirect to dashboard
  if (isPublicRoute && token) {
    const userRole = token.role as string;
    if (userRole === 'admin' || userRole === 'superAdmin') {
      return NextResponse.redirect(new URL('/admin/overview', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
  ]
};
