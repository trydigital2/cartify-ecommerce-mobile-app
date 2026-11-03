import {
  LoyaltyTier,
  LoyaltyTierConfig,
  LoyaltyAccount,
  LoyaltyBenefitCalculation,
} from '../types';

export const CENTS_PER_POINT = 5; // 100 points = $5.00 (5 cents/point)
export const MAX_REDEMPTION_RATIO = 0.5; // Max 50% of subtotal can be redeemed

export const LOYALTY_TIERS: Record<LoyaltyTier, LoyaltyTierConfig> = {
  Bronze: {
    name: 'Bronze',
    minAnnualSpendCents: 0,
    pointsMultiplier: 1.0,
    color: '#CD7F32',
    badgeEmoji: '🥉',
    perks: ['1 pt per $1 spent', 'Standard member offers', 'Birthday bonus 200 pts'],
  },
  Silver: {
    name: 'Silver',
    minAnnualSpendCents: 50000, // $500
    pointsMultiplier: 1.25,
    color: '#94A3B8',
    badgeEmoji: '🥈',
    perks: ['1.25 pts per $1 spent', 'Early access to flash sales', 'Free returns on all orders'],
  },
  Gold: {
    name: 'Gold',
    minAnnualSpendCents: 150000, // $1,500
    pointsMultiplier: 1.5,
    color: '#F59E0B',
    badgeEmoji: '🥇',
    perks: ['1.5 pts per $1 spent', 'Dedicated concierge support', 'Quarterly $25 bonus reward'],
  },
  Platinum: {
    name: 'Platinum',
    minAnnualSpendCents: 300000, // $3,000
    pointsMultiplier: 2.0,
    color: '#8B5CF6',
    badgeEmoji: '💎',
    perks: ['2.0 pts per $1 spent', 'Free overnight shipping', 'VIP exclusive collections'],
  },
};

const TIER_ORDER: LoyaltyTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum'];

/**
 * Determine the loyalty tier earned based on annual spend in integer cents.
 */
export function getTierForAnnualSpend(annualSpendCents: number): LoyaltyTier {
  if (annualSpendCents >= LOYALTY_TIERS.Platinum.minAnnualSpendCents) return 'Platinum';
  if (annualSpendCents >= LOYALTY_TIERS.Gold.minAnnualSpendCents) return 'Gold';
  if (annualSpendCents >= LOYALTY_TIERS.Silver.minAnnualSpendCents) return 'Silver';
  return 'Bronze';
}

/**
 * Compute the loyalty points earned on a purchase subtotal.
 */
export function calculatePointsEarned(subtotalCents: number, tier: LoyaltyTier): number {
  if (subtotalCents <= 0) return 0;
  const config = LOYALTY_TIERS[tier];
  const dollars = subtotalCents / 100;
  return Math.floor(dollars * config.pointsMultiplier);
}

/**
 * Full loyalty benefit calculation for a given user account and pending checkout subtotal.
 */
export function calculateLoyaltyBenefits(
  account: LoyaltyAccount,
  orderSubtotalCents: number = 0
): LoyaltyBenefitCalculation {
  const currentTier = account.currentTier;
  const tierConfig = LOYALTY_TIERS[currentTier];
  const pointsEarnedOnOrder = calculatePointsEarned(orderSubtotalCents, currentTier);

  const balanceDollarValueCents = account.pointsBalance * CENTS_PER_POINT;

  // Max redemption: cannot exceed 50% of current order subtotal, nor balance
  const maxSpendRedemptionCents = Math.floor(orderSubtotalCents * MAX_REDEMPTION_RATIO);
  const maxPossibleCents = Math.min(balanceDollarValueCents, maxSpendRedemptionCents);
  const maxRedeemablePoints = Math.floor(maxPossibleCents / CENTS_PER_POINT);
  const maxRedeemableValueCents = maxRedeemablePoints * CENTS_PER_POINT;

  // Next tier evaluation
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  const isMaxTier = currentIndex === TIER_ORDER.length - 1;
  const nextTier = isMaxTier ? null : TIER_ORDER[currentIndex + 1];

  let centsNeededForNextTier = 0;
  let tierProgressPercentage = 100;

  if (nextTier) {
    const nextTierConfig = LOYALTY_TIERS[nextTier];
    const currentTierFloor = tierConfig.minAnnualSpendCents;
    const nextTierTarget = nextTierConfig.minAnnualSpendCents;
    const spendInCurrentBracket = Math.max(0, account.annualSpentCents - currentTierFloor);
    const bracketSpan = nextTierTarget - currentTierFloor;

    centsNeededForNextTier = Math.max(0, nextTierTarget - account.annualSpentCents);
    tierProgressPercentage = Math.min(100, Math.max(0, Math.round((spendInCurrentBracket / bracketSpan) * 100)));
  }

  return {
    currentTier,
    tierConfig,
    pointsEarnedOnOrder,
    pointsBalance: account.pointsBalance,
    balanceDollarValueCents,
    maxRedeemablePoints,
    maxRedeemableValueCents,
    nextTier,
    centsNeededForNextTier,
    tierProgressPercentage,
  };
}

/**
 * Apply points redemption to an order and calculate final discount.
 */
export function applyPointsRedemption(
  requestedPoints: number,
  pointsBalance: number,
  orderSubtotalCents: number
): {
  discountCents: number;
  pointsUsed: number;
  remainingPoints: number;
} {
  if (requestedPoints <= 0 || pointsBalance <= 0 || orderSubtotalCents <= 0) {
    return {
      discountCents: 0,
      pointsUsed: 0,
      remainingPoints: pointsBalance,
    };
  }

  const maxOrderCents = Math.floor(orderSubtotalCents * MAX_REDEMPTION_RATIO);
  const maxAllowedPointsFromOrder = Math.floor(maxOrderCents / CENTS_PER_POINT);
  const pointsCap = Math.min(pointsBalance, maxAllowedPointsFromOrder);

  const pointsUsed = Math.min(requestedPoints, pointsCap);
  const discountCents = pointsUsed * CENTS_PER_POINT;
  const remainingPoints = pointsBalance - pointsUsed;

  return {
    discountCents,
    pointsUsed,
    remainingPoints,
  };
}

