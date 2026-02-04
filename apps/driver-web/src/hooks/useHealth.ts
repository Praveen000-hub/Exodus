'use client';

import { useQuery } from '@tanstack/react-query';
import type { HealthEvent } from '@/types/api';

const mockHealthData = {
  risk_percentage: 42,
  risk_level: 'yellow' as const,
  continuous_driving_minutes: 45,
  distance_covered_km: 12,
  deliveries_completed: 3,
  time_since_break_minutes: 45,
  heart_rate: 95,
  temperature_celsius: 32,
  last_updated: new Date().toISOString(),
  next_check: new Date(Date.now() + 60000).toISOString(),
};

export function useHealth(driverId: number) {
  return useQuery({
    queryKey: ['health', driverId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockHealthData;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // 30 seconds
  });
}