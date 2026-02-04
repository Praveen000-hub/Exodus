'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardSkeleton } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TodayRouteCard } from '@/components/features/assignment/TodayRouteCard';
import { ShadowComparisonCard } from '@/components/features/dashboard/ShadowComparisonCard';
import { WhyThisRouteCard } from '@/components/features/explainability/WhyThisRouteCard';
import { HealthGaugeCard } from '@/components/features/health/HealthGaugeCard';
import { ForecastCalendar } from '@/components/features/forecast/ForecastCalendar';
import { BonusAlertsCard } from '@/components/features/insurance/BonusAlertsCard';
import { QuickActionsCard } from '@/components/features/dashboard/QuickActionsCard';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { StaggeredList } from '@/components/ui/staggered-list';
import { useAssignment } from '@/hooks/useAssignment';
import { useHealth } from '@/hooks/useHealth';
import { useForecast } from '@/hooks/useForecast';
import { useExplanation } from '@/hooks/useExplanation';
import { Clock, MapPin, Package, TrendingUp } from 'lucide-react';

// Quick stats component with animations
const QuickStats = ({ assignment, isLoading }: { assignment: any; isLoading: boolean }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Today\'s Packages',
      value: assignment?.total_packages || 0,
      icon: Package,
      status: 'live' as const,
    },
    {
      label: 'Est. Duration',
      value: assignment?.estimated_time || 0,
      suffix: 'h',
      icon: Clock,
      status: 'normal' as const,
    },
    {
      label: 'Distance',
      value: assignment?.total_distance || 0,
      suffix: 'km',
      icon: MapPin,
      status: 'normal' as const,
    },
    {
      label: 'Efficiency',
      value: 94,
      suffix: '%',
      icon: TrendingUp,
      status: 'good' as const,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isLive = stat.status === 'live';
        
        return (
          <Card 
            key={index} 
            interactive 
            className={`relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 hover:border-orange-200 stagger-${index + 1} group cursor-pointer`}
            style={{
              transform: `perspective(1000px) rotateX(0deg)`,
            }}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${(y - rect.height / 2) / 20}deg) rotateY(${(rect.width / 2 - x) / 20}deg) translateY(-8px)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            }}
          >
            {/* Animated Orange Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-400/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-400/10 group-hover:to-orange-500/5 transition-all duration-500"></div>
            
            {/* Spotlight Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl animate-pulse"></div>
            </div>
            
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-50 rounded-tr-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
            
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider group-hover:text-orange-600 transition-colors">{stat.label}</p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-5xl font-bold text-gray-900 group-hover:text-orange-600 transition-all duration-300 group-hover:scale-110 origin-left">
                      <AnimatedCounter 
                        value={stat.value} 
                        suffix=""
                        trigger={mounted}
                        duration={1200}
                      />
                    </p>
                    {stat.suffix && (
                      <span className="text-xl font-bold text-gray-600 group-hover:text-orange-500 transition-colors">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Animated Icon Container */}
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
                  <div className="relative p-4 rounded-2xl bg-gray-50 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-600 shadow-lg group-hover:shadow-orange-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <Icon className="w-7 h-7 text-gray-400 group-hover:text-white transition-all duration-300" />
                  </div>
                </div>
              </div>
              
              {/* Interactive Progress Bar */}
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden group-hover:h-2.5 transition-all duration-300">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ 
                    width: mounted ? (stat.status === 'good' ? '94%' : stat.status === 'live' ? '100%' : '75%') : '0%' 
                  }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }}></div>
                  
                  {/* Pulse Effect on Hover */}
                  <div className="absolute inset-0 bg-white/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </div>
              
              {/* Status Badges */}
              {isLive && (
                <div className="mt-4 flex items-center justify-between">
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg shadow-orange-200 px-3 py-1.5 group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <div className="relative flex items-center gap-2">
                      <div className="relative">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping absolute"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="font-bold text-xs">LIVE</span>
                    </div>
                  </Badge>
                  <span className="text-xs text-orange-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Click to view</span>
                </div>
              )}
              
              {stat.status === 'good' && (
                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-orange-600">Excellent Performance</span>
                </div>
              )}
              
              {stat.status === 'normal' && (
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-xs font-medium text-gray-400 group-hover:text-orange-500 transition-colors">Hover for details</span>
                </div>
              )}
            </CardContent>
            
            {/* Bottom Highlight Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </Card>
        );
      })}
    </div>
  );
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('today');
  const [tabContent, setTabContent] = useState<React.ReactNode>(null);
  const driverId = 123; // Mock driver ID
  
  const { data: assignment, isLoading: assignmentLoading } = useAssignment(driverId);
  const { data: healthData, isLoading: healthLoading } = useHealth(driverId);
  const { data: forecast, isLoading: forecastLoading } = useForecast(driverId);
  const { data: explanation, isLoading: explanationLoading } = useExplanation(driverId);

  // Handle tab changes with animation
  const handleTabChange = (value: string) => {
    if (value === activeTab) return;
    
    // Fade out current content
    setTabContent(null);
    
    // Small delay then fade in new content
    setTimeout(() => {
      setActiveTab(value);
    }, 150);
  };

  // Set tab content with animation
  useEffect(() => {
    const timer = setTimeout(() => {
      switch (activeTab) {
        case 'today':
          setTabContent(
            <div className="grid grid-cols-[2fr_1.2fr] gap-8 fade-in-up">
              {/* Left Column - Primary Content */}
              <StaggeredList 
                delay={150}
                className="space-section"
              >
                <TodayRouteCard 
                  assignment={assignment || null} 
                  isLoading={assignmentLoading} 
                />
                <ShadowComparisonCard 
                  assignment={assignment || null} 
                  isLoading={assignmentLoading} 
                />
                <WhyThisRouteCard 
                  explanation={explanation || null} 
                  isLoading={explanationLoading} 
                />
              </StaggeredList>

              {/* Right Column - Secondary Content */}
              <StaggeredList 
                delay={200}
                className="space-section"
              >
                <HealthGaugeCard 
                  healthData={healthData || null} 
                  isLoading={healthLoading} 
                />
                <BonusAlertsCard />
                <QuickActionsCard />
              </StaggeredList>
            </div>
          );
          break;
        case 'health':
          setTabContent(
            <div className="grid grid-cols-[1fr_2fr] gap-8 fade-in-up">
              <div className="space-section">
                <HealthGaugeCard 
                  healthData={healthData || null} 
                  isLoading={healthLoading} 
                />
              </div>
              <div className="space-section">
                <Card className="card-slide-up">
                  <CardHeader>
                    <CardTitle>Health Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-black/60 py-12">
                      <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 bounce-in">
                        <TrendingUp className="w-8 h-8 text-orange-500" />
                      </div>
                      <p className="text-subheading mb-2">Health Analytics Coming Soon</p>
                      <p className="text-body">Detailed health trends and intervention history will be available here.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
          break;
        case 'future':
          setTabContent(
            <div className="fade-in-up">
              <ForecastCalendar 
                forecast={forecast || null} 
                isLoading={forecastLoading} 
              />
            </div>
          );
          break;
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [activeTab, assignment, assignmentLoading, healthData, healthLoading, forecast, forecastLoading, explanation, explanationLoading]);

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back, Rajesh Kumar">
      <div className="max-w-7xl mx-auto space-section">
        {/* Quick Stats Overview with staggered animation */}
        <div className="fade-in-down">
          <QuickStats assignment={assignment} isLoading={assignmentLoading} />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="slide-in-left">
            <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 tab-slide">
              <TabsTrigger 
                value="today" 
                className="transition-all duration-200 hover:scale-105"
              >
                Today
              </TabsTrigger>
              <TabsTrigger 
                value="health" 
                className="transition-all duration-200 hover:scale-105"
              >
                Health
              </TabsTrigger>
              <TabsTrigger 
                value="future" 
                className="transition-all duration-200 hover:scale-105"
              >
                Future
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Animated Tab Content */}
          <div className="min-h-[600px]">
            {tabContent}
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
}