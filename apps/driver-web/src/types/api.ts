// API Response Types based on the FaIr_AI API Reference

export interface Driver {
  id: number;
  name: string;
  phone: string;
  email?: string;
  experience_years: number;
  vehicle_type: string;
  vehicle_number?: string;
  license_number?: string;
  age?: number;
  current_location?: {
    lat: number;
    lon: number;
  };
  active: boolean;
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
  dimensions?: string;
  fragile: boolean;
  time_window_start?: string;
  time_window_end?: string;
  difficulty_score: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
}

export interface Assignment {
  id: number;
  driver_id: number;
  date: string;
  packages: Package[];
  total_packages: number;
  total_distance: number;
  estimated_time: number;
  difficulty_score: number;
  shadow_comparison: {
    shadow_packages: number;
    shadow_difficulty: number;
    savings_hours: number;
  };
  status: 'assigned' | 'in_progress' | 'completed';
  generated_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface SHAPExplanation {
  total_difficulty: number;
  top_factors: Array<{
    feature: string;
    impact: number;
    explanation: string;
  }>;
}

export interface HealthEvent {
  id: number;
  driver_id: number;
  risk_percentage: number;
  risk_level: 'green' | 'yellow' | 'red';
  continuous_driving_minutes: number;
  distance_covered_km: number;
  deliveries_completed: number;
  time_since_break_minutes: number;
  heart_rate?: number;
  temperature_celsius?: number;
  action: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  timestamp: string;
}

export interface Forecast {
  driver_id: number;
  forecasts: Array<{
    date: string;
    predicted_packages: number;
    predicted_difficulty: number;
    predicted_duration_hours: number;
    confidence: number;
  }>;
}

export interface SwapRequest {
  swap_id: number;
  requester_name: string;
  difficulty: number;
  packages: number;
  compatibility_score: number;
  reason?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
  requested_at: string;
}

export interface InsurancePayout {
  id: number;
  driver_id: number;
  assignment_id: number;
  expected_duration_minutes: number;
  actual_duration_minutes: number;
  z_score: number;
  bonus_amount: number;
  reason: string;
  gps_validated: boolean;
  traffic_data_validated: boolean;
  admin_approved: boolean;
  created_at: string;
}

export interface Delivery {
  id: number;
  assignment_id: number;
  driver_id: number;
  package_id: number;
  started_at?: string;
  completed_at?: string;
  duration_minutes?: number;
  distance_km?: number;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  failure_reason?: string;
  signature_url?: string;
  photo_url?: string;
  notes?: string;
  created_at: string;
}

// Auth Types
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  driver: Driver;
}

export interface RegisterRequest {
  phone: string;
  name: string;
  email?: string;
  password: string;
  vehicle_type: string;
  license_number?: string;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'gps_update' | 'health_update' | 'delivery_status' | 'ping' | 'health_alert' | 'swap_notification' | 'assignment_update' | 'pong';
  [key: string]: any;
}

export interface GPSUpdate {
  type: 'gps_update';
  driver_id: number;
  lat: number;
  lon: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

export interface HealthAlert {
  type: 'health_alert';
  risk_percentage: number;
  risk_level: 'green' | 'yellow' | 'red';
  message: string;
  timestamp: string;
}

// API Error Response
export interface APIError {
  error: string;
  message?: string;
  details?: any;
}