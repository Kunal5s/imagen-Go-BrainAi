import HeroSection from '@/components/sections/hero';
import TrustedBySection from '@/components/sections/trusted-by';
import FeaturesSection from '@/components/sections/features';
import HowItWorksSection from '@/components/sections/how-it-works';
import TestimonialsSection from '@/components/sections/testimonials';
import PricingSection from '@/components/sections/pricing';
import CtaSection from '@/components/sections/cta';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
    </>
  );
}
