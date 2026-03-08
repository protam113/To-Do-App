import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip API routes - để rewrites xử lý
  if (path.startsWith('/api')) {
    return NextResponse.next();
  }

  const isAuthenticatedCookie = request.cookies.get('isAuthenticated')?.value;
  const isAuthenticated = isAuthenticatedCookie === 'true';

  const guestOnlyPages = ['/sign-in'];

  const publicPages = ['/evidence'];
  const isPublicPage =
    publicPages.includes(path) || path.startsWith('/evidence/');

  const isGuestOnlyPage = guestOnlyPages.includes(path);

  if (isAuthenticated && isGuestOnlyPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuthenticated && !isPublicPage && !isGuestOnlyPage) {
    return NextResponse.redirect(
      new URL(`/sign-in?from=${encodeURIComponent(path)}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api (API routes - handled by rewrites)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, fonts (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)).*)',
  ],
};
