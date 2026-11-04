import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShipmentTrackingSummary } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export interface OrderTrackingCardProps {
  tracking: ShipmentTrackingSummary;
}

export const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({ tracking }) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderLabel}>Live Package Tracking</Text>
          <Text style={styles.orderNumber}>#{tracking.orderId}</Text>
        </View>
        <View style={styles.carrierBadge}>
          <Text style={styles.carrierText}>{tracking.carrier}</Text>
        </View>
      </View>

      {/* Delivery Countdown Banner */}
      <View style={styles.deliveryBanner}>
        <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
        <Text style={styles.deliveryDate}>{tracking.estimatedDeliveryDate}</Text>
        <Text style={styles.destinationText}>Delivering to {tracking.destinationCity}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${tracking.progressPercentage}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.statusText}>Status: {tracking.status.replace('_', ' ').toUpperCase()}</Text>
          <Text style={styles.percentageText}>{tracking.progressPercentage}% Complete</Text>
        </View>
      </View>

      {/* Milestones List */}
      <View style={styles.milestonesList}>
        {tracking.milestones.map((m, idx) => (
          <View key={m.status} style={styles.milestoneRow}>
            <View style={styles.milestoneIndicatorContainer}>
              <View
                style={[
                  styles.milestoneDot,
                  m.isCompleted && styles.milestoneDotCompleted,
                  m.isCurrent && styles.milestoneDotCurrent,
                ]}
              />
              {idx < tracking.milestones.length - 1 && (
                <View
                  style={[
                    styles.milestoneLine,
                    m.isCompleted && styles.milestoneLineCompleted,
                  ]}
                />
              )}
            </View>
            <View style={styles.milestoneContent}>
              <View style={styles.milestoneHeader}>
                <Text
                  style={[
                    styles.milestoneTitle,
                    m.isCompleted && styles.milestoneTitleCompleted,
                  ]}
                >
                  {m.title}
                </Text>
                <Text style={styles.milestoneTime}>{m.timestamp}</Text>
              </View>
              <Text style={styles.milestoneLocation}>{m.location}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.trackingNumberLabel}>Tracking No: </Text>
        <Text style={styles.trackingNumberValue}>{tracking.trackingNumber}</Text>
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
    marginBottom: spacing.base,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  orderNumber: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  carrierBadge: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  carrierText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  deliveryBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  deliveryLabel: {
    fontSize: typography.fontSize.xs,
    color: '#1E40AF',
    fontWeight: typography.fontWeight.medium,
  },
  deliveryDate: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: '#1E3A8A',
    marginVertical: 2,
  },
  destinationText: {
    fontSize: typography.fontSize.xs,
    color: '#3B82F6',
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  percentageText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  milestonesList: {
    marginTop: spacing.xs,
  },
  milestoneRow: {
    flexDirection: 'row',
    minHeight: 46,
  },
  milestoneIndicatorContainer: {
    width: 24,
    alignItems: 'center',
  },
  milestoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: colors.surface,
    zIndex: 2,
  },
  milestoneDotCompleted: {
    backgroundColor: colors.primary,
  },
  milestoneDotCurrent: {
    borderColor: colors.primaryLight,
    borderWidth: 3,
  },
  milestoneLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.borderLight,
    marginVertical: -2,
  },
  milestoneLineCompleted: {
    backgroundColor: colors.primary,
  },
  milestoneContent: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.sm,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestoneTitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  milestoneTitleCompleted: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  milestoneTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  milestoneLocation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: spacing.xs,
  },
  trackingNumberLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  trackingNumberValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
});

