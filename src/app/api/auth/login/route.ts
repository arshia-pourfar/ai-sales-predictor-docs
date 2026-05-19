import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

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

        return NextResponse.json({
            status: 'success',
            data: {
                token,
                apiKey: user.apiKeys[0]?.key || null,
                role: user.role,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { status: 'error', message: error.message },
            { status: 500 }
        );
    }
}