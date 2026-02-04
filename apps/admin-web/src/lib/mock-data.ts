import type { 
  DashboardStats, 
  SystemMetrics,
  Driver,
  Assignment,
  HealthEvent,
  SwapProposal,
  InsurancePayout,
  Admin,
  Package
} from '@/types';

// ============================================
// MOCK AUTHENTICATION
// ============================================

export const MOCK_ADMIN: Admin = {
  id: 1,
  username: 'admin',
  email: 'admin@fairai.com',
  role: 'super_admin',
  name: 'Admin User',
  phone: '+1234567890',
  created_at: '2025-01-01T00:00:00Z',
};

export const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

// ============================================
// MOCK DRIVERS
// ============================================

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 1,
    phone: '+1234567890',
    name: 'John Doe',
    email: 'john@example.com',
    age: 32,
    fitness: 4,
    knee_pain: 0,
    home_lat: 40.7128,
    home_lng: -74.0060,
    preferred_areas: ['Manhattan', 'Brooklyn'],
    status: 'active',
    lifetime_bonuses: 2450.50,
    total_swaps: 8,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-02-04T00:00:00Z',
  },
  {
    id: 2,
    phone: '+1234567891',
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 28,
    fitness: 5,
    knee_pain: 1,
    home_lat: 40.7580,
    home_lng: -73.9855,
    preferred_areas: ['Queens', 'Bronx'],
    status: 'active',
    lifetime_bonuses: 3120.75,
    total_swaps: 12,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-02-04T00:00:00Z',
  },
  {
    id: 3,
    phone: '+1234567892',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    age: 35,
    fitness: 3,
    knee_pain: 2,
    home_lat: 40.6782,
    home_lng: -73.9442,
    preferred_areas: ['Brooklyn', 'Staten Island'],
    status: 'on_break',
    lifetime_bonuses: 1890.25,
    total_swaps: 5,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-02-04T00:00:00Z',
  },
];

// ============================================
// MOCK DASHBOARD STATS
// ============================================

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_drivers: 45,
  active_drivers: 38,
  total_packages: 1247,
  delivered_packages: 1189,
  delivery_rate: 95.3,
  total_swaps: 156,
  swap_success_rate: 92.3,
  health_interventions: 12,
  intervention_success_rate: 100,
  total_bonuses: 45890.50,
  avg_bonus_per_driver: 1210.80,
  system_fairness_score: 94.8,
  driver_satisfaction: 4.6,
  revenue_today: 12450.00,
  revenue_week: 87320.50,
  revenue_month: 342890.75,
};

// ============================================
// MOCK SYSTEM METRICS
// ============================================

export const MOCK_SYSTEM_METRICS: SystemMetrics[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  total_packages: Math.floor(1100 + Math.random() * 300),
  delivered_packages: Math.floor(1050 + Math.random() * 250),
  active_drivers: Math.floor(35 + Math.random() * 10),
  avg_packages_per_driver: Math.floor(25 + Math.random() * 10),
  avg_delivery_time: Math.floor(180 + Math.random() * 60),
  fairness_score: parseFloat((90 + Math.random() * 8).toFixed(1)),
  swap_count: Math.floor(4 + Math.random() * 8),
  health_interventions: Math.floor(Math.random() * 3),
  total_bonuses: parseFloat((1200 + Math.random() * 800).toFixed(2)),
  system_efficiency: parseFloat((85 + Math.random() * 12).toFixed(1)),
}));

// ============================================
// MOCK PACKAGES
// ============================================

