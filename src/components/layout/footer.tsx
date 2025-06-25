import Link from 'next/link';
import { BrainCircuit, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const socialLinks = [
  { href: '#', icon: Facebook },
  { href: '#', icon: Twitter },
  { href: '#', icon: Instagram },
  { href: '#', icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <BrainCircuit className="h-6 w-6" />
              <span>Imagen Max BrainAi</span>
            </Link>
          </div>
          
          <div className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Imagen Max BrainAi. All rights reserved.
          </div>

          <div className="flex gap-4">
            {socialLinks.map((link, index) => (
              <Link key={index} href={link.href} className="text-muted-foreground hover:text-foreground">
                <link.icon className="h-5 w-5" />
                <span className="sr-only">Social link {index + 1}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
