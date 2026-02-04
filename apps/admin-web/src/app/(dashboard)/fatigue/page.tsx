'use client';

import { useState } from 'react';
import { 
  Coffee, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Moon,
  Sun,
  Battery,
  BatteryLow,
  MapPin,
  Settings,
  PlayCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  ComposedChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts';

// Mock data: Driver fatigue status with dynamic break recommendations
const driverFatigueStatus = [
  {
    id: 'D-1023',
    name: 'Michael Chen',
    currentFatigue: 88,
    workHours: 7.5,
    lastBreak: '3 hours ago',
    recommendedBreak: '20 min (Immediate)',
    breakStatus: 'critical',
    location: 'Downtown (Zone A)',
    nextDelivery: '2.5 km away',
    performance: 'Declining (-15%)',
    alertLevel: 'high'
  },
  {
    id: 'D-1045',
    name: 'Sarah Johnson',
    currentFatigue: 72,
    workHours: 6.2,
    lastBreak: '2.5 hours ago',
    recommendedBreak: '15 min (Within 30 min)',
    breakStatus: 'high',
    location: 'Westside (Zone B)',
    nextDelivery: '1.8 km away',
    performance: 'Declining (-8%)',
    alertLevel: 'medium'
  },
  {
    id: 'D-1089',
    name: 'David Park',
    currentFatigue: 58,
    workHours: 5.0,
    lastBreak: '1.5 hours ago',
    recommendedBreak: '10 min (Within 1 hour)',
    breakStatus: 'medium',
    location: 'Eastside (Zone C)',
    nextDelivery: '3.2 km away',
    performance: 'Stable (±0%)',
    alertLevel: 'low'
  },
  {
    id: 'D-1012',
    name: 'Emily White',
    currentFatigue: 42,
    workHours: 3.8,
    lastBreak: '45 min ago',
    recommendedBreak: '10 min (2 hours)',
    breakStatus: 'normal',
    location: 'Northside (Zone D)',
    nextDelivery: '0.9 km away',
    performance: 'Good (+2%)',
    alertLevel: 'none'
  },
  {
    id: 'D-1156',
    name: 'James Rodriguez',
    currentFatigue: 35,
    workHours: 3.2,
    lastBreak: '30 min ago',
    recommendedBreak: '10 min (2.5 hours)',
    breakStatus: 'normal',
    location: 'Downtown (Zone A)',
    nextDelivery: '1.2 km away',
    performance: 'Good (+5%)',
    alertLevel: 'none'
  },
];

// Break compliance data (hourly tracking)
const breakCompliance = [
  { hour: '6 AM', scheduled: 5, taken: 5, skipped: 0, compliance: 100 },
  { hour: '7 AM', scheduled: 8, taken: 7, skipped: 1, compliance: 87.5 },
  { hour: '8 AM', scheduled: 12, taken: 11, skipped: 1, compliance: 91.7 },
  { hour: '9 AM', scheduled: 15, taken: 14, skipped: 1, compliance: 93.3 },
  { hour: '10 AM', scheduled: 18, taken: 16, skipped: 2, compliance: 88.9 },
  { hour: '11 AM', scheduled: 20, taken: 18, skipped: 2, compliance: 90.0 },
  { hour: '12 PM', scheduled: 22, taken: 19, skipped: 3, compliance: 86.4 },
  { hour: '1 PM', scheduled: 25, taken: 21, skipped: 4, compliance: 84.0 },
  { hour: '2 PM', scheduled: 28, taken: 23, skipped: 5, compliance: 82.1 },
  { hour: '3 PM', scheduled: 24, taken: 20, skipped: 4, compliance: 83.3 },
];

// Fatigue vs Performance correlation
const fatiguePerformance = [
  { fatigue: 15, performance: 98, deliveries: 12 },
  { fatigue: 22, performance: 97, deliveries: 14 },
  { fatigue: 35, performance: 95, deliveries: 16 },
  { fatigue: 42, performance: 92, deliveries: 15 },
  { fatigue: 58, performance: 85, deliveries: 13 },
  { fatigue: 68, performance: 78, deliveries: 11 },
  { fatigue: 72, performance: 72, deliveries: 9 },
  { fatigue: 82, performance: 65, deliveries: 7 },
  { fatigue: 88, performance: 58, deliveries: 5 },
  { fatigue: 95, performance: 45, deliveries: 3 },
];

// Critical drivers map data (high fatigue locations)
const criticalDriversMap = [
  { zone: 'Downtown (Zone A)', drivers: 3, avgFatigue: 78, status: 'critical' },
  { zone: 'Westside (Zone B)', drivers: 2, avgFatigue: 65, status: 'high' },
  { zone: 'Eastside (Zone C)', drivers: 1, avgFatigue: 52, status: 'medium' },
  { zone: 'Northside (Zone D)', drivers: 0, avgFatigue: 38, status: 'normal' },
  { zone: 'Southside (Zone E)', drivers: 0, avgFatigue: 25, status: 'normal' },
];

// Break configuration thresholds
const thresholdConfig = [
  { parameter: 'Critical Fatigue Threshold', value: '75%', editable: true, current: 75 },
  { parameter: 'High Fatigue Threshold', value: '60%', editable: true, current: 60 },
  { parameter: 'Medium Fatigue Threshold', value: '45%', editable: true, current: 45 },
  { parameter: 'Max Continuous Work Hours', value: '4 hours', editable: true, current: 4 },
  { parameter: 'Minimum Break Duration', value: '10 minutes', editable: true, current: 10 },
  { parameter: 'Critical Break Duration', value: '20 minutes', editable: true, current: 20 },
];

// Fatigue trend over shift (simulated driver timeline)
const shiftFatigueTrend = [
  { time: '6:00', fatigue: 15, heartRate: 72, cognitive: 95 },
  { time: '7:00', fatigue: 18, heartRate: 75, cognitive: 94 },
  { time: '8:00', fatigue: 25, heartRate: 82, cognitive: 92 },
  { time: '9:00', fatigue: 35, heartRate: 88, cognitive: 88 },
  { time: '10:00', fatigue: 45, heartRate: 95, cognitive: 82 },
  { time: '11:00', fatigue: 58, heartRate: 102, cognitive: 75 },
  { time: '12:00', fatigue: 42, heartRate: 85, cognitive: 85 }, // Break taken
  { time: '13:00', fatigue: 52, heartRate: 92, cognitive: 80 },
  { time: '14:00', fatigue: 65, heartRate: 105, cognitive: 72 },
  { time: '15:00', fatigue: 75, heartRate: 115, cognitive: 65 },
  { time: '16:00', fatigue: 82, heartRate: 122, cognitive: 58 },
  { time: '17:00', fatigue: 88, heartRate: 128, cognitive: 52 },
];

export default function FatiguePage() {
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedAlertLevel, setSelectedAlertLevel] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredDrivers = driverFatigueStatus.filter(driver => {
    if (selectedAlertLevel !== 'all' && driver.alertLevel !== selectedAlertLevel) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'normal': return 'text-green-500 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'low': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Battery className="w-5 h-5 text-green-500" />;
    }
  };

  // Calculate summary metrics
  const criticalDrivers = filteredDrivers.filter(d => d.breakStatus === 'critical').length;
  const avgCompliance = (breakCompliance.reduce((sum, b) => sum + b.compliance, 0) / breakCompliance.length).toFixed(1);
  const totalBreaksSkipped = breakCompliance.reduce((sum, b) => sum + b.skipped, 0);
  const avgFatigue = (filteredDrivers.reduce((sum, d) => sum + d.currentFatigue, 0) / filteredDrivers.length).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Fatigue & Break Recommendation Monitor</h1>
              <p className="text-sm text-gray-100">Dynamic break scheduling, critical driver alerts, and compliance tracking</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors text-sm">
            <Settings className="w-4 h-4 inline mr-2" />
            Configure Thresholds
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90 transition-opacity text-sm">
            <PlayCircle className="w-4 h-4 inline mr-2" />
            Auto-Schedule Breaks
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="inline-flex rounded-lg border border-gray-700 bg-gray-800/50 p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list' 
                ? 'bg-amber-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'map' 
                ? 'bg-amber-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Map View
          </button>
        </div>
        <select 
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="all">All Zones</option>
          <option value="zone-a">Downtown (Zone A)</option>
          <option value="zone-b">Westside (Zone B)</option>
          <option value="zone-c">Eastside (Zone C)</option>
          <option value="zone-d">Northside (Zone D)</option>
        </select>
        <select 
          value={selectedAlertLevel}
          onChange={(e) => setSelectedAlertLevel(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="all">All Alert Levels</option>
          <option value="high">Critical/High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="none">Normal</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Critical Drivers</p>
            <BatteryLow className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{criticalDrivers}</p>
          <p className="text-xs text-red-400">Require immediate breaks</p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Avg Fatigue</p>
            <Coffee className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{avgFatigue}%</p>
          <p className="text-xs text-amber-400">Fleet-wide average</p>
        </div>

        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Break Compliance</p>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{avgCompliance}%</p>
          <p className="text-xs text-blue-400">Last 10 hours</p>
        </div>

        <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Breaks Skipped</p>
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{totalBreaksSkipped}</p>
          <p className="text-xs text-orange-400">Today across fleet</p>
        </div>
      </div>

      {/* Driver Fatigue Status List */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Driver Fatigue Status & Break Recommendations</h2>
        <div className="space-y-3">
          {filteredDrivers.map((driver) => (
            <div 
              key={driver.id}
              className={`rounded-lg border p-4 ${getStatusColor(driver.breakStatus)} hover:bg-white/5 transition-colors`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getAlertIcon(driver.alertLevel)}
                  <div>
                    <p className="font-semibold text-white">{driver.name}</p>
                    <p className="text-xs text-gray-100">{driver.id} • {driver.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{driver.currentFatigue}%</p>
                  <p className="text-xs uppercase font-semibold">{driver.breakStatus}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Work Hours</p>
                  <p className="font-semibold text-white">{driver.workHours} hrs</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Last Break</p>
                  <p className="font-semibold text-white">{driver.lastBreak}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Performance</p>
                  <p className="font-semibold text-white">{driver.performance}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Next Delivery</p>
                  <p className="font-semibold text-white">{driver.nextDelivery}</p>
                </div>
              </div>
              <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-3">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  <p className="text-sm text-amber-400">
                    <strong>Recommended:</strong> {driver.recommendedBreak}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fatigue Trend & Break Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shift Fatigue Trend */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Fatigue Progression During Shift</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={shiftFatigueTrend}>
              <defs>
                <linearGradient id="fatigueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
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
                dataKey="fatigue" 
                stroke="#f59e0b" 
                fill="url(#fatigueGradient)"
                name="Fatigue %"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="cognitive" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Cognitive Performance %"
                dot={{ fill: '#3b82f6', r: 3 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="heartRate" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Heart Rate"
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-200 mt-2 text-center">
            Note: Fatigue drop at 12:00 PM indicates break taken
          </p>
        </div>

        {/* Break Compliance */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Break Compliance (Hourly)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={breakCompliance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="taken" fill="#22c55e" name="Breaks Taken" radius={[4, 4, 0, 0]} />
              <Bar dataKey="skipped" fill="#ef4444" name="Breaks Skipped" radius={[4, 4, 0, 0]} />
              <Line 
                type="monotone" 
                dataKey="compliance" 
                stroke="#a855f7" 
                strokeWidth={2}
                name="Compliance %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fatigue vs Performance Correlation & Critical Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fatigue-Performance Correlation */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Fatigue vs Performance Correlation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number" 
                dataKey="fatigue" 
                name="Fatigue %" 
                stroke="#9ca3af"
                label={{ value: 'Fatigue Level (%)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
              />
              <YAxis 
                type="number" 
                dataKey="performance" 
                name="Performance %" 
                stroke="#9ca3af"
                label={{ value: 'Performance %', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter name="Drivers" data={fatiguePerformance} fill="#f59e0b">
                {fatiguePerformance.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fatigue > 75 ? '#ef4444' : entry.fatigue > 60 ? '#f97316' : entry.fatigue > 45 ? '#eab308' : '#22c55e'} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-xs text-red-400">
              <strong>Insight:</strong> Performance drops significantly when fatigue exceeds 60%. Break intervention recommended.
            </p>
          </div>
        </div>

        {/* Critical Driver Zones */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Critical Driver Locations</h2>
          <div className="space-y-4">
            {criticalDriversMap.map((zone, index) => (
              <div key={index} className={`rounded-lg border p-4 ${getStatusColor(zone.status)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <p className="font-semibold text-white">{zone.zone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(zone.status)}`}>
                    {zone.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-100 text-xs mb-1">Critical Drivers</p>
                    <p className="text-white font-bold text-lg">{zone.critical}</p>
                  </div>
                  <div>
                    <p className="text-gray-100 text-xs mb-1">Avg Fatigue</p>
                    <p className="text-2xl font-bold text-white">{zone.avgFatigue}%</p>
                  </div>
                </div>
                {zone.drivers > 0 && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <button className="w-full px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors">
                      Schedule Zone-Wide Break
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Fatigue & Break Thresholds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {thresholdConfig.map((config, index) => (
            <div key={index} className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-white">{config.parameter}</p>
                {config.editable && (
                  <button className="px-2 py-1 rounded-md border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                    Edit
                  </button>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-2">{config.value}</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full"
                  style={{ width: `${config.current}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-xs text-blue-400">
            <strong>Note:</strong> Thresholds are dynamically adjusted based on weather, traffic, and delivery complexity. Auto-scheduling considers zone proximity and driver availability.
          </p>
        </div>
      </div>
    </div>
  );
}
