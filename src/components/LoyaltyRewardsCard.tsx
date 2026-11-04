import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LoyaltyAccount } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { calculateLoyaltyBenefits } from '../utils/loyaltyEngine';
import { formatCurrencyCents } from '../utils/currency';

export interface LoyaltyRewardsCardProps {
  account: LoyaltyAccount;
  currentOrderSubtotalCents?: number;
  onRedeemPress?: () => void;
}

export const LoyaltyRewardsCard: React.FC<LoyaltyRewardsCardProps> = ({
  account,
  currentOrderSubtotalCents = 0,
  onRedeemPress,
}) => {
  const benefits = calculateLoyaltyBenefits(account, currentOrderSubtotalCents);
  const tier = benefits.tierConfig;

  return (
    <View style={styles.card}>
      {/* Header with Tier Badge */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.badgeEmoji}>{tier.badgeEmoji}</Text>
          <View>
            <View style={styles.tierNameRow}>
              <Text style={styles.tierName}>{tier.name} VIP Member</Text>
              <View style={[styles.multiplierBadge, { backgroundColor: tier.color + '20' }]}>
                <Text style={[styles.multiplierText, { color: tier.color }]}>
                  {tier.pointsMultiplier}x Earning
                </Text>
              </View>
            </View>
            <Text style={styles.subtext}>Member since {account.memberSince}</Text>
          </View>
        </View>
      </View>

      {/* Points & Value Highlight */}
      <View style={styles.pointsGrid}>
        <View style={styles.pointsBox}>
          <Text style={styles.pointsLabel}>Available Points</Text>
          <Text style={styles.pointsNumber}>{benefits.pointsBalance.toLocaleString()}</Text>
          <Text style={styles.pointsValue}>
            ≈ {formatCurrencyCents(benefits.balanceDollarValueCents)} Reward Value
          </Text>
        </View>

        {currentOrderSubtotalCents > 0 && (
          <View style={styles.pointsEarnBox}>
            <Text style={styles.pointsLabel}>Order Earnings</Text>
            <Text style={styles.pointsEarnNumber}>+{benefits.pointsEarnedOnOrder}</Text>
            <Text style={styles.pointsEarnSubtext}>Points on checkout</Text>
          </View>
        )}
      </View>

      {/* Next Tier Progression */}
      {benefits.nextTier ? (
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>
              Path to {benefits.nextTier} Tier
            </Text>
            <Text style={styles.progressValue}>
              {formatCurrencyCents(benefits.centsNeededForNextTier)} away
            </Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${benefits.tierProgressPercentage}%`, backgroundColor: tier.color },
              ]}
            />
          </View>
          <Text style={styles.progressSubtext}>
            {benefits.tierProgressPercentage}% of annual threshold completed
          </Text>
        </View>
      ) : (
        <View style={styles.maxTierBanner}>
          <Text style={styles.maxTierText}>
            🏆 You have unlocked Cartify’s highest tier! Enjoy top-tier VIP privileges.
          </Text>
        </View>
      )}

      {/* Tier Perks Pills */}
      <View style={styles.perksContainer}>
        <Text style={styles.perksTitle}>Active Perks & Privileges</Text>
        <View style={styles.perkPillsWrap}>
          {tier.perks.map((perk, index) => (
            <View key={index} style={styles.perkPill}>
              <Text style={styles.perkPillText}>✓ {perk}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action / Redeem Button */}
      {benefits.maxRedeemablePoints > 0 && (
        <TouchableOpacity
          style={styles.redeemButton}
          onPress={onRedeemPress}
          activeOpacity={0.85}
        >
          <Text style={styles.redeemButtonText}>
            Redeem up to {benefits.maxRedeemablePoints} Points (-{formatCurrencyCents(benefits.maxRedeemableValueCents)})
          </Text>
        </TouchableOpacity>
      )}
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
    marginBottom: spacing.base,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  tierNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tierName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  multiplierBadge: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  multiplierText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  subtext: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  pointsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pointsBox: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  pointsLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  pointsNumber: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
    marginVertical: 2,
  },
  pointsValue: {
    fontSize: typography.fontSize.xs,
    color: colors.success,
    fontWeight: typography.fontWeight.medium,
  },
  pointsEarnBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsEarnNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentDark,
    marginVertical: 2,
  },
  pointsEarnSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  progressContainer: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.md,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  progressValue: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressSubtext: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  maxTierBanner: {
    backgroundColor: '#FAF5FF',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: spacing.md,
  },
  maxTierText: {
    fontSize: typography.fontSize.xs,
    color: '#6B21A8',
    fontWeight: typography.fontWeight.medium,
  },
  perksContainer: {
    marginBottom: spacing.md,
  },
  perksTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  perkPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  perkPill: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  perkPillText: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});

