import { CodeBlock } from '@/components/docs/CodeBlock';
import { Tabs } from '@/components/docs/Tabs';
import { Callout } from '@/components/docs/Callout';

export default function InstallationPage() {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-4xl font-bold mb-4">Installation</h1>
            <p className="text-xl text-gray-400 mb-12">
                Add AI Sales Predictor to any project in minutes.
            </p>

            <Tabs>
                <Tabs.Tab label="Next.js">
                    <h2 className="text-2xl font-semibold mb-4">Next.js (App Router)</h2>
                    <CodeBlock language="bash">
                        npx create-next-app@latest my-store --typescript --tailwind
                        cd my-store
                        npm install ai-sales-predictor-sdk
                    </CodeBlock>
                </Tabs.Tab>

                <Tabs.Tab label="React">
                    <h2 className="text-2xl font-semibold mb-4">React (Vite/CRA)</h2>
                    <CodeBlock language="bash">
                        npm create vite@latest my-store -- --template react-ts
                        cd my-store
                        npm install ai-sales-predictor-sdk
                    </CodeBlock>
                </Tabs.Tab>

                <Tabs.Tab label="Shopify">
                    <h2 className="text-2xl font-semibold mb-4">Shopify</h2>
                    <CodeBlock language="html">
                        {`<!-- Add to theme.liquid -->
<script src="https://cdn.ai-sales.com/sdk.js"></script>
<script>
  AITracker.init({ apiKey: 'YOUR_KEY' });
</script>`}
                    </CodeBlock>
                </Tabs.Tab>

                <Tabs.Tab label="HTML">
                    <h2 className="text-2xl font-semibold mb-4">Vanilla HTML/JS</h2>
                    <CodeBlock language="html">
                        {`<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.ai-sales.com/sdk.js"></script>
</head>
<body>
  <script>
    AITracker.init({ apiKey: 'YOUR_KEY' });
  </script>
</body>
</html>`}
                    </CodeBlock>
                </Tabs.Tab>
            </Tabs>

            <Callout type="info" className="mt-8">
                <strong>Pro Tip:</strong> Enable debug mode in development to see real-time event logs in your browser console.
            </Callout>
        </div>
    );
}