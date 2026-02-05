export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'elite';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  billing: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  discount?: number;
}

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
  autoRenew: boolean;
}
