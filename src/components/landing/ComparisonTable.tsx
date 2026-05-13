export function ComparisonTable() {
    const rows = [
        { feature: "Mouse Tracking", ai: true, hotjar: true, ga: false },
        { feature: "Sales Prediction", ai: true, hotjar: false, ga: false },
        { feature: "Real-time Intent", ai: true, hotjar: false, ga: false },
        { feature: "Open Source", ai: true, hotjar: false, ga: false },
    ];

    return (
        <section className="py-24 px-6 bg-bg-primary">
            <h2 className="text-4xl font-bold text-center text-white mb-16">Why Choose Us</h2>
            <div className="max-w-3xl mx-auto overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-800">
                            <th className="py-4 text-white">Feature</th>
                            <th className="py-4 text-purple-400">AI Predictor</th>
                            <th className="py-4 text-gray-400">Hotjar</th>
                            <th className="py-4 text-gray-400">Google Analytics</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={i} className="border-b border-gray-800">
                                <td className="py-4 text-gray-300">{r.feature}</td>
                                <td className="py-4">{r.ai ? "✅" : "❌"}</td>
                                <td className="py-4">{r.hotjar ? "✅" : "❌"}</td>
                                <td className="py-4">{r.ga ? "✅" : "❌"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}