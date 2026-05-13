export function CodeBlock({ children, language }: { children: string; language?: string }) {
    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-4 overflow-x-auto my-4">
            {language && <div className="text-xs text-gray-500 mb-2">{language}</div>}
            <pre className="text-green-400 text-sm"><code>{children}</code></pre>
        </div>
    );
}