'use client';

import { Crown, X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PremiumUpgradeBannerProps {
  feature: string;
  requiredTier: 'basic' | 'premium' | 'elite';
  currentTier: 'free' | 'basic' | 'premium' | 'elite';
}

const tierNames = {
  basic: 'Basic',
  premium: 'Premium',
  elite: 'Elite'
};

export function PremiumUpgradeBanner({ feature, requiredTier, currentTier }: PremiumUpgradeBannerProps) {
  const router = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  // Don't show if user already has required tier or higher
  const tierHierarchy = { free: 0, basic: 1, premium: 2, elite: 3 };
  if (tierHierarchy[currentTier] >= tierHierarchy[requiredTier]) return null;

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-purple-50 border-2 border-orange-200 p-4 mb-4 relative">
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="p-2 bg-orange-100 rounded-full">
          <Crown className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">Upgrade to {tierNames[requiredTier]} to unlock this feature</h3>
          <p className="text-sm text-gray-600 mb-3">
            {feature} is available exclusively for {tierNames[requiredTier]} members and above.
          </p>
          <Button onClick={() => router.push('/pricing')} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Crown className="w-4 h-4 mr-2" />
            View Plans
          </Button>
        </div>
      </div>
    </Card>
  );
}
