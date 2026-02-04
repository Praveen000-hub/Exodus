'use client';

import { useState, useEffect } from 'react';
import { assignmentsApi } from '@/lib/api';
import type { Assignment } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, MapPin, Play, RefreshCw, Download } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadAssignments();
  }, [selectedDate]);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const data = await assignmentsApi.getAssignments({ date: selectedDate });
      setAssignments(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAssignments = async () => {
    try {
      setIsGenerating(true);
      await assignmentsApi.generateAssignments(selectedDate);
      // Poll for status
      await loadAssignments();
    } catch (error) {
      console.error('Error generating assignments:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === 'completed').length,
    inProgress: assignments.filter(a => a.status === 'in_progress').length,
    pending: assignments.filter(a => a.status === 'assigned').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Route Assignments</h1>
          <p className="text-gray-600 mt-1">AI-optimized delivery assignments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateAssignments}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Generate Assignments
              </>
            )}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Date Selector & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Date Picker */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <Card>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No assignments for this date</p>
            <button
              onClick={handleGenerateAssignments}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Generate assignments for {selectedDate}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{assignment.driver_name || `Driver ${assignment.driver_id}`}</h3>
                      <Badge status={assignment.status}>{assignment.status}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>Date: {assignment.date}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Packages: </span>
                        <span className="font-medium text-gray-900">
                          {formatNumber(assignment.total_packages)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Difficulty: </span>
                        <span className="font-medium text-gray-900">
                          {assignment.difficulty_score?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Expected Time: </span>
                        <span className="font-medium text-gray-900">
                          {(assignment.estimated_time / 60).toFixed(1)}h
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Distance: </span>
                        <span className="font-medium text-gray-900">
                          {assignment.total_distance?.toFixed(1)} km
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Earnings: </span>
                        <span className="font-medium text-gray-900">
                          ${assignment.earnings?.toFixed(2) || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="text-2xl font-bold text-green-600">
                      {assignment.difficulty_score?.toFixed(0) || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
