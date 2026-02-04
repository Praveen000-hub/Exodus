'use client';

import { useState } from 'react';
import { 
  FileSearch, 
  Download, 
  Search, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  FileText,
  Calendar,
  User,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
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

// Mock data: SHAP feature importance for different assignments
const shapFeatures = [
  { feature: 'Package Weight', importance: 0.28, direction: 'positive', value: '45 kg' },
  { feature: 'Distance', importance: 0.24, direction: 'positive', value: '18.5 km' },
  { feature: 'Delivery Floors', importance: 0.18, direction: 'positive', value: '8 floors' },
  { feature: 'Traffic Conditions', importance: 0.15, direction: 'positive', value: 'Heavy (85%)' },
  { feature: 'Driver Experience', importance: -0.12, direction: 'negative', value: '3.5 years' },
  { feature: 'Time of Day', importance: 0.08, direction: 'positive', value: 'Peak (2 PM)' },
  { feature: 'Weather', importance: 0.05, direction: 'positive', value: 'Rain' },
  { feature: 'Zone Familiarity', importance: -0.04, direction: 'negative', value: 'High (92%)' },
];

// Audit trail data
const auditLog = [
  {
    id: 'AUD-2847',
    timestamp: '2024-01-15 14:23:45',
    action: 'Assignment Created',
    driver: 'Michael Chen (D-1023)',
    assignment: 'ASG-8472',
    model: 'XGBoost Difficulty',
    difficultyScore: 78,
    reason: 'High weight (45kg) + Traffic (85%) + Floors (8)',
    status: 'Accepted',
    fairnessImpact: '+0.02 Gini'
  },
  {
    id: 'AUD-2846',
    timestamp: '2024-01-15 14:18:12',
    action: 'Fair Assignment Optimization',
    driver: 'All Drivers',
    assignment: 'Batch-142',
    model: 'PuLP Fairness',
    difficultyScore: null,
    reason: 'Gini coefficient reduced from 0.42 to 0.18',
    status: 'Completed',
    fairnessImpact: '-0.24 Gini'
  },
  {
    id: 'AUD-2845',
    timestamp: '2024-01-15 14:05:33',
    action: 'Health Alert Triggered',
    driver: 'Sarah Johnson (D-1045)',
    assignment: 'ASG-8468',
    model: 'RF Health Risk',
    difficultyScore: null,
    reason: 'Heart rate 142 bpm, Temperature 39.2°C',
    status: 'Emergency Break',
    fairnessImpact: 'N/A'
  },
  {
    id: 'AUD-2844',
    timestamp: '2024-01-15 13:52:18',
    action: 'Assignment Rejected',
    driver: 'David Park (D-1089)',
    assignment: 'ASG-8465',
    model: 'Shadow AI',
    difficultyScore: 92,
    reason: 'Exceeds max difficulty threshold (85)',
    status: 'Reassigned',
    fairnessImpact: '0.00 Gini'
  },
  {
    id: 'AUD-2843',
    timestamp: '2024-01-15 13:47:05',
    action: 'Break Recommended',
    driver: 'Emily White (D-1012)',
    assignment: null,
    model: 'Fatigue Monitor',
    difficultyScore: null,
    reason: 'Fatigue score 78% after 6.5 hours',
    status: 'Break Taken',
    fairnessImpact: 'N/A'
  },
];

// "Why this driver?" explanation data
const assignmentExplanation = {
  assignmentId: 'ASG-8472',
  packageId: 'PKG-15482',
  driverId: 'D-1023',
  driverName: 'Michael Chen',
  difficultyScore: 78,
  timestamp: '2024-01-15 14:23:45',
  destination: '1234 Market St, Downtown',
  distance: '18.5 km',
  predictedTime: '45 min',
  mainReasons: [
    'Driver has high experience level (3.5 years) suitable for difficult routes',
    'Current workload below fairness target (38 vs 65 assignments)',
    'Zone familiarity score 92% for Downtown area',
    'Available capacity during peak delivery window (2-4 PM)',
    'Health vitals within normal range (Heart Rate: 72 bpm)'
  ],
  modelContributions: [
    { model: 'XGBoost Difficulty', contribution: 35, explanation: 'Route difficulty assessment' },
    { model: 'PuLP Fairness', contribution: 30, explanation: 'Workload balancing optimization' },
    { model: 'RF Health Risk', contribution: 20, explanation: 'Driver health safety check' },
    { model: 'LSTM Forecast', contribution: 10, explanation: 'Capacity availability prediction' },
    { model: 'Fatigue Monitor', contribution: 5, explanation: 'Break compliance validation' }
  ]
};

// Downloadable audit reports
const auditReports = [
  {
    id: 'REP-2024-001',
    title: 'Weekly Assignment Fairness Report',
    period: 'Jan 8 - Jan 14, 2024',
    type: 'Fairness Analysis',
    size: '2.4 MB',
    status: 'Ready',
    created: '2024-01-15 09:00:00'
  },
  {
    id: 'REP-2024-002',
    title: 'Driver Health & Safety Audit',
    period: 'January 2024',
    type: 'Health Report',
    size: '1.8 MB',
    status: 'Ready',
    created: '2024-01-15 08:30:00'
  },
  {
    id: 'REP-2024-003',
    title: 'Model Performance Metrics',
    period: 'Q4 2023',
    type: 'ML Model Audit',
    size: '3.2 MB',
    status: 'Ready',
    created: '2024-01-10 14:00:00'
  },
  {
    id: 'REP-2024-004',
    title: 'Difficulty Distribution Analysis',
    period: 'December 2023',
    type: 'Difficulty Report',
    size: '1.5 MB',
    status: 'Ready',
    created: '2024-01-05 11:00:00'
  },
];

// Model decision breakdown
const modelDecisions = [
  { date: '2024-01-15', accepted: 142, rejected: 8, overridden: 3, total: 153 },
  { date: '2024-01-14', accepted: 138, rejected: 12, overridden: 5, total: 155 },
  { date: '2024-01-13', accepted: 145, rejected: 6, overridden: 2, total: 153 },
  { date: '2024-01-12', accepted: 140, rejected: 9, overridden: 4, total: 153 },
  { date: '2024-01-11', accepted: 135, rejected: 15, overridden: 6, total: 156 },
  { date: '2024-01-10', accepted: 148, rejected: 5, overridden: 1, total: 154 },
  { date: '2024-01-09', accepted: 141, rejected: 10, overridden: 3, total: 154 },
];

export default function ExplainabilityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('driver');
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedModel, setSelectedModel] = useState('all');

  // Filter audit log based on search
  const filteredAuditLog = auditLog.filter(entry => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.driver.toLowerCase().includes(query) ||
      entry.assignment?.toLowerCase().includes(query) ||
      entry.model.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
      case 'Completed':
        return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Emergency Break':
      case 'Rejected':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'Reassigned':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'Break Taken':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  // Calculate acceptance rate
  const totalDecisions = modelDecisions.reduce((sum, d) => sum + d.total, 0);
  const totalAccepted = modelDecisions.reduce((sum, d) => sum + d.accepted, 0);
  const acceptanceRate = ((totalAccepted / totalDecisions) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Explainability & Audit Page</h1>
              <p className="text-sm text-gray-100">SHAP feature importance, decision audit trails, and "why this driver?" explanations</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors text-sm">
            <Download className="w-4 h-4 inline mr-2" />
            Export Audit Log
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90 transition-opacity text-sm">
            Generate Report
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by driver, assignment, or model..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 text-sm"
          />
        </div>
        <select 
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="driver">By Driver</option>
          <option value="assignment">By Assignment</option>
          <option value="model">By Model</option>
          <option value="date">By Date</option>
        </select>
        <select 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="custom">Custom Range</option>
        </select>
        <select 
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white text-sm"
        >
          <option value="all">All Models</option>
          <option value="xgboost">XGBoost Difficulty</option>
          <option value="pulp">PuLP Fairness</option>
          <option value="rf">RF Health Risk</option>
          <option value="lstm">LSTM Forecast</option>
          <option value="fatigue">Fatigue Monitor</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Total Decisions</p>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{totalDecisions}</p>
          <p className="text-xs text-purple-400">Last 7 days</p>
        </div>

        <div className="rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Acceptance Rate</p>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{acceptanceRate}%</p>
          <p className="text-xs text-green-400">Model recommendations</p>
        </div>

        <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Audit Entries</p>
            <FileText className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{filteredAuditLog.length}</p>
          <p className="text-xs text-orange-400">Filtered results</p>
        </div>

        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-100">Reports Available</p>
            <Download className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{auditReports.length}</p>
          <p className="text-xs text-blue-400">Ready to download</p>
        </div>
      </div>

      {/* "Why This Driver?" Explanation Panel */}
      <div className="rounded-xl border border-gradient-to-r from-purple-500/30 to-pink-500/30 bg-gradient-to-br from-purple-500/10 to-pink-600/10 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-400" />
          Why {assignmentExplanation.driverName}? ({assignmentExplanation.assignmentId})
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignment Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-100 uppercase">Assignment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Package ID:</span>
                <span className="text-sm text-white font-mono">{assignmentExplanation.packageId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Difficulty Score:</span>
                <span className="text-sm text-white font-bold">{assignmentExplanation.difficultyScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Distance:</span>
                <span className="text-sm text-white">{assignmentExplanation.distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Est. Time:</span>
                <span className="text-sm text-white">{assignmentExplanation.predictedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Timestamp:</span>
                <span className="text-sm text-white">{assignmentExplanation.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Main Reasons */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-100 uppercase">Top Reasons</h3>
            <div className="space-y-2">
              {assignmentExplanation.mainReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-100">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Model Contributions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-100 uppercase">Model Contributions</h3>
            <div className="space-y-3">
              {assignmentExplanation.modelContributions.map((model, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-semibold">{model.model}</span>
                    <span className="text-purple-400 font-bold">{model.contribution}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                      style={{ width: `${model.contribution}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-100">{model.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Feature Importance & Model Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Feature Importance */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">SHAP Feature Importance (Assignment {assignmentExplanation.assignmentId})</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={shapFeatures} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis type="category" dataKey="feature" stroke="#9ca3af" width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                formatter={(value: any) => Math.abs(value).toFixed(2)}
              />
              <Legend />
              <Bar dataKey="importance" name="SHAP Value" radius={[0, 4, 4, 0]}>
                {shapFeatures.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.direction === 'positive' ? '#22c55e' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3">
              <p className="text-xs text-gray-100 mb-1">Positive Impact</p>
              <p className="text-sm text-green-400 font-semibold">Weight, Distance, Floors, Traffic</p>
            </div>
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
              <p className="text-xs text-gray-100 mb-1">Negative Impact</p>
              <p className="text-sm text-red-400 font-semibold">Experience, Familiarity</p>
            </div>
          </div>
        </div>

        {/* Model Decision Timeline */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Model Decision Breakdown (7 Days)</h2>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={modelDecisions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="accepted" stackId="a" fill="#22c55e" name="Accepted" radius={[0, 0, 0, 0]} />
              <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" radius={[0, 0, 0, 0]} />
              <Bar dataKey="overridden" stackId="a" fill="#f97316" name="Overridden" radius={[4, 4, 0, 0]} />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#a855f7" 
                strokeWidth={2}
                name="Total Decisions"
                dot={{ fill: '#a855f7', r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audit Trail Log */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Decision Audit Trail</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Audit ID</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Timestamp</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Action</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Driver</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Assignment</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Model</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Reason</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-200">Fairness Impact</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuditLog.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                  <td className="p-3 text-sm text-white font-mono">{entry.id}</td>
                  <td className="p-3 text-sm text-gray-100">{entry.timestamp}</td>
                  <td className="p-3 text-sm text-white font-semibold">{entry.action}</td>
                  <td className="p-3 text-sm text-gray-400">{entry.driver}</td>
                  <td className="p-3 text-sm text-white font-mono">{entry.assignment || 'N/A'}</td>
                  <td className="p-3 text-sm text-purple-400">{entry.model}</td>
                  <td className="p-3 text-sm text-gray-400 max-w-xs truncate">{entry.reason}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-400">{entry.fairnessImpact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Downloadable Reports */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Downloadable Audit Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {auditReports.map((report) => (
            <div key={report.id} className="rounded-lg border border-gray-700 bg-gray-900/50 p-4 hover:bg-gray-700/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{report.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{report.period}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                      {report.type}
                    </span>
                    <span className="text-gray-500">{report.size}</span>
                  </div>
                </div>
                <button className="px-3 py-1 rounded-md bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs hover:opacity-90 transition-opacity">
                  <Download className="w-3 h-3 inline mr-1" />
                  Download
                </button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Created: {report.created}</span>
                <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
                  {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
