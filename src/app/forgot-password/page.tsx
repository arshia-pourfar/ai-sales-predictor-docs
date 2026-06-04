'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [devToken, setDevToken] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        setDevToken('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (data.status === 'success') {
                setSuccess(data.message);
                if (data.devToken) setDevToken(data.devToken);
            } else {
                setError(data.message || 'Request failed');
            }
        } catch {
            setError('Cannot connect to server. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-24 px-6">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">Forgot Password</h1>
                <p className="text-text-secondary mb-8">
                    Enter your email and we&apos;ll send you a link to reset your password.
                </p>

                {error && (
                    <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-4 text-red-300">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="bg-bg-secondary border border-accent rounded-xl p-6">
                        <p className="text-white mb-4">{success}</p>
                        {devToken && (
                            <div className="text-sm">
                                <p className="text-text-secondary mb-2">Development reset link:</p>
                                <Link
                                    href={`/reset-password?token=${devToken}`}
                                    className="text-accent hover:underline"
                                >
                                    Set new password
                                </Link>
                            </div>
                        )}
                        <Link
                            href="/login"
                            className="inline-block mt-6 text-accent hover:underline"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-bg-secondary border border-border-primary rounded-lg px-4 py-3 text-white"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                {!success && (
                    <p className="text-text-secondary text-sm mt-6 text-center">
                        <Link href="/login" className="text-accent hover:underline">
                            Back to Sign In
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
