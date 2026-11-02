import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { formatCurrencyCents } from '../utils/currency';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onPress?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onPress }) => {
  const discountPercent = product.originalPriceCents
    ? Math.round(((product.originalPriceCents - product.priceCents) / product.originalPriceCents) * 100)
    : 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => onPress?.(product)}
    >
      {/* Product Image Placeholder / Banner */}
      <View style={styles.imagePlaceholder}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{product.category}</Text>
        </View>

        {discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>-{discountPercent}%</Text>
          </View>
        )}

        <Text style={styles.iconArt}>🛍️</Text>
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.ratingText}>
            {product.rating} ({product.reviewCount})
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {product.subtitle}
        </Text>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.price}>{formatCurrencyCents(product.priceCents)}</Text>
            {product.originalPriceCents && (
              <Text style={styles.originalPrice}>
                {formatCurrencyCents(product.originalPriceCents)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => onAddToCart?.(product)}
            activeOpacity={0.7}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconArt: {
    fontSize: 44,
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: `${colors.textPrimary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  categoryBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  discountBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  detailsContainer: {
    padding: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  star: {
    color: colors.accent,
    fontSize: 14,
  },
  ratingText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  addBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
});

export default ProductCard;
