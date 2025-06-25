"use client";

import { useState } from 'react';
import { useUserPlan, PlanPurchase } from '@/context/user-plan-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ActivePlanModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ActivePlanModal({ isOpen, onOpenChange }: ActivePlanModalProps) {
  const { user, login, logout, purchasePlan } = useUserPlan();
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    if (email) {
      login(email);
      toast({
        title: "Switched Account",
        description: `You are now managing the plan for ${email}.`,
      });
    } else {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    onOpenChange(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
    });
  };
  
  const renderPlanHistory = (planHistory: PlanPurchase[]) => (
    <div className="space-y-2">
      <h4 className="font-semibold">Plan History</h4>
      <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
        {planHistory.length > 0 ? (
          <ul className="divide-y">
            {planHistory.map((p) => (
              <li key={p.id} className="py-2">
                <p className="font-medium">{p.planName}</p>
                <p className="text-sm text-muted-foreground">
                  +{p.creditsAdded} credits on {format(new Date(p.purchaseDate), 'PPP')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No plans purchased yet.</p>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Active Plan Management</DialogTitle>
          <DialogDescription>
            Enter the email you used to purchase a plan to activate it. Your plan is linked to your email address and persists across devices.
          </DialogDescription>
        </DialogHeader>
        
        {user ? (
          <div className="space-y-4">
            <div>
              <Label>Current Email</Label>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <Label>Total Credits</Label>
              <p className="text-2xl font-bold">{user.credits}</p>
            </div>
            {renderPlanHistory(user.planHistory)}
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Log Out & Switch Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-login">Your Purchase Email</Label>
              <Input
                id="email-login"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
               <p className="text-xs text-muted-foreground">
                You must use the same email address you provided during purchase.
              </p>
            </div>
            <Button onClick={handleLogin} className="w-full">
              Activate Plan / Login
            </Button>
          </div>
        )}
        
        <DialogFooter>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
