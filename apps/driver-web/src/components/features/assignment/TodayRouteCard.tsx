'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardSkeleton } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, Package, Clock, Thermometer, Navigation, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDistance, formatDuration } from '@/lib/utils';
import type { Assignment } from '@/types/api';

interface TodayRouteCardProps {
  assignment: Assignment | null;
  isLoading: boolean;
}

export function TodayRouteCard({ assignment, isLoading }: TodayRouteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return <CardSkeleton className="h-80" />;
  }

  if (!assignment) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-48 text-center">
          <Package className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-subheading text-black/60 mb-2">No Assignment Today</p>
          <p className="text-body text-black/40">Check back later for new routes</p>
        </CardContent>
      </Card>
    );
  }

  const buildingDetails = {
    hasLift: Math.random() > 0.3,
    floors: Math.floor(Math.random() * 8) + 1,
    parkingDistance: Math.floor(Math.random() * 300) + 50
  };

  const weather = {
    temperature: 28,
    humidity: 65,
    condition: 'Partly Cloudy'
  };

  const routeProgress = 0; // Would come from real-time tracking
  const isActive = routeProgress > 0;

  return (
    <Card interactive className="fairai-card-interactive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Package className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <span className="text-heading">Today's Route</span>
              {isActive && (
                <Badge className="fairai-live-badge ml-2">
                  <div className="fairai-live-dot" />
                  ACTIVE
                </Badge>
              )}
            </div>
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Difficulty {assignment.difficulty_score}/100
          </Badge>
        </div>
        
        {isActive && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-caption">Route Progress</span>
              <span className="text-caption font-medium">{routeProgress}%</span>
            </div>
            <Progress value={routeProgress} variant="success" animated />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-card">
        {/* Hero Stats */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl p-5 hover-lift">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-value text-orange-600">{assignment.total_packages}</div>
              <div className="text-caption">Packages</div>
            </div>
            <div className="space-y-1">
              <div className="text-value text-orange-600">{formatDistance(assignment.total_distance)}</div>
              <div className="text-caption">Distance</div>
            </div>
            <div className="space-y-1">
              <div className="text-value text-orange-600">{formatDuration(assignment.estimated_time)}</div>
              <div className="text-caption">Est. Time</div>
            </div>
          </div>
        </div>

        {/* Driver-Friendly Details */}
        <div className="space-tight">
          <h4 className="text-label mb-3">Route Details</h4>
          
          <div className="fairai-info-row">
            {buildingDetails.hasLift ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-500" />
            )}
            <span>
              {buildingDetails.hasLift ? 'Lift available' : 'No lift'}, {buildingDetails.floors} floors avg
            </span>
          </div>
          
          <div className="fairai-info-row">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>Parking {buildingDetails.parkingDistance}m away avg</span>
          </div>
          
          <div className="fairai-info-row">
            <Thermometer className="w-4 h-4 text-blue-500" />
            <span>{weather.temperature}°C, {weather.condition}</span>
            <Badge className="fairai-status-good ml-auto">Good conditions</Badge>
          </div>
        </div>

        {/* AI Hint */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div>
              <p className="text-caption font-medium text-blue-800 mb-1">Smart Tip</p>
              <p className="text-caption text-blue-700">
                {buildingDetails.hasLift 
                  ? "Great route for today - lifts available in most buildings!"
                  : "Consider requesting lighter packages next time - many stairs ahead."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Route Timeline */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-caption">Expected Start</span>
            <span className="text-label">8:00 AM</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-caption">Expected End</span>
            <span className="text-label">12:15 PM</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-caption">Estimated Earnings</span>
            <span className="text-value-sm text-green-600">₹{Math.round(assignment.estimated_time * 180)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button className="flex-1" size="lg">
            <Navigation className="w-4 h-4 mr-2" />
            Start Route
          </Button>
          <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-tight fade-in">
            <h5 className="text-label mb-2">Package Breakdown</h5>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white rounded p-2 border">
                <span className="text-caption">Standard</span>
                <div className="font-medium">{Math.floor(assignment.total_packages * 0.7)}</div>
              </div>
              <div className="bg-white rounded p-2 border">
                <span className="text-caption">Fragile</span>
                <div className="font-medium">{Math.floor(assignment.total_packages * 0.3)}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}