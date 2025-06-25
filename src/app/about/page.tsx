import { BrainCircuit, Users, Eye } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">About Imagen Go BrainAi</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We are on a mission to democratize creativity and empower everyone to become a digital artist.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center p-6 border rounded-lg shadow-sm">
            <BrainCircuit className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="text-muted-foreground">
              To build the most powerful, intuitive, and accessible AI image generation tools that push the boundaries of imagination and art. We believe creativity is a fundamental human trait, and our technology is here to amplify it.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 border rounded-lg shadow-sm">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Our Team</h2>
            <p className="text-muted-foreground">
              We are a passionate team of AI researchers, software engineers, and design enthusiasts united by a love for technology and art. We are dedicated to continuous innovation and delivering a product that inspires our users.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 border rounded-lg shadow-sm">
            <Eye className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
            <p className="text-muted-foreground">
              We envision a future where the only limit to visual creation is your imagination. Imagen Go BrainAi aims to be the go-to platform for creators of all kinds, from professional designers to everyday social media users, to express their ideas visually.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
