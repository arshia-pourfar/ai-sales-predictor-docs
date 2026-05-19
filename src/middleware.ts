import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// تعریف مسیرهای محافظت شده
const protectedRoutes = {
    '/api/v1/sales': ['FREE', 'PRO', 'ENTERPRISE'],
    '/api/v1/behavior': ['FREE', 'PRO', 'ENTERPRISE'],
    '/api/v1/recommendations': ['PRO', 'ENTERPRISE'], // فقط PRO به بالا
    '/api/v1/analytics/heatmap': ['PRO', 'ENTERPRISE'],
    '/api/v1/admin': ['ADMIN'], // فقط ادمین
    '/api/dashboard': ['FREE', 'PRO', 'ENTERPRISE'],
};

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // ۱. چک کردن API routes محافظت شده
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
        if (path.startsWith(route)) {
            const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');

            if (!apiKey) {
                return NextResponse.json(
                    {
                        error: 'API key required',
                        docs: 'https://docs.ai-sales.com/authentication'
                    },
                    { status: 401 }
                );
            }

            try {
                // اعتبارسنجی کلید
                const userInfo = await validateApiKey(apiKey);

                // چک سطح دسترسی
                if (!allowedRoles.includes(userInfo.role)) {
                    return NextResponse.json(
                        {
                            error: 'Insufficient permissions',
                            required: allowedRoles,
                            your_role: userInfo.role,
                            upgrade: 'https://ai-sales.com/pricing'
                        },
                        { status: 403 }
                    );
                }

                // چک Rate Limit
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todayRequests = await prisma.usageLog.count({
                    where: {
                        apiKeyId: userInfo.keyId,
                        timestamp: { gte: today },
                    },
                });

                if (todayRequests >= userInfo.dailyLimit) {
                    return NextResponse.json(
                        {
                            error: 'Daily limit exceeded',
                            limit: userInfo.dailyLimit,
                            used: todayRequests,
                            reset: 'Tomorrow 00:00 UTC',
                        },
                        { status: 429 }
                    );
                }

                // اضافه کردن user info به درخواست
                const requestHeaders = new Headers(request.headers);
                requestHeaders.set('x-user-id', userInfo.userId);
                requestHeaders.set('x-user-role', userInfo.role);
                requestHeaders.set('x-api-key-id', userInfo.keyId);

                // ثبت usage log (async - منتظر نمیمونه)
                prisma.usageLog.create({
                    data: {
                        userId: userInfo.userId,
                        apiKeyId: userInfo.keyId,
                        endpoint: path,
                        method: request.method,
                        statusCode: 200,
                        timestamp: new Date(),
                    },
                }).catch(console.error); // خطا رو لاگ کن ولی بلاک نکن

                return NextResponse.next({
                    request: {
                        headers: requestHeaders,
                    },
                });
            } catch (error: any) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 401 }
                );
            }
        }
    }

    // ۲. چک مسیرهای داشبورد (نیاز به JWT token)
    if (path.startsWith('/dashboard')) {
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { verifyToken } = await import('@/lib/auth');
            verifyToken(token);
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
}

export const config = {
    matcher: ['/api/v1/:path*', '/api/dashboard/:path*', '/dashboard/:path*'],
};