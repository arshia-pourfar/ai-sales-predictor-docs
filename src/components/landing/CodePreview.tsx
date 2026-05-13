export function CodePreview() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-white mb-8">Start in Seconds</h2>
                <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 text-left">
                    <pre className="text-green-400 text-sm">
                        <code>{`// Install
  npm install ai-sales-predictor-sdk
  
  // Use (one line!)
  <AITracker apiKey="your-key" />
  
  // Get predictions
  const predictions = await client.getRecommendations();`}</code>
                    </pre>
                </div>
            </div>
        </section>
    );
}