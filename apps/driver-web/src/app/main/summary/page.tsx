'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package, Clock, DollarSign, TrendingUp, Award, Target, Zap, Star, ChevronRight, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SummaryPage() {
  const [animateStats, setAnimateStats] = useState(false);
  const [displayedPackages, setDisplayedPackages] = useState(0);
  const [displayedEarnings, setDisplayedEarnings] = useState(0);
  const [displayedTime, setDisplayedTime] = useState(0);

  const todayStats = {
    packagesDelivered: 8,
    totalPackages: 10,
    timeWorked: 6.5,
    earnings: 420,
    bonus: 75,
    efficiency: 92
  };

  // Animated counters
  useEffect(() => {
    setTimeout(() => setAnimateStats(true), 100);

    // Animate packages counter
    const packagesInterval = setInterval(() => {
      setDisplayedPackages(prev => {
        if (prev < todayStats.packagesDelivered) return prev + 1;
        return prev;
      });
    }, 100);

    // Animate earnings counter
    const earningsInterval = setInterval(() => {
      setDisplayedEarnings(prev => {
        if (prev < todayStats.earnings) return prev + 20;
        return todayStats.earnings;
      });
    }, 50);

    // Animate time counter
    const timeInterval = setInterval(() => {
      setDisplayedTime(prev => {
        if (prev < todayStats.timeWorked) return parseFloat((prev + 0.1).toFixed(1));
        return todayStats.timeWorked;
      });
    }, 100);

    return () => {
      clearInterval(packagesInterval);
      clearInterval(earningsInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const completionPercentage = Math.round((todayStats.packagesDelivered / todayStats.totalPackages) * 100);

  return (
    <MainLayout title="Today's Summary" subtitle="Your performance overview">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero Stats Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-2xl border-2 border-orange-200 shadow-xl p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full -ml-24 -mb-24 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative grid grid-cols-3 gap-6">
            {/* Packages Card */}
            <div className={`group relative bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden ${animateStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                  {displayedPackages}<span className="text-3xl text-gray-400">/{todayStats.totalPackages}</span>
                </div>
                <div className="text-sm text-gray-600 font-medium mb-4">Packages Delivered</div>
                
                {/* Circular Progress */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-orange-100" />
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="56" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeLinecap="round" 
                      className="text-orange-500 transition-all duration-1000"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 56}`,
                        strokeDashoffset: `${2 * Math.PI * 56 * (1 - completionPercentage / 100)}`
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl font-bold text-orange-600">{completionPercentage}%</div>
                  </div>
                </div>
                
                <Badge className="bg-orange-500 text-white px-4 py-1.5 shadow-md">
                  {completionPercentage}% Complete
                </Badge>
              </div>
            </div>

            {/* Time Worked Card */}
            <div className={`group relative bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden ${animateStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '100ms'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                  {displayedTime}<span className="text-2xl">h</span>
                </div>
                <div className="text-sm text-gray-600 font-medium mb-4">Time Worked</div>
                
                {/* Efficiency Gauge */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 font-medium">Efficiency</span>
                    <Zap className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">{todayStats.efficiency}%</div>
                  <div className="h-3 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
                      style={{ width: `${todayStats.efficiency}%` }}
                    >
                      <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <Badge className="bg-orange-500 text-white px-4 py-1.5 shadow-md">
                  {todayStats.efficiency}% Efficiency
                </Badge>
              </div>
            </div>

            {/* Earnings Card */}
            <div className={`group relative bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden ${animateStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '200ms'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                  ₹{displayedEarnings}
                </div>
                <div className="text-sm text-gray-600 font-medium mb-4">Total Earnings</div>
                
                {/* Bonus Highlight */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 mb-4 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative flex items-center justify-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-white animate-pulse" />
                    <span className="text-sm text-white font-bold">BONUS EARNED</span>
                  </div>
                  <div className="text-3xl font-bold text-white">+₹{todayStats.bonus}</div>
                </div>
                
                <Badge className="bg-orange-500 text-white px-4 py-1.5 shadow-md">
                  +₹{todayStats.bonus} Bonus
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Quick Stats */}
          <Card className="border-2 border-orange-100 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Average Speed</div>
                    <div className="text-2xl font-bold text-orange-600">28 km/h</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Customer Rating</div>
                    <div className="text-2xl font-bold text-orange-600">4.9/5.0</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">On-Time Rate</div>
                    <div className="text-2xl font-bold text-orange-600">100%</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </CardContent>
          </Card>

          {/* Weekly Comparison */}
          <Card className="border-2 border-orange-100 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                Weekly Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const isToday = index === 3; // Thursday
                  const value = isToday ? completionPercentage : Math.floor(Math.random() * 30) + 70;
                  return (
                    <div key={day} className={`${isToday ? 'scale-105' : ''} transition-transform`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${isToday ? 'text-orange-600' : 'text-gray-600'}`}>
                          {day} {isToday && <Badge className="ml-2 bg-orange-500 text-white text-xs">Today</Badge>}
                        </span>
                        <span className={`text-sm font-bold ${isToday ? 'text-orange-600' : 'text-gray-700'}`}>{value}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isToday ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-300'
                          }`}
                          style={{ 
                            width: `${value}%`,
                            transitionDelay: `${index * 100}ms`
                          }}
                        >
                          {isToday && (
                            <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends Chart */}
        <Card className="border-2 border-orange-100 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-500" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-white rounded-xl p-6">
              {/* Simple Line Graph */}
              <div className="relative h-full">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                {/* Graph area */}
                <div className="ml-10 h-full relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pb-8">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-t border-gray-100"></div>
                    ))}
                  </div>

                  {/* SVG Line Chart */}
                  <svg className="absolute inset-0 w-full h-full pb-8" viewBox="0 0 700 240" preserveAspectRatio="none">
                    {/* Area fill */}
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    
                    {/* Area */}
                    <path
                      d="M 0 156 L 100 144 L 200 163 L 300 120 L 400 132 L 500 84 L 600 48 L 700 19 L 700 240 L 0 240 Z"
                      fill="url(#areaGradient)"
                      className={`transition-all duration-1000 ${animateStats ? 'opacity-100' : 'opacity-0'}`}
                    />
                    
                    {/* Line */}
                    <path
                      d="M 0 156 L 100 144 L 200 163 L 300 120 L 400 132 L 500 84 L 600 48 L 700 19"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-all duration-1000 ${animateStats ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                        strokeDasharray: animateStats ? 'none' : '2000',
                        strokeDashoffset: animateStats ? '0' : '2000'
                      }}
                    />
                    
                    {/* Data points */}
                    {[
                      { x: 0, y: 156, value: 65 },
                      { x: 100, y: 144, value: 70 },
                      { x: 200, y: 163, value: 62 },
                      { x: 300, y: 120, value: 75 },
                      { x: 400, y: 132, value: 72 },
                      { x: 500, y: 84, value: 86 },
                      { x: 600, y: 48, value: 90 },
                      { x: 700, y: 19, value: 92 }
                    ].map((point, i) => (
                      <g key={i} className={`transition-all duration-500`} style={{ transitionDelay: `${i * 100}ms` }}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="6"
                          fill="#fff"
                          stroke="#f97316"
                          strokeWidth="3"
                          className={`${animateStats ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} transition-all duration-500`}
                          style={{ transitionDelay: `${500 + i * 100}ms` }}
                        />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill="#f97316"
                          className={`${animateStats ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                          style={{ transitionDelay: `${700 + i * 100}ms` }}
                        />
                      </g>
                    ))}
                  </svg>

                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Today'].map((day) => (
                      <span key={day} className={day === 'Today' ? 'font-bold text-orange-600' : ''}>{day}</span>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute top-0 right-0 flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600">Completion Rate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}