'use client';

import { useState } from 'react';
import { 
  Scale, 
  TrendingDown, 
  Users, 
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Target,
  RefreshCw,
  Settings
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Mock data: Before/After PuLP optimization
const beforeOptimization = {
  giniCoefficient: 0.42,
  varianceScore: 18.5,
  underservedDrivers: 12,
  overservedDrivers: 8,
  totalAssignments: 1247
};

const afterOptimization = {
  giniCoefficient: 0.18,
  varianceScore: 5.2,
  underservedDrivers: 2,
  overservedDrivers: 1,
  totalAssignments: 1247
};

// Driver fairness distribution (before vs after)
const driverDistribution = [
  { name: 'D-001', before: 45, after: 62, target: 65, status: 'improved' },
  { name: 'D-002', before: 92, after: 68, target: 65, status: 'balanced' },
  { name: 'D-003', before: 38, after: 58, target: 65, status: 'improved' },
  { name: 'D-004', before: 105, after: 72, target: 65, status: 'balanced' },
  { name: 'D-005', before: 28, after: 61, target: 65, status: 'improved' },
  { name: 'D-006', before: 118, after: 69, target: 65, status: 'balanced' },
  { name: 'D-007', before: 55, after: 64, target: 65, status: 'optimal' },
  { name: 'D-008', before: 82, after: 67, target: 65, status: 'optimal' },
];

// Under/Over-served drivers detailed view
const inequityDrivers = [
  { 
    id: 'D-1023', 
    name: 'Michael Chen', 
    current: 38, 
    target: 65, 
    gap: -27, 
    type: 'underserved',
    difficulty: 'High',
    region: 'Downtown',
    seniority: '2 years'
  },
  { 
    id: 'D-1045', 
    name: 'Sarah Johnson', 
    current: 28, 
    target: 65, 
    gap: -37, 
    type: 'underserved',
    difficulty: 'Medium',
    region: 'Westside',
    seniority: '1.5 years'
  },
  { 
    id: 'D-1156', 
    name: 'James Rodriguez', 
    current: 118, 
    target: 65, 
    gap: +53, 
    type: 'overserved',
    difficulty: 'Low',
    region: 'Eastside',
    seniority: '3 years'
  },
  { 
    id: 'D-1203', 
    name: 'Lisa Anderson', 
    current: 105, 
    target: 65, 
    gap: +40, 
    type: 'overserved',
    difficulty: 'Medium',
    region: 'Northside',
    seniority: '4 years'
  },
];

// Fairness metrics over time (weekly)
const fairnessTimeline = [
  { week: 'Week 1', gini: 0.45, variance: 22.1, underserved: 15, overserved: 10 },
  { week: 'Week 2', gini: 0.38, variance: 18.7, underserved: 12, overserved: 8 },
  { week: 'Week 3', gini: 0.32, variance: 15.3, underserved: 9, overserved: 6 },
  { week: 'Week 4', gini: 0.25, variance: 11.8, underserved: 5, overserved: 4 },
  { week: 'Week 5', gini: 0.18, variance: 8.2, underserved: 2, overserved: 2 },
  { week: 'Week 6', gini: 0.18, variance: 5.2, underserved: 2, overserved: 1 },
];

// Constraint satisfaction data (PuLP optimization)
const constraintData = [
  { constraint: 'Min Assignments', satisfied: 156, violated: 0, compliance: 100 },
  { constraint: 'Max Assignments', satisfied: 154, violated: 2, compliance: 98.7 },
  { constraint: 'Difficulty Balance', satisfied: 148, violated: 8, compliance: 94.9 },
  { constraint: 'Regional Coverage', satisfied: 156, violated: 0, compliance: 100 },
  { constraint: 'Skill Matching', satisfied: 142, violated: 14, compliance: 91.0 },
];

// Equity distribution scatter
const equityScatter = [
  { assignments: 38, difficulty: 72, driver: 'D-1023', type: 'underserved' },
  { assignments: 28, difficulty: 58, driver: 'D-1045', type: 'underserved' },
  { assignments: 118, difficulty: 42, driver: 'D-1156', type: 'overserved' },
  { assignments: 105, difficulty: 48, driver: 'D-1203', type: 'overserved' },
  { assignments: 62, difficulty: 65, driver: 'D-1001', type: 'balanced' },
  { assignments: 68, difficulty: 62, driver: 'D-1002', type: 'balanced' },
  { assignments: 58, difficulty: 68, driver: 'D-1003', type: 'balanced' },
  { assignments: 72, difficulty: 58, driver: 'D-1004', type: 'balanced' },
  { assignments: 61, difficulty: 63, driver: 'D-1005', type: 'balanced' },
  { assignments: 69, difficulty: 61, driver: 'D-1006', type: 'balanced' },
];

// PuLP optimization configuration
const optimizationConfig = [
  { parameter: 'Objective Function', value: 'Minimize Gini Coefficient', editable: true },
  { parameter: 'Min Assignments/Driver', value: '40', editable: true },
  { parameter: 'Max Assignments/Driver', value: '85', editable: true },
  { parameter: 'Difficulty Tolerance', value: '±15%', editable: true },
  { parameter: 'Optimization Horizon', value: '7 days', editable: true },
  { parameter: 'Reoptimization Frequency', value: 'Daily at 2 AM', editable: true },
];

export default function FairAssignmentPage() {
  const [viewMode, setViewMode] = useState<'before' | 'after'>('after');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  const currentData = viewMode === 'after' ? afterOptimization : beforeOptimization;

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'underserved': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'overserved': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'balanced': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'optimal': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getScatterColor = (type: string) => {
    switch (type) {
      case 'underserved': return '#ef4444';
      case 'overserved': return '#f97316';
      case 'balanced': return '#22c55e';
      default: return '#6b7280';
    }
  };

  // Calculate improvement percentage
  const giniImprovement = (((beforeOptimization.giniCoefficient - afterOptimization.giniCoefficient) / beforeOptimization.giniCoefficient) * 100).toFixed(1);
  const varianceImprovement = (((beforeOptimization.varianceScore - afterOptimization.varianceScore) / beforeOptimization.varianceScore) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Fair Assignment & Equity Panel</h1>
              <p className="text-sm text-gray-100">PuLP optimization for balanced workload distribution and Gini coefficient tracking</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors text-sm">
            <Settings className="w-4 h-4 inline mr-2" />
            Configure Constraints
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-opacity text-sm">
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Run Optimization
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-4 items-center">
        <div className="inline-flex rounded-lg border border-gray-700 bg-gray-800/50 p-1">
          <button
            onClick={() => setViewMode('before')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'before' 
                ? 'bg-red-500 text-white' 
                : 'text-gray-200 hover:text-white'
            }`}
          >
            Before Optimization
          </button>
          <button
            onClick={() => setViewMode('after')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'after' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-200 hover:text-white'
            }`}
          >
            After Optimization
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
        </select>
        <select 
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="all">All Regions</option>
          <option value="downtown">Downtown</option>
          <option value="westside">Westside</option>
          <option value="eastside">Eastside</option>
          <option value="northside">Northside</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl border p-6 ${
          viewMode === 'after' 
            ? 'border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-600/10' 
            : 'border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-600/10'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Gini Coefficient</p>
            <Scale className={`w-5 h-5 ${viewMode === 'after' ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{currentData.giniCoefficient}</p>
          <p className={`text-xs ${viewMode === 'after' ? 'text-green-400' : 'text-red-400'}`}>
            {viewMode === 'after' ? `↓ ${giniImprovement}% improvement` : 'Requires optimization'}
          </p>
        </div>

        <div className={`rounded-xl border p-6 ${
          viewMode === 'after' 
            ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-600/10' 
            : 'border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-600/10'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Variance Score</p>
            <TrendingDown className={`w-5 h-5 ${viewMode === 'after' ? 'text-blue-400' : 'text-orange-400'}`} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{currentData.varianceScore}</p>
          <p className={`text-xs ${viewMode === 'after' ? 'text-blue-400' : 'text-orange-400'}`}>
            {viewMode === 'after' ? `↓ ${varianceImprovement}% reduction` : 'High variance detected'}
          </p>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Underserved Drivers</p>
            <AlertTriangle className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{currentData.underservedDrivers}</p>
          <p className="text-xs text-purple-400">
            {viewMode === 'after' ? '83% reduction' : 'Need more assignments'}
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Overserved Drivers</p>
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{currentData.overservedDrivers}</p>
          <p className="text-xs text-amber-400">
            {viewMode === 'after' ? '87.5% reduction' : 'Need workload balancing'}
          </p>
        </div>
      </div>

      {/* Before/After Comparison Chart */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Assignment Distribution: Before vs After PuLP Optimization</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={driverDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Bar dataKey="before" fill="#ef4444" name="Before Optimization" radius={[4, 4, 0, 0]} />
            <Bar dataKey="after" fill="#22c55e" name="After Optimization" radius={[4, 4, 0, 0]} />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#a855f7" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target (Fair Distribution)"
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-red-400">±42%</p>
            <p className="text-xs text-gray-400">Before: Avg Deviation</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">±7%</p>
            <p className="text-xs text-gray-400">After: Avg Deviation</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">84%</p>
            <p className="text-xs text-gray-400">Fairness Improvement</p>
          </div>
        </div>
      </div>

      {/* Equity Scatter & Fairness Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment vs Difficulty Scatter */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Assignment-Difficulty Equity Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number" 
                dataKey="assignments" 
                name="Assignments" 
                stroke="#9ca3af"
                label={{ value: 'Assignments', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
              />
              <YAxis 
                type="number" 
                dataKey="difficulty" 
                name="Avg Difficulty" 
                stroke="#9ca3af"
                label={{ value: 'Difficulty Score', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Legend />
              <Scatter name="Underserved" data={equityScatter.filter(d => d.type === 'underserved')} fill="#ef4444">
                {equityScatter.filter(d => d.type === 'underserved').map((entry, index) => (
                  <Cell key={`cell-underserved-${index}`} fill="#ef4444" />
                ))}
              </Scatter>
              <Scatter name="Overserved" data={equityScatter.filter(d => d.type === 'overserved')} fill="#f97316">
                {equityScatter.filter(d => d.type === 'overserved').map((entry, index) => (
                  <Cell key={`cell-overserved-${index}`} fill="#f97316" />
                ))}
              </Scatter>
              <Scatter name="Balanced" data={equityScatter.filter(d => d.type === 'balanced')} fill="#22c55e">
                {equityScatter.filter(d => d.type === 'balanced').map((entry, index) => (
                  <Cell key={`cell-balanced-${index}`} fill="#22c55e" />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Optimal zone: 55-75 assignments with 55-75 difficulty score
          </p>
        </div>

        {/* Fairness Metrics Timeline */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Fairness Improvement Timeline (6 Weeks)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={fairnessTimeline}>
              <defs>
                <linearGradient id="giniGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
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
                dataKey="gini" 
                stroke="#a855f7" 
                fill="url(#giniGradient)"
                name="Gini Coefficient"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="underserved" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Underserved Drivers"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="overserved" 
                stroke="#f97316" 
                strokeWidth={2}
                name="Overserved Drivers"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Under/Over-served Drivers Table */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Drivers Requiring Rebalancing</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Driver ID</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Name</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Region</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Seniority</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-200">Current</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-200">Target</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-200">Gap</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {inequityDrivers.map((driver) => (
                <tr key={driver.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                  <td className="p-3 text-sm text-white font-mono">{driver.id}</td>
                  <td className="p-3 text-sm text-white font-semibold">{driver.name}</td>
                  <td className="p-3 text-sm text-gray-100">{driver.region}</td>
                  <td className="p-3 text-sm text-gray-100">{driver.seniority}</td>
                  <td className="p-3 text-sm text-white text-right font-semibold">{driver.current}</td>
                  <td className="p-3 text-sm text-gray-100 text-right">{driver.target}</td>
                  <td className={`p-3 text-sm text-right font-bold ${
                    driver.gap > 0 ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {driver.gap > 0 ? `+${driver.gap}` : driver.gap}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(driver.type)}`}>
                      {driver.type}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-100">{driver.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Constraint Satisfaction & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PuLP Constraint Compliance */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">PuLP Constraint Satisfaction</h2>
          <div className="space-y-4">
            {constraintData.map((constraint, index) => (
              <div key={index} className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-white">{constraint.constraint}</p>
                  <span className={`text-sm font-bold ${
                    constraint.compliance === 100 ? 'text-green-400' :
                    constraint.compliance > 95 ? 'text-blue-400' :
                    constraint.compliance > 90 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {constraint.compliance}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs mb-2">
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{constraint.satisfied} Satisfied</span>
                  </div>
                  {constraint.violated > 0 && (
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{constraint.violated} Violated</span>
                    </div>
                  )}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      constraint.compliance === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                      constraint.compliance > 95 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                      constraint.compliance > 90 ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                      'bg-gradient-to-r from-red-500 to-orange-600'
                    }`}
                    style={{ width: `${constraint.compliance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Configuration */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">PuLP Optimization Parameters</h2>
          <div className="space-y-3">
            {optimizationConfig.map((param, index) => (
              <div key={index} className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">{param.parameter}</p>
                    <p className="text-sm text-gray-100">{param.value}</p>
                  </div>
                  {param.editable && (
                    <button className="ml-2 px-3 py-1 rounded-md border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-xs text-blue-400">
              <strong>Note:</strong> PuLP optimization runs daily at 2 AM. Manual optimization can be triggered using the "Run Optimization" button above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
