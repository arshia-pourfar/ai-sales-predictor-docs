import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Sales Predictor - Predict Sales, Understand Users',
  description: 'AI-powered behavioral analytics for e-commerce. Track, analyze, and predict customer behavior in real-time.',
  keywords: 'AI, sales prediction, behavioral analytics, e-commerce, mouse tracking',
  openGraph: {
    title: 'AI Sales Predictor',
    description: 'Predict sales and understand user behavior with AI',
    url: 'https://ai-sales-docs.vercel.app',
    siteName: 'AI Sales Predictor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Sales Predictor',
    description: 'Predict sales and understand user behavior with AI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}