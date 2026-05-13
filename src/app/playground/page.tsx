'use client';

import { useState } from 'react';
import { EndpointSelector } from '@/components/playground/EndpointSelector';
import { RequestBuilder } from '@/components/playground/RequestBuilder';
import { ResponseViewer } from '@/components/playground/ResponseViewer';

export default function PlaygroundPage() {
    const [endpoint, setEndpoint] = useState('/api/v1/sales/predict');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-4">API Playground</h1>
            <p className="text-xl text-gray-400 mb-12">
                Test API endpoints directly in your browser.
            </p>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <EndpointSelector value={endpoint} onChange={setEndpoint} />
                    <RequestBuilder endpoint={endpoint} onResponse={setResponse} setLoading={setLoading} />
                </div>
                <div>
                    <ResponseViewer response={response} loading={loading} />
                </div>
            </div>
        </div>
    );
}