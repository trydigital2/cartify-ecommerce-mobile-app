# 🛍️ Cartify — Modern Cross-Platform E-Commerce Mobile App

> A production-style React Native mobile application engineered with **TypeScript**, **integer cents currency precision**, dynamic coupon engine, tiered shipping calculation, and automated test coverage.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Jest](https://img.shields.io/badge/Tests-11%20Passing-10B981?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 📱 Project Overview

**Cartify** is a complete, modular, local-first E-Commerce shopping application built for iOS and Android. Designed to deliver smooth 60fps micro-interactions, responsive cart updates, and robust arithmetic safety, Cartify operates on deterministic local mock catalogs without requiring third-party credentials or commercial payment gateway keys.

---

## ✨ Key Features

1. **Precision Cart & Order Calculation Engine:**
   - All monetary values are maintained in integer cents to eliminate floating-point arithmetic errors.
   - Live calculations for subtotal, tiered sales tax (8.25%), discounts, and shipping.
2. **Promotions & Promo Code Engine:**
   - Percentage (`SAVE20`, `WELCOME10`) and flat-rate (`FLAT25`) discount models.
   - Enforces minimum order thresholds, coupon validity checks, and dynamic feedback.
3. **Dynamic Free Shipping Tier:**
   - Visual progress bar notifying users how close they are to qualifying for FREE Standard Shipping ($150 threshold).
4. **Rich Multi-Category Product Catalog:**
   - Products across Electronics, Apparel, Home & Living, Fitness & Wellness, and Accessories.
   - Product specifications, customer reviews, stock counts, discount badges, and rating stars.
5. **Automated Testing Suite:**
   - 11 unit tests covering subtotal calculation, coupon thresholds, custom shipping methods, and cart mutators.

---

## 🏗️ Folder Structure

```text
Cartify/
├── __tests__/                  # Automated Jest test suites
│   ├── cartEngine.test.ts      # Cart calculations & coupon rules
│   └── mocks/                  # Native mocks for headless CI
├── src/
│   ├── components/             # Reusable UI cards & summaries
│   │   ├── ProductCard.tsx
│   │   ├── CartSummaryCard.tsx
│   │   └── index.ts
│   ├── data/                   # Realistic mock product catalog
│   │   └── mockData.ts
│   ├── theme/                  # Design tokens (colors, typography, shadows)
│   │   └── index.ts
│   ├── types/                  # Strict TypeScript interfaces
│   │   └── index.ts
│   └── utils/                  # Domain business logic & currency math
│       ├── cartEngine.ts
│       ├── currency.ts
│       └── index.ts
├── App.tsx                     # Main showcase screen
├── package.json
└── tsconfig.json
```

---

## 🧪 Running Tests & Typecheck

```bash
# Run unit tests with Jest
npm test

# Run TypeScript strict type verification
npx tsc --noEmit
```

---

## 📄 License
This project is licensed under the MIT License.
