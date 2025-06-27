
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Plan } from '@/lib/plans';

export interface PlanPurchase {
  id: string;
  planName: string;
  purchaseDate: string;
  googleImagenCreditsAdded: number;
  googleImagenCreditsRemaining: number;
  pollinationsCreditsAdded: number;
  pollinationsCreditsRemaining: number;
}

export interface User {
  email: string;
  planHistory: PlanPurchase[];
  lastLoginDate: string; 
  loginHistory: string[];
}

interface UserPlanContextType {
  user: User | null;
  activePlan: { name: string, tier: number };
  totalGoogleImagenCredits: number;
  totalPollinationsCredits: number;
  isPlanModalOpen: boolean;
  isLoginLocked: boolean;
  lastUsedEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
  purchasePlan: (plan: Plan) => void;
  deductCredits: (amount: number, model: 'google-imagen' | 'pollinations') => void;
  getCreditCost: (quality: string, model: 'google-imagen' | 'pollinations') => number;
  setPlanModalOpen: (isOpen: boolean) => void;
  openPlanModal: () => void;
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined);

const LOGIN_LIMIT = 6;
const LOGIN_PERIOD_DAYS = 30;

const PLAN_TIERS: { [key: string]: number } = {
    'Free': 0,
    'Free Trial': 0,
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
  const [lastUsedEmail, setLastUsedEmail] = useState<string | null>(null);
  
  const updateUserInStorage = useCallback((updatedUser: User | null) => {
    if (!updatedUser) return;
    const storage = getLocalStorage();
    if (!storage) return;

    const allUsers = JSON.parse(storage.getItem('imagenGoBrainAiUsers') || '{}');
    allUsers[updatedUser.email] = updatedUser;
    storage.setItem('imagenGoBrainAiUsers', JSON.stringify(allUsers));
  }, []);
  
  const loadUser = useCallback((email: string) => {
    const storage = getLocalStorage();
    if (!storage) return;

    const allUsersData = JSON.parse(storage.getItem('imagenGoBrainAiUsers') || '{}');
    let userData: User = allUsersData[email];
    const today = new Date().toISOString().split('T')[0];

    if (!userData) {
      // First time user - give them free trial credits
      const freeTrialPurchase: PlanPurchase = {
        id: uuidv4(),
        planName: 'Free Trial',
        purchaseDate: new Date().toISOString(),
        googleImagenCreditsAdded: 20,
        googleImagenCreditsRemaining: 20,
        pollinationsCreditsAdded: 20,
        pollinationsCreditsRemaining: 20,
      };
      userData = {
        email,
        planHistory: [freeTrialPurchase],
        lastLoginDate: today,
        loginHistory: [today],
      };
    } else {
      // Returning user
      userData.loginHistory = userData.loginHistory || [];
      if (userData.lastLoginDate !== today) {
        if (!userData.loginHistory.includes(today)) {
          userData.loginHistory.push(today);
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
    const lastActiveEmail = storage.getItem('imagenGoBrainAiLastUser');
    if (lastActiveEmail) {
      loadUser(lastActiveEmail);
    }
    const lastEverUsedEmail = storage.getItem('imagenGoBrainAiLastUsedEmail');
    if (lastEverUsedEmail) {
      setLastUsedEmail(lastEverUsedEmail);
    }
  }, [loadUser]);

  const login = (email: string) => {
    const storage = getLocalStorage();
    if (!storage) return;

    storage.setItem('imagenGoBrainAiLastUser', email);
    storage.setItem('imagenGoBrainAiLastUsedEmail', email);
    setLastUsedEmail(email);
    loadUser(email);
  };

  const logout = () => {
    const storage = getLocalStorage();
    if (storage) {
        storage.removeItem('imagenGoBrainAiLastUser');
    }
    setUser(null);
  };

  const purchasePlan = (plan: Plan) => {
    if (!user) return;

    const newPurchase: PlanPurchase = {
      id: uuidv4(),
      planName: plan.name,
      purchaseDate: new Date().toISOString(),
      googleImagenCreditsAdded: plan.googleImagenCredits,
      googleImagenCreditsRemaining: plan.googleImagenCredits,
      pollinationsCreditsAdded: plan.pollinationsCredits,
      pollinationsCreditsRemaining: plan.pollinationsCredits,
    };

    const updatedUser = {
      ...user,
      planHistory: [...user.planHistory, newPurchase],
    };

    setUser(updatedUser);
    updateUserInStorage(updatedUser);
  };

  const { activePlan, totalGoogleImagenCredits, totalPollinationsCredits, isLoginLocked } = useMemo(() => {
    if (!user) {
        return {
            activePlan: { name: 'Free', tier: 0 },
            totalGoogleImagenCredits: 0,
            totalPollinationsCredits: 0,
            isLoginLocked: false,
        };
    }

    const now = new Date();
    const activePurchases = user.planHistory.filter(p => {
        const purchaseDate = new Date(p.purchaseDate);
        if (p.planName === 'Booster Pack' || p.planName === 'Free Trial') return true; // These don't expire
        const expiryDate = new Date(new Date(p.purchaseDate).setDate(purchaseDate.getDate() + 30));
        return now < expiryDate;
    });

    const currentGoogleImagenCredits = activePurchases.reduce((sum, p) => sum + p.googleImagenCreditsRemaining, 0);
    const currentPollinationsCredits = activePurchases.reduce((sum, p) => sum + p.pollinationsCreditsRemaining, 0);

    const highestTierPlan = activePurchases
        .filter(p => p.planName !== 'Booster Pack' && p.planName !== 'Free Trial')
        .reduce((max, p) => (PLAN_TIERS[p.planName] > PLAN_TIERS[max.planName] ? p : max), { planName: 'Free' } as PlanPurchase);

    const planDetails = {
        name: highestTierPlan?.planName || 'Free',
        tier: PLAN_TIERS[highestTierPlan?.planName || 'Free']
    };
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLogins = (user.loginHistory || []).filter(dateStr => new Date(dateStr) >= thirtyDaysAgo);
    const loginLocked = planDetails.tier === 0 && recentLogins.length > LOGIN_LIMIT;
    
    return {
        activePlan: planDetails,
        totalGoogleImagenCredits: currentGoogleImagenCredits,
        totalPollinationsCredits: currentPollinationsCredits,
        isLoginLocked: loginLocked,
    };
  }, [user]);
  
  const deductCredits = (amount: number, model: 'google-imagen' | 'pollinations') => {
    if (!user) return;
    
    const creditsToDeduct = model === 'google-imagen' ? totalGoogleImagenCredits : totalPollinationsCredits;
    if (creditsToDeduct < amount) return;

    let amountToDeduct = amount;
    const updatedPlanHistory = [...user.planHistory];
    
    const now = new Date();
    const activePurchases = updatedPlanHistory
        .map((p, index) => ({ ...p, originalIndex: index }))
        .filter(p => {
            if (p.planName === 'Booster Pack' || p.planName === 'Free Trial') return true;
            const purchaseDate = new Date(p.purchaseDate);
            const expiryDate = new Date(new Date(p.purchaseDate).setDate(purchaseDate.getDate() + 30));
            return now < expiryDate;
        })
        .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime());

    for (const purchase of activePurchases) {
        if (amountToDeduct === 0) break;

        if (model === 'google-imagen') {
            const creditsToUse = Math.min(amountToDeduct, purchase.googleImagenCreditsRemaining);
            updatedPlanHistory[purchase.originalIndex].googleImagenCreditsRemaining -= creditsToUse;
            amountToDeduct -= creditsToUse;
        } else { // 'pollinations'
            const creditsToUse = Math.min(amountToDeduct, purchase.pollinationsCreditsRemaining);
            updatedPlanHistory[purchase.originalIndex].pollinationsCreditsRemaining -= creditsToUse;
            amountToDeduct -= creditsToUse;
        }
    }
    
    const updatedUser = {
      ...user,
      planHistory: updatedPlanHistory,
    };
    setUser(updatedUser);
    updateUserInStorage(updatedUser);
  };
  
  const getCreditCost = (quality: string, model: 'google-imagen' | 'pollinations'): number => {
    if (model === 'pollinations') {
        return 20; // Per generation
    }

    // Google Imagen Costs
    if (quality === 'uhd') return 90; // Per generation
    if (quality === 'hd') return 50; // Per generation
    return 10; // Standard quality per generation
  };

  const openPlanModal = () => setPlanModalOpen(true);

  return (
    <UserPlanContext.Provider value={{ user, activePlan, totalGoogleImagenCredits, totalPollinationsCredits, isPlanModalOpen, isLoginLocked, lastUsedEmail, login, logout, purchasePlan, deductCredits, getCreditCost, setPlanModalOpen, openPlanModal }}>
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
