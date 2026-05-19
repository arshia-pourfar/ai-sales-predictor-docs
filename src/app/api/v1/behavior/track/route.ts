import { NextResponse } from 'next/server';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const apiKey = request.headers.get('x-api-key');

        // ارسال به FastAPI برای تحلیل عمیق
        const response = await fetch(`${AI_ENGINE_URL}/api/v1/behavior/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey || '',
            },
            body: JSON.stringify(body),
        });

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'AI Engine unavailable' },
            { status: 503 }
        );
    }
}