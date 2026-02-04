'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Target,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Calculator,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  ComposedChart,
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

// Mock data: Driver earnings predictions vs actuals
const earningsData = [
  {
    id: 'D-1023',
    name: 'Michael Chen',
    predicted: 2850,
    actual: 2920,
    variance: +70,
    variancePercent: 2.5,
    deliveries: 62,
    bonuses: 180,
    status: 'above',
    region: 'Downtown'
  },
  {
    id: 'D-1045',
    name: 'Sarah Johnson',
    predicted: 2650,
    actual: 2580,
    variance: -70,
    variancePercent: -2.6,
    deliveries: 58,
    bonuses: 120,
    status: 'below',
    region: 'Westside'
  },
  {
    id: 'D-1089',
    name: 'David Park',
    predicted: 3100,
    actual: 3125,
    variance: +25,
    variancePercent: 0.8,
    deliveries: 72,
    bonuses: 240,
    status: 'match',
    region: 'Eastside'
  },
  {
    id: 'D-1012',
    name: 'Emily White',
    predicted: 2420,
    actual: 2350,
    variance: -70,
    variancePercent: -2.9,
    deliveries: 52,
    bonuses: 90,
    status: 'below',
    region: 'Northside'
  },
  {
    id: 'D-1156',
    name: 'James Rodriguez',
    predicted: 2980,
    actual: 3050,
    variance: +70,
    variancePercent: 2.3,
    deliveries: 68,
    bonuses: 200,
    status: 'above',
    region: 'Downtown'
  },
  {
    id: 'D-1203',
    name: 'Lisa Anderson',
    predicted: 2750,
    actual: 2740,
    variance: -10,
    variancePercent: -0.4,
    deliveries: 60,
    bonuses: 150,
    status: 'match',
    region: 'Westside'
  },
];

// Weekly earnings trend (predicted vs actual)
const weeklyEarningsTrend = [
  { week: 'Week 1', predicted: 42500, actual: 41800, accuracy: 98.4 },
  { week: 'Week 2', predicted: 45200, actual: 45850, accuracy: 98.6 },
  { week: 'Week 3', predicted: 48100, actual: 48500, accuracy: 99.2 },
  { week: 'Week 4', predicted: 46800, actual: 46200, accuracy: 98.7 },
  { week: 'Week 5', predicted: 50200, actual: 50800, accuracy: 98.8 },
  { week: 'Week 6', predicted: 52500, actual: 52200, accuracy: 99.4 },
];

// Earnings distribution (driver cohorts)
const earningsDistribution = [
  { range: '$0-1000', drivers: 2, avgEarnings: 850 },
  { range: '$1000-1500', drivers: 8, avgEarnings: 1280 },
  { range: '$1500-2000', drivers: 18, avgEarnings: 1750 },
  { range: '$2000-2500', drivers: 42, avgEarnings: 2250 },
  { range: '$2500-3000', drivers: 56, avgEarnings: 2780 },
  { range: '$3000-3500', drivers: 22, avgEarnings: 3220 },
  { range: '$3500+', drivers: 8, avgEarnings: 3850 },
];

// Earnings outliers (under/over-performing)
const earningsOutliers = [
  {
    id: 'D-2047',
    name: 'Carlos Martinez',
    predicted: 2200,
    actual: 1450,
    variance: -750,
    variancePercent: -34.1,
    reason: '12 missed deliveries, 3 customer complaints',
    action: 'Performance review scheduled',
    severity: 'high'
  },
  {
    id: 'D-1892',
    name: 'Anna Kim',
    predicted: 2600,
    actual: 1980,
    variance: -620,
    variancePercent: -23.8,
    reason: 'Health leave (3 days), reduced capacity',
    action: 'Wellness check completed',
    severity: 'medium'
  },
  {
    id: 'D-1534',
    name: 'Robert Taylor',
    predicted: 2400,
    actual: 3850,
    variance: +1450,
    variancePercent: +60.4,
    reason: 'High-demand zone, +28 overtime hours',
    action: 'Bonus awarded, monitor fatigue',
    severity: 'medium'
  },
];

// What-if scenarios
const whatIfScenarios = [
  {
    scenario: '+10% Deliveries per Driver',
    impact: '+$28,400',
    impactPercent: 12.8,
    feasibility: 'High',
    requirements: 'Optimize routing, reduce idle time'
  },
  {
    scenario: '+5% Bonus Rate',
    impact: '+$8,200',
    impactPercent: 3.7,
    feasibility: 'Medium',
    requirements: 'Budget allocation approval needed'
  },
  {
    scenario: 'Remove Low-Performers (Bottom 5%)',
    impact: '-$4,250',
    impactPercent: -1.9,
    feasibility: 'Low',
    requirements: 'HR review, replacement hiring'
  },
  {
    scenario: 'Add Peak-Hour Bonuses',
    impact: '+$15,600',
    impactPercent: 7.0,
    feasibility: 'High',
    requirements: 'Incentive program design'
  },
];

