'use client';

import { useState, useEffect } from 'react';
import { healthApi } from '@/lib/api';
import type { HealthEvent } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function InterventionsPage() {
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    loadHealthEvents();
    // Refresh every 30 seconds
    const interval = setInterval(loadHealthEvents, 30000);
    return () => clearInterval(interval);
  }, [severityFilter]);

  const loadHealthEvents = async () => {
    try {
      setIsLoading(true);
      const data = await healthApi.getHealthEvents({});
      setEvents(Array.isArray(data) ? data : data.data || []);
      // Filter by risk percentage on client side if needed
    } catch (error) {
      console.error('Error loading health events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceIntervention = async (driverId: number) => {
    try {
      await healthApi.forceIntervention(driverId, 'manual_trigger');
      await loadHealthEvents();
    } catch (error) {
      console.error('Error forcing intervention:', error);
    }
  };

  const stats = {
    total: events.length,
    critical: events.filter(e => e.risk_percentage >= 80).length,
    high: events.filter(e => e.risk_percentage >= 50 && e.risk_percentage < 80).length,
    medium: events.filter(e => e.risk_percentage >= 30 && e.risk_percentage < 50).length,
    pending: events.filter(e => !e.intervention_triggered).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Health Interventions</h1>
        <p className="text-gray-600 mt-1">Monitor driver health and trigger interventions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-4">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </Card>

      {/* Events List */}
      <Card>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-600">Loading health events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No health events found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`border rounded-lg p-4 ${
                  event.risk_percentage >= 80
                    ? 'border-red-300 bg-red-50'
                    : event.risk_percentage >= 50
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {event.driver_name || `Driver ${event.driver_id}`}
                      </h3>
                      <Badge status={event.risk_percentage >= 80 ? 'error' : event.risk_percentage >= 50 ? 'warning' : 'success'}>
                        {event.risk_percentage >= 80 ? 'Critical' : event.risk_percentage >= 50 ? 'High' : 'Medium'}
                      </Badge>
                      <Badge status={event.intervention_triggered ? 'success' : 'warning'}>
                        {event.intervention_triggered ? 'Intervened' : 'Pending'}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">
                      <span className="font-medium">Risk Percentage:</span> {event.risk_percentage}%
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Risk Score: </span>
                        <span className="font-medium text-gray-900">
                          {event.risk_percentage}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Detected: </span>
                        <span className="font-medium text-gray-900">
                          {formatRelativeTime(event.timestamp)}
                        </span>
                      </div>
                      {event.heart_rate && (
                        <div>
                          <span className="text-gray-600">Heart Rate: </span>
                          <span className="font-medium text-gray-900">
                            {event.heart_rate} bpm
                          </span>
                        </div>
                      )}
                    </div>

                    {event.intervention_details && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Intervention: </span>
                          <span className="text-gray-600">
                            {event.intervention_details.helpers.length} helpers assigned
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.intervention_details.packages_reassigned} packages reassigned, 
                          ${event.intervention_details.protected_earnings} earnings protected
                        </p>
                      </div>
                    )}
                  </div>

                  {!event.intervention_triggered && (
                    <button
                      onClick={() => handleForceIntervention(event.driver_id)}
                      className="ml-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    >
                      Intervene Now
                    </button>
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
