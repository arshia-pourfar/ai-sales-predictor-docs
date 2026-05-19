'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch('/api/dashboard/profile')
            .then(res => res.json())
            .then(setUser);
    }, []);

    if (!user) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-bg-primary p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

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

                <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Your API Keys</h2>
                    {user.apiKeys?.map((key: any) => (
                        <div key={key.id} className="flex justify-between items-center py-3 border-b border-border-primary">
                            <code className="text-green-400 text-sm">{key.key}</code>
                            <span className={`text-xs px-2 py-1 rounded ${key.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                {key.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}