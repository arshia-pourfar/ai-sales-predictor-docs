import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-black py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold text-white mb-4">Product</h3>
                        <div className="space-y-2">
                            <Link href="/docs" className="text-gray-400 hover:text-white text-sm block">Docs</Link>
                            <Link href="/demo" className="text-gray-400 hover:text-white text-sm block">Demo</Link>
                            <Link href="/playground" className="text-gray-400 hover:text-white text-sm block">Playground</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Resources</h3>
                        <div className="space-y-2">
                            <Link href="/docs/api-reference" className="text-gray-400 hover:text-white text-sm block">API Reference</Link>
                            <Link href="/docs/examples" className="text-gray-400 hover:text-white text-sm block">Examples</Link>
                            <Link href="/docs/faq" className="text-gray-400 hover:text-white text-sm block">FAQ</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <div className="space-y-2">
                            <a href="https://arshia-pourfar.vercel.app" className="text-gray-400 hover:text-white text-sm block">About</a>
                            <a href="https://github.com" className="text-gray-400 hover:text-white text-sm block">GitHub</a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Built by</h3>
                        <a href="https://arshia-pourfar.vercel.app" className="text-purple-400 hover:text-purple-300 text-sm">
                            Arshia Pourfar
                        </a>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} AI Sales Predictor. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}