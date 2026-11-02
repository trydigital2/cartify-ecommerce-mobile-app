import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OrderCheckoutCalculation } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { formatCurrencyCents } from '../utils/currency';

export interface CartSummaryCardProps {
  calculation: OrderCheckoutCalculation;
  itemCount: number;
  onApplyCouponPress?: () => void;
  onCheckoutPress?: () => void;
}

export const CartSummaryCard: React.FC<CartSummaryCardProps> = ({
  calculation,
  itemCount,
  onApplyCouponPress,
  onCheckoutPress,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})</Text>

      {/* Free Shipping Progress Indicator */}
      <View style={styles.shippingBanner}>
        {calculation.freeShippingEligible ? (
          <Text style={styles.shippingBannerTextSuccess}>
            🎉 You have qualified for FREE Standard Delivery!
          </Text>
        ) : (
          <Text style={styles.shippingBannerText}>
            Add {formatCurrencyCents(calculation.freeShippingThresholdGapCents)} more for FREE Delivery!
          </Text>
        )}
      </View>

      {/* Financial Line Items */}
      <View style={styles.rowsContainer}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Subtotal</Text>
          <Text style={styles.rowValue}>{formatCurrencyCents(calculation.subtotalCents)}</Text>
        </View>

        {calculation.discountCents > 0 && (
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.success }]}>
              Discount ({calculation.appliedCoupon?.code})
            </Text>
            <Text style={[styles.rowValue, { color: colors.success }]}>
              -{formatCurrencyCents(calculation.discountCents)}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Estimated Shipping</Text>
          <Text style={styles.rowValue}>
            {calculation.shippingCents === 0 ? 'FREE' : formatCurrencyCents(calculation.shippingCents)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Estimated Sales Tax (8.25%)</Text>
          <Text style={styles.rowValue}>{formatCurrencyCents(calculation.taxCents)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.rowTotal}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{formatCurrencyCents(calculation.totalCents)}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {!calculation.appliedCoupon && (
          <TouchableOpacity
            style={styles.couponBtn}
            onPress={onApplyCouponPress}
            activeOpacity={0.7}
          >
            <Text style={styles.couponBtnText}>🏷️ Apply Promo Code (e.g. SAVE20)</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={onCheckoutPress}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Secure Checkout →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  shippingBanner: {
    backgroundColor: `${colors.primary}10`,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  shippingBannerText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  shippingBannerTextSuccess: {
    fontSize: typography.fontSize.xs,
    color: colors.success,
    fontWeight: typography.fontWeight.bold,
  },
  rowsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  rowValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  rowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  actionsContainer: {
    gap: spacing.sm,
  },
  couponBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  couponBtnText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});

export default CartSummaryCard;
