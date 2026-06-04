import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const decoded = verifyToken(token) as { userId: string; role: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                apiKeys: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        key: true,
                        name: true,
                        isActive: true,
                        rateLimit: true,
                        dailyLimit: true,
                        lastUsedAt: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayCalls = await prisma.usageLog.count({
            where: {
                userId: user.id,
                timestamp: { gte: today },
            },
        });

        return NextResponse.json({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            apiKeys: user.apiKeys,
            todayCalls,
            rateLimit: user.apiKeys[0]?.rateLimit || 100,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
