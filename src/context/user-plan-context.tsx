"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface PlanPurchase {
  id: string;
  planName: string;
  creditsAdded: number;
  purchaseDate: string;
}

export interface User {
  email: string;
  credits: number;
  planHistory: PlanPurchase[];
}

interface UserPlanContextType {
  user: User | null;
  activePlan: { name: string, tier: number };
  isPlanModalOpen: boolean;
  login: (email: string) => void;
  logout: () => void;
  purchasePlan: (planName: string, credits: number) => void;
  deductCredits: (amount: number) => void;
  getCreditCost: (quality: string) => number;
  setPlanModalOpen: (isOpen: boolean) => void;
  openPlanModal: () => void;
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined);

const FREE_PLAN_CREDITS = 10;
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
  
  const loadUser = useCallback((email: string) => {
    const storage = getLocalStorage();
    if (!storage) return;

    const allUsersData = JSON.parse(storage.getItem('imagenGoUsers') || '{}');
    let userData = allUsersData[email];

    if (!userData) {
      // First time user with this email, give free credits
      userData = {
        email,
        credits: FREE_PLAN_CREDITS,
        planHistory: [{
            id: uuidv4(),
            planName: 'Free',
            creditsAdded: FREE_PLAN_CREDITS,
            purchaseDate: new Date().toISOString()
        }],
      };
      allUsersData[email] = userData;
      storage.setItem('imagenGoUsers', JSON.stringify(allUsersData));
    }
    setUser(userData);
  }, []);

  useEffect(() => {
    const storage = getLocalStorage();
    if (!storage) return;

    const lastEmail = storage.getItem('imagenGoLastUser');
    if (lastEmail) {
      loadUser(lastEmail);
    }
  }, [loadUser]);

  const updateUserInStorage = (updatedUser: User) => {
    const storage = getLocalStorage();
    if (!storage) return;

    const allUsers = JSON.parse(storage.getItem('imagenGoUsers') || '{}');
    allUsers[updatedUser.email] = updatedUser;
    storage.setItem('imagenGoUsers', JSON.stringify(allUsers));
  };

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
    };

    const updatedUser = {
      ...user,
      credits: user.credits + credits,
      planHistory: [...user.planHistory, newPurchase],
    };

    setUser(updatedUser);
    updateUserInStorage(updatedUser);
  };

  const deductCredits = (amount: number) => {
    if (!user || user.credits < amount) return;

    const updatedUser = { ...user, credits: user.credits - amount };
    setUser(updatedUser);
    updateUserInStorage(updatedUser);
  };
  
  const getCreditCost = (quality: string): number => {
    if (quality === 'uhd') return 20; // Mega
    if (quality === 'hd') return 10; // Pro
    return 2; // Standard (Free/Booster)
  };

  const activePlan = React.useMemo(() => {
    if (!user || !user.planHistory.length) {
      return { name: 'Free', tier: 0 };
    }
    
    // Find the highest tier subscription plan (not one-time boosters)
    const highestTierPlan = user.planHistory
        .filter(p => p.planName !== 'Booster Pack')
        .reduce((max, p) => (PLAN_TIERS[p.planName] > PLAN_TIERS[max.planName] ? p : max), { planName: 'Free' });

    return { name: highestTierPlan.planName, tier: PLAN_TIERS[highestTierPlan.planName] };
  }, [user]);

  const openPlanModal = () => setPlanModalOpen(true);

  return (
    <UserPlanContext.Provider value={{ user, activePlan, isPlanModalOpen, login, logout, purchasePlan, deductCredits, getCreditCost, setPlanModalOpen, openPlanModal }}>
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
