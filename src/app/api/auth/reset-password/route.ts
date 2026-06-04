import { NextResponse } from 'next/server';
import { resetPasswordWithToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token || typeof token !== 'string') {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Invalid reset token',
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !password ||
            typeof password !== 'string' ||
            password.length < 8
        ) {
            return NextResponse.json(
                {
                    status: 'error',
                    message:
                        'Password must be at least 8 characters',
                },
                {
                    status: 400,
                }
            );
        }

        await resetPasswordWithToken(
            token.trim(),
            password
        );

        return NextResponse.json({
            status: 'success',
            message:
                'Password updated successfully. You can now sign in.',
        });
    } catch (error) {
        console.error('Reset password error:', error);

        const message =
            error instanceof Error
                ? error.message
                : 'Reset failed';

        return NextResponse.json(
            {
                status: 'error',
                message,
            },
            {
                status: 400,
            }
        );
    }
}