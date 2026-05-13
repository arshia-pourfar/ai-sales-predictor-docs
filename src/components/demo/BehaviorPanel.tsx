export function BehaviorPanel({ analysis }: { analysis: any }) {
    return (
        <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">🧠 Real-Time Analysis</h2>
            {analysis ? (
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Intent:</span><span className="text-white">{analysis.intent}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Confidence:</span><span className="text-green-400">{(analysis.confidence * 100).toFixed(0)}%</span></div>
                </div>
            ) : (
                <p className="text-gray-500 text-sm">Click a product to see analysis...</p>
            )}
        </div>
    );
}