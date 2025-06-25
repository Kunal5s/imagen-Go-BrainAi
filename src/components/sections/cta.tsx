import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
          Ready to transform your workflow?
        </h2>
        <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-10">
          Join thousands of photographers who are editing smarter, not harder.
        </p>
        <Button size="lg">
          Start your free trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
