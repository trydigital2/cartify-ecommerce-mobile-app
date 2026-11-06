/**
 * Smart Order Bundle & Volume Savings Discount Engine
 * Computes tiered multi-pack volume markdowns (e.g., Buy 2 get 10% off, Buy 3 get 18% off)
 * in integer sub-penny cents.
 */

export interface BundleTier {
  quantity: number;
  discountPercent: number; // e.g. 15 for 15%
  badgeLabel: string;
}

export interface BundleSavingsCalculation {
  unitPriceCents: number;
  quantity: number;
  grossTotalCents: number;
  discountPercent: number;
  totalSavingsCents: number;
  finalBundlePriceCents: number;
  effectiveUnitPriceCents: number;
}

export const DEFAULT_BUNDLE_TIERS: BundleTier[] = [
  { quantity: 1, discountPercent: 0, badgeLabel: 'Standard' },
  { quantity: 2, discountPercent: 10, badgeLabel: 'Popular · 10% Off' },
  { quantity: 3, discountPercent: 18, badgeLabel: 'Best Value · 18% Off' },
  { quantity: 5, discountPercent: 25, badgeLabel: 'Max Savings · 25% Off' },
];

export function calculateBundlePricing(
  unitPriceCents: number,
  quantity: number,
  tiers: BundleTier[] = DEFAULT_BUNDLE_TIERS
): BundleSavingsCalculation {
  const safeUnit = Math.max(0, unitPriceCents);
  const safeQty = Math.max(1, quantity);

  // Find highest qualifying tier
  const eligibleTier = [...tiers]
    .filter(t => safeQty >= t.quantity)
    .sort((a, b) => b.quantity - a.quantity)[0] || { quantity: 1, discountPercent: 0 };

  const grossTotalCents = safeUnit * safeQty;
  const discountPercent = eligibleTier.discountPercent;
  const totalSavingsCents = Math.round(grossTotalCents * (discountPercent / 100));
  const finalBundlePriceCents = grossTotalCents - totalSavingsCents;
  const effectiveUnitPriceCents = Math.round(finalBundlePriceCents / safeQty);

  return {
    unitPriceCents: safeUnit,
    quantity: safeQty,
    grossTotalCents,
    discountPercent,
    totalSavingsCents,
    finalBundlePriceCents,
    effectiveUnitPriceCents,
  };
}
