
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/generate', label: 'Generate' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold mr-4">
            <BrainCircuit className="h-6 w-6" />
            <span className="hidden sm:inline-block text-lg">Imagen Max BrainAi</span>
            <span className="sm:hidden text-lg whitespace-nowrap">BrainAi</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-foreground/70 transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center p-4 border-b">
                      <Link href="/" className="flex items-center gap-2 font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                        <BrainCircuit className="h-6 w-6" />
                        <span>Imagen Max BrainAi</span>
                      </Link>
                    </div>
                    <nav className="flex flex-col gap-4 p-4">
                      {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
