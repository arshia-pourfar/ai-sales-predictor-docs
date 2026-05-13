export function ResponseViewer({ response, loading }: { response: any; loading: boolean }) {
    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Response</h3>
            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : response ? (
                <pre className="text-green-400 text-sm overflow-auto max-h-96">{JSON.stringify(response, null, 2)}</pre>
            ) : (
                <p className="text-gray-500">Send a request to see the response...</p>
            )}
        </div>
    );
}