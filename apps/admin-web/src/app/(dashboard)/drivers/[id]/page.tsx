'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { driversApi } from '@/lib/api';
import type { Driver } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AnimatedStatCard } from '@/components/ui/AnimatedStatCard';
import { LoadingSkeleton, StatCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { TrendIndicator } from '@/components/ui/TrendIndicator';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Activity,
  TrendingUp,
  Shield,
  DollarSign,
  Route,
  Heart,
  Brain,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Clock,
  MapPin,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

type TabType = 'overview' | 'fairness' | 'shadowai' | 'forecast' | 'health' | 'swaps' | 'insurance' | 'explainer';

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const driverId = params.id as string;
  
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (driverId) {
      fetchDriverDetails();
    }
  }, [driverId]);

  const fetchDriverDetails = async () => {
    try {
      setLoading(true);
      const data = await driversApi.getDriver(parseInt(driverId));
      setDriver(data);
    } catch (error) {
      console.error('Failed to fetch driver details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Driver not found</p>
        <Link href="/drivers" className="text-green-600 hover:text-green-700 mt-4 inline-block">
          Back to Drivers
        </Link>
      </div>
    );
  }

  // Mock data for demonstrations (in production, fetch from API)
  const performanceData = [
    { date: 'Mon', deliveries: 45, avgTime: 28, efficiency: 92 },
    { date: 'Tue', deliveries: 52, avgTime: 26, efficiency: 95 },
    { date: 'Wed', deliveries: 48, avgTime: 29, efficiency: 90 },
    { date: 'Thu', deliveries: 55, avgTime: 25, efficiency: 96 },
    { date: 'Fri', deliveries: 50, avgTime: 27, efficiency: 93 },
    { date: 'Sat', deliveries: 60, avgTime: 24, efficiency: 97 },
    { date: 'Sun', deliveries: 42, avgTime: 30, efficiency: 88 }
  ];

  const fairnessData = [
    { date: '1 Week Ago', difficulty: 65, variance: 12, fairScore: 88 },
    { date: '6 Days Ago', difficulty: 62, variance: 10, fairScore: 90 },
    { date: '5 Days Ago', difficulty: 68, variance: 8, fairScore: 92 },
    { date: '4 Days Ago', difficulty: 64, variance: 7, fairScore: 93 },
    { date: '3 Days Ago', difficulty: 66, variance: 6, fairScore: 94 },
    { date: '2 Days Ago', difficulty: 63, variance: 5, fairScore: 95 },
    { date: 'Yesterday', difficulty: 65, variance: 4, fairScore: 96 },
    { date: 'Today', difficulty: 67, variance: 3, fairScore: 97 }
  ];

  const healthData = {
    vitals: [
      { metric: 'Heart Rate', value: 72, normal: '60-100 bpm', status: 'good' },
      { metric: 'Sleep Quality', value: 85, normal: '> 70%', status: 'good' },
      { metric: 'Stress Level', value: 35, normal: '< 50', status: 'good' },
      { metric: 'Fatigue Index', value: 28, normal: '< 40', status: 'good' },
      { metric: 'Hydration', value: 92, normal: '> 80%', status: 'excellent' },
      { metric: 'Activity Level', value: 78, normal: '> 60%', status: 'good' }
    ],
    alerts: [
      { date: '2 days ago', message: 'Elevated stress detected - recommended break taken', severity: 'warning' },
      { date: '5 days ago', message: 'Excellent sleep quality maintained', severity: 'success' }
    ]
  };

  const forecastData = [
    { hour: '9 AM', predicted: 8, actual: 7 },
    { hour: '10 AM', predicted: 12, actual: 11 },
    { hour: '11 AM', predicted: 15, actual: 16 },
    { hour: '12 PM', predicted: 10, actual: 10 },
    { hour: '1 PM', predicted: 14, actual: null },
    { hour: '2 PM', predicted: 18, actual: null },
    { hour: '3 PM', predicted: 16, actual: null },
    { hour: '4 PM', predicted: 12, actual: null },
    { hour: '5 PM', predicted: 10, actual: null }
  ];

  const shapData = [
    { feature: 'Route Difficulty', impact: 0.32, description: 'High traffic areas increase delivery time' },
    { feature: 'Time of Day', impact: 0.24, description: 'Peak hours affect performance' },
    { feature: 'Package Count', impact: 0.18, description: 'More packages = more stops' },
    { feature: 'Weather Conditions', impact: 0.12, description: 'Rain reduces speed by 15%' },
    { feature: 'Driver Experience', impact: 0.08, description: 'Familiarity with routes' },
    { feature: 'Vehicle Type', impact: 0.06, description: 'Cargo capacity matters' }
  ];

  const radarData = [
    { metric: 'Speed', value: driver.fitness * 0.9, fullMark: 100 },
    { metric: 'Accuracy', value: driver.fitness * 1.1, fullMark: 100 },
    { metric: 'Safety', value: driver.fitness * 0.95, fullMark: 100 },
    { metric: 'Customer Rating', value: driver.fitness * 1.05, fullMark: 100 },
    { metric: 'Efficiency', value: driver.fitness, fullMark: 100 },
    { metric: 'Reliability', value: driver.fitness * 1.02, fullMark: 100 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'fairness', label: '1. Fair Assignment', icon: Shield },
    { id: 'shadowai', label: '2. Shadow AI', icon: Brain },
    { id: 'forecast', label: '3. LSTM Forecast', icon: TrendingUp },
    { id: 'health', label: '4. Health Guardian', icon: Heart },
    { id: 'swaps', label: '5. Swap Marketplace', icon: Route },
    { id: 'insurance', label: '6. Insurance Bonus', icon: DollarSign },
    { id: 'explainer', label: '7. SHAP Explainer', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/drivers')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <User className="h-6 w-6 text-green-600" />
            </div>
            {driver.name}
          </h1>
          <p className="text-gray-600 mt-1">Driver ID: {driver.id}</p>
        </div>
        <Badge variant={driver.status === 'active' ? 'success' : 'secondary'} className="text-sm px-3 py-1">
          {driver.status}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedStatCard
          title="Fitness Score"
          value={driver.fitness}
          format="percentage"
          icon={Activity}
          iconColor="green"
          change={5}
        />
        <AnimatedStatCard
          title="Deliveries Today"
          value={48}
          format="number"
          icon={Package}
          iconColor="blue"
          change={12}
        />
        <AnimatedStatCard
          title="Avg. Delivery Time"
          value={26}
          subtitle="minutes"
          format="number"
          icon={Clock}
          iconColor="purple"
          change={-8}
        />
        <AnimatedStatCard
          title="Earnings Today"
          value={285}
          format="currency"
          icon={DollarSign}
          iconColor="yellow"
          change={15}
        />
      </div>

      {/* Driver Info Card */}
      <Card title="Driver Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{driver.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900 truncate">{driver.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium text-gray-900">{formatDate(driver.created_at, 'short')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <MapPin className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <p className="font-medium text-gray-900">On Route</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card title="Performance This Week">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="deliveries" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorDeliveries)" 
                    name="Deliveries"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorEfficiency)" 
                    name="Efficiency %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Driver Performance Radar">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
                  <Radar name="Performance" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Fair Assignment Tab */}
        {activeTab === 'fairness' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="Fairness Score" subtitle="Assignment equity">
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-green-600">97</div>
                  <p className="text-gray-600 mt-2">Out of 100</p>
                  <TrendIndicator value={3} />
                </div>
              </Card>
              <Card title="Route Difficulty" subtitle="Avg. this week">
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-blue-600">65</div>
                  <p className="text-gray-600 mt-2">Normalized score</p>
                  <TrendIndicator value={2} />
                </div>
              </Card>
              <Card title="Variance" subtitle="Difficulty distribution">
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-purple-600">3.2</div>
                  <p className="text-gray-600 mt-2">Lower is better</p>
                  <TrendIndicator value={12} inverse />
                </div>
              </Card>
            </div>

            <Card title="Fairness Trend - Route Difficulty Over Time">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fairnessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="difficulty" stroke="#3b82f6" name="Route Difficulty" strokeWidth={2} />
                  <Line type="monotone" dataKey="variance" stroke="#ef4444" name="Variance" strokeWidth={2} />
                  <Line type="monotone" dataKey="fairScore" stroke="#10b981" name="Fair Score" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card title="How Fair Assignment Works">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI analyzes route difficulty</h4>
                    <p className="text-sm text-gray-600">Considers traffic, distance, stops, customer ratings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Tracks each driver's workload history</h4>
                    <p className="text-sm text-gray-600">Ensures balanced distribution over time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Optimizes for fairness & efficiency</h4>
                    <p className="text-sm text-gray-600">Minimizes variance while maintaining performance</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Shadow AI Tab */}
        {activeTab === 'shadowai' && (
          <Card title="Shadow AI - Real-time Decision Support">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-600 rounded-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendation</h3>
                    <p className="text-gray-700 mb-4">
                      Based on current traffic and weather conditions, Shadow AI suggests taking alternate route via Highway 101.
                      This will save approximately <strong>12 minutes</strong> and reduce stress by <strong>15%</strong>.
                    </p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                        Accept Recommendation
                      </button>
                      <button className="px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="AI Suggestions Today" subtitle="8 recommendations made">
                  <div className="space-y-3">
                    {[
                      { time: '9:15 AM', action: 'Route optimization', impact: '+8 min saved', status: 'accepted' },
                      { time: '11:30 AM', action: 'Break reminder', impact: 'Fatigue prevention', status: 'accepted' },
                      { time: '1:45 PM', action: 'Traffic avoidance', impact: '+12 min saved', status: 'pending' },
                      { time: '3:20 PM', action: 'Delivery reorder', impact: '+5 packages/hr', status: 'declined' }
                    ].map((suggestion, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{suggestion.action}</p>
                          <p className="text-xs text-gray-500">{suggestion.time} • {suggestion.impact}</p>
                        </div>
                        <Badge 
                          variant={
                            suggestion.status === 'accepted' ? 'success' : 
                            suggestion.status === 'pending' ? 'warning' : 
                            'secondary'
                          }
                        >
                          {suggestion.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Impact Metrics" subtitle="Shadow AI effectiveness">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Acceptance Rate</span>
                        <span className="text-sm font-bold text-green-600">87%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '87%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Time Saved</span>
                        <span className="text-sm font-bold text-blue-600">2.5 hrs/day</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Stress Reduction</span>
                        <span className="text-sm font-bold text-purple-600">-23%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        )}

        {/* LSTM Forecast Tab */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <Card title="Hourly Delivery Forecast - LSTM Neural Network">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Model Accuracy:</strong> 94.2% • <strong>Confidence Interval:</strong> ±1.8 deliveries
                </p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" label={{ value: 'Deliveries', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Predicted"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="Today's Forecast" subtitle="Total deliveries">
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-blue-600">115</div>
                  <p className="text-sm text-gray-600 mt-2">Expected deliveries</p>
                  <p className="text-xs text-gray-500 mt-1">94.2% accuracy</p>
                </div>
              </Card>
              <Card title="Peak Hour" subtitle="Highest activity">
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-purple-600">2 PM</div>
                  <p className="text-sm text-gray-600 mt-2">18 deliveries predicted</p>
                  <p className="text-xs text-gray-500 mt-1">Prepare accordingly</p>
                </div>
              </Card>
              <Card title="Model Confidence" subtitle="Prediction reliability">
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-green-600">94.2%</div>
                  <p className="text-sm text-gray-600 mt-2">Historical accuracy</p>
                  <p className="text-xs text-gray-500 mt-1">Based on 30 days</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Health Guardian Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthData.vitals.map((vital, idx) => (
                <Card key={idx} title={vital.metric} subtitle={vital.normal}>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">{vital.value}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vital.status === 'excellent' ? 'bg-green-100 text-green-700' :
                      vital.status === 'good' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {vital.status}
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        vital.status === 'excellent' ? 'bg-green-500' :
                        vital.status === 'good' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${vital.value}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <Card title="Health Alerts & Recommendations">
              <div className="space-y-3">
                {healthData.alerts.map((alert, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'success' 
                        ? 'bg-green-50 border-green-500' 
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {alert.severity === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{alert.message}</p>
                        <p className="text-sm text-gray-600 mt-1">{alert.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Wearable Integration">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Connected Device</h4>
                    <p className="text-sm text-gray-600">Fitbit Charge 5</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      Live Syncing
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Data Points Today</h4>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-xs text-gray-500">Last update: 2 min ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Swap Marketplace Tab */}
        {activeTab === 'swaps' && (
          <Card title="Route Swap Marketplace">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">12</div>
                  <p className="text-sm text-gray-700 mt-1">Swaps Completed</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600">+3.2</div>
                  <p className="text-sm text-gray-700 mt-1">Hours Saved</p>
                  <p className="text-xs text-gray-500">Via route swaps</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">4.8</div>
                  <p className="text-sm text-gray-700 mt-1">Avg. Rating</p>
                  <p className="text-xs text-gray-500">From swap partners</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Available Swap Opportunities</h3>
                {[
                  { 
                    partner: 'John Smith', 
                    route: 'Downtown → Suburbs', 
                    benefit: '+45 min closer to home',
                    matchScore: 92
                  },
                  { 
                    partner: 'Maria Garcia', 
                    route: 'North District → East Side', 
                    benefit: 'Better route for your vehicle',
                    matchScore: 85
                  },
                  { 
                    partner: 'David Chen', 
                    route: 'Industrial Zone → Residential', 
                    benefit: 'Lower difficulty score',
                    matchScore: 78
                  }
                ].map((swap, idx) => (
                  <div key={idx} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{swap.partner}</h4>
                          <Badge variant="secondary">{swap.matchScore}% match</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{swap.route}</p>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {swap.benefit}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        Request Swap
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Insurance Bonus Tab */}
        {activeTab === 'insurance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card title="Current Bonus" subtitle="This month">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(450)}</div>
                  <TrendIndicator value={12} />
                </div>
              </Card>
              <Card title="Safety Score" subtitle="Out of 100">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-blue-600">96</div>
                  <TrendIndicator value={2} />
                </div>
              </Card>
              <Card title="Incident-Free Days" subtitle="Current streak">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-purple-600">127</div>
                  <p className="text-xs text-gray-500 mt-1">Personal best!</p>
                </div>
              </Card>
              <Card title="Tier Status" subtitle="Bonus multiplier">
                <div className="text-center py-4">
                  <div className="text-2xl font-bold text-yellow-600">GOLD</div>
                  <p className="text-sm text-gray-600 mt-1">1.5x multiplier</p>
                </div>
              </Card>
            </div>

            <Card title="Bonus Calculation Breakdown">
              <div className="space-y-4">
                {[
                  { factor: 'Base Safety Bonus', value: 300, percentage: 100 },
                  { factor: 'No Incidents (127 days)', value: 100, percentage: 33 },
                  { factor: 'Gold Tier Multiplier', value: 50, percentage: 17 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.factor}</p>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(item.value)}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t-2 border-gray-300 flex items-center justify-between">
                  <p className="text-lg font-bold text-gray-900">Total Insurance Bonus</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(450)}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* SHAP Explainer Tab */}
        {activeTab === 'explainer' && (
          <div className="space-y-6">
            <Card title="SHAP (SHapley Additive exPlanations) - Model Explainability">
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-900">
                  SHAP values explain how each feature contributes to the model's prediction for this driver's performance.
                  Positive values (green) increase predicted performance, negative values (red) decrease it.
                </p>
              </div>

              <div className="space-y-3">
                {shapData.map((item, idx) => {
                  const isPositive = item.impact > 0.15;
                  return (
                    <div key={idx} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{item.feature}</h4>
                        <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{(item.impact * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`absolute h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.abs(item.impact) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Feature Importance - What Matters Most?">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={shapData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="feature" type="category" stroke="#6b7280" width={150} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="impact" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
