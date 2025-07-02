import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    frequency: '/ month',
    description: 'Perfect for trying out the platform and generating a few ideas.',
    features: [
      '10 Generation Credits per month',
      'Access to standard models',
      'Standard image quality',
      'Personal use license',
    ],
    buttonText: 'Start for Free',
    href: '/generate',
  },
  {
    name: 'Pro',
    price: '$15',
    frequency: '/ month',
    description: 'For artists, designers, and creators who need more power.',
    features: [
      '200 Generation Credits per month',
      'Access to all models, including premium',
      'High-resolution image quality',
      'Commercial use license',
      'Priority support',
    ],
    buttonText: 'Upgrade to Pro',
    href: '/generate',
    popular: true,
  },
  {
    name: 'Mega',
    price: '$45',
    frequency: '/ month',
    description: 'The ultimate plan for professionals and power users.',
    features: [
      '1,000 Generation Credits per month',
      'All features of Pro plan',
      '4K ultra-high quality generations',
      'Early access to new features',
      'API Access (coming soon)',
    ],
    buttonText: 'Go Mega',
    href: '/generate',
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Flexible Plans for Every Creator</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No hidden fees. Choose a plan and start creating today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={cn('flex flex-col shadow-lg', plan.popular ? 'border-primary' : '')}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{plan.name}</span>
                  {plan.popular && <div className="text-sm font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full">Most Popular</div>}
                </CardTitle>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.frequency}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button variant={plan.popular ? 'default' : 'outline'} className="w-full">
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
