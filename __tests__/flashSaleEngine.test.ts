import {
  calculateMarkdownPrice,
  determineUrgencyTier,
  evaluateFlashSaleDeal,
} from '../src/utils/flashSaleEngine';

describe('Cartify Flash Sale & Dynamic Price Markdown Engine', () => {
  describe('calculateMarkdownPrice', () => {
    it('calculates markdown savings and discounted price in integer cents', () => {
      // Original $120.00 (12000 cents), 25% off -> savings $30.00 (3000 cents), price $90.00 (9000 cents)
      const res = calculateMarkdownPrice(12000, 25);
      expect(res.savingsCents).toBe(3000);
      expect(res.discountedPriceCents).toBe(9000);
    });

    it('safely handles zero and extreme discount percentages', () => {
      const zero = calculateMarkdownPrice(5000, 0);
      expect(zero.savingsCents).toBe(0);
      expect(zero.discountedPriceCents).toBe(5000);

      const maxClamped = calculateMarkdownPrice(5000, 150);
      expect(maxClamped.savingsCents).toBe(4750); // Clamped at 95%
      expect(maxClamped.discountedPriceCents).toBe(250);
    });
  });

  describe('determineUrgencyTier', () => {
    it('flags critical low stock when remaining units <= 5', () => {
      const res = determineUrgencyTier(3, 100, 7200);
      expect(res.urgencyTier).toBe('Critical Low Stock');
      expect(res.badgeColor).toBe('#EF4444');
    });

    it('flags ending soon when seconds remaining <= 1 hour (3600s)', () => {
      const res = determineUrgencyTier(20, 100, 1800);
      expect(res.urgencyTier).toBe('Ending Soon');
      expect(res.badgeColor).toBe('#F97316');
    });

    it('flags high demand when stock claimed >= 70%', () => {
      const res = determineUrgencyTier(25, 100, 10000);
      expect(res.urgencyTier).toBe('High Demand');
      expect(res.badgeColor).toBe('#8B5CF6');
    });
  });

  describe('evaluateFlashSaleDeal', () => {
    it('assembles complete flash sale deal summary', () => {
      const deal = evaluateFlashSaleDeal(
        'deal-wireless-earbuds',
        8999, // $89.99
        30, // 30% off
        12, // 12 units left
        100, // 100 total
        4500 // 4500s left
      );

      expect(deal.id).toBe('deal-wireless-earbuds');
      expect(deal.stockSoldPercent).toBe(88);
      expect(deal.savingsCents).toBe(2700);
      expect(deal.discountedPriceCents).toBe(6299);
      expect(deal.urgencyTier).toBe('Critical Low Stock'); // 12/100 <= 15%
    });
  });
});
