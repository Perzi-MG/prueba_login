import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get('session');

    // Handle root path /
    if (pathname === '/') {
        if (session) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/login/student', request.url));
        }
    }

    // Prevent logged-in users from visiting /login
    if (pathname.startsWith('/login/student') && session) {
        return NextResponse.redirect(new URL('/loan-request', request.url));
    }

    if (pathname.startsWith('/login/admin') && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Prevent unauthenticated users from visiting /loan-request
    if (pathname.startsWith('/loan-request') && !session) {
        return NextResponse.redirect(new URL('/login/student', request.url));
    }

    // Prevent unauthenticated users from visiting /dashboard
    if (pathname.startsWith('/dashboard') && !session) {
        return NextResponse.redirect(new URL('/login/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login/:path*', '/dashboard/:path*', '/loan-request/:path*'],
};
