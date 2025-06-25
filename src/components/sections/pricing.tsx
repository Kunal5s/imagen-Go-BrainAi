"use client"

import { Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPlan } from '@/context/user-plan-context';
import { useToast } from '@/hooks/use-toast';

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 10,
    description: 'For starters and hobbyists.',
    features: ['10 daily credits', 'Standard Quality (1080p)', '5 images per generation', 'Personal use license'],
    cta: 'Your Current Plan',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 50,
    priceUnit: '/ month',
    credits: 3000,
    description: 'For professionals and creators.',
    features: ['3,000 credits per month', 'HD (2K) Quality access', '10 credits per image', 'Commercial use license', 'Priority support'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'mega',
    name: 'Mega',
    price: 100,
    priceUnit: '/ month',
    credits: 10000,
    description: 'For power users and teams.',
    features: ['10,000 credits per month', '4K Ultra-High Quality access', '20 credits per image', 'API access (coming soon)', 'Team collaboration features'],
    cta: 'Upgrade to Mega',
    popular: false,
  },
  {
    id: 'booster',
    name: 'Booster Pack',
    price: 20,
    priceUnit: 'one-time',
    credits: 1000,
    description: 'Add-on credit top-up.',
    features: ['1,000 credits', '15 credits per image', 'Credits never expire', 'Use with any plan'],
    cta: 'Buy Credits',
    popular: false,
  }
];

export default function PricingSection() {
  const { user, purchasePlan, openPlanModal } = useUserPlan();
  const { toast } = useToast();

  const handlePurchase = (plan: typeof pricingPlans[0]) => {
    if (plan.id === 'free') return;

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in with your email before purchasing a plan.",
        variant: "destructive",
      });
      openPlanModal();
      return;
    }

    if (plan.id === 'mega') {
      window.location.href = 'https://buy.polar.sh/polar_cl_xkFeAW6Ib01eE9ya6C6jRJVdkpSmHIb9xMnXL0trOi7';
      return;
    }

    if (plan.id === 'booster') {
      window.location.href = 'https://buy.polar.sh/polar_cl_u5vpk1YGAidaW5Lf7PXbDiWqo7jDVyWlv1v0o3G0NAh';
      return;
    }

    purchasePlan(plan.name, plan.credits);
    toast({
      title: "Plan Purchased!",
      description: `You've successfully purchased the ${plan.name} plan. ${plan.credits} credits have been added to your account.`,
    });
  };

  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Choose Your Perfect Plan</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent pricing for Imagen Go. Your credits, your creations.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
                      <Check className="h-5 w-5 text-chart-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handlePurchase(plan)}
                  disabled={plan.id === 'free'}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
