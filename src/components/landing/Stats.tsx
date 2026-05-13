export function Stats() {
    return (
        <section className="py-16 px-6 border-t border-b border-gray-800">
            <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
                {[{ value: "10K+", label: "Stores" }, { value: "50M+", label: "Events Tracked" }, { value: "99.9%", label: "Uptime" }].map((s, i) => (
                    <div key={i}>
                        <div className="text-3xl font-bold text-purple-400">{s.value}</div>
                        <div className="text-gray-400">{s.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}