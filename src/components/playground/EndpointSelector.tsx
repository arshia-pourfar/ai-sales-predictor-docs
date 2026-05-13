const endpoints = ["/api/v1/sales/predict", "/api/v1/behavior/track/mouse", "/api/v1/recommendations/personalized"];

export function EndpointSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-bg-secondary border border-border-primary rounded-lg px-4 py-2 text-white mb-4">
            {endpoints.map((ep) => (
                <option key={ep} value={ep}>{ep}</option>
            ))}
        </select>
    );
}