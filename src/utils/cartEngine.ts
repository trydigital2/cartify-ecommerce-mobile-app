import { CartItem, CouponCode, OrderCheckoutCalculation, ShippingMethod } from '../types';

export const FREE_SHIPPING_THRESHOLD_CENTS = 15000; // $150.00
export const STANDARD_TAX_RATE = 0.0825; // 8.25%

/**
 * Calculates complete order checkout totals with coupon validation,
 * free shipping eligibility, and sales tax.
 */
export function calculateCheckout(
  items: CartItem[],
  coupon: CouponCode | null = null,
  selectedShipping: ShippingMethod | null = null
): OrderCheckoutCalculation {
  // 1. Subtotal
  const subtotalCents = items.reduce((acc, item) => {
    return acc + Math.max(0, item.product.priceCents) * Math.max(0, item.quantity);
  }, 0);

  // 2. Coupon Discount
  let discountCents = 0;
  let appliedCoupon: CouponCode | null = null;

  if (coupon && subtotalCents >= coupon.minimumOrderCents) {
    if (coupon.discountType === 'percentage') {
      discountCents = Math.round(subtotalCents * (coupon.discountValue / 100));
    } else {
      discountCents = Math.min(subtotalCents, coupon.discountValue);
    }
    appliedCoupon = coupon;
  }

  // 3. Shipping
  const freeShippingEligible = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const freeShippingThresholdGapCents = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);

  let shippingCents = 0;
  if (items.length > 0) {
    if (selectedShipping) {
      if (selectedShipping.id === 'ship-std' && freeShippingEligible) {
        shippingCents = 0;
      } else {
        shippingCents = selectedShipping.costCents;
      }
    } else {
      shippingCents = freeShippingEligible ? 0 : 900; // default standard $9.00
    }
  }

  // 4. Tax (calculated on discounted taxable merchandise)
  const taxableBase = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.round(taxableBase * STANDARD_TAX_RATE);

  // 5. Total
  const totalCents = Math.max(0, taxableBase + shippingCents + taxCents);

  return {
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents,
    freeShippingEligible,
    freeShippingThresholdGapCents,
    appliedCoupon,
  };
}

/**
 * Cart Item Mutators
 */
export function addItemToCart(items: CartItem[], newItem: CartItem): CartItem[] {
  const existingIndex = items.findIndex(
    (i) =>
      i.product.id === newItem.product.id &&
      i.selectedColor === newItem.selectedColor &&
      i.selectedSize === newItem.selectedSize
  );

  if (existingIndex > -1) {
    const updated = [...items];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + newItem.quantity,
    };
    return updated;
  }

  return [...items, newItem];
}

export function updateItemQuantity(
  items: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] {
  if (newQuantity <= 0) {
    return items.filter((i) => i.product.id !== productId);
  }
  return items.map((i) => (i.product.id === productId ? { ...i, quantity: newQuantity } : i));
}

export function removeItemFromCart(items: CartItem[], productId: string): CartItem[] {
  return items.filter((i) => i.product.id !== productId);
}
