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
          <CardSkeleton key={i} className="h-20" />
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
    <div className="grid grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            interactive 
            className={`hover-lift card-pop stagger-${index + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption mb-1">{stat.label}</p>
                  <p className="text-value-sm">
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix || ''}
                      trigger={mounted}
                      duration={1200}
                    />
                  </p>
                </div>
                <div className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  stat.status === 'live' ? 'bg-orange-50' :
                  stat.status === 'good' ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    stat.status === 'live' ? 'text-orange-500' :
                    stat.status === 'good' ? 'text-green-500' : 'text-gray-500'
                  }`} />
                </div>
              </div>
              {stat.status === 'live' && (
                <Badge className="fairai-live-badge mt-2 pulse-glow">
                  <div className="fairai-live-dot" />
                  LIVE
                </Badge>
              )}
            </CardContent>
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