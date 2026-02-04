'use client';

import { useState, useEffect } from 'react';
import { driverApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Package, DollarSign, TrendingUp, Activity, Heart, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface DashboardData {
  active_assignment?: any;
  today_stats: {
    packages_delivered: number;
    earnings: number;
    distance_covered: number;
    current_fitness: number;
  };
  health_status: {
    risk_percentage: number;
    heart_rate?: number;
    spo2?: number;
    last_updated: string;
  };
  recent_swaps: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const result = await driverApi.getDashboard();
      setData(result);
    } catch (error) {
      console.error('Error loading dashboard:', error);
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

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load dashboard data</p>
      </div>
    );
  }

  const { today_stats, health_status } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Packages Delivered</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatNumber(today_stats.packages_delivered)}
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(today_stats.earnings)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Distance Covered</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatNumber(today_stats.distance_covered)} km
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fitness Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {today_stats.current_fitness}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Health Status */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="h-6 w-6 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">Health Status</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Risk Level</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    health_status.risk_percentage >= 80
                      ? 'bg-red-500'
                      : health_status.risk_percentage >= 50
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${health_status.risk_percentage}%` }}
                />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {health_status.risk_percentage}%
              </span>
            </div>
          </div>

          {health_status.heart_rate && (
            <div>
              <p className="text-sm text-gray-600">Heart Rate</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                {health_status.heart_rate} <span className="text-sm font-normal">bpm</span>
              </p>
            </div>
          )}

          {health_status.spo2 && (
            <div>
              <p className="text-sm text-gray-600">SpO2</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                {health_status.spo2}%
              </p>
            </div>
          )}
        </div>

        {health_status.risk_percentage >= 80 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">High Risk Alert</p>
              <p className="text-sm text-red-700 mt-1">
                Your health risk is high. Please take a break and contact support if needed.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Active Assignment */}
      {data.active_assignment && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Assignment</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Packages:</span> {data.active_assignment.total_packages}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Distance:</span> {data.active_assignment.total_distance} km
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Expected Earnings:</span> {formatCurrency(data.active_assignment.earnings)}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
