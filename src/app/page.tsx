import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Film, Image as ImageIcon } from 'lucide-react';
import ImageGenerator from '@/components/image-generator';
import Link from 'next/link';
import FaqSection from '@/components/sections/faq';

function HeroSection() {
    return (
        <section className="text-center py-12 md:py-20">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Imagen Go BrainAi</h1>
                <p className="max-w-3xl mx-auto text-muted-foreground mt-4 text-base md:text-lg">
                    Welcome to the future of digital artistry. Imagen Go BrainAi is a state-of-the-art platform that transforms your text prompts into breathtaking, high-quality images and videos in seconds.
                </p>
                <p className="max-w-3xl mx-auto text-muted-foreground mt-4 text-base md:text-lg">
                    Our advanced AI understands a vast range of styles, moods, and compositions, giving you unparalleled control to bring your imagination to life. Whether you're a professional designer, a creative hobbyist, or just curious, our tools are designed for you.
                </p>
                <Link href="/generate">
                    <Button className="mt-8" size="lg">Start Creating Now</Button>
                </Link>
            </div>
        </section>
    );
}

const whyChooseFeatures = [
  {
    icon: Zap,
    title: 'Instant Creativity',
    description: 'Go from a simple idea to a stunning visual concept in seconds. Our high-speed generation process means less waiting and more creating.',
  },
  {
    icon: Film,
    title: 'Image & Video',
    description: 'Unleash your creativity in both static and motion formats. Generate high-resolution images or captivating short video clips from a single prompt.',
  },
  {
    icon: ImageIcon,
    title: 'Vast Model Selection',
    description: 'Choose from a wide array of specialized image and video models. Find the perfect style for any creative project, from photorealism to animation.',
  },
];

function WhyChooseSection() {
    return (
        <section className="py-12 md:py-20 bg-secondary">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold">Why Choose Imagen Go BrainAi?</h2>
                    <p className="mt-4 text-muted-foreground text-lg">
                        Our platform is built to empower your creativity with speed, variety, and precision. We provide the tools you need to not just generate content, but to craft visual stories.
                    </p>
                </div>
                <div className="mt-12 grid md:grid-cols-3 gap-8">
                    {whyChooseFeatures.map((feature, index) => (
                        <Card key={index} className="bg-card text-center p-8 shadow-lg">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-muted rounded-full">
                                    <feature.icon className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 my-12">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Try It Now</h2>
            <p className="max-w-3xl mx-auto text-muted-foreground mt-4 text-base md:text-lg">
                Enter a prompt below to see the magic happen.
            </p>
        </div>
        <ImageGenerator />
      </div>
      <WhyChooseSection />
      <FaqSection />
    </>
  );
}
