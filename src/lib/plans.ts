

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
    googleImagenCredits: number;
    pollinationsCredits: number;
};


export const pricingPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    googleImagenCredits: 0,
    pollinationsCredits: 20,
    description: 'For starters and hobbyists.',
    features: ['20 Pollinations credits (Free Trial)', 'Standard Quality generations', 'Upgrade to use Google Imagen 3'],
    cta: 'Your Current Plan',
    popular: false,
    purchaseLink: ''
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 50,
    priceUnit: '/ month',
    googleImagenCredits: 1500,
    pollinationsCredits: 1500,
    description: 'For professionals and creators.',
    features: ['1,500 Google Imagen 3 credits', '1,500 Pollinations credits', 'HD (2K) Quality access', 'Commercial use license', 'Priority support'],
    cta: 'Upgrade to Pro',
    popular: true,
    purchaseLink: 'https://buy.polar.sh/polar_cl_iQpYIoo3qkW310DMOKN5lXhQo70OHOiLLU5Fp0eZ49f'
  },
  {
    id: 'mega',
    name: 'Mega',
    price: 100,
    priceUnit: '/ month',
    googleImagenCredits: 5000,
    pollinationsCredits: 5000,
    description: 'For power users and teams.',
    features: ['5,000 Google Imagen 3 credits', '5,000 Pollinations credits', '4K Ultra-High Quality access', 'API access (coming soon)', 'Team collaboration features'],
    cta: 'Upgrade to Mega',
    popular: false,
    purchaseLink: 'https://buy.polar.sh/polar_cl_xkFeAW6Ib01eE9ya6C6jRJVdkpSmHIb9xMnXL0trOi7'
  },
  {
    id: 'booster',
    name: 'Booster Pack',
    price: 20,
    priceUnit: 'one-time',
    googleImagenCredits: 500,
    pollinationsCredits: 500,
    description: 'Add-on credit top-up.',
    features: ['500 Google Imagen 3 credits', '500 Pollinations credits', 'Credits never expire', 'Use with any plan'],
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
