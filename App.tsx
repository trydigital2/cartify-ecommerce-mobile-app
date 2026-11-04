import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { MOCK_PRODUCTS, MOCK_COUPONS } from './src/data/mockData';
import { CartItem, Product, LoyaltyAccount } from './src/types';
import { ProductCard } from './src/components/ProductCard';
import { CartSummaryCard } from './src/components/CartSummaryCard';
import { LoyaltyRewardsCard } from './src/components/LoyaltyRewardsCard';
import { calculateCheckout, addItemToCart } from './src/utils/cartEngine';
import { colors, spacing, typography } from './src/theme';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], quantity: 1 },
    { product: MOCK_PRODUCTS[3], quantity: 1 },
  ]);
  const [couponCode, setCouponCode] = useState<string | null>('SAVE20');
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccount>({
    userId: 'vip_7701',
    currentTier: 'Silver',
    pointsBalance: 840,
    lifetimeSpentCents: 165000,
    annualSpentCents: 95000,
    memberSince: 'March 2025',
  });

  const appliedCoupon = MOCK_COUPONS.find((c) => c.code === couponCode) || null;
  const calculation = calculateCheckout(cart, appliedCoupon);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => addItemToCart(prev, { product, quantity: 1 }));
  };

  const handleRedeemLoyalty = () => {
    // Demo redemption handler
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>Cartify</Text>
          <Text style={styles.brandSubtitle}>Curated Luxury & Everyday Essentials</Text>
        </View>

        {/* Loyalty VIP Member Card */}
        <LoyaltyRewardsCard
          account={loyaltyAccount}
          currentOrderSubtotalCents={calculation.subtotalCents}
          onRedeemPress={handleRedeemLoyalty}
        />

        {/* Live Cart Order Summary */}
        <CartSummaryCard
          calculation={calculation}
          itemCount={cart.reduce((a, b) => a + b.quantity, 0)}
          onApplyCouponPress={() => setCouponCode('SAVE20')}
          onCheckoutPress={() => {}}
        />

        {/* Product Catalog */}
        <View style={styles.catalogSection}>
          <Text style={styles.sectionTitle}>Featured Collections</Text>
          {MOCK_PRODUCTS.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={handleAddToCart}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.base,
  },
  header: {
    marginBottom: spacing.base,
  },
  brandTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  brandSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  catalogSection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});
