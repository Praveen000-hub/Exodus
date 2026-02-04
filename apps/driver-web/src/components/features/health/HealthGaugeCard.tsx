'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardSkeleton } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Clock, TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatRelativeTime, getNextCheckTime, getRiskLevel, getRiskLabel } from '@/lib/utils';

interface HealthData {
  risk_percentage: number;
  risk_level: 'green' | 'yellow' | 'red';
  continuous_driving_minutes: number;
  distance_covered_km: number;
  deliveries_completed: number;
  heart_rate?: number;
  last_updated: string;
  next_check: string;
}

interface HealthGaugeCardProps {
  healthData: HealthData | null;
  isLoading: boolean;
}

export function HealthGaugeCard({ healthData, isLoading }: HealthGaugeCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return <CardSkeleton className="h-72" />;
  }

  if (!healthData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-48 text-center">
          <Heart className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-subheading text-black/60 mb-2">Health Data Unavailable</p>
          <p className="text-body text-black/40">Connect your health tracker</p>
        </CardContent>
      </Card>
    );
  }

  const riskLevel = getRiskLevel(healthData.risk_percentage);
  const riskLabel = getRiskLabel(riskLevel);
  const hoursWorked = Math.round(healthData.continuous_driving_minutes / 60 * 10) / 10;
  const floorsClimbed = Math.floor(healthData.deliveries_completed * 2.5);
  
  const getHealthIcon = () => {
    switch (riskLevel) {
      case 'green': return CheckCircle;
      case 'yellow': return AlertTriangle;
      case 'red': return AlertTriangle;
      default: return Shield;
    }
  };

  const getHealthColor = () => {
    switch (riskLevel) {
      case 'green': return 'text-green-500';
      case 'yellow': return 'text-orange-500';
      case 'red': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getProgressVariant = () => {
    switch (riskLevel) {
      case 'green': return 'success';
      case 'yellow': return 'warning';
      case 'red': return 'danger';
      default: return 'default';
    }
  };

  const HealthIcon = getHealthIcon();

  return (
    <Card interactive className="fairai-card-interactive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <span className="text-heading">Health Guardian</span>
              <Badge className="fairai-live-badge ml-2">
                <div className="fairai-live-dot" />
                LIVE
              </Badge>
            </div>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-card">
        {/* Main Health Score */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-2">
              <HealthIcon className={`w-8 h-8 ${getHealthColor()}`} />
              <div>
                <div className="text-display">{100 - healthData.risk_percentage}%</div>
                <div className="text-caption">Health Score</div>
              </div>
            </div>
          </div>
          
          <Progress 
            value={100 - healthData.risk_percentage} 
            variant={getProgressVariant() as any}
            size="lg"
            showValue={false}
            className="h-3"
          />
          
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            riskLevel === 'green' ? 'bg-green-50 text-green-700' :
            riskLevel === 'yellow' ? 'bg-orange-50 text-orange-700' : 
            'bg-red-50 text-red-700'
          }`}>
            <HealthIcon className="w-4 h-4" />
            {riskLabel}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center hover-lift">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-caption">Hours Worked</span>
            </div>
            <div className="text-value-sm text-blue-600">{hoursWorked}h</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 text-center hover-lift">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-caption">Floors Climbed</span>
            </div>
            <div className="text-value-sm text-green-600">{floorsClimbed}</div>
          </div>
        </div>

        {/* Heart Rate (if available) */}
        {healthData.heart_rate && (
          <div className="bg-red-50 rounded-lg p-3 text-center hover-lift">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-red-500" />
              <span className="text-caption">Heart Rate</span>
            </div>
            <div className="text-value-sm text-red-600">{healthData.heart_rate} bpm</div>
          </div>
        )}

        {/* AI Health Recommendation */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div>
              <p className="text-caption font-medium text-blue-800 mb-1">Health Tip</p>
              <p className="text-caption text-blue-700">
                {riskLevel === 'green' 
                  ? "You're doing great! Keep maintaining good work-life balance."
                  : riskLevel === 'yellow'
                  ? "Consider taking a 10-minute break soon to recharge."
                  : "Time for a mandatory break - your health is priority!"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-caption text-black/60">
              Updated {formatRelativeTime(healthData.last_updated)}
            </div>
            <div className="text-caption text-black/40">
              Next check in {getNextCheckTime(healthData.last_updated)}
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </Button>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-tight fade-in">
            <h5 className="text-label mb-3">Today's Activity</h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-caption">Distance Covered</span>
                <span className="text-label">{healthData.distance_covered_km}km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-caption">Deliveries Made</span>
                <span className="text-label">{healthData.deliveries_completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-caption">Continuous Driving</span>
                <span className="text-label">{Math.round(healthData.continuous_driving_minutes)}min</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}