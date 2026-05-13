'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Home' },
        { href: '/docs', label: 'Docs' },
        { href: '/demo', label: 'Demo' },
        { href: '/playground', label: 'Playground' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
                    AI Sales Predictor
                </Link>

                <div className="flex gap-6">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm \${
                        pathname === link.href
                            ? 'text-purple-400 font-semibold'
                            : 'text-gray-400 hover:text-white'
                    } transition-colors `}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav >
    );
}