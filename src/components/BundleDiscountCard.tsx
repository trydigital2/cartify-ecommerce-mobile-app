import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateBundlePricing } from '../utils/bundleDiscountEngine';
import { formatCurrencyCents } from '../utils/currency';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export interface BundleDiscountCardProps {
  productName: string;
  unitPriceCents: number;
  selectedQuantity?: number;
}

export const BundleDiscountCard: React.FC<BundleDiscountCardProps> = ({
  productName,
  unitPriceCents,
  selectedQuantity = 3,
}) => {
  const result = calculateBundlePricing(unitPriceCents, selectedQuantity);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.label}>BUNDLE & SAVE</Text>
          <Text style={styles.productName} numberOfLines={1}>
            {productName}
          </Text>
        </View>
        {result.discountPercent > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{result.discountPercent}% OFF</Text>
          </View>
        )}
      </View>

      {/* Pricing Comparison */}
      <View style={styles.pricingRow}>
        <View>
          <Text style={styles.totalPrice}>
            {formatCurrencyCents(result.finalBundlePriceCents)}
          </Text>
          <Text style={styles.unitSub}>
            {formatCurrencyCents(result.effectiveUnitPriceCents)} each ({result.quantity} items)
          </Text>
        </View>

        {result.totalSavingsCents > 0 && (
          <View style={styles.savingsPill}>
            <Text style={styles.savingsText}>
              SAVE {formatCurrencyCents(result.totalSavingsCents)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  productName: {
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#DCFCE7',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  totalPrice: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  unitSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  savingsPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  savingsText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
});

export default BundleDiscountCard;
