import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener el token de autenticación de las cookies
  const token = request.cookies.get('sb-access-token')?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Si es una ruta pública y el usuario está autenticado, redirigir al dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si es una ruta privada y el usuario no está autenticado, redirigir al login
  if (!isPublicRoute && !token && pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};