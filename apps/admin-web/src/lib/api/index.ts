import { api } from './client';
import type { 
  DashboardStats, 
  SystemMetrics,
  Driver,
  Assignment,
  HealthEvent,
  SwapProposal,
  InsurancePayout,
  ApiResponse,
  PaginatedResponse
} from '@/types';
import { 
  MOCK_DASHBOARD_STATS,
  MOCK_SYSTEM_METRICS,
  MOCK_DRIVERS,
  MOCK_ASSIGNMENTS,
  MOCK_HEALTH_EVENTS,
  MOCK_SWAP_PROPOSALS,
  MOCK_INSURANCE_PAYOUTS,
  MOCK_ACTIVE_DRIVERS,
  paginateData
} from '@/lib/mock-data';

// 🎭 DEMO MODE - Use mock data instead of real API
const DEMO_MODE = true;

// Helper to simulate network delay
const simulateDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// ANALYTICS API
// ============================================

export const analyticsApi = {
  /**
   * Get dashboard overview stats
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return MOCK_DASHBOARD_STATS;
    }
    return api.get<DashboardStats>('/analytics/dashboard');
  },

  /**
   * Get system metrics for a specific date
   */
  getSystemMetrics: async (date?: string): Promise<SystemMetrics> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return MOCK_SYSTEM_METRICS[MOCK_SYSTEM_METRICS.length - 1];
    }
    const params = date ? `?date=${date}` : '';
    return api.get<SystemMetrics>(`/analytics/system${params}`);
  },

  /**
   * Get system metrics history (last N days)
   */
  getMetricsHistory: async (days: number = 30): Promise<SystemMetrics[]> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return MOCK_SYSTEM_METRICS.slice(-days);
    }
    return api.get<SystemMetrics[]>(`/analytics/metrics/history?days=${days}`);
  },

  /**
   * Get driver-specific analytics
   */
  getDriverAnalytics: async (driverId: number, days: number = 30) => {
    if (DEMO_MODE) {
      await simulateDelay();
      const driver = MOCK_DRIVERS.find(d => d.id === driverId);
      return {
        driver,
        metrics: MOCK_SYSTEM_METRICS.slice(-days),
        assignments: MOCK_ASSIGNMENTS.filter(a => a.driver_id === driverId),
      };
    }
    return api.get(`/analytics/driver/${driverId}?days=${days}`);
  },

  /**
   * Export analytics data
   */
  exportData: async (startDate: string, endDate: string, format: 'json' | 'csv' = 'csv') => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { message: 'Export not available in demo mode' };
    }
    return api.get(`/analytics/export?start=${startDate}&end=${endDate}&format=${format}`);
  },
};

// ============================================
// DRIVERS API
// ============================================

