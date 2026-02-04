'use client';

import { useState, useEffect } from 'react';
import { analyticsApi } from '@/lib/api';
import type { DashboardStats } from '@/types';
import { AnimatedStatCard } from '@/components/ui/AnimatedStatCard';
import { Card } from '@/components/ui/Card';
import { StatCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { 
  Users, 
  Package, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeftRight,
  DollarSign,
  TrendingUp,
  Activity,
  Zap,
  Shield
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';

export default function OverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsApi.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard stats');
      console.error('Error loading stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadDashboardStats}
          className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Overview</h1>
          <p className="text-gray-600">Real-time metrics and AI-powered insights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">Live</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading && !stats ? (
          Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <AnimatedStatCard
              title="Active Drivers"
              value={stats.active_drivers}
              change={5.2}
              icon={Users}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
              subtitle="Currently on duty"
            />
            <AnimatedStatCard
              title="Packages Today"
              value={stats.total_packages || 0}
              change={12.3}
              icon={Package}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              subtitle="Total assigned"
            />
            <AnimatedStatCard
              title="Deliveries Completed"
              value={stats.delivered_packages || 0}
              change={8.7}
              icon={CheckCircle}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
              subtitle={`${stats.delivery_rate?.toFixed(1) || 0}% success rate`}
            />
            <AnimatedStatCard
              title="Health Interventions"
              value={stats.health_interventions || 0}
              change={-15.2}
              icon={AlertTriangle}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
              subtitle="AI-triggered today"
            />
            <AnimatedStatCard
              title="Route Swaps"
              value={stats.total_swaps || 0}
              change={3.4}
              icon={ArrowLeftRight}
              iconColor="text-indigo-600"
              iconBgColor="bg-indigo-100"
              subtitle="Driver-initiated"
            />
            <AnimatedStatCard
              title="Insurance Payouts"
              value={stats.total_bonuses || 0}
              change={7.8}
              icon={DollarSign}
              iconColor="text-emerald-600"
              iconBgColor="bg-emerald-100"
              format="currency"
              subtitle="Performance bonuses"
            />
            <AnimatedStatCard
              title="Fairness Score"
              value={stats.system_fairness_score || 0}
              change={2.1}
              icon={Shield}
              iconColor="text-cyan-600"
              iconBgColor="bg-cyan-100"
              format="percentage"
              subtitle="Assignment equity"
            />
            <AnimatedStatCard
              title="Driver Satisfaction"
              value={stats.driver_satisfaction || 0}
              change={-4.5}
              icon={Activity}
              iconColor="text-red-600"
              iconBgColor="bg-red-100"
              format="percentage"
              subtitle="Overall rating"
            />
          </>
        ) : null}
      </div>

      {/* 7 Innovations Showcase */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">7 AI Innovations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            { 
              name: 'Fair Assignment', 
              desc: 'PuLP optimization for equity',
              color: 'from-blue-500 to-blue-600',
              icon: '⚖️',
              link: '/assignments'
            },
            { 
              name: 'Shadow AI', 
              desc: 'XGBoost baseline comparison',
              color: 'from-purple-500 to-purple-600',
              icon: '🤖',
              link: '/analytics'
            },
            { 
              name: 'LSTM Forecast', 
              desc: '30-day earnings prediction',
              color: 'from-green-500 to-green-600',
              icon: '📈',
              link: '/analytics'
            },
            { 
              name: 'Health Guardian', 
              desc: 'Random Forest risk detection',
              color: 'from-red-500 to-red-600',
              icon: '❤️',
              link: '/interventions'
            },
            { 
              name: 'Swap Marketplace', 
              desc: 'Driver route exchanges',
              color: 'from-indigo-500 to-indigo-600',
              icon: '🔄',
              link: '/swaps'
            },
            { 
              name: 'Insurance Bonus', 
              desc: 'Z-score performance rewards',
              color: 'from-yellow-500 to-yellow-600',
              icon: '💰',
              link: '/analytics'
            },
            { 
              name: 'SHAP Explainer', 
              desc: 'Transparent AI decisions',
              color: 'from-cyan-500 to-cyan-600',
              icon: '🔍',
              link: '/drivers'
            },
          ].map((innovation, i) => (
            <Link key={i} href={innovation.link}>
              <div className={`bg-gradient-to-br ${innovation.color} rounded-xl p-6 text-white hover:scale-105 transition-transform duration-200 cursor-pointer group`}>
                <div className="text-4xl mb-3">{innovation.icon}</div>
                <h3 className="font-bold text-lg mb-1 group-hover:scale-105 transition-transform">
                  {innovation.name}
                </h3>
                <p className="text-sm opacity-90">{innovation.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/drivers" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <Users className="h-8 w-8 text-gray-600 group-hover:text-green-600 transition-colors" />
              <div>
                <p className="font-medium text-gray-900">Manage Drivers</p>
                <p className="text-sm text-gray-600">View all drivers</p>
              </div>
            </Link>
            <Link href="/assignments" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <Package className="h-8 w-8 text-gray-600 group-hover:text-green-600 transition-colors" />
              <div>
                <p className="font-medium text-gray-900">Assignments</p>
                <p className="text-sm text-gray-600">Today's routes</p>
              </div>
            </Link>
            <Link href="/interventions" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <AlertTriangle className="h-8 w-8 text-gray-600 group-hover:text-green-600 transition-colors" />
              <div>
                <p className="font-medium text-gray-900">Health Alerts</p>
                <p className="text-sm text-gray-600">Monitor risks</p>
              </div>
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <TrendingUp className="h-8 w-8 text-gray-600 group-hover:text-green-600 transition-colors" />
              <div>
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-600">View reports</p>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}