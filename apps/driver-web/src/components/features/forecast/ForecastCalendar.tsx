'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Download, TrendingUp, Package, Clock, Target } from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils';
import type { Forecast } from '@/types/api';

interface ForecastCalendarProps {
  forecast: Forecast | null;
  isLoading: boolean;
}

export function ForecastCalendar({ forecast, isLoading }: ForecastCalendarProps) {
  if (isLoading) {
    return (
      <Card className="fairai-card">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!forecast) {
    return null;
  }

  // Group forecasts by weeks
  const weeks = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = i * 7;
    const weekEnd = Math.min(weekStart + 7, forecast.forecasts.length);
    const weekData = forecast.forecasts.slice(weekStart, weekEnd);
    
    const avgPackages = Math.round(
      weekData.reduce((sum, day) => sum + day.predicted_packages, 0) / weekData.length
    );
    const avgDifficulty = Math.round(
      weekData.reduce((sum, day) => sum + day.predicted_difficulty, 0) / weekData.length
    );
    const avgDuration = 
      weekData.reduce((sum, day) => sum + day.predicted_duration_hours, 0) / weekData.length;
    const avgConfidence = 
      weekData.reduce((sum, day) => sum + day.confidence, 0) / weekData.length;
    
    // Estimate earnings (₹40 per package)
    const estimatedEarnings = avgPackages * 40 * 7;
    
    weeks.push({
      week: i + 1,
      avgPackages,
      avgDifficulty,
      avgDuration,
      avgConfidence,
      estimatedEarnings,
      workload: avgDifficulty > 75 ? 'High' : avgDifficulty > 60 ? 'Medium' : 'Low'
    });
  }

  return (
    <Card className="fairai-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            30-Day Forecast
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export ICS
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Cards */}
        <div className="grid grid-cols-4 gap-4">
          {weeks.map((week) => (
            <div 
              key={week.week}
              className={`p-3 rounded-lg border ${
                week.workload === 'High' ? 'bg-orange-50 border-orange-200' :
                week.workload === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}
            >
              <div className="text-center space-y-2">
                <div className="font-semibold text-black">Week {week.week}</div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Package className="w-3 h-3 text-orange-500" />
                    <span className="text-sm font-medium">{week.avgPackages}/day</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-black/60">
                      {formatDuration(week.avgDuration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-black/60">
                      {formatCurrency(week.estimatedEarnings)}
                    </span>
                  </div>
                </div>
                
                <div className={`text-xs px-2 py-1 rounded-full ${
                  week.workload === 'High' ? 'bg-orange-100 text-orange-700' :
                  week.workload === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {week.workload}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-orange-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-black/60">Avg Confidence</span>
            </div>
            <div className="font-semibold text-black">
              {Math.round(weeks.reduce((sum, w) => sum + w.avgConfidence, 0) / weeks.length * 100)}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Package className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-black/60">Total Packages</span>
            </div>
            <div className="font-semibold text-black">
              {weeks.reduce((sum, w) => sum + w.avgPackages * 7, 0)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-black/60">Est. Earnings</span>
            </div>
            <div className="font-semibold text-black">
              {formatCurrency(weeks.reduce((sum, w) => sum + w.estimatedEarnings, 0))}
            </div>
          </div>
        </div>

        {/* Planning Note */}
        <div className="text-center text-sm text-black/60 bg-gray-50 rounded-lg p-3">
          Plan your schedule based on predicted workload. Week 2 shows high demand.
        </div>
      </CardContent>
    </Card>
  );
}