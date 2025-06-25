import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    priceUnit: '',
    description: 'For starters and hobbyists.',
    features: ['10 generations per day', 'Standard Quality (1080p)', 'Access to core models', 'Personal use license'],
    cta: 'Start Generating',
    popular: false,
  },
  {
    name: 'Pro',
    price: '50',
    priceUnit: '/ month',
    description: 'For professionals and creators.',
    features: ['3,000 credits per month', 'Fast generation speed', '4K Ultra-High Quality', 'Access to all AI models', 'Commercial use license', 'Priority support'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Mega',
    price: '100',
    priceUnit: '/ month',
    description: 'For power users and teams.',
    features: ['10,000 credits per month', 'Lightning-fast speed', '4K Ultra-High Quality', 'API access (coming soon)', 'Team collaboration features', 'Dedicated support'],
    cta: 'Upgrade to Mega',
    popular: false,
  },
  {
    name: 'Booster Pack',
    price: '20',
    priceUnit: 'one-time',
    description: 'Add-on credit top-up.',
    features: ['1,000 credits', 'Immediately fast generation', 'Credits never expire'],
    cta: 'Buy Credits',
    popular: false,
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Choose Your Perfect Plan</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent pricing for Imagen BrainAI. No hidden fees.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary' : 'border'}`}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                 <div className="flex items-baseline">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.priceUnit && <span className="text-lg font-normal text-muted-foreground ml-1">{plan.priceUnit}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-chart-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>{plan.cta}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
