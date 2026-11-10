import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashSaleDeal } from '../utils/flashSaleEngine';
import { formatCurrencyCents } from '../utils/currency';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export interface FlashSaleBannerCardProps {
  deal: FlashSaleDeal;
  productName: string;
}

export const FlashSaleBannerCard: React.FC<FlashSaleBannerCardProps> = ({ deal, productName }) => {
  const hoursLeft = Math.floor(deal.secondsRemaining / 3600);
  const minutesLeft = Math.floor((deal.secondsRemaining % 3600) / 60);

  return (
    <View style={styles.card}>
      {/* Header with Urgency Badge */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.saleLabel}>⚡ FLASH SALE</Text>
          <Text style={styles.productName} numberOfLines={1}>
            {productName}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: deal.badgeColor + '20', borderColor: deal.badgeColor }]}>
          <Text style={[styles.badgeText, { color: deal.badgeColor }]}>{deal.urgencyTier}</Text>
        </View>
      </View>

      {/* Pricing Row */}
      <View style={styles.pricingRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.discountedPrice}>{formatCurrencyCents(deal.discountedPriceCents)}</Text>
          <Text style={styles.originalPrice}>{formatCurrencyCents(deal.originalPriceCents)}</Text>
        </View>
        <View style={styles.savingsPill}>
          <Text style={styles.savingsText}>SAVE {deal.markdownPercent}%</Text>
        </View>
      </View>

      {/* Stock Progress Bar */}
      <View style={styles.stockContainer}>
        <View style={styles.stockLabels}>
          <Text style={styles.stockText}>{deal.stockSoldPercent}% Claimed</Text>
          <Text style={styles.remainingText}>{deal.stockRemaining} units left</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${deal.stockSoldPercent}%` }]} />
        </View>
      </View>

      {/* Countdown Timer Strip */}
      <View style={styles.timerStrip}>
        <Text style={styles.timerLabel}>Deal expires in:</Text>
        <Text style={styles.timerValue}>
          {hoursLeft}h {minutesLeft}m
        </Text>
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
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  saleLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 0.8,
  },
  productName: {
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  discountedPrice: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  originalPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  savingsPill: {
    backgroundColor: '#DC2626',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  savingsText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  stockContainer: {
    marginTop: spacing.sm,
  },
  stockLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  remainingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: borderRadius.full,
  },
  timerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: spacing.md,
  },
  timerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timerValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default FlashSaleBannerCard;
