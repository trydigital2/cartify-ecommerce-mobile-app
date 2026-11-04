import {
  calculateShipmentProgress,
  estimateDeliveryDate,
  generateTrackingMilestones,
  createShipmentTrackingSummary,
} from '../src/utils/shipmentEstimatorEngine';

describe('Cartify Shipment Estimator & Tracking Engine', () => {
  describe('calculateShipmentProgress', () => {
    it('calculates 0% for order_placed', () => {
      expect(calculateShipmentProgress('order_placed')).toBe(0);
    });

    it('calculates 60% for in_transit', () => {
      expect(calculateShipmentProgress('in_transit')).toBe(60);
    });

    it('calculates 100% for delivered status', () => {
      expect(calculateShipmentProgress('delivered')).toBe(100);
    });
  });

  describe('estimateDeliveryDate', () => {
    it('skips weekends when calculating business day deliveries', () => {
      // Friday Nov 6, 2026
      const friday = new Date('2026-11-06T10:00:00Z');
      const delivery = estimateDeliveryDate(friday, 2);

      // 2 business days from Friday is Tuesday Nov 10
      expect(delivery.daysRemaining).toBe(2);
      expect(delivery.formattedDate).toContain('Nov 10');
    });
  });

  describe('generateTrackingMilestones', () => {
    it('marks milestones prior to current status as completed', () => {
      const milestones = generateTrackingMilestones('dispatched');

      expect(milestones).toHaveLength(6);
      expect(milestones[0].isCompleted).toBe(true); // order_placed
      expect(milestones[1].isCompleted).toBe(true); // processing
      expect(milestones[2].isCompleted).toBe(true); // dispatched
      expect(milestones[2].isCurrent).toBe(true);
      expect(milestones[3].isCompleted).toBe(false); // in_transit
    });
  });

  describe('createShipmentTrackingSummary', () => {
    it('assembles complete summary with tracking number and destination', () => {
      const summary = createShipmentTrackingSummary(
        'ORD-98421',
        'TRK-77192840',
        'FedEx Express',
        'in_transit',
        2,
        'Seattle, WA'
      );

      expect(summary.orderId).toBe('ORD-98421');
      expect(summary.trackingNumber).toBe('TRK-77192840');
      expect(summary.carrier).toBe('FedEx Express');
      expect(summary.status).toBe('in_transit');
      expect(summary.progressPercentage).toBe(60);
      expect(summary.destinationCity).toBe('Seattle, WA');
      expect(summary.milestones).toHaveLength(6);
    });
  });
});
