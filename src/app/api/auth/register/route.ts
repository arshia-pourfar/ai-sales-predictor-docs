import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateApiKey } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, username, password, fullName } = await request.json();

        // اعتبارسنجی ساده
        if (!email || !username || !password) {
            return NextResponse.json(
                { status: 'error', message: 'All fields are required' },
                { status: 400 }
            );
        }

        // چک تکراری نبودن
        const existing = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existing) {
            return NextResponse.json(
                { status: 'error', message: 'Email or username already exists' },
                { status: 400 }
            );
        }

        // هش پسورد
        const hashedPassword = await hashPassword(password);

        // ساخت کاربر + API Key
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                fullName: fullName || null,
                apiKeys: {
                    create: {
                        key: generateApiKey(),
                        name: 'Default',
                        rateLimit: 100,
                        dailyLimit: 1000,
                    },
                },
            },
            include: {
                apiKeys: true,
            },
        });

        return NextResponse.json({
            status: 'success',
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
                apiKey: user.apiKeys[0].key,
                role: user.role,
            },
            message: 'Registration successful! Save your API key.',
        });
    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json(
            { status: 'error', message: error.message || 'Registration failed' },
            { status: 500 }
        );
    }
}