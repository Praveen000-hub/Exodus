'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SummaryPage() {
  const todayStats = {
    packagesDelivered: 8,
    totalPackages: 10,
    timeWorked: 6.5,
    earnings: 420,
    bonus: 75,
    efficiency: 92
  };

  return (
    <MainLayout title="Today's Summary" subtitle="Your performance overview">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="fairai-card">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="fairai-metric-value">{todayStats.packagesDelivered}/{todayStats.totalPackages}</div>
              <div className="fairai-metric">Packages Delivered</div>
              <Badge variant="secondary" className="mt-2">
                {Math.round((todayStats.packagesDelivered / todayStats.totalPackages) * 100)}% Complete
              </Badge>
            </CardContent>
          </Card>

          <Card className="fairai-card">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="fairai-metric-value">{todayStats.timeWorked}h</div>
              <div className="fairai-metric">Time Worked</div>
              <Badge variant="secondary" className="mt-2">
                {todayStats.efficiency}% Efficiency
              </Badge>
            </CardContent>
          </Card>

          <Card className="fairai-card">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="fairai-metric-value">{formatCurrency(todayStats.earnings)}</div>
              <div className="fairai-metric">Total Earnings</div>
              <Badge variant="secondary" className="mt-2">
                +{formatCurrency(todayStats.bonus)} Bonus
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card className="fairai-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-black/20 mx-auto mb-4" />
                <p className="text-black/60">Performance charts will be integrated here</p>
                <p className="text-sm text-black/40">Recharts integration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}