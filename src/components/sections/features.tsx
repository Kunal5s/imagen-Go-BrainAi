"use client";

import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const features = [
  {
    value: 'culling',
    title: 'AI Culling',
    description: 'Never waste time on manual selection again. Our AI analyzes your photos for focus, composition, and duplicates, delivering the best shots in minutes.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'photo selection',
    points: ['Finds blurry or out-of-focus shots', 'Groups similar photos for easy comparison', 'Detects closed eyes'],
  },
  {
    value: 'editing',
    title: 'AI Editing',
    description: 'Teach Imagen your editing style, and it will apply it consistently to your entire gallery. Get a beautiful, consistent look every time.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'photo editing',
    points: ['Learns from your past edits', 'Adjusts exposure, color, and tone', 'Applies your unique style to batches of photos'],
  },
  {
    value: 'cloud',
    title: 'Cloud Storage',
    description: 'Store and share your photos securely in the cloud. Access your work from anywhere and collaborate with clients effortlessly.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'cloud storage',
    points: ['Secure backups', 'Easy sharing with clients', 'Access from any device'],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Features that work for you</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Our powerful AI tools are designed to streamline your workflow and unleash your creativity.
          </p>
        </div>
        <Tabs defaultValue="culling" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-10 max-w-2xl mx-auto">
            {features.map((feature) => (
              <TabsTrigger key={feature.value} value={feature.value}>{feature.title}</TabsTrigger>
            ))}
          </TabsList>
          {features.map((feature) => (
            <TabsContent key={feature.value} value={feature.value}>
              <Card>
                <CardContent className="p-0 md:p-0">
                  <div className="grid md:grid-cols-2 gap-0 items-center">
                    <div className="p-8 md:p-12">
                      <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground mb-6">{feature.description}</p>
                      <ul className="space-y-3">
                        {feature.points.map((point) => (
                          <li key={point} className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-chart-2" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="aspect-square md:aspect-auto h-full w-full">
                       <Image
                        src={feature.image}
                        alt={feature.title}
                        data-ai-hint={feature.aiHint}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover rounded-b-lg md:rounded-r-lg md:rounded-bl-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
