
"use client"

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPlan } from '@/context/user-plan-context';
import { useToast } from '@/hooks/use-toast';
import { pricingPlans } from '@/lib/plans';

export default function PricingSection() {
  const { user, openPlanModal } = useUserPlan();
  const { toast } = useToast();

  const handlePurchase = (plan: typeof pricingPlans[0]) => {
    if (plan.id === 'free' || !plan.purchaseLink) return;

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in with your email before purchasing a plan.",
        variant: "destructive",
      });
      openPlanModal();
      return;
    }

    const emailQueryParam = `email=${encodeURIComponent(user.email)}`;
    const successUrlParam = `success_url=${encodeURIComponent(`${window.location.origin}/purchase-success?plan_id=${plan.id}&email=${user.email}`)}`;
    
    const purchaseUrl = `${plan.purchaseLink}?${emailQueryParam}&${successUrlParam}`;
    window.location.href = purchaseUrl;
  };

  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Choose Your Perfect Plan</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent pricing for Imagen Go BrainAi. Your credits, your creations.
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
