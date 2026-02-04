import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistance, formatRelative } from 'date-fns';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Handle custom format shortcuts
  if (formatStr === 'short') {
    return format(d, 'MMM d');
  }
  
  return format(d, formatStr);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(d, new Date(), { addSuffix: true });
}

/**
 * Format time duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Get risk level color based on percentage
 */
export function getRiskColor(riskPercentage: number): {
  color: string;
  label: string;
  bgClass: string;
  textClass: string;
} {
  if (riskPercentage >= 75) {
    return {
      color: '#ef4444',
      label: 'Critical',
      bgClass: 'bg-red-100',
      textClass: 'text-red-800',
    };
  }
  if (riskPercentage >= 50) {
    return {
      color: '#f59e0b',
      label: 'Warning',
      bgClass: 'bg-yellow-100',
      textClass: 'text-yellow-800',
    };
  }
  return {
    color: '#10b981',
    label: 'Safe',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
  };
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): {
  bgClass: string;
  textClass: string;
} {
  const statusColors: Record<string, { bgClass: string; textClass: string }> = {
    active: { bgClass: 'bg-green-100', textClass: 'text-green-800' },
    on_break: { bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' },
    terminated: { bgClass: 'bg-red-100', textClass: 'text-red-800' },
    pending: { bgClass: 'bg-blue-100', textClass: 'text-blue-800' },
    accepted: { bgClass: 'bg-green-100', textClass: 'text-green-800' },
    rejected: { bgClass: 'bg-red-100', textClass: 'text-red-800' },
    expired: { bgClass: 'bg-gray-100', textClass: 'text-gray-800' },
    assigned: { bgClass: 'bg-blue-100', textClass: 'text-blue-800' },
    in_progress: { bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' },
    completed: { bgClass: 'bg-green-100', textClass: 'text-green-800' },
    in_transit: { bgClass: 'bg-purple-100', textClass: 'text-purple-800' },
    delivered: { bgClass: 'bg-green-100', textClass: 'text-green-800' },
    failed: { bgClass: 'bg-red-100', textClass: 'text-red-800' },
  };

  return statusColors[status.toLowerCase()] || {
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-800',
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download data as CSV file
 */
export function downloadCSV(data: any[], filename: string): void {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => JSON.stringify(row[header] || '')).join(',')
    ),
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
