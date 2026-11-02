import {
  calculateCheckout,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  FREE_SHIPPING_THRESHOLD_CENTS,
} from '../src/utils/cartEngine';
import { formatCurrencyCents, parseDollarsToCents } from '../src/utils/currency';
import { MOCK_PRODUCTS, MOCK_COUPONS, MOCK_SHIPPING_METHODS } from '../src/data/mockData';
import { CartItem } from '../src/types';

describe('Cartify E-Commerce Checkout Engine', () => {
  const sampleItem1: CartItem = {
    product: MOCK_PRODUCTS[0], // $299.00 (29900 cents)
    quantity: 1,
  };

  const sampleItem2: CartItem = {
    product: MOCK_PRODUCTS[3], // $68.00 (6800 cents)
    quantity: 2,
  };

  describe('currency formatters & parsers', () => {
    it('formats positive and zero cents to USD string accurately', () => {
      expect(formatCurrencyCents(29900)).toBe('$299.00');
      expect(formatCurrencyCents(50)).toBe('$0.50');
      expect(formatCurrencyCents(0)).toBe('$0.00');
    });

    it('formats negative cents with leading minus symbol', () => {
      expect(formatCurrencyCents(-2500)).toBe('-$25.00');
    });

    it('parses dollar strings into exact integer cents', () => {
      expect(parseDollarsToCents('$149.99')).toBe(14999);
      expect(parseDollarsToCents('299')).toBe(29900);
      expect(parseDollarsToCents('invalid')).toBe(0);
    });
  });

  describe('calculateCheckout', () => {
    it('computes subtotal, tax, and free shipping for order above $150', () => {
      // 1 item of $299.00 > $150 threshold
      const result = calculateCheckout([sampleItem1]);

      expect(result.subtotalCents).toBe(29900);
      expect(result.freeShippingEligible).toBe(true);
      expect(result.shippingCents).toBe(0);
      expect(result.freeShippingThresholdGapCents).toBe(0);
      // Tax: 29900 * 0.0825 = 2466.75 -> 2467
      expect(result.taxCents).toBe(2467);
      expect(result.totalCents).toBe(29900 + 2467);
    });

    it('applies standard shipping charge when subtotal is below $150 threshold', () => {
      // 1 diffuser = $68.00
      const singleItem: CartItem = { product: MOCK_PRODUCTS[3], quantity: 1 };
      const result = calculateCheckout([singleItem]);

      expect(result.subtotalCents).toBe(6800);
      expect(result.freeShippingEligible).toBe(false);
      expect(result.shippingCents).toBe(900); // $9.00 standard
      expect(result.freeShippingThresholdGapCents).toBe(FREE_SHIPPING_THRESHOLD_CENTS - 6800);
      expect(result.taxCents).toBe(Math.round(6800 * 0.0825));
    });

    it('applies percentage coupon SAVE20 correctly to eligible orders', () => {
      const save20 = MOCK_COUPONS.find((c) => c.code === 'SAVE20')!;
      const result = calculateCheckout([sampleItem1], save20);

      // Subtotal = 29900. 20% discount = 5980 cents ($59.80)
      expect(result.discountCents).toBe(5980);
      expect(result.appliedCoupon?.code).toBe('SAVE20');
      const taxable = 29900 - 5980; // 23920
      expect(result.taxCents).toBe(Math.round(taxable * 0.0825));
    });

    it('ignores coupon if order subtotal does not satisfy minimum requirement', () => {
      const flat25 = MOCK_COUPONS.find((c) => c.code === 'FLAT25')!; // requires $150 min
      const smallItem: CartItem = { product: MOCK_PRODUCTS[3], quantity: 1 }; // $68
      const result = calculateCheckout([smallItem], flat25);

      expect(result.discountCents).toBe(0);
      expect(result.appliedCoupon).toBeNull();
    });

    it('supports custom shipping methods like Express Priority', () => {
      const expressMethod = MOCK_SHIPPING_METHODS[1]; // $19.00
      const result = calculateCheckout([sampleItem1], null, expressMethod);

      expect(result.shippingCents).toBe(1900);
    });
  });

  describe('cart mutators', () => {
    it('adds new item or increments existing quantity', () => {
      let cart: CartItem[] = [];
      cart = addItemToCart(cart, sampleItem1);
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(1);

      // Adding same product increments quantity
      cart = addItemToCart(cart, { product: MOCK_PRODUCTS[0], quantity: 2 });
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(3);
    });

    it('updates item quantity and removes if quantity is 0', () => {
      let cart = [sampleItem1, sampleItem2];
      cart = updateItemQuantity(cart, sampleItem1.product.id, 5);
      expect(cart.find((i) => i.product.id === sampleItem1.product.id)?.quantity).toBe(5);

      cart = updateItemQuantity(cart, sampleItem1.product.id, 0);
      expect(cart.find((i) => i.product.id === sampleItem1.product.id)).toBeUndefined();
    });

    it('removes item from cart completely', () => {
      let cart = [sampleItem1, sampleItem2];
      cart = removeItemFromCart(cart, sampleItem1.product.id);
      expect(cart).toHaveLength(1);
      expect(cart[0].product.id).toBe(sampleItem2.product.id);
    });
  });
});
