'use client';

import { useState } from 'react';
import { 
  HeartPulse, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Shield,
  Clock,
  ThermometerSun,
  Wind,
  Bell,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  ComposedChart,
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

// Mock data: Driver health risk scores with RF model predictions
const driverHealthData = [
  { 
    id: 'D-1023', 
    name: 'Michael Chen', 
    riskScore: 85, 
    severity: 'critical', 
    heartRate: 142, 
    temperature: 39.2, 
    fatigue: 88, 
    lastUpdate: '2 min ago',
    alerts: 3,
    city: 'Downtown',
    shift: 'Morning'
  },
  { 
    id: 'D-1045', 
    name: 'Sarah Johnson', 
    riskScore: 72, 
    severity: 'high', 
    heartRate: 118, 
    temperature: 38.1, 
    fatigue: 65, 
    lastUpdate: '5 min ago',
    alerts: 2,
    city: 'Westside',
    shift: 'Afternoon'
  },
  { 
    id: 'D-1089', 
    name: 'David Park', 
    riskScore: 58, 
    severity: 'medium', 
    heartRate: 95, 
    temperature: 37.8, 
    fatigue: 52, 
    lastUpdate: '8 min ago',
    alerts: 1,
    city: 'Downtown',
    shift: 'Morning'
  },
  { 
    id: 'D-1012', 
    name: 'Emily White', 
    riskScore: 45, 
    severity: 'low', 
    heartRate: 85, 
    temperature: 37.2, 
    fatigue: 38, 
    lastUpdate: '3 min ago',
    alerts: 0,
    city: 'Eastside',
    shift: 'Evening'
  },
  { 
    id: 'D-1156', 
    name: 'James Rodriguez', 
    riskScore: 39, 
    severity: 'low', 
    heartRate: 78, 
    temperature: 36.9, 
    fatigue: 28, 
    lastUpdate: '1 min ago',
    alerts: 0,
    city: 'Northside',
    shift: 'Morning'
  },
  { 
    id: 'D-1203', 
    name: 'Lisa Anderson', 
    riskScore: 28, 
    severity: 'normal', 
    heartRate: 72, 
    temperature: 36.6, 
    fatigue: 18, 
    lastUpdate: '4 min ago',
    alerts: 0,
    city: 'Downtown',
    shift: 'Afternoon'
  },
  { 
    id: 'D-1287', 
    name: 'Robert Kim', 
    riskScore: 18, 
    severity: 'normal', 
    heartRate: 68, 
    temperature: 36.4, 
    fatigue: 12, 
    lastUpdate: '6 min ago',
    alerts: 0,
    city: 'Westside',
    shift: 'Evening'
  },
];

// Vitals timeline data (hourly tracking)
const vitalsTimeline = [
  { time: '6 AM', heartRate: 72, temperature: 36.5, fatigue: 15, riskScore: 20 },
  { time: '7 AM', heartRate: 78, temperature: 36.6, fatigue: 18, riskScore: 22 },
  { time: '8 AM', heartRate: 82, temperature: 36.8, fatigue: 25, riskScore: 28 },
  { time: '9 AM', heartRate: 88, temperature: 37.1, fatigue: 35, riskScore: 38 },
  { time: '10 AM', heartRate: 95, temperature: 37.5, fatigue: 45, riskScore: 48 },
  { time: '11 AM', heartRate: 102, temperature: 37.9, fatigue: 58, riskScore: 62 },
  { time: '12 PM', heartRate: 108, temperature: 38.2, fatigue: 68, riskScore: 72 },
  { time: '1 PM', heartRate: 115, temperature: 38.6, fatigue: 75, riskScore: 78 },
  { time: '2 PM', heartRate: 122, temperature: 38.9, fatigue: 82, riskScore: 82 },
  { time: '3 PM', heartRate: 128, temperature: 39.1, fatigue: 88, riskScore: 85 },
];

// Incident correlation data
const incidentTrends = [
  { month: 'Jan', incidents: 8, avgRiskScore: 42, heatRelated: 2, fatigueRelated: 4, other: 2 },
  { month: 'Feb', incidents: 6, avgRiskScore: 38, heatRelated: 1, fatigueRelated: 3, other: 2 },
  { month: 'Mar', incidents: 12, avgRiskScore: 55, heatRelated: 5, fatigueRelated: 5, other: 2 },
  { month: 'Apr', incidents: 15, avgRiskScore: 62, heatRelated: 7, fatigueRelated: 6, other: 2 },
  { month: 'May', incidents: 18, avgRiskScore: 68, heatRelated: 9, fatigueRelated: 7, other: 2 },
  { month: 'Jun', incidents: 22, avgRiskScore: 72, heatRelated: 12, fatigueRelated: 8, other: 2 },
];

// Health alerts feed
const healthAlerts = [
  {
    id: 1,
    driverId: 'D-1023',
    driverName: 'Michael Chen',
    type: 'critical',
    message: 'Heart rate elevated above 140 bpm for 15 minutes',
    timestamp: '2 min ago',
    action: 'Emergency rest break recommended'
  },
  {
    id: 2,
    driverId: 'D-1023',
    driverName: 'Michael Chen',
    type: 'critical',
    message: 'Body temperature 39.2°C - Heat stress detected',
    timestamp: '2 min ago',
    action: 'Immediate cooling and hydration required'
  },
  {
    id: 3,
    driverId: 'D-1045',
    driverName: 'Sarah Johnson',
    type: 'high',
    message: 'Fatigue score 65% - Cognitive impairment risk',
    timestamp: '5 min ago',
    action: '20-minute break scheduled'
  },
  {
    id: 4,
    driverId: 'D-1089',
    driverName: 'David Park',
    type: 'medium',
    message: 'Temperature trending upward - Monitor closely',
    timestamp: '8 min ago',
    action: 'Next break in 45 minutes'
  },
  {
    id: 5,
    driverId: 'D-1045',
    driverName: 'Sarah Johnson',
    type: 'high',
    message: 'Heart rate variability decreased - Stress indicator',
    timestamp: '12 min ago',
    action: 'Workload reduction suggested'
  },
];

// Wearable integration status
const wearableStatus = [
  { device: 'Heart Rate Monitors', active: 142, total: 156, status: 'Operational', battery: 87 },
  { device: 'Temperature Sensors', active: 138, total: 156, status: 'Operational', battery: 82 },
  { device: 'GPS Trackers', active: 156, total: 156, status: 'Fully Active', battery: 91 },
  { device: 'Fatigue Detection', active: 145, total: 156, status: 'Operational', battery: 78 },
];

// RF model feature importance (for health risk prediction)
const healthFeatures = [
  { feature: 'Heart Rate', importance: 92, value: 'Current: 128 bpm' },
  { feature: 'Temperature', importance: 88, value: 'Current: 39.1°C' },
  { feature: 'Fatigue Score', importance: 85, value: 'Current: 88%' },
  { feature: 'Time in Heat', importance: 78, value: 'Current: 3.2 hrs' },
  { feature: 'Hydration', importance: 65, value: 'Last: 45 min ago' },
  { feature: 'Work Duration', importance: 58, value: 'Current: 7.5 hrs' },
];

export default function HealthSafetyPage() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  // Filter drivers based on selections
  const filteredDrivers = driverHealthData.filter(driver => {
    if (selectedCity !== 'all' && driver.city !== selectedCity) return false;
    if (selectedShift !== 'all' && driver.shift !== selectedShift) return false;
    if (selectedSeverity !== 'all' && driver.severity !== selectedSeverity) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      default: return 'text-green-500 bg-green-500/10 border-green-500/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  // Calculate summary metrics
  const criticalDrivers = filteredDrivers.filter(d => d.severity === 'critical').length;
  const totalAlerts = filteredDrivers.reduce((sum, d) => sum + d.alerts, 0);
  const avgRiskScore = filteredDrivers.length > 0 
    ? (filteredDrivers.reduce((sum, d) => sum + d.riskScore, 0) / filteredDrivers.length).toFixed(1)
    : '0';
  const activeWearables = 142;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Health & Safety Console</h1>
              <p className="text-sm text-gray-400">RF-based health risk monitoring and wearable vitals tracking</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors text-sm">
            Export Health Report
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:opacity-90 transition-opacity text-sm">
            Configure Thresholds
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
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
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="all">All Cities</option>
          <option value="Downtown">Downtown</option>
          <option value="Westside">Westside</option>
          <option value="Eastside">Eastside</option>
          <option value="Northside">Northside</option>
        </select>
        <select 
          value={selectedShift}
          onChange={(e) => setSelectedShift(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="all">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
        <select 
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="all">All Severity Levels</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-pink-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Critical Drivers</p>
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{criticalDrivers}</p>
          <p className="text-xs text-red-400">Require immediate attention</p>
        </div>

        <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Active Alerts</p>
            <Bell className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{totalAlerts}</p>
          <p className="text-xs text-orange-400">Real-time health warnings</p>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Avg Risk Score</p>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{avgRiskScore}</p>
          <p className="text-xs text-purple-400">RF model prediction</p>
        </div>

        <div className="rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Active Wearables</p>
            <HeartPulse className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{activeWearables}/156</p>
          <p className="text-xs text-green-400">91% connectivity rate</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver Health Risk List */}
        <div className="lg:col-span-2 rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Driver Health Status</h2>
          <div className="space-y-3">
            {filteredDrivers.map((driver) => (
              <div 
                key={driver.id}
                className={`rounded-lg border p-4 ${getSeverityColor(driver.severity)} hover:bg-white/5 transition-colors cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{driver.name}</p>
                      <p className="text-xs text-gray-400">{driver.id} • {driver.city} • {driver.shift}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{driver.riskScore}</p>
                    <p className="text-xs uppercase font-semibold">{driver.severity}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Heart Rate</p>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span className="font-semibold">{driver.heartRate} bpm</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Temperature</p>
                    <div className="flex items-center gap-1">
                      <ThermometerSun className="w-3 h-3" />
                      <span className="font-semibold">{driver.temperature}°C</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Fatigue</p>
                    <div className="flex items-center gap-1">
                      <Wind className="w-3 h-3" />
                      <span className="font-semibold">{driver.fatigue}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Alerts</p>
                    <div className="flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      <span className="font-semibold">{driver.alerts}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-current/20">
                  <p className="text-xs text-gray-400">Last updated: {driver.lastUpdate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Alerts Feed */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Live Alerts</h2>
            <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
              {healthAlerts.length} Active
            </span>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {healthAlerts.map((alert) => (
              <div 
                key={alert.id}
                className="rounded-lg border border-gray-700 bg-gray-900/50 p-4 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">{alert.message}</p>
                    <p className="text-xs text-gray-400 mb-2">{alert.driverName} ({alert.driverId})</p>
                    <div className="rounded-md bg-blue-500/10 border border-blue-500/30 p-2 mb-2">
                      <p className="text-xs text-blue-400">
                        <strong>Action:</strong> {alert.action}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vitals Timeline Chart */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Real-time Vitals Timeline (Hourly)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={vitalsTimeline}>
            <defs>
              <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
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
              dataKey="heartRate" 
              stroke="#ef4444" 
              fill="url(#heartRateGradient)"
              name="Heart Rate (bpm)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="temperature" 
              stroke="#f97316" 
              strokeWidth={2}
              name="Temperature (°C)"
              dot={{ fill: '#f97316', r: 4 }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="riskScore" 
              stroke="#a855f7" 
              strokeWidth={3}
              name="Risk Score"
              dot={{ fill: '#a855f7', r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Incident Trends & Wearable Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Correlation */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Health Incident Trends (6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incidentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="heatRelated" stackId="a" fill="#f97316" name="Heat-Related" />
              <Bar dataKey="fatigueRelated" stackId="a" fill="#eab308" name="Fatigue-Related" />
              <Bar dataKey="other" stackId="a" fill="#6b7280" name="Other" />
              <Line 
                type="monotone" 
                dataKey="avgRiskScore" 
                stroke="#a855f7" 
                strokeWidth={3}
                name="Avg Risk Score"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-orange-400">36</p>
              <p className="text-xs text-gray-400">Heat Incidents</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">33</p>
              <p className="text-xs text-gray-400">Fatigue Incidents</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">+18%</p>
              <p className="text-xs text-gray-400">Month-over-Month</p>
            </div>
          </div>
        </div>

        {/* Wearable Integration Status */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Wearable Device Status</h2>
          <div className="space-y-4">
            {wearableStatus.map((device, index) => (
              <div key={index} className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">{device.device}</p>
                    <p className="text-xs text-gray-400">{device.active}/{device.total} Active</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.status === 'Fully Active' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-sm font-semibold text-white">{device.status}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Coverage</span>
                    <span className="text-white font-semibold">
                      {((device.active / device.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                      style={{ width: `${(device.active / device.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-gray-400">Battery Avg</span>
                    <span className="text-white font-semibold">{device.battery}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full"
                      style={{ width: `${device.battery}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RF Model Feature Importance */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">RF Model Feature Importance (Health Risk Prediction)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthFeatures.map((feature, index) => (
            <div key={index} className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-white">{feature.feature}</p>
                <span className="text-purple-400 font-bold">{feature.importance}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                  style={{ width: `${feature.importance}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{feature.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
