'use client';

import { useState, useEffect } from 'react';
import { driverApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeftRight, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface SwapProposal {
  id: number;
  from_driver_name?: string;
  to_driver_name?: string;
  date: string;
  reason: string;
  benefit_score: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  expires_at: string;
}

export default function SwapsPage() {
  const [swaps, setSwaps] = useState<SwapProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSwaps();
  }, []);

  const loadSwaps = async () => {
    try {
      setIsLoading(true);
      const data = await driverApi.getSwaps();
      setSwaps(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error('Error loading swaps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (swapId: number) => {
    try {
      await driverApi.acceptSwap(swapId);
      await loadSwaps();
    } catch (error) {
      console.error('Error accepting swap:', error);
    }
  };

  const handleReject = async (swapId: number) => {
    try {
      await driverApi.rejectSwap(swapId);
      await loadSwaps();
    } catch (error) {
      console.error('Error rejecting swap:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Route Swaps</h1>
        <p className="text-gray-600 mt-1">Manage route swap proposals</p>
      </div>

      {swaps.length === 0 ? (
        <Card className="p-12 text-center">
          <ArrowLeftRight className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">No Swap Proposals</h2>
          <p className="text-gray-600 mt-2">Check back later for route swap opportunities</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {swaps.map((swap) => (
            <Card key={swap.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">Swap Proposal #{swap.id}</h3>
                  <Badge status={swap.status}>{swap.status}</Badge>
                </div>
                <p className="text-sm text-gray-500">{formatRelativeTime(swap.created_at)}</p>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {new Date(swap.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Reason:</span> {swap.reason}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Benefit Score:</span> {swap.benefit_score.toFixed(1)}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Expires: {formatRelativeTime(swap.expires_at)}</span>
                </div>
              </div>

              {swap.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(swap.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Accept Swap
                  </button>
                  <button
                    onClick={() => handleReject(swap.id)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