export const driversApi = {
  /**
   * Get all drivers with optional filters
   */
  getDrivers: async (params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Driver>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      let filteredDrivers = [...MOCK_DRIVERS];
      
      if (params?.status) {
        filteredDrivers = filteredDrivers.filter(d => d.status === params.status);
      }
      
      return paginateData(filteredDrivers, params?.page || 1, params?.per_page || 10);
    }
    const queryParams = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<Driver>>(`/drivers${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get single driver by ID
   */
  getDriver: async (driverId: number): Promise<Driver> => {
    if (DEMO_MODE) {
      await simulateDelay();
      const driver = MOCK_DRIVERS.find(d => d.id === driverId);
      if (!driver) throw new Error('Driver not found');
      return driver;
    }
    return api.get<Driver>(`/drivers/${driverId}`);
  },

  /**
   * Get driver's current assignment
   */
  getDriverAssignment: async (driverId: number, date?: string): Promise<Assignment> => {
    if (DEMO_MODE) {
      await simulateDelay();
      const assignment = MOCK_ASSIGNMENTS.find(a => a.driver_id === driverId);
      if (!assignment) throw new Error('Assignment not found');
      return assignment;
    }
    const params = date ? `?date=${date}` : '';
    return api.get<Assignment>(`/drivers/${driverId}/assignment${params}`);
  },

  /**
   * Get driver's health history
   */
  getDriverHealth: async (driverId: number, days: number = 7): Promise<HealthEvent[]> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return MOCK_HEALTH_EVENTS.filter(h => h.driver_id === driverId);
    }
    return api.get<HealthEvent[]>(`/drivers/${driverId}/health?days=${days}`);
  },

  /**
   * Update driver profile (admin)
   */
  updateDriver: async (driverId: number, data: Partial<Driver>): Promise<Driver> => {
    if (DEMO_MODE) {
      await simulateDelay();
      const driver = MOCK_DRIVERS.find(d => d.id === driverId);
      if (!driver) throw new Error('Driver not found');
      return { ...driver, ...data };
    }
    return api.put<Driver>(`/drivers/${driverId}`, data);
  },

  /**
   * Terminate driver
   */
  terminateDriver: async (driverId: number, reason: string): Promise<ApiResponse<void>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { success: true, data: undefined, message: 'Driver terminated successfully (demo mode)' };
    }
    return api.post<ApiResponse<void>>(`/drivers/${driverId}/terminate`, { reason });
  },
};

// ============================================
// ASSIGNMENTS API
// ============================================

export const assignmentsApi = {
  /**
   * Get all assignments with filters
   */
  getAssignments: async (params?: {
    date?: string;
    driver_id?: number;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Assignment>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      let filtered = [...MOCK_ASSIGNMENTS];
      if (params?.driver_id) filtered = filtered.filter(a => a.driver_id === params.driver_id);
      if (params?.status) filtered = filtered.filter(a => a.status === params.status);
      return paginateData(filtered, params?.page || 1, params?.per_page || 10);
    }
    const queryParams = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<Assignment>>(`/assignments${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get single assignment
   */
  getAssignment: async (assignmentId: number): Promise<Assignment> => {
    if (DEMO_MODE) {
      await simulateDelay();
      const assignment = MOCK_ASSIGNMENTS.find(a => a.id === assignmentId);
      if (!assignment) throw new Error('Assignment not found');
      return assignment;
    }
    return api.get<Assignment>(`/assignments/${assignmentId}`);
  },

  /**
   * Manually trigger assignment generation (admin only)
   */
  generateAssignments: async (date: string): Promise<ApiResponse<{ job_id: string }>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { success: true, data: { job_id: 'mock-job-' + Date.now() }, message: 'Generation started (demo mode)' };
    }
    return api.post<ApiResponse<{ job_id: string }>>('/assignments/generate', { date });
  },

  /**
   * Get assignment generation status
   */
  getGenerationStatus: async (jobId: string): Promise<{
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress?: number;
    message?: string;
  }> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { status: 'completed', progress: 100, message: 'Assignment generation complete' };
    }
    return api.get(`/assignments/generate/status/${jobId}`);
  },
};

// ============================================
// HEALTH & INTERVENTIONS API
// ============================================

