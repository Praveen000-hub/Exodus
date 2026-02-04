'use client';

import { useState, useEffect } from 'react';
import { swapsApi } from '@/lib/api';
import type { SwapProposal } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeftRight, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { formatDate, formatRelativeTime, formatCurrency } from '@/lib/utils';

export default function SwapsPage() {
  const [swaps, setSwaps] = useState<SwapProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'expired'>('all');

  useEffect(() => {
    loadSwaps();
    // Refresh every 30 seconds
    const interval = setInterval(loadSwaps, 30000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const loadSwaps = async () => {
    try {
      setIsLoading(true);
      const data = await swapsApi.getSwaps({
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setSwaps(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error loading swaps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSwap = async (swapId: number) => {
    try {
      await swapsApi.cancelSwap(swapId, 'Cancelled by admin');
      await loadSwaps();
    } catch (error) {
      console.error('Error cancelling swap:', error);
    }
  };

  const stats = {
    total: swaps.length,
    pending: swaps.filter(s => s.status === 'pending').length,
    accepted: swaps.filter(s => s.status === 'accepted').length,
    rejected: swaps.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Route Swaps</h1>
        <p className="text-gray-600 mt-1">Marketplace for voluntary route exchanges</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Proposals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ArrowLeftRight className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
            </div>
            <ArrowLeftRight className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <ArrowLeftRight className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Swaps List */}
      <Card>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-600">Loading swaps...</p>
          </div>
        ) : swaps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No swap proposals found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {swaps.map((swap) => (
              <div
                key={swap.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Swap #{swap.id}</h3>
                    <Badge status={swap.status}>{swap.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatRelativeTime(swap.created_at)}
                  </p>
                </div>

                {/* Driver Exchange */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium mb-1">From Driver</p>
                    <p className="font-semibold text-gray-900">
                      {swap.from_driver_name || `Driver ${swap.from_driver_id}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">ID: {swap.from_driver_id}</p>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowLeftRight className="h-6 w-6 text-gray-400" />
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium mb-1">To Driver</p>
                    <p className="font-semibold text-gray-900">
                      {swap.to_driver_name || `Driver ${swap.to_driver_id}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">ID: {swap.to_driver_id}</p>
                  </div>
                </div>

                {/* Swap Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Benefit Score: </span>
                    <span className="font-medium text-gray-900">
                      {swap.benefit_score.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Reason: </span>
                    <span className="font-medium text-gray-900 capitalize">
                      {swap.reason}
                    </span>
                  </div>
                  {swap.expires_at && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Expires: </span>
                      <span className="font-medium text-gray-900">
                        {formatRelativeTime(swap.expires_at)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {swap.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleCancelSwap(swap.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      Cancel Swap
                    </button>
                  </div>
                )}

                {swap.status === 'rejected' && (
                  <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Swap Rejected</p>
                      <p className="text-sm text-red-700 mt-1">
                        {swap.responded_at ? `Rejected on ${formatDate(swap.responded_at)}` : 'Rejected'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
