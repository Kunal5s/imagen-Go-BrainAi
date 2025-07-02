import PricingSection from '@/components/sections/pricing';

export default function PricingPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Find the Perfect Plan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your creative needs. All plans come with access to our powerful suite of AI generation tools.
          </p>
        </div>
        <div className="mt-16">
          <PricingSection />
        </div>
      </div>
    </div>
  );
}
