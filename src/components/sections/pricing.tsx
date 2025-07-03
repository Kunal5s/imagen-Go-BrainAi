
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    title: 'Free',
    price: '$0',
    period: '/ month',
    description: 'For starters and hobbyists.',
    features: [
      '10 generations per day',
      'Standard Quality (1080p)',
      'Access to core models',
      'Personal use license',
    ],
    buttonText: 'Start Generating',
    buttonVariant: 'outline' as 'outline' | 'default',
    href: '/generate',
    highlighted: false,
  },
  {
    title: 'Pro',
    price: '$50',
    period: '/ month',
    description: 'For professionals and creators.',
    features: [
        '3,000 credits per month',
        'Fast generation speed',
        '4K Ultra-High Quality',
        'Access to all AI models',
        'Commercial use license',
        'Priority support',
    ],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'default' as 'outline' | 'default',
    href: '/generate',
    highlighted: true,
  },
  {
    title: 'Mega',
    price: '$100',
    period: '/ month',
    description: 'For power users and teams.',
    features: [
        '10,000 credits per month',
        'Lightning-fast speed',
        '4K Ultra-High Quality',
        'API access (coming soon)',
        'Team collaboration features',
        'Dedicated support',
    ],
    buttonText: 'Upgrade to Mega',
    buttonVariant: 'outline' as 'outline' | 'default',
    href: '/generate',
    highlighted: false,
  },
    {
    title: 'Booster Pack',
    price: '$20',
    period: 'one-time',
    description: 'Add-on credit top-up.',
    features: [
      '1,000 credits',
      'Immediately fast generation',
      'Credits never expire',
    ],
    buttonText: 'Buy Credits',
    buttonVariant: 'outline' as 'outline' | 'default',
    href: '/generate',
    highlighted: false,
  },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card key={plan.title} className={`flex flex-col shadow-lg ${plan.highlighted ? 'border-primary ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{plan.title}</span>
                  {plan.highlighted && <div className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full">Most Popular</div>}
                </CardTitle>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button variant={plan.buttonVariant} className="w-full">
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
