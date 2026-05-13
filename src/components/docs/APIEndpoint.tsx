import { CodeBlock } from './CodeBlock';

export function APIEndpoint({ method, path, description, parameters, example, response }: {
    method: string;
    path: string;
    description: string;
    parameters?: { name: string; type: string; required: boolean; description: string }[];
    example: string;
    response: string;
}) {
    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded ${method === 'GET' ? 'bg-green-700 text-green-100' : 'bg-blue-700 text-blue-100'}`}>{method}</span>
                <code className="text-white font-mono">{path}</code>
            </div>
            <p className="text-gray-400 mb-4">{description}</p>
            {parameters && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Parameters</h4>
                    <table className="w-full text-sm">
                        <thead><tr className="text-gray-500"><th className="text-left py-1">Name</th><th className="text-left py-1">Type</th><th className="text-left py-1">Required</th></tr></thead>
                        <tbody>
                            {parameters.map((p) => (
                                <tr key={p.name} className="border-t border-gray-800"><td className="py-1 text-gray-300">{p.name}</td><td className="py-1 text-gray-400">{p.type}</td><td className="py-1">{p.required ? '✅' : '❌'}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <details className="mt-4">
                <summary className="text-purple-400 cursor-pointer hover:underline">View Example</summary>
                <CodeBlock language="javascript">{example}</CodeBlock>
                <CodeBlock language="json">{response}</CodeBlock>
            </details>
        </div>
    );
}