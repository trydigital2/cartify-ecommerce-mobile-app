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
