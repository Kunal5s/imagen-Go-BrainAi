import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const pricingPlans = [
  {
    name: 'Pay-as-you-go',
    price: '0.05',
    priceUnit: 'per photo',
    description: 'Perfect for trying out Imagen or for occasional use.',
    features: ['AI Editing', 'AI Culling', 'Cloud Storage', 'No commitment'],
    cta: 'Start editing',
  },
  {
    name: 'Annual Plan',
    price: '40',
    priceUnit: 'per month',
    description: 'Best value for professionals and studios with high volume.',
    features: ['Unlimited AI Editing', 'Unlimited AI Culling', '1TB Cloud Storage', 'Priority support'],
    cta: 'Choose Annual',
    popular: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Pricing that makes sense</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Choose a plan that fits your workflow. No hidden fees.
          </p>
        </div>
        <div className="flex justify-center flex-wrap gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={`w-full max-w-sm flex flex-col ${plan.popular ? 'border-primary-foreground/50 ring-2 ring-primary-foreground/30' : ''}`}>
              <CardHeader>
                {plan.popular && <div className="text-xs font-bold uppercase text-primary-foreground/80 tracking-wider mb-2 text-center">Most Popular</div>}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground"> {plan.priceUnit}</span>
                </div>
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
                <Button className="w-full" variant={plan.popular ? 'default' : 'secondary'}>{plan.cta}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
