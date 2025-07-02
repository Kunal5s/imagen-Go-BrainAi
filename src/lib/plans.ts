
export type Plan = {
    id: string;
    name: string;
    price: number;
    priceUnit?: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
    purchaseLink: string;
    generationCredits: number;
};


export const pricingPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    generationCredits: 20,
    description: 'For starters and hobbyists.',
    features: ['20 Generation Credits (Free Trial)', 'Standard model access', 'Generate images and short videos'],
    cta: 'Your Current Plan',
    popular: false,
    purchaseLink: ''
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 50,
    priceUnit: '/ month',
    generationCredits: 3000,
    description: 'For professionals and creators.',
    features: ['3,000 Generation Credits', 'Access to all models', 'Higher quality outputs', 'Commercial use license', 'Priority support'],
    cta: 'Upgrade to Pro',
    popular: true,
    purchaseLink: 'https://buy.polar.sh/polar_cl_iQpYIoo3qkW310DMOKN5lXhQo70OHOiLLU5Fp0eZ49f'
  },
  {
    id: 'mega',
    name: 'Mega',
    price: 100,
    priceUnit: '/ month',
    generationCredits: 10000,
    description: 'For power users and teams.',
    features: ['10,000 Generation Credits', 'Access to all models', 'Highest quality outputs', 'API access (coming soon)', 'Team collaboration features'],
    cta: 'Upgrade to Mega',
    popular: false,
    purchaseLink: 'https://buy.polar.sh/polar_cl_xkFeAW6Ib01eE9ya6C6jRJVdkpSmHIb9xMnXL0trOi7'
  },
  {
    id: 'booster',
    name: 'Booster Pack',
    price: 20,
    priceUnit: 'one-time',
    generationCredits: 1000,
    description: 'Add-on credit top-up.',
    features: ['1,000 Generation Credits', 'Credits never expire', 'Use with any plan'],
    cta: 'Buy Credits',
    popular: false,
    purchaseLink: 'https://buy.polar.sh/polar_cl_u5vpk1YGAidaW5Lf7PXbDiWqo7jDVyWlv1v0o3G0NAh'
  }
];

export const getPlanById = (id: string | null): Plan | null => {
    if (!id) return null;
    const plan = pricingPlans.find(p => p.id === id);
    return plan || null;
}
