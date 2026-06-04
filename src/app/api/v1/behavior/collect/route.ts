import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('📥 Received:', {
            session: body.session_id,
            clicks: body.total_clicks || body.clicks?.length || 0,
            hovers: body.total_hovers || body.hover_samples?.length || 0,
            duration: body.duration_seconds || 0,
        });

        // ===== ۱. ذخیره Session =====
        await prisma.session.upsert({
            where: { id: body.session_id },
            update: {
                endTime: new Date(),
            },
            create: {
                id: body.session_id,
                startTime: body.start_time ? new Date(body.start_time) : new Date(),
                endTime: body.end_time ? new Date(body.end_time) : new Date(),
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
            },
        });

        // ===== ۲. ذخیره کلیک‌ها =====
        const clicks = body.clicks || [];
        for (const click of clicks.slice(0, 50)) {
            await prisma.mouseEvent.create({
                data: {
                    sessionId: body.session_id,
                    eventType: 'click',
                    x: click.x || 0,
                    y: click.y || 0,
                    target: `${click.tag || ''}: ${(click.text || '').substring(0, 100)}`,
                    timestamp: click.time ? new Date(click.time) : new Date(),
                },
            });
        }

        // ===== ۳. ذخیره hover ها =====
        const hovers = body.hover_samples || [];
        for (const hover of hovers.slice(0, 20)) {
            await prisma.mouseEvent.create({
                data: {
                    sessionId: body.session_id,
                    eventType: 'hover',
                    x: 0,
                    y: 0,
                    target: `${hover.tag || ''}: ${(hover.text || '').substring(0, 100)} (${hover.duration_ms || 0}ms)`,
                    timestamp: hover.time ? new Date(hover.time) : new Date(),
                },
            });
        }

        // ===== ۴. ذخیره Prediction اولیه =====
        await prisma.prediction.create({
            data: {
                sessionId: body.session_id,
                intent: body.pattern || 'collecting',
                confidence: body.interest_score || 0,
                category: body.hot_zones?.join(',') || null,
            },
        });

        // ===== ۵. ارسال به FastAPI برای تحلیل عمیق =====
        let deepAnalysis = null;
        try {
            console.log('📤 Sending to AI Engine...');

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000); // ۵ ثانیه timeout

            const apiKey = body.api_key || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';

            const aiResponse = await fetch(`${AI_ENGINE_URL}/api/v1/behavior/collect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(apiKey ? { Authorization: `Bearer ${apiKey}`, 'X-API-Key': apiKey } : {}),
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });

            clearTimeout(timeout);

            if (aiResponse.ok) {
                deepAnalysis = await aiResponse.json();
                console.log('🧠 AI Engine response:', {
                    probability: deepAnalysis?.analysis?.intent?.purchase_probability,
                    stage: deepAnalysis?.analysis?.intent?.decision_stage,
                    recommendations: deepAnalysis?.analysis?.recommendations?.length,
                });

                // ذخیره تحلیل عمیق
                if (deepAnalysis?.analysis) {
                    await prisma.prediction.create({
                        data: {
                            sessionId: body.session_id,
                            intent: deepAnalysis.analysis.intent?.decision_stage || 'unknown',
                            confidence: deepAnalysis.analysis.intent?.purchase_probability || 0,
                            category: deepAnalysis.analysis.intent?.estimated_budget || null,
                        },
                    });
                }
            } else {
                console.log('⚠️ AI Engine returned:', aiResponse.status);
            }
        } catch (e: any) {
            if (e.name === 'AbortError') {
                console.log('⚠️ AI Engine timeout (5s)');
            } else {
                console.log('⚠️ AI Engine offline:', e.message);
            }
        }

        // ===== ۶. پاسخ نهایی =====
        return NextResponse.json({
            status: 'success',
            data: {
                session_id: body.session_id,
                saved: {
                    clicks: clicks.length,
                    hovers: hovers.length,
                    predictions: 1,
                },
                basic: {
                    total_clicks: body.total_clicks || clicks.length,
                    total_hovers: body.total_hovers || hovers.length,
                    max_scroll: body.max_scroll_depth || 0,
                    duration: body.duration_seconds || 0,
                },
                ai_analysis: deepAnalysis?.analysis || null,
                ai_available: !!deepAnalysis,
            },
        });
    } catch (error: any) {
        console.error('❌ Error:', error.message);
        return NextResponse.json(
            {
                status: 'error',
                message: error.message,
            },
            { status: 500 }
        );
    }
}