'use client';

import { useState, useEffect } from 'react';
import { driverApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Heart, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface HealthData {
  current_fitness: number;
  risk_percentage: number;
  heart_rate?: number;
  spo2?: number;
  temperature?: number;
  last_updated: string;
  recent_events: Array<{
    id: number;
    risk_percentage: number;
    timestamp: string;
    intervention_triggered: boolean;
  }>;
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadHealth = async () => {
    try {
      setIsLoading(true);
      const data = await driverApi.getHealth();
      setHealth(data);
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load health data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Health Monitoring</h1>
        <p className="text-gray-600 mt-1">Track your health metrics in real-time</p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <p className="text-sm text-gray-600">Fitness Score</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{health.current_fitness}%</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            <p className="text-sm text-gray-600">Risk Level</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{health.risk_percentage}%</p>
        </Card>

        {health.heart_rate && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-6 w-6 text-red-500" />
              <p className="text-sm text-gray-600">Heart Rate</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {health.heart_rate} <span className="text-lg font-normal">bpm</span>
            </p>
          </Card>
        )}

        {health.spo2 && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <p className="text-sm text-gray-600">SpO2</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{health.spo2}%</p>
          </Card>
        )}
      </div>

      {/* Health Alert */}
      {health.risk_percentage >= 80 && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900">High Risk Alert</h3>
              <p className="text-sm text-red-700 mt-1">
                Your health risk level is critical. Please take a break and contact support immediately.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Events */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Health Events</h2>
        {health.recent_events.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No recent health events</p>
        ) : (
          <div className="space-y-3">
            {health.recent_events.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border ${
                  event.risk_percentage >= 80
                    ? 'bg-red-50 border-red-200'
                    : event.risk_percentage >= 50
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Risk: {event.risk_percentage}%</p>
                    <p className="text-sm text-gray-600 mt-1">{formatRelativeTime(event.timestamp)}</p>
                  </div>
                  {event.intervention_triggered && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      Intervention Applied
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