export const healthApi = {
  /**
   * Get all health events
   */
  getHealthEvents: async (params?: {
    driver_id?: number;
    date?: string;
    risk_level?: 'safe' | 'warning' | 'critical';
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<HealthEvent>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      let filtered = [...MOCK_HEALTH_EVENTS];
      if (params?.driver_id) filtered = filtered.filter(h => h.driver_id === params.driver_id);
      return paginateData(filtered, params?.page || 1, params?.per_page || 10);
    }
    const queryParams = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<HealthEvent>>(`/health/events${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get interventions (risk > 75%)
   */
  getInterventions: async (params?: {
    date?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<HealthEvent>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      const interventions = MOCK_HEALTH_EVENTS.filter(h => h.intervention_triggered);
      return paginateData(interventions, params?.page || 1, params?.per_page || 10);
    }
    const queryParams = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<HealthEvent>>(`/health/interventions${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Force intervention for driver (admin)
   */
  forceIntervention: async (driverId: number, reason: string): Promise<ApiResponse<void>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { success: true, data: undefined, message: 'Intervention forced (demo mode)' };
    }
    return api.post<ApiResponse<void>>(`/health/intervention/force`, { driver_id: driverId, reason });
  },
};

// ============================================
// SWAPS API
// ============================================

export const swapsApi = {
  /**
   * Get all swap proposals
   */
  getSwaps: async (params?: {
    status?: 'pending' | 'accepted' | 'rejected' | 'expired';
    date?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<SwapProposal>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      let filtered = [...MOCK_SWAP_PROPOSALS];
      if (params?.status) filtered = filtered.filter(s => s.status === params.status);
      return paginateData(filtered, params?.page || 1, params?.per_page || 10);
    }
    const queryParams = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<SwapProposal>>(`/swaps${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get swap details
   */
  getSwap: async (swapId: number): Promise<SwapProposal> => {
    if (DEMO_MODE) {
      await simulateDelay();
      const swap = MOCK_SWAP_PROPOSALS.find(s => s.id === swapId);
      if (!swap) throw new Error('Swap not found');
      return swap;
    }
    return api.get<SwapProposal>(`/swaps/${swapId}`);
  },

  /**
   * Cancel swap (admin override)
   */
  cancelSwap: async (swapId: number, reason: string): Promise<ApiResponse<void>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { success: true, data: undefined, message: 'Swap cancelled (demo mode)' };
    }
    return api.post<ApiResponse<void>>(`/swaps/${swapId}/cancel`, { reason });
  },
};

// ============================================
// INSURANCE API
// ============================================

export const insuranceApi = {
  /**
   * Get all insurance payouts
   */
  getPayouts: async (params?: {
    driver_id?: number;
    date?: string;
    approved?: boolean;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<InsurancePayout>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      let filtered = [...MOCK_INSURANCE_PAYOUTS];
      if (params?.driver_id) filtered = filtered.filter(p => p.driver_id === params.driver_id);
      if (params?.approved !== undefined) filtered = filtered.filter(p => p.approved === params.approved);
      return paginateData(filtered, params?.page || 1, params?.per_page || 10);
    }
    const queryParams = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<InsurancePayout>>(`/insurance/payouts${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Approve/reject insurance payout (admin)
   */
  reviewPayout: async (payoutId: number, approved: boolean, notes?: string): Promise<ApiResponse<void>> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { success: true, data: undefined, message: `Payout ${approved ? 'approved' : 'rejected'} (demo mode)` };
    }
    return api.post<ApiResponse<void>>(`/insurance/payouts/${payoutId}/review`, { approved, notes });
  },
};

// ============================================
// MONITORING API (Real-time data)
// ============================================

export const monitoringApi = {
  /**
   * Get current active drivers with GPS
   */
  getActiveDrivers: async (): Promise<any[]> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return MOCK_ACTIVE_DRIVERS;
    }
    return api.get('/monitoring/active-drivers');
  },

  /**
   * Get system health status
   */
  getSystemHealth: async (): Promise<{
    database: 'healthy' | 'degraded' | 'down';
    redis: 'healthy' | 'degraded' | 'down';
    workers: 'healthy' | 'degraded' | 'down';
    api: 'healthy' | 'degraded' | 'down';
  }> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return {
        database: 'healthy',
        redis: 'healthy',
        workers: 'healthy',
        api: 'healthy',
      };
    }
    return api.get('/health');
  },

  /**
   * Get recent system events
   */
  getRecentEvents: async (limit: number = 50): Promise<any[]> => {
    if (DEMO_MODE) {
      await simulateDelay();
      return Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
        id: i + 1,
        type: ['assignment', 'health_check', 'swap', 'delivery'][i % 4],
        message: `System event ${i + 1}`,
        timestamp: new Date(Date.now() - i * 5 * 60 * 1000).toISOString(),
      }));
    }
    return api.get(`/monitoring/events?limit=${limit}`);
  },
};
