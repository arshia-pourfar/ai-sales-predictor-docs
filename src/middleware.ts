import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth-edge';

function getValidSession(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) return false;

    try {
        verifyToken(token);
        return true;
    } catch {
        return false;
    }
}

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isLoggedIn = getValidSession(request);

    const guestOnlyPaths = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
    ];

    if (
        isLoggedIn &&
        guestOnlyPaths.some(
            p => path === p || path.startsWith(p + '/')
        )
    ) {
        return NextResponse.redirect(
            new URL('/dashboard', request.url)
        );
    }

    if (path.startsWith('/dashboard')) {
        if (!isLoggedIn) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', path);

            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    if (path.startsWith('/api/dashboard')) {
        if (!isLoggedIn) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/dashboard/:path*',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
    ],
};