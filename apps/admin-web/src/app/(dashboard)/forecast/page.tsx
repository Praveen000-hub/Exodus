'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import {
  TrendingUp,
  Calendar,
  Clock,
  AlertTriangle,
  Download,
  MapPin,
  Users,
  Package,
  BarChart3,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

export default function ForecastDashboard() {
  const [loading, setLoading] = useState(true);
  const [forecastRange, setForecastRange] = useState<'7days' | '30days'>('7days');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // 7-day forecast data
  const forecast7Days = [
    { date: 'Wed 02/05', actual: 0, predicted: 1320, lower: 1250, upper: 1390, confidence: 94.2 },
    { date: 'Thu 02/06', actual: 0, predicted: 1280, lower: 1210, upper: 1350, confidence: 93.8 },
    { date: 'Fri 02/07', actual: 0, predicted: 1400, lower: 1330, upper: 1470, confidence: 94.5 },
    { date: 'Sat 02/08', actual: 0, predicted: 1520, lower: 1450, upper: 1590, confidence: 92.1 },
    { date: 'Sun 02/09', actual: 0, predicted: 890, lower: 840, upper: 940, confidence: 95.3 },
    { date: 'Mon 02/10', actual: 0, predicted: 1200, lower: 1130, upper: 1270, confidence: 94.7 },
    { date: 'Tue 02/11', actual: 0, predicted: 1250, lower: 1180, upper: 1320, confidence: 93.9 },
  ];

  // 30-day forecast summary
  const forecast30Days = [
    { week: 'Week 1', packages: 8650, capacity: 10500, gap: -1850 },
    { week: 'Week 2', packages: 9120, capacity: 10500, gap: -1380 },
    { week: 'Week 3', packages: 10800, capacity: 10500, gap: 300 },
    { week: 'Week 4', packages: 9630, capacity: 10500, gap: -870 },
  ];

  // Peak hours analysis
  const peakHours = [
    { hour: '06:00', volume: 45, label: '6 AM' },
    { hour: '07:00', volume: 78, label: '7 AM' },
    { hour: '08:00', volume: 120, label: '8 AM' },
    { hour: '09:00', volume: 165, label: '9 AM' },
    { hour: '10:00', volume: 198, label: '10 AM' },
    { hour: '11:00', volume: 210, label: '11 AM' },
    { hour: '12:00', volume: 180, label: '12 PM' },
    { hour: '13:00', volume: 156, label: '1 PM' },
    { hour: '14:00', volume: 220, label: '2 PM' },
    { hour: '15:00', volume: 195, label: '3 PM' },
    { hour: '16:00', volume: 172, label: '4 PM' },
    { hour: '17:00', volume: 145, label: '5 PM' },
    { hour: '18:00', volume: 98, label: '6 PM' },
  ];

  // Regional forecast
  const regionalForecast = [
    { region: 'Downtown Hub', forecast: 3420, capacity: 3000, drivers: 45, gap: 420, status: 'critical' },
    { region: 'North District Hub', forecast: 2890, capacity: 3200, drivers: 38, gap: -310, status: 'good' },
    { region: 'East Side Hub', forecast: 1650, capacity: 2100, drivers: 25, gap: -450, status: 'good' },
    { region: 'Suburbs Hub', forecast: 1190, capacity: 1500, drivers: 18, gap: -310, status: 'good' },
    { region: 'Industrial Zone', forecast: 2200, capacity: 2000, drivers: 28, gap: 200, status: 'warning' },
  ];

  // Model performance metrics
  const modelMetrics = {
    accuracy: 94.2,
    mape: 5.8, // Mean Absolute Percentage Error
    r2Score: 0.92,
    lastUpdated: '2 hours ago'
  };

  const peakDays = [
    { day: 'Saturday', date: '02/08', volume: 1520, reason: 'Weekend delivery rush' },
    { day: 'Friday', date: '02/07', volume: 1400, reason: 'End of week surge' },
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
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workload Forecast Dashboard</h1>
              <p className="text-gray-600">Innovation #2 - LSTM Volume Prediction & Capacity Planning</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
            <Calendar className="h-4 w-4" />
            Plan Resources
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            <Download className="h-4 w-4" />
            Export Forecast
          </button>
        </div>
      </div>

      {/* Toggle Forecast Range */}
      <Card>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Forecast Period:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setForecastRange('7days')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                forecastRange === '7days'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setForecastRange('30days')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                forecastRange === '30days'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </Card>

      {/* Model Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Model Accuracy</span>
            <BarChart3 className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{modelMetrics.accuracy}%</div>
          <p className="text-sm text-gray-600 mt-1">R² Score: {modelMetrics.r2Score}</p>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">MAPE</span>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{modelMetrics.mape}%</div>
          <p className="text-sm text-gray-600 mt-1">Error margin</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Next Peak Day</span>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">Sat 02/08</div>
          <p className="text-sm text-gray-600 mt-1">1,520 packages</p>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Last Updated</span>
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{modelMetrics.lastUpdated}</div>
          <p className="text-sm text-gray-600 mt-1">Auto-refresh: 15 min</p>
        </Card>
      </div>

      {/* Main Forecast Chart */}
      {forecastRange === '7days' && (
        <Card title="7-Day Volume Forecast" subtitle="LSTM predictions with confidence intervals">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Confidence Level:</strong> {forecast7Days.reduce((acc, d) => acc + d.confidence, 0) / forecast7Days.length}% average • 
              <strong className="ml-3">Peak Day:</strong> Saturday 02/08 (1,520 packages)
            </p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={forecast7Days}>
              <defs>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" label={{ value: 'Package Volume', angle: -90, position: 'insideLeft' }} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="upper" 
                stackId="1"
                stroke="none" 
                fill="url(#colorConfidence)" 
                name="Upper Bound"
              />
              <Area 
                type="monotone" 
                dataKey="lower" 
                stackId="1"
                stroke="none" 
                fill="url(#colorConfidence)" 
                name="Lower Bound"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                name="Predicted Volume" 
                dot={{ fill: '#3b82f6', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10b981" 
                strokeWidth={2} 
                name="Actual Volume"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* 30-Day Forecast View */}
      {forecastRange === '30days' && (
        <Card title="30-Day Volume Forecast (Weekly Breakdown)" subtitle="Capacity gap analysis">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={forecast30Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="packages" fill="#3b82f6" name="Predicted Packages" radius={[8, 8, 0, 0]} />
              <Bar dataKey="capacity" fill="#d1d5db" name="Current Capacity" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Capacity Alert: Week 3</p>
                <p className="text-sm text-gray-700 mt-1">
                  Predicted volume (10,800) exceeds capacity (10,500) by 300 packages.
                  <strong> Recommendation:</strong> Hire 5 additional drivers or extend shifts.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Peak Hours Analysis */}
      <Card title="Peak Hours Analysis" subtitle="Hourly volume distribution (today's pattern)">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={peakHours}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="volume" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVolume)" name="Package Volume" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600">Peak Hour</p>
            <p className="text-lg font-bold text-gray-900">2:00 PM</p>
            <p className="text-xs text-gray-500">220 packages</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600">Busiest Period</p>
            <p className="text-lg font-bold text-gray-900">11 AM - 3 PM</p>
            <p className="text-xs text-gray-500">765 packages</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600">Quietest Hour</p>
            <p className="text-lg font-bold text-gray-900">6:00 AM</p>
            <p className="text-xs text-gray-500">45 packages</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-gray-600">Avg/Hour</p>
            <p className="text-lg font-bold text-gray-900">153</p>
            <p className="text-xs text-gray-500">Packages</p>
          </div>
        </div>
      </Card>

      {/* Regional Forecast & Capacity Gap */}
      <Card title="Regional Hub Forecast & Capacity Analysis" subtitle="Next 7 days by location">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region/Hub</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forecast (7d)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Drivers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gap</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regionalForecast.map((region) => (
                <tr key={region.region} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{region.region}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {region.forecast.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {region.capacity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      {region.drivers}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${region.gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {region.gap > 0 ? '+' : ''}{region.gap}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      region.status === 'critical' ? 'danger' :
                      region.status === 'warning' ? 'warning' :
                      'success'
                    }>
                      {region.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Critical Capacity Shortage</p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Downtown Hub</strong> is forecasted to exceed capacity by 420 packages (14% over).
                <strong className="ml-2">Action Required:</strong> Redistribute 200 packages to North District Hub and hire 7 additional drivers.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <Card title="Planning & Export Options">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group">
            <div className="flex items-center gap-3 mb-2">
              <Download className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
              <span className="font-semibold text-gray-900">Download CSV</span>
            </div>
            <p className="text-sm text-gray-600">Export forecast data for spreadsheet analysis</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
              <span className="font-semibold text-gray-900">Driver Schedule</span>
            </div>
            <p className="text-sm text-gray-600">Generate optimal driver shifts based on forecast</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
              <span className="font-semibold text-gray-900">Resource Plan</span>
            </div>
            <p className="text-sm text-gray-600">Create resource allocation plan for peak days</p>
          </button>
        </div>
      </Card>
    </div>
  );
}
