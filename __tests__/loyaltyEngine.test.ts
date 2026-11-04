import {
  getTierForAnnualSpend,
  calculatePointsEarned,
  calculateLoyaltyBenefits,
  applyPointsRedemption,
  LOYALTY_TIERS,
  CENTS_PER_POINT,
} from '../src/utils/loyaltyEngine';
import { LoyaltyAccount } from '../src/types';

describe('Cartify Loyalty & Rewards Engine', () => {
  describe('getTierForAnnualSpend', () => {
    it('categorizes $0 - $499 as Bronze', () => {
      expect(getTierForAnnualSpend(0)).toBe('Bronze');
      expect(getTierForAnnualSpend(49900)).toBe('Bronze');
    });

    it('categorizes $500 - $1,499 as Silver', () => {
      expect(getTierForAnnualSpend(50000)).toBe('Silver');
      expect(getTierForAnnualSpend(149999)).toBe('Silver');
    });

    it('categorizes $1,500 - $2,999 as Gold', () => {
      expect(getTierForAnnualSpend(150000)).toBe('Gold');
      expect(getTierForAnnualSpend(299900)).toBe('Gold');
    });

    it('categorizes $3,000+ as Platinum', () => {
      expect(getTierForAnnualSpend(300000)).toBe('Platinum');
      expect(getTierForAnnualSpend(850000)).toBe('Platinum');
    });
  });

  describe('calculatePointsEarned', () => {
    it('returns 0 points for zero or negative subtotal', () => {
      expect(calculatePointsEarned(0, 'Bronze')).toBe(0);
      expect(calculatePointsEarned(-5000, 'Gold')).toBe(0);
    });

    it('calculates 1x points for Bronze', () => {
      // $100.00 spent = 100 points
      expect(calculatePointsEarned(10000, 'Bronze')).toBe(100);
    });

    it('calculates 1.25x points for Silver', () => {
      // $100.00 spent = 125 points
      expect(calculatePointsEarned(10000, 'Silver')).toBe(125);
    });

    it('calculates 1.5x points for Gold', () => {
      // $200.00 spent = 300 points
      expect(calculatePointsEarned(20000, 'Gold')).toBe(300);
    });

    it('calculates 2.0x points for Platinum VIP', () => {
      // $250.00 spent = 500 points
      expect(calculatePointsEarned(25000, 'Platinum')).toBe(500);
    });
  });

  describe('calculateLoyaltyBenefits', () => {
    const mockSilverAccount: LoyaltyAccount = {
      userId: 'user_42',
      currentTier: 'Silver',
      pointsBalance: 600, // $30 value
      lifetimeSpentCents: 120000,
      annualSpentCents: 80000, // $800 spent (Silver range $500-$1500)
      memberSince: '2025-01-15',
    };

    it('computes correct balance value and next tier progression', () => {
      const benefits = calculateLoyaltyBenefits(mockSilverAccount, 12000); // $120 order

      expect(benefits.currentTier).toBe('Silver');
      expect(benefits.tierConfig.pointsMultiplier).toBe(1.25);
      expect(benefits.balanceDollarValueCents).toBe(600 * CENTS_PER_POINT); // $30.00 (3000 cents)
      expect(benefits.nextTier).toBe('Gold');

      // Next tier needs $1500, user has spent $800, so $700 needed (70,000 cents)
      expect(benefits.centsNeededForNextTier).toBe(70000);
      // Bracket $500 to $1500 is $1000 span. User spent $300 in this bracket -> 30%
      expect(benefits.tierProgressPercentage).toBe(30);
    });

    it('caps max redeemable points to 50% of order subtotal', () => {
      // $40 order (4000 cents). Max redemption is 50% = 2000 cents = 400 points
      const benefits = calculateLoyaltyBenefits(mockSilverAccount, 4000);

      expect(benefits.maxRedeemablePoints).toBe(400);
      expect(benefits.maxRedeemableValueCents).toBe(2000);
    });

    it('handles Platinum tier with null next tier and 100% progress', () => {
      const platinumAccount: LoyaltyAccount = {
        userId: 'vip_1',
        currentTier: 'Platinum',
        pointsBalance: 2500,
        lifetimeSpentCents: 900000,
        annualSpentCents: 500000,
        memberSince: '2024-03-01',
      };

      const benefits = calculateLoyaltyBenefits(platinumAccount, 20000);
      expect(benefits.nextTier).toBeNull();
      expect(benefits.centsNeededForNextTier).toBe(0);
      expect(benefits.tierProgressPercentage).toBe(100);
    });
  });

  describe('applyPointsRedemption', () => {
    it('safely handles zero or negative redemption inputs', () => {
      const res = applyPointsRedemption(0, 500, 10000);
      expect(res.discountCents).toBe(0);
      expect(res.pointsUsed).toBe(0);
      expect(res.remainingPoints).toBe(500);
    });

    it('redeems valid points up to requested amount', () => {
      // Balance 500 ($25), order $100 (10000 cents, max allowed $50 = 1000 points)
      // Requesting 200 points ($10 discount)
      const res = applyPointsRedemption(200, 500, 10000);
      expect(res.pointsUsed).toBe(200);
      expect(res.discountCents).toBe(1000);
      expect(res.remainingPoints).toBe(300);
    });

    it('restricts redemption if requested points exceed order 50% cap', () => {
      // Order is $20 (2000 cents). Max 50% is $10 (1000 cents = 200 points)
      // User has 500 points and requests 400 points
      const res = applyPointsRedemption(400, 500, 2000);
      expect(res.pointsUsed).toBe(200);
      expect(res.discountCents).toBe(1000);
      expect(res.remainingPoints).toBe(300);
    });
  });
});