// Earnings fairness metrics
const earningsFairness = [
  { metric: 'Gini Coefficient', value: 0.22, target: 0.25, status: 'good' },
  { metric: 'Variance', value: 485, target: 500, status: 'good' },
  { metric: 'Top 10% vs Bottom 10%', value: '2.8x', target: '3.0x', status: 'good' },
  { metric: 'Underearners (<$2000)', value: 28, target: 30, status: 'good' },
];

// Earnings breakdown (pie chart)
const earningsBreakdown = [
  { name: 'Base Pay', value: 68, amount: 183600 },
  { name: 'Bonuses', value: 18, amount: 48600 },
  { name: 'Overtime', value: 10, amount: 27000 },
  { name: 'Tips', value: 4, amount: 10800 },
];

export default function EarningsPage() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [viewMode, setViewMode] = useState<'predicted' | 'actual'>('actual');
  const [dateRange, setDateRange] = useState('7days');

  const filteredDrivers = earningsData.filter(driver => {
    if (selectedRegion !== 'all' && driver.region !== selectedRegion) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'above': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'match': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'below': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'low': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  // Calculate summary metrics
  const totalPredicted = filteredDrivers.reduce((sum, d) => sum + d.predicted, 0);
  const totalActual = filteredDrivers.reduce((sum, d) => sum + d.actual, 0);
  const avgAccuracy = weeklyEarningsTrend.reduce((sum, w) => sum + w.accuracy, 0) / weeklyEarningsTrend.length;
  const driversAbove = filteredDrivers.filter(d => d.status === 'above').length;
  const driversBelow = filteredDrivers.filter(d => d.status === 'below').length;

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ec4899'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Earnings & Income Insights</h1>
              <p className="text-sm text-gray-100">Predicted vs actual earnings, fairness analysis, and what-if scenario modeling</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors text-sm">
            <Calculator className="w-4 h-4 inline mr-2" />
            Run What-If Analysis
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 transition-opacity text-sm">
            Export Earnings Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="inline-flex rounded-lg border border-gray-700 bg-gray-800/50 p-1">
          <button
            onClick={() => setViewMode('predicted')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'predicted' 
                ? 'bg-purple-500 text-white' 
                : 'text-gray-200 hover:text-white'
            }`}
          >
            Predicted
          </button>
          <button
            onClick={() => setViewMode('actual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'actual' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-200 hover:text-white'
            }`}
          >
            Actual
          </button>
        </div>
        <select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="quarter">This Quarter</option>
        </select>
        <select 
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="all">All Regions</option>
          <option value="Downtown">Downtown</option>
          <option value="Westside">Westside</option>
          <option value="Eastside">Eastside</option>
          <option value="Northside">Northside</option>
        </select>
        <select 
          value={selectedCohort}
          onChange={(e) => setSelectedCohort(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="all">All Cohorts</option>
          <option value="high">High Earners ($3000+)</option>
          <option value="medium">Medium Earners ($2000-3000)</option>
          <option value="low">Low Earners (under $2000)</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Total Earnings</p>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${viewMode === 'actual' ? totalActual.toLocaleString() : totalPredicted.toLocaleString()}
          </p>
          <p className="text-xs text-green-400">
            {viewMode === 'actual' ? 'This week actual' : 'This week predicted'}
          </p>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Model Accuracy</p>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{avgAccuracy.toFixed(1)}%</p>
          <p className="text-xs text-purple-400">6-week average</p>
        </div>

        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Above Prediction</p>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{driversAbove}</p>
          <p className="text-xs text-blue-400">Drivers exceeding forecast</p>
        </div>

        <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Below Prediction</p>
            <TrendingDown className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{driversBelow}</p>
          <p className="text-xs text-orange-400">Need support/intervention</p>
        </div>
      </div>

      {/* Predicted vs Actual Timeline & Earnings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Earnings Trend */}
        <div className="lg:col-span-2 rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Predicted vs Actual Earnings (6 Weeks)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={weeklyEarningsTrend}>
              <defs>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="predicted" 
                stroke="#a855f7" 
                fill="url(#predictedGradient)"
                name="Predicted ($)"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="actual" 
                stroke="#22c55e" 
                fill="url(#actualGradient)"
                name="Actual ($)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="accuracy" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Accuracy (%)"
                dot={{ fill: '#3b82f6', r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings Breakdown Pie Chart */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Earnings Composition</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={earningsBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {earningsBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                formatter={(value: any, name: any, props: any) => [`$${props.payload.amount.toLocaleString()} (${value}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {earningsBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-100">{item.name}</span>
                </div>
                <span className="text-white font-semibold">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Driver Earnings Table */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Driver Earnings: Predicted vs Actual</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Driver ID</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Name</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Region</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-200">Predicted</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-200">Actual</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-200">Variance</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-200">Deliveries</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-200">Bonuses</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                  <td className="p-3 text-sm text-white font-mono">{driver.id}</td>
                  <td className="p-3 text-sm text-white font-semibold">{driver.name}</td>
                  <td className="p-3 text-sm text-gray-100">{driver.region}</td>
                  <td className="p-3 text-sm text-purple-400 text-right font-semibold">${driver.predicted}</td>
                  <td className="p-3 text-sm text-green-400 text-right font-semibold">${driver.actual}</td>
                  <td className={`p-3 text-sm text-right font-bold ${
                    driver.variance > 0 ? 'text-green-400' : driver.variance < 0 ? 'text-red-400' : 'text-gray-100'
                  }`}>
                    {driver.variance > 0 ? `+$${driver.variance}` : `$${driver.variance}`} ({driver.variancePercent > 0 ? '+' : ''}{driver.variancePercent}%)
                  </td>
                  <td className="p-3 text-sm text-white text-right">{driver.deliveries}</td>
                  <td className="p-3 text-sm text-white text-right">${driver.bonuses}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(driver.status)}`}>
                      {driver.status === 'above' ? 'Above' : driver.status === 'below' ? 'Below' : 'Match'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Earnings Distribution & Outliers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Distribution */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Earnings Distribution (Driver Cohorts)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="drivers" fill="#3b82f6" name="Number of Drivers" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-400">156</p>
              <p className="text-xs text-gray-400">Total Drivers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">$2,720</p>
              <p className="text-xs text-gray-400">Median Earnings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">0.22</p>
              <p className="text-xs text-gray-400">Gini Coefficient</p>
            </div>
          </div>
        </div>

        {/* Earnings Outliers */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Earnings Outliers (Investigation Required)</h2>
          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {earningsOutliers.map((outlier) => (
              <div 
                key={outlier.id}
                className={`rounded-lg border p-4 ${getSeverityColor(outlier.severity)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white">{outlier.name}</p>
                    <p className="text-xs text-gray-100">{outlier.id}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${outlier.variance > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {outlier.variance > 0 ? '+' : ''}${Math.abs(outlier.variance)}
                    </p>
                    <p className="text-xs">{outlier.variancePercent > 0 ? '+' : ''}{outlier.variancePercent}%</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-100">Predicted:</span>
                    <span className="text-white">${outlier.predicted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actual:</span>
                    <span className="text-white">${outlier.actual}</span>
                  </div>
                  <div className="rounded-md bg-white/5 p-2 mt-2">
                    <p className="text-gray-300"><strong>Reason:</strong> {outlier.reason}</p>
                  </div>
                  <div className="rounded-md bg-blue-500/10 border border-blue-500/30 p-2">
                    <p className="text-blue-400"><strong>Action:</strong> {outlier.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What-If Scenarios & Fairness Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What-If Scenarios */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            What-If Scenario Analysis
          </h2>
          <div className="space-y-3">
            {whatIfScenarios.map((scenario, index) => (
              <div key={index} className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-white text-sm">{scenario.scenario}</p>
                  <span className={`text-lg font-bold ${
                    scenario.impactPercent > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {scenario.impact}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400">Impact:</span>
                  <span className={scenario.impactPercent > 0 ? 'text-green-400' : 'text-red-400'}>
                    {scenario.impactPercent > 0 ? '+' : ''}{scenario.impactPercent}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400">Feasibility:</span>
                  <span className={`px-2 py-1 rounded-full ${
                    scenario.feasibility === 'High' ? 'bg-green-500/10 text-green-400' :
                    scenario.feasibility === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {scenario.feasibility}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  <strong>Requirements:</strong> {scenario.requirements}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fairness Metrics */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Earnings Fairness Metrics</h2>
          <div className="space-y-4">
            {earningsFairness.map((metric, index) => (
              <div key={index} className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-white text-sm">{metric.metric}</p>
                  {metric.status === 'good' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  )}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Current</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Target</p>
                    <p className="text-xl font-semibold text-gray-400">{metric.target}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.status === 'good' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-r from-orange-500 to-red-600'
                    }`}
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
