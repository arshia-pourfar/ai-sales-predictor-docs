import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function sendPasswordResetEmail(
    email: string,
    resetUrl: string
) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Password',
        html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
            <h2>Password Reset</h2>

            <p>You requested a password reset.</p>

            <p>
                Click the button below to choose a new password:
            </p>

            <a
                href="${resetUrl}"
                style="
                    display:inline-block;
                    padding:12px 20px;
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                "
            >
                Reset Password
            </a>

            <p style="margin-top:20px;">
                This link will expire in 1 hour.
            </p>

            <p>
                If you did not request this password reset,
                you can safely ignore this email.
            </p>
        </div>
        `,
    });
}