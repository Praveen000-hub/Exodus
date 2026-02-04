'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, Package, TrendingUp, Radio, Zap, Target, CheckCircle2, AlertCircle, Activity } from 'lucide-react';

export default function TrackingPage() {
  const [delivered, setDelivered] = useState(3);
  const [distance, setDistance] = useState(12.3);
  const [activeTime, setActiveTime] = useState(2.5);
  const [speed, setSpeed] = useState(25);
  const [pulse, setPulse] = useState(false);
  const [speedTrend, setSpeedTrend] = useState<'up' | 'down' | 'stable'>('stable');

  // Real-time simulation
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);

    const updateInterval = setInterval(() => {
      // Simulate real-time updates
      setDistance(prev => Math.min(prev + 0.1, 45.8));
      setActiveTime(prev => parseFloat((prev + 0.01).toFixed(2)));
      
      // Random speed variations (realistic traffic)
      const speedChange = (Math.random() - 0.5) * 3;
      setSpeed(prev => {
        const newSpeed = Math.max(0, Math.min(60, prev + speedChange));
        if (speedChange > 1) setSpeedTrend('up');
        else if (speedChange < -1) setSpeedTrend('down');
        else setSpeedTrend('stable');
        return Math.round(newSpeed);
      });
    }, 2000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(updateInterval);
    };
  }, []);

  const progress = (delivered / 10) * 100;
  const distanceProgress = (distance / 45.8) * 100;

  return (
    <MainLayout title="Live Tracking" subtitle="Real-time delivery progress">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero Stats with Real-time Animation */}
        <Card className="relative overflow-hidden border-2 border-orange-200 shadow-xl">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-60"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -mr-32 -mt-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full -ml-24 -mb-24 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="relative">
                  <Radio className={`w-6 h-6 text-orange-500 transition-all duration-500 ${pulse ? 'scale-125' : 'scale-100'}`} />
                  <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  Current Status
                </span>
              </CardTitle>
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 text-sm shadow-lg animate-pulse border-0">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                LIVE
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="grid grid-cols-4 gap-6">
              {/* Packages Delivered */}
              <div className="group relative bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-orange-600 mb-1 group-hover:scale-110 transition-transform">
                    {delivered}<span className="text-2xl text-gray-400">/10</span>
                  </div>
                  <div className="text-sm text-gray-600 font-medium mb-3">Delivered</div>
                  
                  {/* Progress bar */}
                  <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-xs text-orange-600 font-semibold mt-2">{progress}% Complete</div>
                </div>
              </div>

              {/* Distance Covered */}
              <div className="group relative bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-orange-600 mb-1 group-hover:scale-110 transition-transform">
                    {distance.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium mb-3">km Covered</div>
                  
                  {/* Distance progress */}
                  <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                      style={{ width: `${distanceProgress}%` }}
                    >
                      <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-xs text-orange-600 font-semibold mt-2">Target: 45.8 km</div>
                </div>
              </div>

              {/* Active Time */}
              <div className="group relative bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform relative">
                    <Clock className="w-7 h-7 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
                  </div>
                  <div className="text-4xl font-bold text-orange-600 mb-1 group-hover:scale-110 transition-transform">
                    {activeTime.toFixed(1)}<span className="text-xl">h</span>
                  </div>
                  <div className="text-sm text-gray-600 font-medium mb-3">Active Time</div>
                  
                  {/* Time indicator */}
                  <div className="flex items-center justify-center gap-1 mt-3">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                          i < (activeTime / 8 * 8) ? 'bg-orange-500 scale-110' : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="text-xs text-orange-600 font-semibold mt-2">of 8h shift</div>
                </div>
              </div>

              {/* Current Speed */}
              <div className="group relative bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <Navigation className={`w-7 h-7 text-white transition-transform ${pulse ? 'scale-110' : 'scale-100'}`} />
                  </div>
                  <div className="text-4xl font-bold text-orange-600 mb-1 flex items-center justify-center gap-2 group-hover:scale-110 transition-transform">
                    {speed}
                    {speedTrend === 'up' && <TrendingUp className="w-5 h-5 text-orange-500" />}
                    {speedTrend === 'down' && <TrendingUp className="w-5 h-5 text-orange-500 rotate-180" />}
                  </div>
                  <div className="text-sm text-gray-600 font-medium mb-3">km/h Speed</div>
                  
                  {/* Speed gauge */}
                  <div className="relative h-2 bg-orange-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full transition-all duration-300"
                      style={{ width: `${(speed / 60) * 100}%` }}
                    >
                      <div className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-xs text-orange-600 font-semibold mt-2">
                    {speed > 40 ? '🚀 Fast' : speed > 20 ? '⚡ Normal' : '🐌 Slow'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          {/* Next Stop */}
          <Card className="col-span-2 border-2 border-orange-100 hover:shadow-xl transition-all group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Next Stop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-orange-500 text-white">Package #4</Badge>
                      <Badge className="bg-orange-100 text-orange-700 border-2 border-orange-300">ETA: 8 min</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Johnson</h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      456 Oak Street, Downtown District
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                </div>
                
                {/* Route progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Route Progress</span>
                    <span className="text-orange-600 font-semibold">3.2 km away</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" style={{ width: '40%', animation: 'pulse 2s infinite' }}>
                      <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Package details */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-orange-100">
                  <div className="text-center">
                    <Package className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Weight</div>
                    <div className="text-sm font-bold text-gray-900">2.5 kg</div>
                  </div>
                  <div className="text-center">
                    <AlertCircle className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Priority</div>
                    <div className="text-sm font-bold text-orange-600">Standard</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Window</div>
                    <div className="text-sm font-bold text-gray-900">2-4 PM</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Performance */}
          <Card className="border-2 border-orange-100 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">On-Time Rate</span>
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
                <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Efficiency</span>
                  <Zap className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">94%</div>
                <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" style={{ width: '94%' }}>
                    <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Avg. Speed</span>
                  <Navigation className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-orange-600">28 <span className="text-lg text-gray-500">km/h</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Placeholder with Enhanced Design */}
        <Card className="border-2 border-orange-100 shadow-xl">
          <CardContent className="p-0">
            <div className="h-96 bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* Animated route line */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <path d="M 50 50 Q 150 100, 250 150 T 450 250" stroke="currentColor" strokeWidth="3" fill="none" className="text-orange-500" strokeDasharray="10,5" />
              </svg>
              
              {/* Map pins simulation */}
              <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center shadow-lg opacity-50">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              
              <div className="text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <p className="text-xl font-bold text-gray-900 mb-2">Live Route Visualization</p>
                <p className="text-gray-600 mb-1">Real-time tracking with Google Maps</p>
                <p className="text-sm text-orange-600 font-semibold">Integration ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}