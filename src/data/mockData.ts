import { Product, CouponCode, ShippingMethod } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Aura Pro Noise-Cancelling Headphones',
    subtitle: 'Spatial audio with 40-hour battery life',
    description: 'Precision engineered 40mm beryllium drivers delivering studio-grade acoustic clarity. Hybrid active noise cancellation with transparency pass-through.',
    category: 'Electronics',
    priceCents: 29900, // $299.00
    originalPriceCents: 34900,
    rating: 4.9,
    reviewCount: 342,
    stockCount: 28,
    isFeatured: true,
    isNewArrival: false,
    tags: ['wireless', 'anc', 'audiophile', 'bluetooth 5.4'],
    specs: {
      Battery: '40 Hours Playback',
      Weight: '250g',
      Connectivity: 'Bluetooth 5.4 + USB-C',
      Driver: '40mm Custom Beryllium',
    },
    reviews: [
      { id: 'rev-1', author: 'Elena Rostova', rating: 5, comment: 'Astonishing soundstage and the ANC isolates subway noise effortlessly.', date: '2026-10-15' },
      { id: 'rev-2', author: 'Marcus Chen', rating: 5, comment: 'Comfortable for 8-hour coding sessions without ear fatigue.', date: '2026-10-18' },
    ],
  },
  {
    id: 'prod-2',
    title: 'Veloce Mechanical Chronograph Watch',
    subtitle: 'Automatic movement with sapphire crystal',
    description: 'Hand-assembled 24-jewel automatic chronometer encased in surgical 316L stainless steel with double anti-reflective sapphire glass.',
    category: 'Accessories',
    priceCents: 42000, // $420.00
    originalPriceCents: 49900,
    rating: 4.8,
    reviewCount: 189,
    stockCount: 14,
    isFeatured: true,
    isNewArrival: true,
    tags: ['luxury', 'automatic', 'waterproof 100m', 'swiss movement'],
    specs: {
      Movement: 'Automatic Calibre 8215',
      WaterResistance: '10 ATM (100m)',
      Case: '316L Stainless Steel 41mm',
      Glass: 'Sapphire Crystal',
    },
    reviews: [
      { id: 'rev-3', author: 'Julian Vance', rating: 5, comment: 'Exquisite craftsmanship at a fraction of high-street luxury prices.', date: '2026-09-29' },
    ],
  },
  {
    id: 'prod-3',
    title: 'Merino Wool Minimalist Overshirt',
    subtitle: '100% ultrafine Australian merino wool',
    description: 'Naturally thermal-regulating, odor-resistant, and machine washable overshirt tailored for everyday transitional wear.',
    category: 'Apparel',
    priceCents: 14500, // $145.00
    originalPriceCents: 17500,
    rating: 4.7,
    reviewCount: 215,
    stockCount: 42,
    isFeatured: false,
    isNewArrival: true,
    tags: ['merino wool', 'sustainable', 'breathable', 'tailored fit'],
    specs: {
      Material: '100% 19.5-Micron Merino Wool',
      Fit: 'Relaxed Tailored',
      Care: 'Machine wash delicate',
      Origin: 'Melbourne, Australia',
    },
    reviews: [
      { id: 'rev-4', author: 'Siddharth Rao', rating: 5, comment: 'Soft, drape is immaculate, wears wonderfully in AC offices or outdoors.', date: '2026-10-22' },
    ],
  },
  {
    id: 'prod-4',
    title: 'Komorebi Ultrasonic Aroma Diffuser',
    subtitle: 'Handcrafted ceramic with ambient LED glow',
    description: 'Ultrasonic cold vapor atomization preserves pure essential oil chemistry. Whisper-quiet operation under 20dB with 8-hour continuous runtime.',
    category: 'Home & Living',
    priceCents: 6800, // $68.00
    originalPriceCents: 8500,
    rating: 4.9,
    reviewCount: 512,
    stockCount: 65,
    isFeatured: true,
    isNewArrival: false,
    tags: ['aromatherapy', 'home decor', 'ultrasonic', 'ceramic'],
    specs: {
      Capacity: '280 mL',
      Coverage: '400 sq ft',
      Timer: '2h, 4h, 8h auto shut-off',
      Noise: '< 19 dB',
    },
    reviews: [
      { id: 'rev-5', author: 'Maya Lin', rating: 5, comment: 'Transformed my evening wind-down routine. Sleek aesthetic.', date: '2026-10-12' },
    ],
  },
  {
    id: 'prod-5',
    title: 'Titanium Smart Health Ring Gen-3',
    subtitle: 'Biometric sleep, HRV, and skin temp tracker',
    description: 'Medical-grade photoplethysmography sensors embedded in aerospace-grade grade 5 titanium. 7-day battery life with zero subscription fees.',
    category: 'Fitness & Wellness',
    priceCents: 24900, // $249.00
    originalPriceCents: 29900,
    rating: 4.8,
    reviewCount: 284,
    stockCount: 19,
    isFeatured: true,
    isNewArrival: true,
    tags: ['smart ring', 'sleep tracker', 'hrv', 'titanium'],
    specs: {
      Material: 'Grade 5 Titanium + PVD Coating',
      Battery: '7 Days',
      WaterResistance: '50m (Swim-proof)',
      Sensors: 'PPG, NTC Thermistor, 3D Accelerometer',
    },
    reviews: [
      { id: 'rev-6', author: 'Alex Thorne', rating: 5, comment: 'Lightweight and seamless sleep metrics compared to bulky smartwatches.', date: '2026-10-25' },
    ],
  },
  {
    id: 'prod-6',
    title: 'Full-Grain Italian Leather Weekender',
    subtitle: 'Vegetable-tanned Vachetta leather duffel',
    description: 'Reinforced dual-ply stitching, solid brass hardware, and dedicated water-resistant shoe compartment designed for lifetime travel.',
    category: 'Accessories',
    priceCents: 31000, // $310.00
    originalPriceCents: 38000,
    rating: 4.9,
    reviewCount: 140,
    stockCount: 12,
    isFeatured: false,
    isNewArrival: false,
    tags: ['leather', 'travel', 'handcrafted', 'tsa compliant'],
    specs: {
      Leather: 'Full-Grain Tuscan Vachetta',
      Hardware: 'Solid Brushed Antique Brass',
      Dimensions: '52cm x 28cm x 26cm',
      Volume: '38 Liters',
    },
    reviews: [
      { id: 'rev-7', author: 'Carlos Mendoza', rating: 5, comment: 'Smells phenomenal and has developed a stunning rich patina already.', date: '2026-09-15' },
    ],
  },
];

export const MOCK_COUPONS: CouponCode[] = [
  {
    code: 'SAVE20',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrderCents: 10000, // $100.00 min order
    expiresAt: '2027-12-31',
  },
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrderCents: 5000, // $50.00 min order
    expiresAt: '2027-12-31',
  },
  {
    code: 'FLAT25',
    discountType: 'fixed',
    discountValue: 2500, // $25.00 off
    minimumOrderCents: 15000, // $150.00 min order
    expiresAt: '2027-12-31',
  },
];

export const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'ship-std', name: 'Standard Delivery', costCents: 900, estimatedDays: '3-5 Business Days' },
  { id: 'ship-exp', name: 'Express Priority', costCents: 1900, estimatedDays: '1-2 Business Days' },
  { id: 'ship-same', name: 'Same-Day Metro Dispatch', costCents: 2900, estimatedDays: 'Today by 8 PM' },
];
