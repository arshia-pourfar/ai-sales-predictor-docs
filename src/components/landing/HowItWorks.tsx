export function HowItWorks() {
    return (
      <section className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-16">How It Works</h2>
        <div className="max-w-4xl mx-auto space-y-12">
          {[
            { step: 1, title: "Install SDK", code: "npm install ai-sales-predictor-sdk" },
            { step: 2, title: "Add Tracker", code: "<AITracker apiKey='...' />" },
            { step: 3, title: "Get Predictions", code: "client.getRecommendations()" },
          ].map((s) => (
            <div key={s.step} className="flex gap-6 items-start">
              <span className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                {s.step}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
                <code className="bg-bg-secondary border border-border-primary rounded px-4 py-2 text-green-400 text-sm">{s.code}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }