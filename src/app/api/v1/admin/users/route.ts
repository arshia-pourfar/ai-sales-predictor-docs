import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const role = request.headers.get('x-user-role');

    // فقط ADMIN
    if (role !== 'ADMIN') {
        return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
        );
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            isActive: true,
            createdAt: true,
            _count: {
                select: { usageLogs: true, apiKeys: true },
            },
        },
    });

    return NextResponse.json({ users });
}