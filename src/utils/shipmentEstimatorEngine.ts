import { ShipmentStatus, TrackingMilestone, ShipmentTrackingSummary } from '../types';

export const SHIPMENT_STEPS: ShipmentStatus[] = [
  'order_placed',
  'processing',
  'dispatched',
  'in_transit',
  'out_for_delivery',
  'delivered',
];

export const STEP_METADATA: Record<ShipmentStatus, { title: string; defaultLocation: string }> = {
  order_placed: { title: 'Order Verified', defaultLocation: 'Cartify Commerce Hub' },
  processing: { title: 'Fulfillment & Quality Check', defaultLocation: 'Regional Fulfillment Center, TX' },
  dispatched: { title: 'Dispatched with Carrier', defaultLocation: 'Regional Sorting Facility, TX' },
  in_transit: { title: 'In Transit across Network', defaultLocation: 'National Transit Hub' },
  out_for_delivery: { title: 'Out for Local Delivery', defaultLocation: 'Local Distribution Center' },
  delivered: { title: 'Package Delivered', defaultLocation: 'Front Porch / Mailbox' },
};

/**
 * Calculates delivery progress percentage (0 - 100%) based on shipment status.
 */
export function calculateShipmentProgress(status: ShipmentStatus): number {
  const index = SHIPMENT_STEPS.indexOf(status);
  if (index === -1) return 0;
  return Math.round((index / (SHIPMENT_STEPS.length - 1)) * 100);
}

/**
 * Estimates delivery date range adding business days from base date.
 */
export function estimateDeliveryDate(baseDate: Date, transitDays: number): { formattedDate: string; daysRemaining: number } {
  const result = new Date(baseDate);
  let daysAdded = 0;

  while (daysAdded < transitDays) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    // Skip Saturday (6) and Sunday (0) for business day transit
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  return {
    formattedDate: result.toLocaleDateString('en-US', options),
    daysRemaining: transitDays,
  };
}

/**
 * Generates tracking milestones array with completion status.
 */
export function generateTrackingMilestones(
  currentStatus: ShipmentStatus,
  baseDate: Date = new Date()
): TrackingMilestone[] {
  const currentIndex = SHIPMENT_STEPS.indexOf(currentStatus);

  return SHIPMENT_STEPS.map((step, idx) => {
    const meta = STEP_METADATA[step];
    const isCompleted = idx <= currentIndex;
    const isCurrent = idx === currentIndex;

    const eventDate = new Date(baseDate);
    eventDate.setHours(eventDate.getHours() - (currentIndex - idx) * 8);

    return {
      status: step,
      title: meta.title,
      location: meta.defaultLocation,
      timestamp: isCompleted
        ? eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : 'Pending',
      isCompleted,
      isCurrent,
    };
  });
}

/**
 * Assembles full tracking summary for customer order.
 */
export function createShipmentTrackingSummary(
  orderId: string,
  trackingNumber: string,
  carrier: ShipmentTrackingSummary['carrier'],
  currentStatus: ShipmentStatus,
  transitDaysRemaining: number = 2,
  destinationCity: string = 'Austin, TX'
): ShipmentTrackingSummary {
  const delivery = estimateDeliveryDate(new Date(), transitDaysRemaining);
  const progressPercentage = calculateShipmentProgress(currentStatus);
  const milestones = generateTrackingMilestones(currentStatus);

  return {
    orderId,
    trackingNumber,
    carrier,
    shippingMethodName: carrier.includes('Express') ? 'Priority Air Express' : 'Standard Ground',
    status: currentStatus,
    progressPercentage,
    estimatedDeliveryDate: delivery.formattedDate,
    daysRemaining: delivery.daysRemaining,
    milestones,
    destinationCity,
  };
}
