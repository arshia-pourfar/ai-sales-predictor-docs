export function EventLog({ events }: { events: string[] }) {
    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">📋 Event Log</h2>
            <div className="space-y-2 font-mono text-xs">
                {events.length === 0 ? (
                    <p className="text-gray-500">No events yet...</p>
                ) : (
                    events.slice(-20).map((e, i) => (
                        <div key={i} className="text-green-400 bg-bg-primary px-3 py-1 rounded border border-gray-800">{e}</div>
                    ))
                )}
            </div>
        </div>
    );
}