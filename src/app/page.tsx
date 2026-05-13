import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ComparisonTable } from '@/components/landing/ComparisonTable';
import { CodePreview } from '@/components/landing/CodePreview';
import { Testimonials } from '@/components/landing/Testimonials';
import { CTASection } from '@/components/landing/CTASection';
import { Stats } from '@/components/landing/Stats';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CodePreview />
      <ComparisonTable />
      <Testimonials />
      <CTASection />
    </>
  );
}