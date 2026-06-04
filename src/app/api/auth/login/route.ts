import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { status: 'error', message: 'Email and password are required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { apiKeys: { where: { isActive: true }, take: 1 } },
        });

        if (!user || !(await verifyPassword(password, user.password))) {
            return NextResponse.json(
                { status: 'error', message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = generateToken(user.id, user.role);

        const response = NextResponse.json({
            status: 'success',
            data: {
                token,
                apiKey: user.apiKeys[0]?.key || null,
                role: user.role,
                email: user.email,
                username: user.username,
            },
        });

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Login failed';
        return NextResponse.json(
            { status: 'error', message },
            { status: 500 }
        );
    }
}
