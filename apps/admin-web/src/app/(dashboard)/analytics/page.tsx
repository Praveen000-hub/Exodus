'use client';

import { useState, useEffect } from 'react';
import { analyticsApi } from '@/lib/api';
import type { SystemMetrics } from '@/types';
import { Card } from '@/components/ui/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadMetrics();
  }, [dateRange]);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsApi.getMetricsHistory();
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      await analyticsApi.exportData(
        thirtyDaysAgo.toISOString().split('T')[0],
        now.toISOString().split('T')[0],
        'csv'
      );
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  // Prepare chart data
  const chartData = metrics.map(m => ({
    date: formatDate(m.date, 'short'),
    packages: m.total_packages,
    deliveries: m.delivered_packages,
    interventions: m.health_interventions,
    swaps: m.swap_count,
    fairness: m.fairness_score,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">System performance and trends</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadMetrics}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Delivery Performance */}
          <Card title="Delivery Performance" subtitle="Packages and completions over time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="packages" stroke="#3b82f6" name="Total Packages" />
                <Line type="monotone" dataKey="deliveries" stroke="#10b981" name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Interventions & Swaps */}
          <Card title="System Interventions" subtitle="Health interventions and route swaps">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="interventions" fill="#f59e0b" name="Health Interventions" />
                <Bar dataKey="swaps" fill="#8b5cf6" name="Route Swaps" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Fairness Score Trend */}
          <Card title="Fairness Score" subtitle="Higher is better (0-100 scale)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="fairness" stroke="#10b981" strokeWidth={2} name="Fairness Score" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}
