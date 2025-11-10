/**
 * Number utilities
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function parseNumber(str: string): number {
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

