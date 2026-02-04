// Re-export all API types
export * from './api';
export * from './models';

// UI Component Types
export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface TabsData {
  today: {
    assignment: Assignment | null;
    explanation: SHAPExplanation | null;
    health: HealthEvent | null;
  };
  health: {
    currentRisk: number;
    events: HealthEvent[];
    interventions: HealthEvent[];
  };
  future: {
    forecasts: Forecast | null;
  };
}

// Real-world micro-details types
export interface BuildingDetails {
  hasLift: boolean;
  floors: number;
  parkingDistance: number; // meters
  accessNotes?: string;
}

export interface WeatherInfo {
  temperature: number; // Celsius
  humidity: number; // percentage
  condition: string;
  advice?: string;
}

export interface RouteDetails {
  totalStops: number;
  totalPackages: number;
  totalFloors: number;
  totalDistance: number; // km
  expectedStartTime: string;
  expectedEndTime: string;
  buildingDetails: BuildingDetails[];
  weather: WeatherInfo;
}

export interface HealthMetrics {
  riskPercentage: number;
  hoursWorked: number;
  floorsClimbed: number;
  heartRate?: number;
  lastUpdated: string;
  nextCheckIn: string;
}

export interface SwapBenefit {
  benefitScore: number;
  difficultyDifference: number;
  floorsSaved: number;
  compatibilityScore: number;
}

export interface InsuranceDetails {
  expectedDuration: number;
  actualDuration: number;
  zScore: number;
  bonusAmount: number;
  proofSources: {
    gpsValidated: boolean;
    trafficApiValidated: boolean;
  };
}

// Import necessary types from api.ts
import type { Assignment, SHAPExplanation, HealthEvent, Forecast } from './api';