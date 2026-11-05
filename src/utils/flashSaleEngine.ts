/**
 * Flash Sale & Dynamic Price Markdown Engine
 * Computes tiered flash discounts, stock depletion velocity,
 * urgency status badges, and guaranteed customer savings metrics.
 */

export type UrgencyTier = 'Critical Low Stock' | 'High Demand' | 'Ending Soon' | 'Normal';

export interface FlashSaleDeal {
  id: string;
  originalPriceCents: number;
  markdownPercent: number; // e.g. 35 for 35% off
  discountedPriceCents: number;
  savingsCents: number;
  stockRemaining: number;
  totalInitialStock: number;
  stockSoldPercent: number;
  secondsRemaining: number;
  urgencyTier: UrgencyTier;
  badgeColor: string;
}

/**
 * Calculates markdown discounted price in integer cents.
 */
export function calculateMarkdownPrice(originalPriceCents: number, markdownPercent: number): {
  discountedPriceCents: number;
  savingsCents: number;
} {
  const safeOriginal = Math.max(0, originalPriceCents);
  const safePercent = Math.max(0, Math.min(95, markdownPercent));

  const savingsCents = Math.round(safeOriginal * (safePercent / 100));
  const discountedPriceCents = safeOriginal - savingsCents;

  return { discountedPriceCents, savingsCents };
}

/**
 * Determines urgency tier and corresponding visual badge color
 * based on remaining inventory and time left.
 */
export function determineUrgencyTier(
  stockRemaining: number,
  totalStock: number,
  secondsRemaining: number
): { urgencyTier: UrgencyTier; badgeColor: string } {
  if (stockRemaining <= 5 || (totalStock > 0 && stockRemaining / totalStock <= 0.15)) {
    return { urgencyTier: 'Critical Low Stock', badgeColor: '#EF4444' }; // Red
  }
  if (secondsRemaining <= 3600) {
    // Under 1 hour remaining
    return { urgencyTier: 'Ending Soon', badgeColor: '#F97316' }; // Orange
  }
  if (totalStock > 0 && (totalStock - stockRemaining) / totalStock >= 0.7) {
    return { urgencyTier: 'High Demand', badgeColor: '#8B5CF6' }; // Purple
  }
  return { urgencyTier: 'Normal', badgeColor: '#10B981' }; // Green
}

/**
 * Evaluates comprehensive flash sale deal status for a product.
 */
export function evaluateFlashSaleDeal(
  dealId: string,
  originalPriceCents: number,
  markdownPercent: number,
  stockRemaining: number,
  totalInitialStock: number,
  secondsRemaining: number
): FlashSaleDeal {
  const { discountedPriceCents, savingsCents } = calculateMarkdownPrice(
    originalPriceCents,
    markdownPercent
  );

  const safeTotalStock = Math.max(1, totalInitialStock);
  const safeRemaining = Math.max(0, Math.min(safeTotalStock, stockRemaining));
  const stockSold = safeTotalStock - safeRemaining;
  const stockSoldPercent = Math.round((stockSold / safeTotalStock) * 100);

  const { urgencyTier, badgeColor } = determineUrgencyTier(
    safeRemaining,
    safeTotalStock,
    secondsRemaining
  );

  return {
    id: dealId,
    originalPriceCents,
    markdownPercent,
    discountedPriceCents,
    savingsCents,
    stockRemaining: safeRemaining,
    totalInitialStock: safeTotalStock,
    stockSoldPercent,
    secondsRemaining: Math.max(0, secondsRemaining),
    urgencyTier,
    badgeColor,
  };
}
