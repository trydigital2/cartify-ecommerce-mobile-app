/**
 * Currency Formatting & Arithmetic
 * All values are maintained in integer cents to guarantee sub-penny precision.
 */

export function formatCurrencyCents(cents: number, currencySymbol: string = '$'): string {
  const isNegative = cents < 0;
  const absoluteCents = Math.abs(cents);
  const dollars = Math.floor(absoluteCents / 100);
  const remainingCents = absoluteCents % 100;
  const formattedString = `${dollars.toLocaleString('en-US')}.${remainingCents.toString().padStart(2, '0')}`;
  return isNegative ? `-${currencySymbol}${formattedString}` : `${currencySymbol}${formattedString}`;
}

export function parseDollarsToCents(amountString: string): number {
  const cleaned = amountString.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}
