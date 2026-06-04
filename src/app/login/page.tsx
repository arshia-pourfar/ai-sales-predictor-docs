'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                credentials: 'include',
            });

            const data = await res.json();

            if (data.status === 'success') {
                router.push('/dashboard');
                router.refresh();
            } else {
                setError(data.message || 'Login failed');
            }
        } catch {
            setError('Cannot connect to server. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-24 px-6">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">Sign In</h1>
                <p className="text-text-secondary mb-8">
                    Log in to access your dashboard and API keys.
                </p>

                {error && (
                    <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-4 text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-bg-secondary border border-border-primary rounded-lg px-4 py-3 text-white"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full bg-bg-secondary border border-border-primary rounded-lg px-4 py-3 text-white"
                        required
                    />
                    <div className="text-right">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-accent hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In →'}
                    </button>
                </form>

                <p className="text-text-secondary text-sm mt-6 text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-accent hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
