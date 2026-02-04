// Domain Models for FaIr_AI Driver App

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: 'driver' | 'admin';
  isAuthenticated: boolean;
}

export interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  lastSync: string | null;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  healthAlerts: boolean;
  swapNotifications: boolean;
  assignmentUpdates: boolean;
  bonusAlerts: boolean;
}

export interface OfflineData {
  assignments: any[];
  gpsLogs: any[];
  healthEvents: any[];
  lastSyncTimestamp: string;
}

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: string | null;
  isTracking: boolean;
  error: string | null;
}

export interface WebSocketState {
  isConnected: boolean;
  connectionId: string | null;
  lastMessage: any;
  error: string | null;
  reconnectAttempts: number;
}

// UI State Types
export interface TabState {
  activeTab: 'today' | 'health' | 'future';
}

export interface ModalState {
  isOpen: boolean;
  type: 'explanation' | 'swap' | 'health' | 'route' | null;
  data?: any;
}

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Feature-specific models
export interface DashboardData {
  todayAssignment: any;
  shadowComparison: any;
  healthStatus: any;
  upcomingForecasts: any;
  recentBonuses: any[];
}

export interface SwapMarketplace {
  availableSwaps: any[];
  mySwapRequests: any[];
  swapHistory: any[];
}

export interface HealthDashboard {
  currentRisk: number;
  riskHistory: any[];
  interventions: any[];
  metrics: {
    hoursWorked: number;
    floorsClimbed: number;
    heartRate?: number;
    stressLevel: number;
  };
}