'use client';

import { useQuery } from '@tanstack/react-query';
import type { Forecast } from '@/types/api';

const mockForecast: Forecast = {
  driver_id: 123,
  forecasts: Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    return {
      date: date.toISOString().split('T')[0]!,
      predicted_packages: Math.floor(Math.random() * 5) + 8, // 8-12 packages
      predicted_difficulty: Math.floor(Math.random() * 30) + 55, // 55-85 difficulty
      predicted_duration_hours: Math.random() * 2 + 3.5, // 3.5-5.5 hours
      confidence: Math.random() * 0.2 + 0.8, // 0.8-1.0 confidence
    };
  })
};

export function useForecast(driverId: number) {
  return useQuery({
    queryKey: ['forecast', driverId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockForecast;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}