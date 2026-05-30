'use client';
import { useEffect } from 'react';

export default function TestSDKPage() {
  useEffect(() => {
    // استارت ردیابی
    const script = document.createElement('script');
    script.src = '/sdk.js';
    script.onload = () => {
      new (window as any).AITracker({
        apiKey: 'test-key',
        apiUrl: '/api/v1'
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary p-8 pt-24">
      <h1 className="text-4xl text-white mb-8">🧪 Test SDK</h1>
      <p className="text-text-secondary mb-4">تکونش بده موس رو! کلیک کن! اسکرول کن!</p>
      
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-bg-secondary border border-border-primary rounded-xl p-6 h-48 flex items-center justify-center text-white cursor-pointer hover:border-accent transition-all">
            <div>
              <div className="text-4xl mb-4">🖱️</div>
              <div className="text-center">Product {i + 1}</div>
              <div className="text-center text-accent mt-2 price-tag">${(i + 1) * 100}</div>
              <div className="text-center text-text-secondary text-sm mt-2 review-stars">★★★★★</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}