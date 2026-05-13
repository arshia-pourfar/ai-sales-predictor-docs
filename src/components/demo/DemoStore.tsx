'use client';

const products = [
    { id: 1, name: "Gaming Mouse", price: "$59", emoji: "🖱️" },
    { id: 2, name: "Wireless Headphones", price: "$129", emoji: "🎧" },
    { id: 3, name: "Mechanical Keyboard", price: "$89", emoji: "⌨️" },
    { id: 4, name: "24\" Monitor", price: "$299", emoji: "🖥️" },
];

export function DemoStore({ onEvent, onAnalysis }: { onEvent: (e: string) => void; onAnalysis: (a: any) => void }) {
    const handleClick = (product: string) => {
        onEvent(`click → ${product}`);
        onAnalysis?.({ intent: "browsing", confidence: 0.8 });
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
                <div key={p.id} onClick={() => handleClick(p.name)} className="bg-bg-secondary border border-border-primary rounded-xl p-6 cursor-pointer hover:border-purple-500/50 transition-all">
                    <div className="text-4xl mb-4">{p.emoji}</div>
                    <h3 className="text-white font-semibold">{p.name}</h3>
                    <p className="text-purple-400 mt-2">{p.price}</p>
                </div>
            ))}
        </div>
    );
}