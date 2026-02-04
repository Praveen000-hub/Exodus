'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardSkeleton } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Clock, TrendingUp, Shield, AlertTriangle, CheckCircle, Zap, Brain } from 'lucide-react';
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
  const [pulse, setPulse] = useState(false);
  const [nextCheckSeconds, setNextCheckSeconds] = useState(58);

  useEffect(() => {
    // Pulse animation for heart
    const pulseInterval = setInterval(() => {
      setPulse(prev => !prev);
    }, 1000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setNextCheckSeconds(prev => prev > 0 ? prev - 1 : 58);
    }, 1000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(countdownInterval);
    };
  }, []);

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
  const healthScore = 100 - healthData.risk_percentage;
  const hoursWorked = Math.round(healthData.continuous_driving_minutes / 60 * 10) / 10;
  const floorsClimbed = Math.floor(healthData.deliveries_completed * 2.5);
  
  const getHealthColor = () => {
    switch (riskLevel) {
      case 'green': return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        icon: 'text-orange-500',
        progress: 'bg-orange-500'
      };
      case 'yellow': return {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-700',
        icon: 'text-orange-500',
        progress: 'bg-orange-500'
      };
      case 'red': return {
        bg: 'bg-orange-50',
        border: 'border-orange-400',
        text: 'text-orange-700',
        icon: 'text-orange-500',
        progress: 'bg-orange-500'
      };
      default: return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
        icon: 'text-gray-500',
        progress: 'bg-gray-500'
      };
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

  const colors = getHealthColor();

  return (
    <Card interactive className="fairai-card-interactive overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className={`p-2 ${colors.bg} rounded-lg relative`}>
              <Heart 
                className={`w-5 h-5 ${colors.icon} transition-transform duration-300 ${pulse ? 'scale-110' : 'scale-100'}`}
                fill={pulse ? 'currentColor' : 'none'}
              />
            </div>
            <div>
              <span className="text-heading">Health Guardian</span>
              <Badge className="fairai-live-badge ml-2 animate-pulse">
                <div className="fairai-live-dot" />
                LIVE
              </Badge>
            </div>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Health Score with Circular Progress */}
        <div className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative flex items-center justify-center gap-4">
            <div className="relative">
              {/* Circular progress */}
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-white/40"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={colors.icon}
                  style={{
                    strokeDasharray: `${2 * Math.PI * 56}`,
                    strokeDashoffset: `${2 * Math.PI * 56 * (1 - healthScore / 100)}`,
                    transition: 'stroke-dashoffset 1s ease-in-out'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AlertTriangle className={`w-6 h-6 ${colors.icon} mb-1`} />
                <div className={`text-3xl font-bold ${colors.text}`}>{healthScore}%</div>
              </div>
            </div>
            
            <div className="text-left">
              <div className="text-xs text-gray-600 mb-1">Health Score</div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.text} border-2 ${colors.border}`}>
                <AlertTriangle className="w-4 h-4" />
                {riskLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200 hover:shadow-lg hover:scale-105 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-orange-600">Hours Worked</span>
            </div>
            <div className="text-2xl font-bold text-orange-700">{hoursWorked}h</div>
            <div className="h-1 bg-orange-200 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${(hoursWorked / 8) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50/70 to-orange-100/30 rounded-xl p-4 border border-orange-200 hover:shadow-lg hover:scale-105 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-orange-600">Floors Climbed</span>
            </div>
            <div className="text-2xl font-bold text-orange-700">{floorsClimbed}</div>
            <div className="h-1 bg-orange-200 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((floorsClimbed / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Heart Rate Monitor */}
        {healthData.heart_rate && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 rounded-xl p-4 border-2 border-orange-200 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 30">
                <path 
                  d="M 0 15 Q 5 15 10 5 T 20 15 T 30 5 T 40 15 T 50 5 T 60 15 T 70 5 T 80 15 T 90 5 T 100 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-orange-500"
                />
              </svg>
            </div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className={`w-6 h-6 text-orange-500 ${pulse ? 'scale-125' : 'scale-100'} transition-transform`} />
                <div>
                  <div className="text-xs text-orange-600 font-medium">Heart Rate</div>
                  <div className="text-3xl font-bold text-orange-700">{healthData.heart_rate} <span className="text-lg">bpm</span></div>
                </div>
              </div>
              <Badge className={`${healthData.heart_rate > 100 ? 'bg-orange-500' : 'bg-white border-2 border-orange-500 text-orange-600'} px-3 py-1`}>
                {healthData.heart_rate > 100 ? 'Elevated' : 'Normal'}
              </Badge>
            </div>
          </div>
        )}

        {/* AI Health Recommendation with Animation */}
        <div className={`${colors.bg} border-2 ${colors.border} rounded-xl p-4 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 opacity-5">
            <Brain className="w-24 h-24" />
          </div>
          <div className="relative flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                Health Tip
                <Zap className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
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

        {/* Status Footer with Live Updates */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs">
            <div className="text-gray-500">Updated <span className="font-medium text-gray-700">1 sec ago</span></div>
            <div className="text-gray-400 mt-0.5">Next check in <span className="font-semibold text-orange-600">{nextCheckSeconds} sec</span></div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide' : 'Details'}
          </Button>
        </div>

        {/* Expandable Detailed Stats */}
        {showDetails && (
          <div className="mt-2 bg-white rounded-xl border-2 border-gray-200 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
            <h5 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Today's Activity Summary
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-sm text-gray-600">Distance Covered</span>
                <span className="text-sm font-bold text-gray-900">{healthData.distance_covered_km} km</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-sm text-gray-600">Deliveries Made</span>
                <span className="text-sm font-bold text-gray-900">{healthData.deliveries_completed}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-sm text-gray-600">Continuous Driving</span>
                <span className="text-sm font-bold text-gray-900">{Math.round(healthData.continuous_driving_minutes)} min</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}