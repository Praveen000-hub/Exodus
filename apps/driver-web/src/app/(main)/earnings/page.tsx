'use client';

import { useState, useEffect } from 'react';
import { driverApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface EarningsData {
  total_today: number;
  total_week: number;
  total_month: number;
  average_per_package: number;
  recent_earnings: Array<{
    date: string;
    amount: number;
    packages: number;
  }>;
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      setIsLoading(true);
      const data = await driverApi.getEarnings();
      setEarnings(data);
    } catch (error) {
      console.error('Error loading earnings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load earnings data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600 mt-1">Track your earnings and performance</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            <p className="text-sm text-gray-600">Today</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(earnings.total_today)}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <p className="text-sm text-gray-600">This Week</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(earnings.total_week)}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <p className="text-sm text-gray-600">This Month</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(earnings.total_month)}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-6 w-6 text-orange-600" />
            <p className="text-sm text-gray-600">Avg per Package</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(earnings.average_per_package)}</p>
        </Card>
      </div>

      {/* Recent Earnings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Earnings</h2>
        <div className="space-y-3">
          {earnings.recent_earnings.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{formatDate(day.date)}</p>
                <p className="text-sm text-gray-600 mt-1">{day.packages} packages delivered</p>
              </div>
              <p className="text-xl font-bold text-green-600">{formatCurrency(day.amount)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
