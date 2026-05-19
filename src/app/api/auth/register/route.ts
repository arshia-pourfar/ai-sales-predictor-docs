import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, username, password, fullName } = await request.json();

        const result = await registerUser(email, username, password, fullName);

        return NextResponse.json({
            status: 'success',
            data: result,
            message: 'Registration successful! Save your API key.',
        });
    } catch (error: any) {
        return NextResponse.json(
            { status: 'error', message: error.message },
            { status: 400 }
        );
    }
}