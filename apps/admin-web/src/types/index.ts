// ============================================
// CORE TYPES
// ============================================

export interface Admin {
  id: number;
  username: string;
  email: string;
  role: 'manager' | 'super_admin';
  name: string;
  phone?: string;
  created_at: string;
}

export interface Driver {
  id: number;
  phone: string;
  name: string;
  email?: string;
  age: number;
  fitness: number; // 1-5
  knee_pain: number; // 0-2
  home_lat: number;
  home_lng: number;
  preferred_areas: string[];
  status: 'active' | 'on_break' | 'terminated';
  lifetime_bonuses: number;
  total_swaps: number;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: number;
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_lat: number;
  delivery_lon: number;
  weight: number;
  difficulty_score: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
  time_window_start?: string;
  time_window_end?: string;
  created_at: string;
}

export interface Assignment {
  id: number;
  driver_id: number;
  driver_name?: string;
  date: string;
  packages: Package[];
  total_packages: number;
  total_distance: number;
  estimated_time: number;
  difficulty_score: number;
  earnings: number;
  floors: number;
  total_bonuses: number;
  protected: boolean;
  shadow_packages?: number;
  shadow_difficulty?: number;
  savings_hours?: number;
  status: 'assigned' | 'in_progress' | 'completed';
  generated_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface HealthEvent {
  id: number;
  driver_id: number;
  driver_name?: string;
  risk_percentage: number;
  timestamp: string;
  heart_rate?: number;
  spo2?: number;
  temperature?: number;
  intervention_triggered: boolean;
  intervention_details?: {
    helpers: number[];
    packages_reassigned: number;
    protected_earnings: number;
  };
  created_at: string;
}

export interface SwapProposal {
  id: number;
  from_driver_id: number;
  from_driver_name?: string;
  to_driver_id: number;
  to_driver_name?: string;
  date: string;
  reason: 'health' | 'balance' | 'preference';
  benefit_score: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  expires_at: string;
  responded_at?: string;
  accepted_at?: string;
}

export interface InsurancePayout {
  id: number;
  driver_id: number;
  driver_name?: string;
  date: string;
  z_score: number;
  bonus_percentage: number;
  bonus_amount: number;
  base_earnings: number;
  final_earnings: number;
  approved: boolean;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
}

export interface Forecast {
  date: string;
  predicted_packages: number;
  predicted_difficulty: number;
  predicted_duration_hours: number;
  confidence: number;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface SystemMetrics {
  date: string;
  total_packages: number;
  delivered_packages: number;
  active_drivers: number;
  avg_packages_per_driver: number;
  avg_delivery_time: number;
  fairness_score: number;
  swap_count: number;
  health_interventions: number;
  total_bonuses: number;
  system_efficiency: number;
}

export interface DashboardStats {
  total_drivers: number;
  active_drivers: number;
  total_packages: number;
  delivered_packages: number;
  delivery_rate: number;
  total_swaps: number;
  swap_success_rate: number;
  health_interventions: number;
  intervention_success_rate: number;
  total_bonuses: number;
  avg_bonus_per_driver: number;
  system_fairness_score: number;
  driver_satisfaction: number;
  revenue_today: number;
  revenue_week: number;
  revenue_month: number;
}

// ============================================
// WEBSOCKET TYPES
// ============================================

export interface WebSocketMessage {
  type: 'gps_all' | 'intervention_event' | 'swap_completed' | 'insurance_payout' | 'assignment_update' | 'metrics';
  timestamp: string;
  data: any;
}

export interface GPSUpdate {
  driver_id: number;
  driver_name?: string;
  lat: number;
  lng: number;
  speed: number;
  risk: number;
  status: string;
  timestamp: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: Admin;
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginFormData {
  username: string;
  password: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

// ============================================
// CHART DATA TYPES
// ============================================

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  [key: string]: any;
}