const generateMockPackages = (count: number): Package[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    tracking_number: `TRK${String(i + 1).padStart(8, '0')}`,
    customer_name: `Customer ${i + 1}`,
    customer_phone: `+123456789${i % 10}`,
    delivery_address: `${100 + i} Main St, New York, NY`,
    delivery_lat: 40.7128 + (Math.random() - 0.5) * 0.1,
    delivery_lon: -74.0060 + (Math.random() - 0.5) * 0.1,
    weight: parseFloat((1 + Math.random() * 20).toFixed(2)),
    difficulty_score: parseFloat((1 + Math.random() * 4).toFixed(1)),
    status: i % 10 === 0 ? 'pending' : 'delivered',
    created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

// ============================================
// MOCK ASSIGNMENTS
// ============================================

export const MOCK_ASSIGNMENTS: Assignment[] = MOCK_DRIVERS.map((driver, idx) => ({
  id: idx + 1,
  driver_id: driver.id,
  driver_name: driver.name,
  date: new Date().toISOString().split('T')[0],
  packages: generateMockPackages(Math.floor(20 + Math.random() * 15)),
  total_packages: Math.floor(20 + Math.random() * 15),
  total_distance: parseFloat((50 + Math.random() * 80).toFixed(2)),
  estimated_time: Math.floor(180 + Math.random() * 120),
  difficulty_score: parseFloat((2 + Math.random() * 2).toFixed(1)),
  earnings: parseFloat((250 + Math.random() * 200).toFixed(2)),
  floors: Math.floor(40 + Math.random() * 80),
  total_bonuses: parseFloat((50 + Math.random() * 100).toFixed(2)),
  protected: Math.random() > 0.7,
  shadow_packages: Math.floor(25 + Math.random() * 10),
  shadow_difficulty: parseFloat((3 + Math.random() * 1.5).toFixed(1)),
  savings_hours: parseFloat((0.5 + Math.random() * 2).toFixed(1)),
  status: idx === 0 ? 'in_progress' : idx === 1 ? 'completed' : 'assigned',
  generated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  started_at: idx <= 1 ? new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() : undefined,
  completed_at: idx === 1 ? new Date().toISOString() : undefined,
}));

// ============================================
// MOCK HEALTH EVENTS
// ============================================

export const MOCK_HEALTH_EVENTS: HealthEvent[] = Array.from({ length: 15 }, (_, i) => {
  const riskPercentage = Math.floor(30 + Math.random() * 70);
  const isIntervention = riskPercentage > 75;
  
  return {
    id: i + 1,
    driver_id: MOCK_DRIVERS[i % MOCK_DRIVERS.length].id,
    driver_name: MOCK_DRIVERS[i % MOCK_DRIVERS.length].name,
    risk_percentage: riskPercentage,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    heart_rate: Math.floor(70 + Math.random() * 50),
    spo2: Math.floor(92 + Math.random() * 8),
    temperature: parseFloat((36.5 + Math.random() * 1.5).toFixed(1)),
    intervention_triggered: isIntervention,
    intervention_details: isIntervention ? {
      helpers: [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
      packages_reassigned: Math.floor(5 + Math.random() * 10),
      protected_earnings: parseFloat((50 + Math.random() * 100).toFixed(2)),
    } : undefined,
    created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

// ============================================
// MOCK SWAP PROPOSALS
// ============================================

export const MOCK_SWAP_PROPOSALS: SwapProposal[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  from_driver_id: MOCK_DRIVERS[i % MOCK_DRIVERS.length].id,
  from_driver_name: MOCK_DRIVERS[i % MOCK_DRIVERS.length].name,
  to_driver_id: MOCK_DRIVERS[(i + 1) % MOCK_DRIVERS.length].id,
  to_driver_name: MOCK_DRIVERS[(i + 1) % MOCK_DRIVERS.length].name,
  date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  reason: ['health', 'balance', 'preference'][i % 3] as 'health' | 'balance' | 'preference',
  benefit_score: parseFloat((0.5 + Math.random() * 0.5).toFixed(2)),
  status: ['pending', 'accepted', 'rejected', 'expired'][i % 4] as 'pending' | 'accepted' | 'rejected' | 'expired',
  created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
  expires_at: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
}));

// ============================================
// MOCK INSURANCE PAYOUTS
// ============================================

export const MOCK_INSURANCE_PAYOUTS: InsurancePayout[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  driver_id: MOCK_DRIVERS[i % MOCK_DRIVERS.length].id,
  driver_name: MOCK_DRIVERS[i % MOCK_DRIVERS.length].name,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  z_score: parseFloat((1.5 + Math.random() * 1.5).toFixed(2)),
  bonus_percentage: Math.floor(5 + Math.random() * 15),
  bonus_amount: parseFloat((50 + Math.random() * 150).toFixed(2)),
  base_earnings: parseFloat((300 + Math.random() * 200).toFixed(2)),
  final_earnings: parseFloat((350 + Math.random() * 350).toFixed(2)),
  approved: i % 3 !== 0,
  approved_by: i % 3 !== 0 ? MOCK_ADMIN.name : undefined,
  approved_at: i % 3 !== 0 ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  notes: i % 3 !== 0 ? 'Approved based on performance metrics' : undefined,
  created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

// ============================================
// MOCK ACTIVE DRIVERS (for monitoring)
// ============================================

export const MOCK_ACTIVE_DRIVERS = MOCK_DRIVERS.filter(d => d.status === 'active').map(driver => ({
  ...driver,
  current_location: {
    lat: driver.home_lat + (Math.random() - 0.5) * 0.05,
    lng: driver.home_lng + (Math.random() - 0.5) * 0.05,
  },
  current_package: Math.floor(Math.random() * 20) + 1,
  total_packages_today: Math.floor(20 + Math.random() * 15),
  status_text: ['Driving to delivery', 'At delivery location', 'Returning to hub'][Math.floor(Math.random() * 3)],
  last_update: new Date(Date.now() - Math.random() * 5 * 60 * 1000).toISOString(),
}));

// ============================================
// HELPER FUNCTIONS FOR PAGINATION
// ============================================

export function paginateData<T>(data: T[], page: number = 1, perPage: number = 10) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  
  return {
    data: data.slice(start, end),
    pagination: {
      page,
      per_page: perPage,
      total: data.length,
      total_pages: Math.ceil(data.length / perPage),
    },
  };
}
