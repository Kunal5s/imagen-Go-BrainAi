
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Completely Free to Use</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Unleash your creativity without any cost. All image and video generation features on Imagen Max BrainAi are available for free. No subscriptions, no credits, no hidden fees.
        </p>
        <Link href="/generate">
          <Button size="lg">Start Creating Now</Button>
        </Link>
      </div>
    </section>
  );
}
