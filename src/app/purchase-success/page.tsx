
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUserPlan } from '@/context/user-plan-context';
import { getPlanById, Plan } from '@/lib/plans';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function PurchaseSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, purchasePlan, login } = useUserPlan();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const [purchasedPlan, setPurchasedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const planId = searchParams.get('plan_id');
    const emailFromUrl = searchParams.get('email');

    if (status !== 'processing') return;

    if (!planId) {
      setErrorMessage('No plan specified in the return URL.');
      setStatus('error');
      return;
    }

    const plan = getPlanById(planId);
    if (!plan) {
      setErrorMessage(`Invalid plan ID: ${planId}`);
      setStatus('error');
      return;
    }
    setPurchasedPlan(plan);

    // If the user context has loaded, we can process the purchase
    if (user) {
      // Check for duplicate processing
      const lastPurchase = user.planHistory[user.planHistory.length - 1];
      const timeSinceLastPurchase = lastPurchase ? new Date().getTime() - new Date(lastPurchase.purchaseDate).getTime() : Infinity;
      
      if (lastPurchase && lastPurchase.planName === plan.name && timeSinceLastPurchase < 60000) {
        setStatus('success'); // Already processed recently
        return;
      }

      purchasePlan(plan);
      setStatus('success');
    } else if (emailFromUrl) {
      // If user is not loaded but we have an email, log them in. The effect will re-run.
      login(emailFromUrl);
    }

  }, [searchParams, user, login, purchasePlan, router, status]);
  
  // This handles the case where the user context isn't loading and we have no email
  useEffect(() => {
    // Only run this check if we're still processing
    if (status !== 'processing') return;

    const timeout = setTimeout(() => {
        // If after 3 seconds, we're still processing and have no user, it's likely an issue.
        if (!user) {
            setErrorMessage('Could not verify your session. Please log in and contact support if your plan is not active.');
            setStatus('error');
        }
    }, 3000); 

    return () => clearTimeout(timeout);
  }, [status, user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md text-center p-6">
        <CardHeader>
          {status === 'processing' && <CardTitle>Processing Your Purchase</CardTitle>}
          {status === 'success' && <CardTitle>Purchase Successful!</CardTitle>}
          {status === 'error' && <CardTitle>An Error Occurred</CardTitle>}
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === 'processing' && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-muted-foreground">Please wait while we activate your new plan...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <CardDescription>Your '{purchasedPlan?.name}' plan has been activated. You can now use your new credits.</CardDescription>
              <Button onClick={() => router.push('/generate')}>Start Creating</Button>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertTriangle className="h-16 w-16 text-destructive" />
              <p className="text-destructive">{errorMessage}</p>
              <Button onClick={() => router.push('/#pricing')}>Return to Pricing</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PurchaseSuccessPage() {
    return (
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-secondary">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        }>
            <PurchaseSuccessContent />
        </Suspense>
    );
}
