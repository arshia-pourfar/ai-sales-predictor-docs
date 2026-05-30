'use client';
import { useState } from 'react';

export default function RegisterPage() {
    const [form, setForm] = useState({ email: '', username: '', password: '' });
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (data.status === 'success') {
                setApiKey(data.data.apiKey);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Cannot connect to server. Is the backend running?');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-24 px-6">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">Get Your Free API Key</h1>
                <p className="text-text-secondary mb-8">Start tracking in 30 seconds.</p>

                {error && (
                    <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-4 text-red-300">
                        {error}
                    </div>
                )}

                {apiKey ? (
                    <div className="bg-bg-secondary border border-accent rounded-xl p-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">🎉 Your API Key</h2>
                        <code className="bg-black px-4 py-2 rounded text-green-400 text-sm select-all block mb-4 break-all">
                            {apiKey}
                        </code>
                        <p className="text-text-secondary text-sm">Save this key! It won&apos;t be shown again.</p>
                    </div>
                ) : (
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
                            type="text"
                            placeholder="Username"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Get API Key →'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}