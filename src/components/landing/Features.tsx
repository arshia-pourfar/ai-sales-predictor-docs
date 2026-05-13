const features = [
    { icon: "🧠", title: "Behavioral AI", desc: "Analyze mouse, scroll & search patterns locally on client-side" },
    { icon: "📊", title: "Sales Forecasting", desc: "Predict next month's revenue with ML models trained on your data" },
    { icon: "🎯", title: "Smart Recommendations", desc: "Personalized product suggestions based on real-time intent" },
    { icon: "📈", title: "Analytics Dashboard", desc: "Track conversion rates, heatmaps & user flows visually" },
    { icon: "🔒", title: "Privacy-First", desc: "Data analyzed on client-side, only insights sent to server" },
    { icon: "⚡", title: "5-Minute Setup", desc: "One line of code, instant insights. Works with any framework" },
  ];
  
  export function Features() {
    return (
      <section className="py-24 px-6 bg-bg-primary">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Everything You Need</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-bg-secondary border border-border-primary rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }