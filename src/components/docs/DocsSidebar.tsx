import Link from 'next/link';

const sections = [
    {
        title: "Getting Started",
        links: [
            { href: "/docs/quick-start", label: "Quick Start" },
            { href: "/docs/installation", label: "Installation" },
        ],
    },
    {
        title: "Core",
        links: [
            { href: "/docs/api-reference", label: "API Reference" },
        ],
    },
];

export function DocsSidebar() {
    return (
        <aside className="w-64 h-screen sticky top-16 border-r border-gray-800 p-6 overflow-y-auto shrink-0 bg-black">
            {sections.map((section, i) => (
                <div key={i} className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{section.title}</h3>
                    <ul className="space-y-2">
                        {section.links.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-gray-300 hover:text-white text-sm transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </aside>
    );
}