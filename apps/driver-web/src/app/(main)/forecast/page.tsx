'use client';

import { useState, useEffect } from 'react';
import { driverApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { TrendingUp, Package, Clock, Activity } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface Forecast {
  date: string;
  predicted_packages: number;
  predicted_difficulty: number;
  predicted_duration_hours: number;
  confidence: number;
}

export default function ForecastPage() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadForecasts();
  }, []);

  const loadForecasts = async () => {
    try {
      setIsLoading(true);
      const data = await driverApi.getForecast();
      setForecasts(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error('Error loading forecast:', error);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Workload Forecast</h1>
        <p className="text-gray-600 mt-1">AI-powered predictions for upcoming assignments</p>
      </div>

      {forecasts.length === 0 ? (
        <Card className="p-12 text-center">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">No Forecast Available</h2>
          <p className="text-gray-600 mt-2">Check back later for workload predictions</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forecasts.map((forecast, index) => (
            <Card key={index} className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">
                  {new Date(forecast.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h3>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${forecast.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {(forecast.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Packages</p>
                    <p className="font-semibold text-gray-900">
                      {formatNumber(forecast.predicted_packages)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-600">Difficulty</p>
                    <p className="font-semibold text-gray-900">
                      {forecast.predicted_difficulty.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {forecast.predicted_duration_hours.toFixed(1)}h
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
