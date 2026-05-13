'use client';

import { useState, useEffect } from 'react';
import { DemoStore } from '@/components/demo/DemoStore';
import { BehaviorPanel } from '@/components/demo/BehaviorPanel';
import { EventLog } from '@/components/demo/EventLog';

export default function DemoPage() {
    const [events, setEvents] = useState<string[]>([]);
    const [analysis, setAnalysis] = useState<any>(null);

    const addEvent = (event: string) => {
        setEvents(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${event}`]);
    };

    return (
        <div className="flex h-screen">
            <div className="w-2/3 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">🎮 Live Demo Store</h1>
                <p className="text-gray-400 mb-8">
                    Interact with the products and watch the AI analyze your behavior in real-time.
                </p>
                <DemoStore onEvent={addEvent} onAnalysis={setAnalysis} />
            </div>

            <div className="w-1/3 border-l border-gray-800 flex flex-col">
                <BehaviorPanel analysis={analysis} />
                <EventLog events={events} />
            </div>
        </div>
    );
}