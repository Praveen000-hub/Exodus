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
  const [activePackage, setActivePackage] = useState<number | null>(null);

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
            {assignment.total_packages} Packages
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-card">
        {/* Quick Stats Bar */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-orange-50 rounded-lg p-3 text-center border-l-4 border-orange-500">
            <div className="text-2xl font-bold text-orange-600">{formatDistance(assignment.total_distance)}</div>
            <div className="text-xs text-gray-600">Distance</div>
          </div>
          <div className="flex-1 bg-orange-50/50 rounded-lg p-3 text-center border-l-4 border-orange-400">
            <div className="text-2xl font-bold text-orange-600">{formatDuration(assignment.estimated_time)}</div>
            <div className="text-xs text-gray-600">Est. Time</div>
          </div>
          <div className="flex-1 bg-orange-50/30 rounded-lg p-3 text-center border-l-4 border-orange-300">
            <div className="text-2xl font-bold text-orange-600">₹{Math.round(assignment.estimated_time * 180)}</div>
            <div className="text-xs text-gray-600">Earnings</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Side - Package List */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" />
              Your Deliveries
            </h5>
            {assignment.packages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className={`bg-white rounded-lg p-4 border-2 transition-all cursor-pointer ${
                  activePackage === index 
                    ? 'border-orange-500 shadow-lg scale-[1.02]' 
                    : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                }`}
                onClick={() => setActivePackage(activePackage === index ? null : index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-base font-bold text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{pkg.customer_name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3" />
                        {pkg.time_window_start} - {pkg.time_window_end}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {pkg.fragile && (
                      <Badge variant="secondary" className="text-xs bg-red-50 text-red-600">Fragile</Badge>
                    )}
                    {pkg.priority === 'high' && (
                      <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700">Priority</Badge>
                    )}
                  </div>
                </div>
                
                {/* Expandable Details */}
                {activePackage === index && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{pkg.delivery_address}</span>
                    </div>
                    
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span>📦</span>
                        <span className="text-gray-600">{pkg.weight}kg</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📏</span>
                        <span className="text-gray-600">{pkg.dimensions}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-orange-500 hover:bg-orange-600 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/search/?api=1&query=${pkg.delivery_lat},${pkg.delivery_lon}`, '_blank');
                      }}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate Now
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Why This Route */}
          <div className="lg:col-span-1 space-y-3">
            <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500" />
              Why This Route?
            </h5>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-start gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-orange-900 mb-1">Smart Assignment</div>
                  <div className="text-xs text-orange-700">Optimized for you</div>
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex items-center gap-2 bg-white/60 rounded p-2">
                  <CheckCircle2 className="w-3 h-3 text-orange-600 flex-shrink-0" />
                  <span>Best time windows</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 rounded p-2">
                  <CheckCircle2 className="w-3 h-3 text-orange-600 flex-shrink-0" />
                  <span>Minimal distance</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 rounded p-2">
                  <CheckCircle2 className="w-3 h-3 text-orange-600 flex-shrink-0" />
                  <span>Fair workload</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border-2 border-orange-200">
              <div className="text-xs font-semibold text-gray-900 mb-2">Route Summary</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Stops</span>
                  <span className="font-semibold text-orange-600">{assignment.total_packages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-semibold text-orange-600">{assignment.difficulty_score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fragile Items</span>
                  <span className="font-semibold text-orange-600">{assignment.packages.filter(p => p.fragile).length}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="text-xs font-semibold text-gray-900 mb-1 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-orange-500" />
                Today's Conditions
              </div>
              <div className="text-xs text-gray-700">
                28°C, Partly Cloudy - Perfect for deliveries!
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}