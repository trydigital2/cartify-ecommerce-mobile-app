export type UrgencyTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXPIRED';

export interface CartUrgencyState {
  remainingSeconds: number;
  totalHoldDurationSeconds: number;
  percentRemaining: number;
  urgencyTier: UrgencyTier;
  badgeLabel: string;
  isExpired: boolean;
  canExtend: boolean;
  extensionAllowedSeconds: number;
}

/**
 * Calculates cart inventory reservation state and urgency tiers.
 */
export function calculateCartUrgency(
  reservedAtMs: number,
  holdDurationMinutes: number = 15,
  currentTimeMs: number = Date.now()
): CartUrgencyState {
  const totalHoldSec = holdDurationMinutes * 60;
  const elapsedSec = Math.max(0, Math.floor((currentTimeMs - reservedAtMs) / 1000));
  const remainingSec = Math.max(0, totalHoldSec - elapsedSec);
  const percent = totalHoldSec > 0 ? Math.round((remainingSec / totalHoldSec) * 100) : 0;

  let urgencyTier: UrgencyTier = 'LOW';
  let badgeLabel = 'ITEMS RESERVED';

  if (remainingSec === 0) {
    urgencyTier = 'EXPIRED';
    badgeLabel = 'RESERVATION EXPIRED';
  } else if (remainingSec <= 120) {
    urgencyTier = 'CRITICAL';
    badgeLabel = 'RELEASE IMMINENT (<2m)';
  } else if (remainingSec <= 300) {
    urgencyTier = 'HIGH';
    badgeLabel = 'HOLD ENDING SOON';
  } else if (remainingSec <= 600) {
    urgencyTier = 'MEDIUM';
    badgeLabel = 'POPULAR ITEMS HELD';
  }

  return {
    remainingSeconds: remainingSec,
    totalHoldDurationSeconds: totalHoldSec,
    percentRemaining: percent,
    urgencyTier,
    badgeLabel,
    isExpired: remainingSec === 0,
    canExtend: remainingSec > 0 && remainingSec <= 300,
    extensionAllowedSeconds: 300, // 5 min extension
  };
}

/**
 * Formats seconds into MM:SS format.
 */
export function formatCountdownTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
