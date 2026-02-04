'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { AnimatedStatCard } from '@/components/ui/AnimatedStatCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import {
  Package,
  CheckCircle,
  Users,
  AlertTriangle,
  ArrowLeftRight,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Shield,
  Activity,
  MapPin,
  Calendar,
  Heart,
  Brain,
  Coffee,
  BarChart3
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function ComprehensiveOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('today');

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Mock comprehensive data
  const kpis = {
    totalOrders: 1247,
    onTimeRate: 94.3,
    activeDrivers: 156,
    swapsToday: 23,
    incidentsToday: 4,
    forecastedVolume7Days: 8650,
    forecastedVolume30Days: 38200,
    totalPredictedPayouts: 284500
  };

  const riskDrivers = [
    { id: 'D-145', name: 'John Martinez', riskScore: 87, reason: 'High heart rate', severity: 'critical' },
    { id: 'D-089', name: 'Sarah Chen', riskScore: 72, reason: 'Fatigue detected', severity: 'warning' },
    { id: 'D-234', name: 'Mike Johnson', riskScore: 68, reason: 'Extended hours', severity: 'warning' },
  ];

  const fairnessAlerts = [
    { driver: 'D-067', issue: 'Consistently harder routes (15% above avg)', days: 5, action: 'Rebalance needed' },
    { driver: 'D-198', issue: 'Below minimum package threshold', days: 3, action: 'Assign more' },
  ];

  const highDemandZones = [
    { zone: 'Downtown', demand: 'Very High', packages: 342, drivers: 28, ratio: 12.2 },
    { zone: 'North District', demand: 'High', packages: 267, drivers: 24, ratio: 11.1 },
    { zone: 'Industrial Area', demand: 'Medium', packages: 189, drivers: 18, ratio: 10.5 },
  ];

  const volumeTrend = [
    { day: 'Mon', actual: 1180, forecast: 1200, capacity: 1500 },
    { day: 'Tue', actual: 1247, forecast: 1250, capacity: 1500 },
    { day: 'Wed', actual: 0, forecast: 1320, capacity: 1500 },
    { day: 'Thu', actual: 0, forecast: 1280, capacity: 1500 },
    { day: 'Fri', actual: 0, forecast: 1400, capacity: 1500 },
    { day: 'Sat', actual: 0, forecast: 1520, capacity: 1500 },
    { day: 'Sun', actual: 0, forecast: 890, capacity: 1500 },
  ];

  const performanceData = [
    { metric: 'On-Time', value: 94.3, target: 95 },
    { metric: 'Completion', value: 98.1, target: 97 },
    { metric: 'Fairness', value: 96.8, target: 90 },
    { metric: 'Safety', value: 99.2, target: 98 },
  ];

  const innovationImpact = [
    { name: 'Shadow AI', saved: 3.2, unit: 'hrs/driver' },
    { name: 'Fair Assignment', variance: 2.8, unit: 'variance' },
    { name: 'Health Monitor', prevented: 12, unit: 'incidents' },
    { name: 'Earnings Predict', accuracy: 94.5, unit: '% accurate' },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Overview Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time insights across all 7 AI innovations</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-green-500"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            Download Report
          </button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedStatCard
          title="Total Orders"
          value={kpis.totalOrders}
          change={8.3}
          icon={Package}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          subtitle={`${timeRange === 'today' ? 'Today' : timeRange === '7days' ? 'This week' : 'This month'}`}
        />
        <AnimatedStatCard
          title="On-Time Rate"
          value={kpis.onTimeRate}
          change={2.1}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          format="percentage"
          subtitle="Target: 95%"
        />
        <AnimatedStatCard
          title="Active Drivers"
          value={kpis.activeDrivers}
          change={4.7}
          icon={Users}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          subtitle="Currently on duty"
        />
        <AnimatedStatCard
          title="Incidents Today"
          value={kpis.incidentsToday}
          change={-25.0}
          icon={AlertTriangle}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          subtitle="AI prevented 12 more"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedStatCard
          title="Route Swaps"
          value={kpis.swapsToday}
          change={12.5}
          icon={ArrowLeftRight}
          iconColor="text-indigo-600"
          iconBgColor="bg-indigo-100"
          subtitle="Today"
        />
        <AnimatedStatCard
          title="7-Day Forecast"
          value={kpis.forecastedVolume7Days}
          icon={TrendingUp}
          iconColor="text-cyan-600"
          iconBgColor="bg-cyan-100"
          subtitle="Predicted volume"
        />
        <AnimatedStatCard
          title="30-Day Forecast"
          value={kpis.forecastedVolume30Days}
          icon={Calendar}
          iconColor="text-pink-600"
          iconBgColor="bg-pink-100"
          subtitle="Next month"
        />
        <AnimatedStatCard
          title="Predicted Payouts"
          value={kpis.totalPredictedPayouts}
          change={7.8}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100"
          format="currency"
          subtitle="This period"
        />
      </div>

      {/* Volume Forecast Chart */}
      <Card title="Volume Forecast & Capacity" subtitle="Next 7 days with confidence intervals">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={volumeTrend}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend />
            <Area type="monotone" dataKey="actual" stroke="#10b981" fillOpacity={1} fill="url(#colorActual)" name="Actual" />
            <Area type="monotone" dataKey="forecast" stroke="#3b82f6" fillOpacity={1} fill="url(#colorForecast)" strokeDasharray="5 5" name="Forecast" />
            <Line type="monotone" dataKey="capacity" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" name="Capacity Limit" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Drivers */}
        <Card title="Today's Risk Drivers" subtitle="Requires attention" className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <div className="space-y-3">
            {riskDrivers.map((driver) => (
              <Link key={driver.id} href={`/drivers/${driver.id}`}>
                <div className="p-3 bg-white rounded-lg border border-red-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{driver.name}</p>
                        <p className="text-xs text-gray-500">{driver.id}</p>
                      </div>
                    </div>
                    <Badge variant={driver.severity === 'critical' ? 'danger' : 'warning'}>
                      {driver.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{driver.reason}</span>
                    <span className="font-bold text-red-600">{driver.riskScore}%</span>
                  </div>
                </div>
              </Link>
            ))}
            <Link href="/health-safety" className="block text-center py-2 text-sm text-green-600 hover:text-green-700 font-medium">
              View All Risk Assessments →
            </Link>
          </div>
        </Card>

        {/* Fairness Alerts */}
        <Card title="Fairness Alerts" subtitle="Assignment imbalances" className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <div className="space-y-3">
            {fairnessAlerts.map((alert, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2 mb-2">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{alert.driver}</p>
                    <p className="text-sm text-gray-600">{alert.issue}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{alert.days} days</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                    {alert.action}
                  </span>
                </div>
              </div>
            ))}
            <Link href="/fair-assignment" className="block text-center py-2 text-sm text-green-600 hover:text-green-700 font-medium">
              View Fairness Dashboard →
            </Link>
          </div>
        </Card>

        {/* High Demand Zones */}
        <Card title="High-Demand Zones" subtitle="Packages per driver" className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="space-y-3">
            {highDemandZones.map((zone, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{zone.zone}</span>
                  </div>
                  <Badge variant={zone.demand === 'Very High' ? 'danger' : zone.demand === 'High' ? 'warning' : 'success'}>
                    {zone.demand}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Packages</p>
                    <p className="font-bold text-gray-900">{zone.packages}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Drivers</p>
                    <p className="font-bold text-gray-900">{zone.drivers}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ratio</p>
                    <p className="font-bold text-gray-900">{zone.ratio}</p>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/monitoring" className="block text-center py-2 text-sm text-green-600 hover:text-green-700 font-medium">
              View Route Monitor →
            </Link>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Key Performance Indicators" subtitle="vs targets">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={performanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
              <YAxis dataKey="metric" type="category" stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="value" fill="#10b981" name="Current" radius={[0, 8, 8, 0]} />
              <Bar dataKey="target" fill="#d1d5db" name="Target" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="AI Innovation Impact" subtitle="Quantified benefits">
          <div className="space-y-4">
            {innovationImpact.map((item, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{item.name}</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">
                    {item.saved || item.variance || item.prevented || item.accuracy}
                  </span>
                  <span className="text-sm text-gray-600">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Links to 7 Innovations */}
      <Card title="7 AI Innovations - Quick Access" subtitle="Navigate to detailed dashboards">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Difficulty & Shadow AI', href: '/difficulty', icon: Target, color: 'blue', number: '1' },
            { name: 'Workload Forecast', href: '/forecast', icon: TrendingUp, color: 'purple', number: '2' },
            { name: 'Health & Safety', href: '/health-safety', icon: Heart, color: 'red', number: '3' },
            { name: 'Fair Assignment', href: '/fair-assignment', icon: Shield, color: 'yellow', number: '4' },
            { name: 'Explainability', href: '/explainability', icon: Brain, color: 'pink', number: '5' },
            { name: 'Fatigue & Breaks', href: '/fatigue', icon: Coffee, color: 'orange', number: '6' },
            { name: 'Earnings Insights', href: '/earnings', icon: DollarSign, color: 'green', number: '7' },
            { name: 'System Analytics', href: '/analytics', icon: BarChart3, color: 'indigo', number: 'SLA' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-xs font-bold text-gray-600 group-hover:text-green-600">
                  {item.number}
                </div>
                <Icon className={`h-8 w-8 text-${item.color}-600 mb-3`} />
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">View dashboard →</p>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
