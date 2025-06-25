"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface PlanPurchase {
  id: string;
  planName: string;
  creditsAdded: number;
  purchaseDate: string;
}

export interface User {
  email: string;
  credits: number; // purchased credits
  dailyCredits: number;
  planHistory: PlanPurchase[];
  lastLoginDate: string; // YYYY-MM-DD
}

interface UserPlanContextType {
  user: User | null;
  activePlan: { name: string, tier: number };
  totalCredits: number;
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

const FREE_DAILY_CREDITS = 10;
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
    let userData: User = allUsersData[email];
    const today = new Date().toISOString().split('T')[0];

    if (!userData) {
      // First time user with this email, give free daily credits
      userData = {
        email,
        credits: 0,
        dailyCredits: FREE_DAILY_CREDITS,
        planHistory: [],
        lastLoginDate: today,
      };
    } else {
      // Returning user, check if it's a new day to reset daily credits
      if (userData.lastLoginDate !== today) {
        userData.dailyCredits = FREE_DAILY_CREDITS;
        userData.lastLoginDate = today;
      }
    }
    
    setUser(userData);
    allUsersData[email] = userData;
    storage.setItem('imagenGoUsers', JSON.stringify(allUsersData));
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
      credits: user.credits + credits, // Add to purchased credits
      planHistory: [...user.planHistory, newPurchase],
    };

    setUser(updatedUser);
    updateUserInStorage(updatedUser);
  };

  const deductCredits = (amount: number) => {
    if (!user) return;

    const totalUserCredits = user.credits + user.dailyCredits;
    if (totalUserCredits < amount) return;

    const fromDaily = Math.min(amount, user.dailyCredits);
    const fromPurchased = amount - fromDaily;

    const updatedUser = { 
      ...user, 
      dailyCredits: user.dailyCredits - fromDaily,
      credits: user.credits - fromPurchased,
    };
    setUser(updatedUser);
    updateUserInStorage(updatedUser);
  };
  
  const getCreditCost = (quality: string): number => {
    if (quality === 'uhd') return 20; // Mega
    if (quality === 'hd') return 10; // Pro
    return 2; // Standard (Free/Booster)
  };

  const totalCredits = useMemo(() => {
    if (!user) return 0;
    return user.credits + user.dailyCredits;
  }, [user]);

  const activePlan = useMemo(() => {
    if (!user || !user.planHistory.length) {
      return { name: 'Free', tier: 0 };
    }
    
    // Find the highest tier subscription plan (not one-time boosters)
    const highestTierPlan = user.planHistory
        .filter(p => p.planName !== 'Booster Pack')
        .reduce((max, p) => (PLAN_TIERS[p.planName] > PLAN_TIERS[max.planName] ? p : max), { planName: 'Free' } as PlanPurchase);

    return { name: highestTierPlan.planName, tier: PLAN_TIERS[highestTierPlan.planName] };
  }, [user]);

  const openPlanModal = () => setPlanModalOpen(true);

  return (
    <UserPlanContext.Provider value={{ user, activePlan, totalCredits, isPlanModalOpen, login, logout, purchasePlan, deductCredits, getCreditCost, setPlanModalOpen, openPlanModal }}>
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
