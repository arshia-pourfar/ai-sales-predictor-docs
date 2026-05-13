import Link from 'next/link';

const quickLinks = [
    { href: '/docs/quick-start', title: 'Quick Start', desc: 'Get up and running in under 5 minutes', icon: '🚀' },
    { href: '/docs/installation', title: 'Installation', desc: 'Install the SDK for any framework', icon: '📦' },
    { href: '/docs/api-reference', title: 'API Reference', desc: 'Complete API documentation', icon: '📚' },
    { href: '/demo', title: 'Live Demo', desc: 'See it in action', icon: '🎮' },
];

export default function DocsPage() {
    return (
        <div className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-extrabold text-white mb-4">Documentation</h1>
                <p className="text-xl text-text-secondary mb-12">
                    Everything you need to integrate AI-powered analytics into your store.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="bg-bg-secondary border border-border-primary hover:border-accent rounded-xl p-6 transition-all group"
                        >
                            <div className="text-3xl mb-4">{link.icon}</div>
                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-accent-light transition-colors">
                                {link.title}
                            </h3>
                            <p className="text-text-secondary">{link.desc}</p>
                        </Link>
                    ))}
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">New here?</h2>
                    <p className="text-text-secondary mb-6">Start with the Quick Start guide to integrate in minutes.</p>
                    <Link
                        href="/docs/quick-start"
                        className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                    >
                        Go to Quick Start →
                    </Link>
                </div>
            </div>
        </div>
    );
}