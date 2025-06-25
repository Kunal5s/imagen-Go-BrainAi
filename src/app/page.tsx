import ImageGenerator from '@/components/image-generator';
import { Button } from '@/components/ui/button';

function HeroSection() {
    return (
        <section className="text-center py-12 md:py-20">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Imagen Max BrainAi</h1>
            <p className="max-w-3xl mx-auto text-muted-foreground mt-4 text-base md:text-lg">
                Welcome to the future of digital artistry. Imagen Max BrainAI is a state-of-the-art platform that transforms your text prompts into breathtaking, high-quality images in seconds.
            </p>
            <p className="max-w-3xl mx-auto text-muted-foreground mt-4 text-base md:text-lg">
                Our advanced AI understands a vast range of styles, moods, and compositions, giving you unparalleled control to bring your imagination to life. Whether you're a professional designer, a creative hobbyist, or just curious, our tools are designed for you.
            </p>
            <Button className="mt-8" size="lg">Start Creating Now</Button>
        </section>
    );
}

function WhyChooseSection() {
    return (
        <section className="text-center py-12 md:py-20">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Imagen Max BrainAi?</h2>
        </section>
    );
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <HeroSection />
      <ImageGenerator />
      <WhyChooseSection />
    </div>
  );
}
