'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const PUBLIC_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/docs', label: 'Docs' },
    { href: '/demo', label: 'Demo' },
    { href: '/playground', label: 'Playground' },
];

const GUEST_LINKS = [
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
];

export function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);

    const checkSession = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/session', { credentials: 'include' });
            const data = await res.json();
            setAuthenticated(!!data.authenticated);
            setUsername(data.user?.username ?? null);
        } catch {
            setAuthenticated(false);
            setUsername(null);
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [pathname, checkSession]);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            setAuthenticated(false);
            setUsername(null);
            router.push('/login');
            router.refresh();
        } finally {
            setLoggingOut(false);
        }
    };

    const navLinks = authenticated
        ? [...PUBLIC_LINKS, { href: '/dashboard', label: 'Dashboard' }]
        : [...PUBLIC_LINKS, ...GUEST_LINKS];

    return (
        <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link
                    href={authenticated ? '/dashboard' : '/'}
                    className="text-xl font-bold text-white hover:text-purple-400 transition-colors"
                >
                    AI Sales Predictor
                </Link>

                <div className="flex items-center gap-6">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm ${
                                pathname === link.href
                                    ? 'text-purple-400 font-semibold'
                                    : 'text-gray-400 hover:text-white'
                            } transition-colors`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {authenticated && (
                        <>
                            {username && (
                                <span className="text-sm text-gray-500 hidden sm:inline">
                                    {username}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="text-sm text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loggingOut ? 'Logging out...' : 'Log out'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
