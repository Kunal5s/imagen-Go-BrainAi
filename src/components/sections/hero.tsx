import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-background text-foreground py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          Your personal photo editing assistant, powered by AI
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-foreground/80 mb-10">
          Get back your time and creativity with our AI-powered photo editing solutions.
          Spend more time doing what you love.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">
            Try for free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-muted">
            <Image
              src="https://placehold.co/1280x720.png"
              alt="App demonstration video placeholder"
              data-ai-hint="product video"
              width={1280}
              height={720}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
