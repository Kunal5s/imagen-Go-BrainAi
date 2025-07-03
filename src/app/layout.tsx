import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PageTransition from '@/components/page-transition';

export const metadata: Metadata = {
  title: 'Imagen Max BrainAi: AI Image Generator',
  description: 'Transform your text prompts into breathtaking, high-quality images with Imagen Max BrainAi. Our state-of-the-art AI image generation platform offers unparalleled control, speed, and customization for designers, artists, and creatives.',
  keywords: ['AI image generator', 'text to image', 'AI art', 'digital art', 'creative tool', 'image creation', 'Imagen Max BrainAi'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>
          <Toaster />
      </body>
    </html>
  );
}
