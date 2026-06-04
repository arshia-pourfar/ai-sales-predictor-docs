'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Invalid reset link. Request a new one.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();

            if (data.status === 'success') {
                setSuccess(true);
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(data.message || 'Reset failed');
            }
        } catch {
            setError('Cannot connect to server. Please try again.');
        }
        setLoading(false);
    };

    if (!token) {
        return (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-300">
                Invalid or missing reset token.{' '}
                <Link href="/forgot-password" className="text-accent underline">
                    Request a new link
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-bg-secondary border border-accent rounded-xl p-6 text-center">
                <p className="text-white mb-2">Password updated successfully.</p>
                <p className="text-text-secondary text-sm">Redirecting to sign in...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-300">
                    {error}
                </div>
            )}
            <input
                type="password"
                placeholder="New password (min 8 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-bg-secondary border border-border-primary rounded-lg px-4 py-3 text-white"
                required
                minLength={8}
            />
            <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full bg-bg-secondary border border-border-primary rounded-lg px-4 py-3 text-white"
                required
                minLength={8}
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
                {loading ? 'Updating...' : 'Set New Password'}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-bg-primary pt-24 px-6">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">Reset Password</h1>
                <p className="text-text-secondary mb-8">Choose a new password for your account.</p>
                <Suspense fallback={<p className="text-text-secondary">Loading...</p>}>
                    <ResetPasswordForm />
                </Suspense>
                <p className="text-text-secondary text-sm mt-6 text-center">
                    <Link href="/login" className="text-accent hover:underline">
                        Back to Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
