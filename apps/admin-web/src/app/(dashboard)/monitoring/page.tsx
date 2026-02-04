'use client';

import { useState, useEffect } from 'react';
import { monitoringApi } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { Driver, WebSocketMessage, GPSUpdate } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Navigation, Activity, RefreshCw } from 'lucide-react';
import { formatRelativeTime, formatNumber } from '@/lib/utils';

export default function MonitoringPage() {
  const [activeDrivers, setActiveDrivers] = useState<Driver[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gpsUpdates, setGpsUpdates] = useState<Map<number, GPSUpdate>>(new Map());

  // WebSocket connection for real-time updates
  const { isConnected } = useWebSocket({
    onMessage: handleWebSocketMessage
  });

  useEffect(() => {
    loadInitialData();
    // Refresh every 30 seconds
    const interval = setInterval(loadInitialData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [drivers, health] = await Promise.all([
        monitoringApi.getActiveDrivers(),
        monitoringApi.getSystemHealth(),
      ]);
      setActiveDrivers(drivers as Driver[]);
      setSystemHealth(health);
    } catch (error) {
      console.error('Error loading monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function handleWebSocketMessage(message: WebSocketMessage) {
    if (message.type === 'gps_all') {
      const updates = message.data as GPSUpdate[];
      const newMap = new Map<number, GPSUpdate>();
      updates.forEach(update => newMap.set(update.driver_id, update));
      setGpsUpdates(newMap);
    } else if (message.type === 'intervention_event' || message.type === 'assignment_update') {
      // Reload drivers when status changes
      loadInitialData();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real-Time Monitoring</h1>
          <p className="text-gray-600 mt-1">Live driver tracking and system health</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={loadInitialData}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* System Health */}
      {systemHealth && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{activeDrivers.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">GPS Updates/min</p>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.gps_updates_per_min || 0}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Response</p>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.avg_response_time_ms || 0}ms</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Load</p>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.cpu_usage_percent?.toFixed(0) || 0}%</p>
              </div>
              <Activity className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>
      )}

      {/* Live Map Placeholder */}
      <Card title="Live Driver Map" subtitle="Real-time GPS tracking">
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Placeholder for map - would integrate with Google Maps/Mapbox */}
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Map Integration</p>
            <p className="text-sm text-gray-500 mt-1">
              {activeDrivers.length} active drivers • {gpsUpdates.size} recent updates
            </p>
          </div>

          {/* GPS Update indicators */}
          {Array.from(gpsUpdates.values()).slice(0, 5).map((update, idx) => (
            <div
              key={update.driver_id}
              className="absolute bg-green-500 rounded-full h-3 w-3 animate-pulse"
              style={{
                top: `${20 + idx * 15}%`,
                left: `${30 + idx * 10}%`,
              }}
            />
          ))}
        </div>
      </Card>

      {/* Active Drivers List */}
      <Card title="Active Drivers" subtitle={`${activeDrivers.length} drivers currently on delivery`}>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-600">Loading active drivers...</p>
          </div>
        ) : activeDrivers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No active drivers</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeDrivers.map((driver) => {
              const gpsUpdate = gpsUpdates.get(driver.id);
              const riskLevel = Math.max(0, 100 - driver.fitness);
              return (
                <div
                  key={driver.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                      <p className="text-sm text-gray-500">Driver #{driver.id}</p>
                    </div>
                    <Badge status={driver.status}>{driver.status}</Badge>
                  </div>

                  {gpsUpdate && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Navigation className="h-4 w-4" />
                        <span>
                          {gpsUpdate.lat.toFixed(4)}, {gpsUpdate.lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Activity className="h-4 w-4" />
                        <span>{gpsUpdate.speed?.toFixed(0) || 0} km/h</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Updated {formatRelativeTime(gpsUpdate.timestamp)}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                    <p className="text-gray-600">
                      Risk Level: <span className="font-medium text-gray-900">{riskLevel}%</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
