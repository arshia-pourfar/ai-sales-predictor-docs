export function Testimonials() {
    return (
        <section className="py-24 px-6 bg-bg-primary">
            <h2 className="text-4xl font-bold text-center text-white mb-16">Loved by Developers</h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {["Increased our conversion by 40%!", "The easiest AI integration ever.", "Privacy-first approach is genius."].map((q, i) => (
                    <div key={i} className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                        <p className="text-gray-300 mb-4">"{q}"</p>
                        <p className="text-gray-500 text-sm">— Developer {i + 1}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}