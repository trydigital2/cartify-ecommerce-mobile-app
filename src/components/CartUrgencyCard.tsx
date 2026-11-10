import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateCartUrgency, formatCountdownTimer, UrgencyTier } from '../utils/cartUrgencyEngine';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export interface CartUrgencyCardProps {
  reservedAtMs?: number;
  holdDurationMinutes?: number;
  itemCount?: number;
}

export const CartUrgencyCard: React.FC<CartUrgencyCardProps> = ({
  reservedAtMs = Date.now() - 650 * 1000, // ~10m 50s ago -> ~4m 10s left
  holdDurationMinutes = 15,
  itemCount = 3,
}) => {
  const urgency = calculateCartUrgency(reservedAtMs, holdDurationMinutes);

  const getTierColor = (tier: UrgencyTier) => {
    switch (tier) {
      case 'CRITICAL':
      case 'EXPIRED':
        return colors.error;
      case 'HIGH':
        return colors.warning;
      case 'MEDIUM':
        return colors.primary;
      default:
        return colors.success;
    }
  };

  const accentColor = getTierColor(urgency.urgencyTier);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.label}>STOCK RESERVATION</Text>
          <Text style={styles.headline}>
            {itemCount} item{itemCount !== 1 ? 's' : ''} reserved for you
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: accentColor + '20' }]}>
          <Text style={[styles.badgeText, { color: accentColor }]}>
            {urgency.badgeLabel}
          </Text>
        </View>
      </View>

      <View style={styles.timerRow}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>TIME REMAINING</Text>
          <Text style={[styles.timerValue, { color: accentColor }]}>
            {formatCountdownTimer(urgency.remainingSeconds)}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${urgency.percentRemaining}%`,
                  backgroundColor: accentColor,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {urgency.percentRemaining}% of hold period remaining
          </Text>
        </View>
      </View>

      <Text style={styles.notice}>
        {urgency.isExpired
          ? 'Items have been released back to general inventory.'
          : 'High demand items in your cart will be released once the timer expires.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  headline: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  timerContainer: {
    marginRight: spacing.md,
    alignItems: 'center',
    minWidth: 70,
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  timerValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    marginTop: 2,
  },
  progressContainer: {
    flex: 1,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  notice: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

export default CartUrgencyCard;
