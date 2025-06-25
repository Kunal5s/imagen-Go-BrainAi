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

const allowedDomains = ["@gmail.com", "@yahoo.com"];

export default function ActivePlanModal({ isOpen, onOpenChange }: ActivePlanModalProps) {
  const { user, totalCredits, purchasedCredits, login, logout } = useUserPlan();
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    const isValidDomain = allowedDomains.some(domain => trimmedEmail.endsWith(domain));

    if (!isValidDomain) {
      toast({
        title: "Invalid Email Provider",
        description: "For security, only Gmail and Yahoo accounts are allowed.",
        variant: "destructive",
      });
      return;
    }
    
    login(trimmedEmail);
    toast({
      title: "Switched Account",
      description: `You are now managing the plan for ${trimmedEmail}.`,
    });
  };

  const handleLogout = () => {
    logout();
    onOpenChange(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
    });
  };
  
  const renderPlanHistory = (planHistory: PlanPurchase[]) => {
    const sortedHistory = [...planHistory].sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
    
    return (
        <div className="space-y-2">
        <h4 className="font-semibold">Purchase History</h4>
        <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
            {sortedHistory.length > 0 ? (
            <ul className="divide-y">
                {sortedHistory.map((p) => {
                    const expiryDate = new Date(new Date(p.purchaseDate).setDate(new Date(p.purchaseDate).getDate() + 30));
                    const isExpired = new Date() > expiryDate;
                    return (
                        <li key={p.id} className={`py-2 ${isExpired ? 'opacity-50' : ''}`}>
                            <div className="flex justify-between items-center">
                                <p className="font-medium">{p.planName}</p>
                                <p className="text-sm font-semibold">{p.remainingCredits} / {p.creditsAdded} left</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Purchased on {format(new Date(p.purchaseDate), 'PPP')}
                            </p>
                            <p className={`text-xs ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {isExpired ? `Expired on ${format(expiryDate, 'PPP')}` : `Expires on ${format(expiryDate, 'PPP')}`}
                            </p>
                        </li>
                    )
                })}
            </ul>
            ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No plans purchased yet.</p>
            )}
        </div>
        </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Active Plan Management</DialogTitle>
          <DialogDescription>
            Enter your email to activate your plan or log in. Your plan is linked to your email address and persists across devices.
          </DialogDescription>
        </DialogHeader>
        
        {user ? (
          <div className="space-y-4">
            <div>
              <Label>Current Email</Label>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <Label>Total Credits Available</Label>
              <p className="text-2xl font-bold">{totalCredits}</p>
              <p className="text-xs text-muted-foreground">
                Includes {user.dailyCredits} daily credits and {purchasedCredits} purchased credits.
              </p>
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
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
               <p className="text-xs text-muted-foreground">
                You must use a valid @gmail.com or @yahoo.com email address.
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
