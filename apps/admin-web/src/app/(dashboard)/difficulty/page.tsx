'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import {
  Target,
  Brain,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Calendar,
  MapPin,
  Users,
  Package,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import Link from 'next/link';

export default function DifficultyDashboard() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');
  const [cityFilter, setCityFilter] = useState('all');
  const [driverFilter, setDriverFilter] = useState('all');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Mock data - in production, fetch from API
  const difficultyDistribution = [
    { range: '0-20', count: 45, avgTime: 15, color: '#10b981' },
    { range: '21-40', count: 128, avgTime: 25, color: '#3b82f6' },
    { range: '41-60', count: 267, avgTime: 35, color: '#f59e0b' },
    { range: '61-80', count: 184, avgTime: 48, color: '#ef4444' },
    { range: '81-100', count: 56, avgTime: 62, color: '#7c3aed' },
  ];

  const driverWorkload = [
    { driverId: 'D-145', name: 'John Martinez', avgDifficulty: 72.3, packages: 48, variance: 18.5, flag: 'high' },
    { driverId: 'D-089', name: 'Sarah Chen', avgDifficulty: 45.2, packages: 52, variance: 8.2, flag: 'balanced' },
    { driverId: 'D-234', name: 'Mike Johnson', avgDifficulty: 28.7, packages: 45, variance: 12.1, flag: 'low' },
    { driverId: 'D-167', name: 'Emily Rodriguez', avgDifficulty: 68.9, packages: 50, variance: 22.4, flag: 'high' },
    { driverId: 'D-092', name: 'David Kim', avgDifficulty: 51.3, packages: 49, variance: 9.8, flag: 'balanced' },
    { driverId: 'D-201', name: 'Lisa Wang', avgDifficulty: 33.4, packages: 46, variance: 15.2, flag: 'low' },
    { driverId: 'D-178', name: 'Carlos Mendez', avgDifficulty: 65.1, packages: 51, variance: 19.7, flag: 'high' },
    { driverId: 'D-123', name: 'Anna Patel', avgDifficulty: 47.8, packages: 53, variance: 11.3, flag: 'balanced' },
  ];

  const shadowAIRecommendations = [
    { time: '09:15 AM', driver: 'D-145', action: 'Reduce package load', impact: '-8 min', status: 'accepted' },
    { time: '10:30 AM', driver: 'D-234', action: 'Route optimization', impact: '+12 min saved', status: 'accepted' },
    { time: '11:45 AM', driver: 'D-167', action: 'Difficulty rebalance', impact: '-15% difficulty', status: 'pending' },
    { time: '01:20 PM', driver: 'D-089', action: 'Break suggestion', impact: 'Fatigue prevention', status: 'accepted' },
    { time: '02:45 PM', driver: 'D-092', action: 'Add helper packages', impact: '+5 packages', status: 'declined' },
  ];

  const outliers = [
    { driver: 'D-145', deviation: '+28%', days: 7, reason: 'Consistently assigned high-traffic zones' },
    { driver: 'D-234', deviation: '-22%', days: 5, reason: 'Mostly residential, low difficulty' },
    { driver: 'D-167', deviation: '+25%', days: 6, reason: 'Multi-floor buildings, parking issues' },
  ];

  const difficultyTrend = [
    { date: '01-28', avg: 48.2, max: 85, min: 12 },
    { date: '01-29', avg: 52.1, max: 88, min: 15 },
    { date: '01-30', avg: 45.8, max: 82, min: 18 },
    { date: '01-31', avg: 49.6, max: 87, min: 14 },
    { date: '02-01', avg: 51.3, max: 89, min: 16 },
    { date: '02-02', avg: 47.9, max: 84, min: 13 },
    { date: '02-03', avg: 50.2, max: 86, min: 17 },
    { date: 'Today', avg: 48.7, max: 83, min: 15 },
  ];

  const packageDetails = [
    { id: 'P-8472', difficulty: 85, weight: '25kg', floors: 5, traffic: 'High', time: 45, zone: 'Downtown' },
    { id: 'P-8491', difficulty: 72, weight: '18kg', floors: 3, traffic: 'Medium', time: 35, zone: 'North' },
    { id: 'P-8503', difficulty: 28, weight: '8kg', floors: 1, traffic: 'Low', time: 18, zone: 'Suburbs' },
    { id: 'P-8514', difficulty: 91, weight: '32kg', floors: 7, traffic: 'Very High', time: 58, zone: 'Downtown' },
    { id: 'P-8527', difficulty: 45, weight: '12kg', floors: 2, traffic: 'Medium', time: 28, zone: 'East' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-12 w-96" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Difficulty & Shadow AI Dashboard</h1>
              <p className="text-gray-600">Innovation #1 - XGBoost Difficulty Scoring & AI Recommendations</p>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Cities</option>
              <option value="downtown">Downtown</option>
              <option value="north">North District</option>
              <option value="east">East Side</option>
              <option value="suburbs">Suburbs</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" />
            <select
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Drivers</option>
              <option value="high">High Difficulty Drivers</option>
              <option value="balanced">Balanced</option>
              <option value="low">Low Difficulty Drivers</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="all">All Partners</option>
              <option value="partner1">Partner A</option>
              <option value="partner2">Partner B</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Avg Difficulty</span>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">48.7</div>
          <p className="text-sm text-gray-600 mt-1">+2.3% from yesterday</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
            <Brain className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">87</div>
          <p className="text-sm text-gray-600 mt-1">75% acceptance rate</p>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Outliers Detected</span>
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">3</div>
          <p className="text-sm text-gray-600 mt-1">Require rebalancing</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Time Saved</span>
            <TrendingDown className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">3.2h</div>
          <p className="text-sm text-gray-600 mt-1">Per driver average</p>
        </Card>
      </div>

      {/* Difficulty Distribution */}
      <Card title="Difficulty Score Distribution" subtitle="Packages grouped by difficulty range">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={difficultyDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="range" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" label={{ value: 'Package Count', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" label={{ value: 'Avg Time (min)', angle: 90, position: 'insideRight' }} />
            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend />
            <Bar yAxisId="left" dataKey="count" name="Packages" radius={[8, 8, 0, 0]}>
              {difficultyDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke="#ef4444" strokeWidth={2} name="Avg Time" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Difficulty Trend */}
      <Card title="Difficulty Trend Over Time" subtitle="7-day moving average">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={difficultyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={3} name="Average" />
            <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Max" />
            <Line type="monotone" dataKey="min" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Min" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Driver Workload Table */}
      <Card title="Driver Workload Distribution" subtitle="Sorted by difficulty variance">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {driverWorkload.map((driver) => (
                <tr key={driver.driverId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                      <div className="text-sm text-gray-500">{driver.driverId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[100px]">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              driver.avgDifficulty >= 65 ? 'bg-red-500' :
                              driver.avgDifficulty >= 45 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${driver.avgDifficulty}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{driver.avgDifficulty}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.packages}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      driver.variance > 20 ? 'text-red-600' :
                      driver.variance > 15 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {driver.variance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      driver.flag === 'high' ? 'danger' :
                      driver.flag === 'balanced' ? 'success' :
                      'warning'
                    }>
                      {driver.flag}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link href={`/drivers/${driver.driverId}`} className="text-green-600 hover:text-green-900 font-medium">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Shadow AI & Outliers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shadow AI Recommendations */}
        <Card title="Shadow AI Recommendations" subtitle="Real-time optimization suggestions" className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="space-y-3">
            {shadowAIRecommendations.map((rec, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">{rec.time}</span>
                  </div>
                  <Badge variant={
                    rec.status === 'accepted' ? 'success' :
                    rec.status === 'pending' ? 'warning' :
                    'secondary'
                  }>
                    {rec.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{rec.driver} - {rec.action}</p>
                    <p className="text-xs text-green-600 mt-1">Impact: {rec.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Outliers */}
        <Card title="Difficulty Outliers" subtitle="Drivers with imbalanced workload" className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <div className="space-y-3">
            {outliers.map((outlier, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{outlier.driver}</span>
                  <Badge variant="danger">{outlier.deviation}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{outlier.reason}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{outlier.days} consecutive days</span>
                  <Link href={`/fair-assignment?driver=${outlier.driver}`} className="text-green-600 hover:text-green-700 font-medium">
                    Rebalance →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Package Details */}
      <Card title="Package-Level Difficulty Breakdown" subtitle="Top 5 most difficult packages today">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Traffic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packageDetails.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      pkg.difficulty >= 80 ? 'bg-red-100 text-red-700' :
                      pkg.difficulty >= 60 ? 'bg-orange-100 text-orange-700' :
                      pkg.difficulty >= 40 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {pkg.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pkg.weight}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pkg.floors}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pkg.traffic}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pkg.time} min</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pkg.zone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
