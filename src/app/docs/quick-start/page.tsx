import { Steps } from '@/components/docs/Steps';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Callout } from '@/components/docs/Callout';

export default function QuickStartPage() {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-4xl font-bold mb-4">Quick Start</h1>
            <p className="text-xl text-gray-400 mb-12">
                Get AI-powered sales predictions in your store in under 5 minutes.
            </p>

            <Steps>
                <Steps.Step number={1} title="Install the SDK">
                    <CodeBlock language="bash">
                        npm install ai-sales-predictor-sdk
                    </CodeBlock>
                    <p className="mt-4 text-gray-400">Or use your preferred package manager:</p>
                    <CodeBlock language="bash">
                        {`# yarn
yarn add ai-sales-predictor-sdk

# pnpm
pnpm add ai-sales-predictor-sdk`}
                    </CodeBlock>
                </Steps.Step>

                <Steps.Step number={2} title="Get Your API Key">
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Sign up at <a href="https://dashboard.ai-sales.com" className="text-purple-400 hover:underline">dashboard.ai-sales.com</a></li>
                        <li>Create a new project</li>
                        <li>Copy your public API key</li>
                    </ol>
                    <Callout type="warning" className="mt-4">
                        Never expose your secret API key in client-side code. Use environment variables.
                    </Callout>
                </Steps.Step>

                <Steps.Step number={3} title="Add the Tracker Component">
                    <p className="mb-4 text-gray-300">In your root layout file:</p>
                    <CodeBlock language="tsx">
                        {`// app/layout.tsx
import { AITracker } from 'ai-sales-predictor-sdk';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AITracker 
          apiKey={process.env.NEXT_PUBLIC_AI_SALES_KEY!}
          debug={process.env.NODE_ENV === 'development'}
        />
        {children}
      </body>
    </html>
  );
}`}
                    </CodeBlock>
                </Steps.Step>

                <Steps.Step number={4} title="Make Your First API Call">
                    <CodeBlock language="typescript">
                        {`// app/api/recommendations/route.ts
import { AISalesClient } from 'ai-sales-predictor-sdk/server';

const client = new AISalesClient({
  apiKey: process.env.AI_SALES_API_KEY!,
});

export async function POST(request: Request) {
  const { sessionId } = await request.json();
  const recommendations = await client.getRecommendations(sessionId);
  return Response.json(recommendations);
}`}
                    </CodeBlock>
                </Steps.Step>

                <Steps.Step number={5} title="View Your Analytics">
                    <p className="text-gray-300">
                        Go to <a href="https://dashboard.ai-sales.com" className="text-purple-400 hover:underline">dashboard.ai-sales.com</a> to see real-time analytics and predictions.
                    </p>
                </Steps.Step>
            </Steps>
        </div>
    );
}