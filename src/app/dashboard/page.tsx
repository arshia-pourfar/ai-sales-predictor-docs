'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_ENDPOINTS = [
    {
        method: 'POST',
        path: '/api/v1/behavior/collect',
        description: 'Collect user behavior events',
        auth: 'Authorization: Bearer YOUR_API_KEY',
    },
    {
        method: 'GET',
        path: '/api/v1/sales/predict',
        description: 'Sales forecast (Next.js proxy)',
        auth: 'Authorization: Bearer YOUR_API_KEY',
    },
    {
        method: 'POST',
        path: 'http://localhost:8000/api/v1/behavior/collect',
        description: 'AI Engine — deep behavior analysis',
        auth: 'X-API-Key or Authorization: Bearer YOUR_API_KEY',
    },
    {
        method: 'GET',
        path: 'http://localhost:8000/api/v1/sales/predict',
        description: 'AI Engine — ML sales prediction',
        auth: 'X-API-Key or Authorization: Bearer YOUR_API_KEY',
    },
    {
        method: 'POST',
        path: 'http://localhost:8000/api/v1/recommendations/personalized',
        description: 'AI Engine — personalized recommendations',
        auth: 'X-API-Key or Authorization: Bearer YOUR_API_KEY',
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/profile', { credentials: 'include' })
            .then(async res => {
                if (res.status === 401) {
                    router.push('/login');
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data) setUser(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        router.push('/login');
    };

    if (loading) return <div className="text-white p-8 pt-24">Loading...</div>;
    if (!user) return null;

    const primaryKey = user.apiKeys?.[0]?.key;

    return (
        <div className="min-h-screen bg-bg-primary p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                        <p className="text-text-secondary mt-1">
                            Welcome, {user.username} ({user.email})
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-text-secondary hover:text-white border border-border-primary px-4 py-2 rounded-lg"
                    >
                        Log out
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                        <h3 className="text-text-secondary text-sm mb-2">Role</h3>
                        <p className="text-2xl font-bold text-accent">{user.role}</p>
                    </div>
                    <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                        <h3 className="text-text-secondary text-sm mb-2">API Calls Today</h3>
                        <p className="text-2xl font-bold text-white">{user.todayCalls}</p>
                    </div>
                    <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                        <h3 className="text-text-secondary text-sm mb-2">Rate Limit</h3>
                        <p className="text-2xl font-bold text-white">{user.rateLimit}/min</p>
                    </div>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Your API Keys</h2>
                    {user.apiKeys?.length ? (
                        user.apiKeys.map((key: { id: string; key: string; isActive: boolean }) => (
                            <div
                                key={key.id}
                                className="flex justify-between items-center py-3 border-b border-border-primary last:border-0"
                            >
                                <code className="text-green-400 text-sm break-all">{key.key}</code>
                                <span
                                    className={`text-xs px-2 py-1 rounded shrink-0 ml-4 ${
                                        key.isActive
                                            ? 'bg-green-900 text-green-300'
                                            : 'bg-red-900 text-red-300'
                                    }`}
                                >
                                    {key.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-text-secondary text-sm">
                            No active keys.{' '}
                            <Link href="/register" className="text-accent hover:underline">
                                Register
                            </Link>{' '}
                            to get one.
                        </p>
                    )}
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-2">Available APIs</h2>
                    <p className="text-text-secondary text-sm mb-6">
                        Use your API key in the Authorization header. Example curl with your key:
                    </p>
                    {primaryKey && (
                        <pre className="bg-black rounded-lg p-4 text-green-400 text-xs overflow-x-auto mb-6">
{`curl -H "Authorization: Bearer ${primaryKey}" \\
  http://localhost:8000/api/v1/sales/predict?days=7`}
                        </pre>
                    )}
                    <div className="space-y-4">
                        {API_ENDPOINTS.map(ep => (
                            <div
                                key={ep.path + ep.method}
                                className="border border-border-primary rounded-lg p-4"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-mono bg-accent/20 text-accent px-2 py-1 rounded">
                                        {ep.method}
                                    </span>
                                    <code className="text-white text-sm break-all">{ep.path}</code>
                                </div>
                                <p className="text-text-secondary text-sm">{ep.description}</p>
                                <p className="text-text-secondary text-xs mt-2 font-mono">{ep.auth}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-text-secondary text-sm mt-6">
                        Full docs: <Link href="/docs/api-reference" className="text-accent hover:underline">API Reference</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
