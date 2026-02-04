// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

// Format numbers
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

// Format percentages
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
