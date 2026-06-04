import { NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { key } = await request.json();

        if (!key || typeof key !== 'string') {
            return NextResponse.json({ valid: false, error: 'API key required' }, { status: 400 });
        }

        const info = await validateApiKey(key);

        return NextResponse.json({
            valid: true,
            userId: info.userId,
            role: info.role,
            keyId: info.keyId,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Invalid API key';
        return NextResponse.json({ valid: false, error: message }, { status: 401 });
    }
}
