export type ProductCategory = 'Electronics' | 'Apparel' | 'Home & Living' | 'Fitness & Wellness' | 'Accessories';

export interface ProductReview {
  id: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  priceCents: number; // integer cents to avoid floating-point errors
  originalPriceCents?: number;
  rating: number;
  reviewCount: number;
  stockCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  tags: string[];
  specs: Record<string, string>;
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CouponCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 20 for 20% or 1500 for $15.00
  minimumOrderCents: number;
  expiresAt: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  costCents: number;
  estimatedDays: string;
}

export interface OrderCheckoutCalculation {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  freeShippingEligible: boolean;
  freeShippingThresholdGapCents: number;
  appliedCoupon: CouponCode | null;
}

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface LoyaltyTierConfig {
  name: LoyaltyTier;
  minAnnualSpendCents: number;
  pointsMultiplier: number; // e.g. 1.0, 1.25, 1.5, 2.0
  color: string;
  badgeEmoji: string;
  perks: string[];
}

export interface LoyaltyAccount {
  userId: string;
  currentTier: LoyaltyTier;
  pointsBalance: number;
  lifetimeSpentCents: number;
  annualSpentCents: number;
  memberSince: string;
}

export interface LoyaltyBenefitCalculation {
  currentTier: LoyaltyTier;
  tierConfig: LoyaltyTierConfig;
  pointsEarnedOnOrder: number;
  pointsBalance: number;
  balanceDollarValueCents: number;
  maxRedeemablePoints: number;
  maxRedeemableValueCents: number;
  nextTier: LoyaltyTier | null;
  centsNeededForNextTier: number;
  tierProgressPercentage: number;
}

