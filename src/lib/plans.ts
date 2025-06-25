
export const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 10,
    description: 'For starters and hobbyists.',
    features: ['10 daily credits', '2 credits per image (Standard)', '5 images per generation', 'Personal use license'],
    cta: 'Your Current Plan',
    popular: false,
    purchaseLink: ''
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 50,
    priceUnit: '/ month',
    credits: 3000,
    description: 'For professionals and creators.',
    features: ['3,000 credits per month', '10 credits per image (HD)', 'HD (2K) Quality access', 'Commercial use license', 'Priority support'],
    cta: 'Upgrade to Pro',
    popular: true,
    purchaseLink: 'https://buy.polar.sh/polar_cl_iQpYIoo3qkW310DMOKN5lXhQo70OHOiLLU5Fp0eZ49f'
  },
  {
    id: 'mega',
    name: 'Mega',
    price: 100,
    priceUnit: '/ month',
    credits: 10000,
    description: 'For power users and teams.',
    features: ['10,000 credits per month', '20 credits per image (UHD)', '4K Ultra-High Quality access', 'API access (coming soon)', 'Team collaboration features'],
    cta: 'Upgrade to Mega',
    popular: false,
    purchaseLink: 'https://buy.polar.sh/polar_cl_xkFeAW6Ib01eE9ya6C6jRJVdkpSmHIb9xMnXL0trOi7'
  },
  {
    id: 'booster',
    name: 'Booster Pack',
    price: 20,
    priceUnit: 'one-time',
    credits: 1000,
    description: 'Add-on credit top-up.',
    features: ['1,000 credits', '2 credits per image (Standard)', 'Credits never expire', 'Use with any plan'],
    cta: 'Buy Credits',
    popular: false,
    purchaseLink: 'https://buy.polar.sh/polar_cl_u5vpk1YGAidaW5Lf7PXbDiWqo7jDVyWlv1v0o3G0NAh'
  }
];

export const getPlanById = (id: string | null) => {
    if (!id) return null;
    return pricingPlans.find(p => p.id === id);
}
