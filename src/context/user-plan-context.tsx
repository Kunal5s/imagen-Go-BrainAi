"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export interface PlanPurchase {
  id: string;
  planName: string;
  creditsAdded: number;
  purchaseDate: string;
  remainingCredits: number;
}

export interface User {
  email: string;
  dailyCredits: number;
  planHistory: PlanPurchase[];
  lastLoginDate: string; // YYYY-MM-DD
  dailyCreditResetHistory: string[];
}

interface UserPlanContextType {
  user: User | null;
  activePlan: { name: string, tier: number };
  totalCredits: number;
  purchasedCredits: number;
  isPlanModalOpen: boolean;
  isFreeTierExhausted: boolean;
  login: (email: string) => void;
  logout: () => void;
  purchasePlan: (planName: string, credits: number) => void;
  deductCredits: (amount: number) => void;
  getCreditCost: (quality: string) => number;
  setPlanModalOpen: (isOpen: boolean) => void;
  openPlanModal: () => void;
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined);

const FREE_DAILY_CREDITS = 10;
const FREE_TIER_RESET_LIMIT = 6;
const PLAN_TIERS: { [key: string]: number } = {
    'Free': 0,
    'Booster Pack': 1,
    'Pro': 2,
    'Mega': 3
};

const getLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

export const UserPlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isPlanModalOpen, setPlanModalOpen] = useState(false);
  
  const updateUserInStorage = useCallback((updatedUser: User | null) => {
    if (!updatedUser) return;
    const storage = getLocalStorage();
    if (!storage) return;

    const allUsers = JSON.parse(storage.getItem('imagenGoUsers') || '{}');
    allUsers[updatedUser.email] = updatedUser;
    storage.setItem('imagenGoUsers', JSON.stringify(allUsers));
  }, []);
  
  const loadUser = useCallback((email: string) => {
    const storage = getLocalStorage();
    if (!storage) return;

    const allUsersData = JSON.parse(storage.getItem('imagenGoUsers') || '{}');
    let userData: User = allUsersData[email];
    const today = new Date().toISOString().split('T')[0];

    if (!userData) {
      // First time user
      userData = {
        email,
        dailyCredits: FREE_DAILY_CREDITS,
        planHistory: [],
        lastLoginDate: today,
        dailyCreditResetHistory: [today],
      };
    } else {
       // Backward compatibility
      userData.planHistory = (userData.planHistory || []).map(p => ({
        ...p,
        remainingCredits: p.remainingCredits ?? p.creditsAdded
      }));
      userData.dailyCreditResetHistory = userData.dailyCreditResetHistory || [];
       
      if ((userData as any).credits > 0) {
        userData.planHistory.push({
          id: uuidv4(),
          planName: 'Booster Pack (Migrated)',
          creditsAdded: (userData as any).credits,
          purchaseDate: new Date().toISOString(),
          remainingCredits: (userData as any).credits,
        });
        delete (userData as any).credits;
      }

      // Reset daily credits if it's a new day, subject to limits
      if (userData.lastLoginDate !== today) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentResets = userData.dailyCreditResetHistory.filter(dateStr => new Date(dateStr) >= thirtyDaysAgo);
        
        if (recentResets.length < FREE_TIER_RESET_LIMIT) {
          userData.dailyCredits = FREE_DAILY_CREDITS;
          if (!userData.dailyCreditResetHistory.includes(today)) {
              userData.dailyCreditResetHistory.push(today);
          }
        } else {
          userData.dailyCredits = 0;
        }
        userData.lastLoginDate = today;
      }
    }
    
    setUser(userData);
    updateUserInStorage(userData);
  }, [updateUserInStorage]);

  useEffect(() => {
    const storage = getLocalStorage();
    if (!storage) return;
    const lastEmail = storage.getItem('imagenGoLastUser');
    if (lastEmail) {
      loadUser(lastEmail);
    }
  }, [loadUser]);

  const login = (email: string) => {
    const storage = getLocalStorage();
    if (!storage) return;

    storage.setItem('imagenGoLastUser', email);
    loadUser(email);
  };

  const logout = () => {
    const storage = getLocalStorage();
    if (storage) {
        storage.removeItem('imagenGoLastUser');
    }
    setUser(null);
  };

  const purchasePlan = (planName: string, credits: number) => {
    if (!user) return;

    const newPurchase: PlanPurchase = {
      id: uuidv4(),
      planName,
      creditsAdded: credits,
      purchaseDate: new Date().toISOString(),
      remainingCredits: credits,
    };

    const updatedUser = {
      ...user,
      planHistory: [...user.planHistory, newPurchase],
    };

    setUser(updatedUser);
    updateUserInStorage(updatedUser);
  };

  const { activePlan, purchasedCredits, totalCredits, isFreeTierExhausted } = useMemo(() => {
    if (!user) {
        return {
            activePlan: { name: 'Free', tier: 0 },
            purchasedCredits: 0,
            totalCredits: 0,
            isFreeTierExhausted: false,
        };
    }

    const now = new Date();
    const activePurchases = user.planHistory.filter(p => {
        const purchaseDate = new Date(p.purchaseDate);
        const expiryDate = new Date(new Date(p.purchaseDate).setDate(purchaseDate.getDate() + 30));
        return now < expiryDate;
    });

    const currentPurchasedCredits = activePurchases.reduce((sum, p) => sum + p.remainingCredits, 0);

    const highestTierPlan = activePurchases
        .filter(p => p.planName !== 'Booster Pack' && p.planName !== 'Booster Pack (Migrated)')
        .reduce((max, p) => (PLAN_TIERS[p.planName] > PLAN_TIERS[max.planName] ? p : max), { planName: 'Free' } as PlanPurchase);

    const planDetails = {
        name: highestTierPlan.planName,
        tier: PLAN_TIERS[highestTierPlan.planName]
    };
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentResets = (user.dailyCreditResetHistory || []).filter(dateStr => new Date(dateStr) >= thirtyDaysAgo);
    const freeTierExhausted = recentResets.length >= FREE_TIER_RESET_LIMIT && planDetails.tier < 2;

    return {
        activePlan: planDetails,
        purchasedCredits: currentPurchasedCredits,
        totalCredits: user.dailyCredits + currentPurchasedCredits,
        isFreeTierExhausted: freeTierExhausted,
    };
  }, [user]);
  
  const deductCredits = (amount: number) => {
    if (!user || totalCredits < amount) return;

    let amountToDeduct = amount;
    const fromDaily = Math.min(amountToDeduct, user.dailyCredits);
    const newDailyCredits = user.dailyCredits - fromDaily;
    amountToDeduct -= fromDaily;

    const updatedPlanHistory = [...user.planHistory];

    if (amountToDeduct > 0) {
        const now = new Date();
        const activePurchases = updatedPlanHistory
            .map((p, index) => ({ ...p, originalIndex: index }))
            .filter(p => {
                const purchaseDate = new Date(p.purchaseDate);
                const expiryDate = new Date(new Date(p.purchaseDate).setDate(purchaseDate.getDate() + 30));
                return now < expiryDate && p.remainingCredits > 0;
            })
            .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime());

        for (const purchase of activePurchases) {
            if (amountToDeduct === 0) break;
            const creditsToUse = Math.min(amountToDeduct, purchase.remainingCredits);
            updatedPlanHistory[purchase.originalIndex].remainingCredits -= creditsToUse;
            amountToDeduct -= creditsToUse;
        }
    }
    
    const updatedUser = {
      ...user,
      dailyCredits: newDailyCredits,
      planHistory: updatedPlanHistory,
    };
    setUser(updatedUser);
    updateUserInStorage(updatedUser);
  };
  
  const getCreditCost = (quality: string): number => {
    if (quality === 'uhd') return 20;
    if (quality === 'hd') return 10;
    return 2; // Standard and Booster Pack cost
  };

  const openPlanModal = () => setPlanModalOpen(true);

  return (
    <UserPlanContext.Provider value={{ user, activePlan, totalCredits, purchasedCredits, isPlanModalOpen, isFreeTierExhausted, login, logout, purchasePlan, deductCredits, getCreditCost, setPlanModalOpen, openPlanModal }}>
      {children}
    </UserPlanContext.Provider>
  );
};

export const useUserPlan = () => {
  const context = useContext(UserPlanContext);
  if (context === undefined) {
    throw new Error('useUserPlan must be used within a UserPlanProvider');
  }
  return context;
};
