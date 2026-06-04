import { NextResponse } from 'next/server';
import { createPasswordResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Email is required',
                },
                {
                    status: 400,
                }
            );
        }

        const token = await createPasswordResetToken(
            email.trim().toLowerCase()
        );

        if (token) {
            const baseUrl =
                process.env.NEXT_PUBLIC_APP_URL ||
                new URL(request.url).origin;

            const resetUrl =
                `${baseUrl}/reset-password?token=${token}`;

            await sendPasswordResetEmail(
                email,
                resetUrl
            );
        }

        return NextResponse.json({
            status: 'success',
            message:
                'If an account exists with this email, you will receive reset instructions shortly.',
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to send reset email',
            },
            {
                status: 500,
            }
        );
    }
}