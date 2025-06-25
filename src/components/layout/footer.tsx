import Link from 'next/link';
import { BrainCircuit, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const socialLinks = [
  { href: '#', icon: Facebook, name: 'Facebook' },
  { href: '#', icon: Twitter, name: 'Twitter' },
  { href: '#', icon: Instagram, name: 'Instagram' },
  { href: '#', icon: Linkedin, name: 'LinkedIn' },
];

const companyLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/#pricing', label: 'Pricing' },
];

const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/disclaimer', label: 'Disclaimer' },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                  <BrainCircuit className="h-6 w-6" />
                  <span>Imagen Go</span>
                </Link>
                <p className="text-muted-foreground text-sm">The future of AI-powered image generation.</p>
                <div className="flex gap-4">
                    {socialLinks.map((link) => (
                      <Link key={link.name} href={link.href} className="text-muted-foreground hover:text-foreground">
                        <link.icon className="h-5 w-5" />
                        <span className="sr-only">{link.name}</span>
                      </Link>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                    {companyLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                    {legalLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="font-semibold mb-4">Subscribe</h4>
                <p className="text-sm text-muted-foreground mb-2">Join our newsletter to stay up to date on features and releases.</p>
                {/* A real form would go here */}
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <input type="email" placeholder="Enter your email" className="w-full text-sm p-2 border rounded-md" />
                    <button className="text-sm p-2 bg-primary text-primary-foreground rounded-md">Subscribe</button>
                </div>
            </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Imagen Go. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
