export function Hero() {
    return (
        <section className="text-center py-24 px-6">
            <h1 className="text-6xl font-extrabold text-white mb-6">
                Predict Sales, <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Understand Users</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
                AI-powered behavioral analytics that tracks, analyzes, and predicts customer intent in real-time. One line of code, instant insights.
            </p>
            <div className="flex justify-center gap-4">
                <a href="/docs/quick-start" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                    Get Started Free
                </a>
                <a href="/demo" className="border border-gray-600 hover:border-gray-400 text-gray-300 font-semibold py-3 px-8 rounded-lg transition-colors">
                    View Demo
                </a>
            </div>
        </section>
    );
}