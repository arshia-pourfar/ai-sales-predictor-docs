'use client';
import { useState } from 'react';

export function RequestBuilder({ endpoint, onResponse, setLoading }: any) {
    const [body, setBody] = useState('{}');

    const send = async () => {
        setLoading(true);
        try {
            const method = endpoint.includes('predict') ? 'GET' : 'POST';
            const options: any = { headers: { 'Content-Type': 'application/json' } };
            if (method === 'POST') {
                options.method = 'POST';
                options.body = body;
            }
            const res = await fetch(`https://api.ai-sales.com${endpoint}`, options);
            const data = await res.json();
            onResponse(data);
        } catch (e: any) {
            onResponse({ error: e.message });
        }
        setLoading(false);
    };

    return (
        <div>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full h-40 bg-bg-secondary border border-border-primary rounded-lg p-4 text-green-400 font-mono text-sm mb-4" />
            <button onClick={send} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg">Send Request →</button>
        </div>
    );
}