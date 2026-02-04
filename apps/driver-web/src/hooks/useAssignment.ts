'use client';

import { useQuery } from '@tanstack/react-query';
import type { Assignment } from '@/types/api';

// Mock data for development
const mockAssignment: Assignment = {
  id: 456,
  driver_id: 123,
  date: '2026-02-04',
  packages: [
    {
      id: 1,
      tracking_number: 'PKG001',
      customer_name: 'Amit Sharma',
      customer_phone: '9876543210',
      delivery_address: '123 MG Road, Bangalore',
      delivery_lat: 12.9716,
      delivery_lon: 77.5946,
      weight: 2.5,
      dimensions: '30x20x10 cm',
      fragile: false,
      time_window_start: '09:00',
      time_window_end: '12:00',
      difficulty_score: 65,
      status: 'assigned',
      priority: 'normal',
      created_at: '2026-02-04T06:00:00Z'
    }
  ],
  total_packages: 10,
  total_distance: 18.5,
  estimated_time: 4.2,
  difficulty_score: 68,
  shadow_comparison: {
    shadow_packages: 13,
    shadow_difficulty: 89,
    savings_hours: 0.9
  },
  status: 'assigned',
  generated_at: '2026-02-04T06:00:00Z'
};

export function useAssignment(driverId: number) {
  return useQuery({
    queryKey: ['assignment', driverId, 'today'],
    queryFn: async () => {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockAssignment;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}