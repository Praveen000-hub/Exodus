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
      time_window_end: '10:00',
      difficulty_score: 65,
      status: 'assigned',
      priority: 'normal',
      created_at: '2026-02-04T06:00:00Z'
    },
    {
      id: 2,
      tracking_number: 'PKG002',
      customer_name: 'Priya Kumar',
      customer_phone: '9876543211',
      delivery_address: '456 Koramangala, Bangalore',
      delivery_lat: 12.9352,
      delivery_lon: 77.6245,
      weight: 1.8,
      dimensions: '25x15x12 cm',
      fragile: true,
      time_window_start: '10:00',
      time_window_end: '11:00',
      difficulty_score: 55,
      status: 'assigned',
      priority: 'high',
      created_at: '2026-02-04T06:00:00Z'
    },
    {
      id: 3,
      tracking_number: 'PKG003',
      customer_name: 'Rajesh Verma',
      customer_phone: '9876543212',
      delivery_address: '789 Indiranagar, Bangalore',
      delivery_lat: 12.9784,
      delivery_lon: 77.6408,
      weight: 3.2,
      dimensions: '40x30x15 cm',
      fragile: false,
      time_window_start: '11:00',
      time_window_end: '12:00',
      difficulty_score: 70,
      status: 'assigned',
      priority: 'normal',
      created_at: '2026-02-04T06:00:00Z'
    },
    {
      id: 4,
      tracking_number: 'PKG004',
      customer_name: 'Sneha Reddy',
      customer_phone: '9876543213',
      delivery_address: '321 Whitefield, Bangalore',
      delivery_lat: 12.9698,
      delivery_lon: 77.7499,
      weight: 2.0,
      dimensions: '35x25x10 cm',
      fragile: true,
      time_window_start: '12:00',
      time_window_end: '13:00',
      difficulty_score: 60,
      status: 'assigned',
      priority: 'normal',
      created_at: '2026-02-04T06:00:00Z'
    },
    {
      id: 5,
      tracking_number: 'PKG005',
      customer_name: 'Karthik Menon',
      customer_phone: '9876543214',
      delivery_address: '654 Jayanagar, Bangalore',
      delivery_lat: 12.9250,
      delivery_lon: 77.5838,
      weight: 1.5,
      dimensions: '20x15x8 cm',
      fragile: false,
      time_window_start: '13:00',
      time_window_end: '14:00',
      difficulty_score: 50,
      status: 'assigned',
      priority: 'normal',
      created_at: '2026-02-04T06:00:00Z'
    }
  ],
  total_packages: 5,
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