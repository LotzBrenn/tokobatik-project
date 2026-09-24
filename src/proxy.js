import { NextResponse } from 'next/server';
import { verifySession } from '@/library/session';

export async function proxy(request) {
  const path = request.nextUrl.pathname;

  // Proteksi semua route /admin
  if (path.startsWith('/admin')) {
    const session = await verifySession();

    // Jika tidak ada session atau bukan admin, redirect ke login
    if (!session.isAuth || session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Jika sudah login dan mengakses /login, redirect ke admin dashboard
  if (path === '/login') {
    const session = await verifySession();
    if (session.isAuth && session.user?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
