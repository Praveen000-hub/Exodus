import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date utilities
export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export function getNextCheckTime(lastCheck: string, intervalMinutes: number = 1): string {
  const lastCheckTime = new Date(lastCheck);
  const nextCheck = new Date(lastCheckTime.getTime() + intervalMinutes * 60 * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((nextCheck.getTime() - now.getTime()) / 1000);
  
  if (diffInSeconds <= 0) {
    return 'Now';
  } else if (diffInSeconds < 60) {
    return `${diffInSeconds} sec`;
  } else {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min`;
  }
}

// Number utilities
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function formatDuration(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  if (hrs === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hrs} hour${hrs > 1 ? 's' : ''}`;
  } else {
    return `${hrs}h ${mins}m`;
  }
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

// Health utilities
export function getRiskLevel(percentage: number): 'green' | 'yellow' | 'red' {
  if (percentage <= 40) return 'green';
  if (percentage <= 74) return 'yellow';
  return 'red';
}

export function getRiskLabel(level: 'green' | 'yellow' | 'red'): string {
  switch (level) {
    case 'green': return 'Safe';
    case 'yellow': return 'Warning';
    case 'red': return 'Critical';
  }
}

export function getRiskColor(level: 'green' | 'yellow' | 'red'): string {
  switch (level) {
    case 'green': return 'text-orange-400';
    case 'yellow': return 'text-orange-500';
    case 'red': return 'text-orange-600';
  }
}

// Building utilities
export function formatBuildingDetails(hasLift: boolean, floors: number): string {
  if (hasLift) {
    return `Lift available, ${floors} floors`;
  } else {
    return `No lift, ${floors} floors`;
  }
}

export function formatParkingDistance(meters: number): string {
  if (meters < 100) {
    return `Parking ${meters} m away`;
  } else {
    return `Parking ${(meters / 1000).toFixed(1)} km away`;
  }
}

// Weather utilities
export function getWeatherAdvice(temperature: number, humidity: number): string {
  if (temperature > 35) {
    return 'Extra breaks recommended due to heat';
  } else if (temperature < 15) {
    return 'Dress warmly for deliveries';
  } else if (humidity > 80) {
    return 'High humidity, stay hydrated';
  } else {
    return 'Good weather for deliveries';
  }
}

// Validation utilities
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Local storage utilities
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}