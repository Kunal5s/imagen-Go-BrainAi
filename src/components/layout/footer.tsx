import Link from 'next/link';
import { Rocket, Twitter, Github, Linkedin } from 'lucide-react';

const footerLinks = {
  Product: [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#', label: 'Downloads' },
    { href: '#', label: 'Blog' },
  ],
  Company: [
    { href: '#', label: 'About us' },
    { href: '#', label: 'Careers' },
    { href: '#', label: 'Contact' },
  ],
  Resources: [
    { href: '#', label: 'Support' },
    { href: '#', label: 'Affiliates' },
    { href: '#', label: 'Ambassadors' },
  ],
};

const socialLinks = [
  { href: '#', icon: Twitter },
  { href: '#', icon: Github },
  { href: '#', icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Rocket className="h-6 w-6" />
              <span>Imagen</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered photo editing assistant.
            </p>
          </div>
          
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Imagen Clone. All rights reserved.</p>
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
