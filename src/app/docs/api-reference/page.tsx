import { APIEndpoint } from '@/components/docs/APIEndpoint';
import { CodeBlock } from '@/components/docs/CodeBlock';

const salesEndpoints = [
  {
    method: 'GET',
    path: '/api/v1/sales/predict',
    description: 'Predict future sales based on historical data and ML models.',
    parameters: [
      { name: 'days', type: 'number', required: false, description: 'Number of days to predict (default: 7)' },
      { name: 'include_seasonality', type: 'boolean', required: false, description: 'Include seasonal patterns' },
    ],
    example: `fetch("https://api.ai-sales.com/api/v1/sales/predict?days=7")
  .then(res => res.json())
  .then(data => console.log(data));`,
    response: `{
  "status": "success",
  "prediction": {
    "forecast": [
      { "date": "2026-05-14", "predicted_sales": 4500.50 },
      { "date": "2026-05-15", "predicted_sales": 5200.00 }
    ],
    "summary": {
      "total_predicted": 39700.50,
      "trend": "increasing 📈",
      "confidence": "high ✨"
    }
  }
}`
  }
];

export default function APIRefPage() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-4">API Reference</h1>
      <p className="text-xl text-gray-400 mb-12">
        Complete reference for all available API endpoints.
      </p>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Authentication</h2>
        <CodeBlock language="bash">
{`# Include your API key in headers
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.ai-sales.com/api/v1/sales/predict`}
        </CodeBlock>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Sales Endpoints</h2>
        {salesEndpoints.map((endpoint, index) => (
          <APIEndpoint key={index} {...endpoint} />
        ))}
      </section>
    </div>
  );
}