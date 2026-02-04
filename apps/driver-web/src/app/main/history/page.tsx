'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Package, Clock, CheckCircle } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

const mockHistory = [
  {
    date: '2026-02-03',
    packages: 12,
    earnings: 480,
    bonus: 50,
    status: 'completed'
  },
  {
    date: '2026-02-02',
    packages: 9,
    earnings: 360,
    bonus: 25,
    status: 'completed'
  },
  {
    date: '2026-02-01',
    packages: 11,
    earnings: 440,
    bonus: 0,
    status: 'completed'
  }
];

export default function HistoryPage() {
  return (
    <MainLayout title="Delivery History" subtitle="Your past assignments and earnings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="fairai-card">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="fairai-metric-value">32</div>
              <div className="fairai-metric">Total Packages (7 days)</div>
            </CardContent>
          </Card>

          <Card className="fairai-card">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="fairai-metric-value">98%</div>
              <div className="fairai-metric">Success Rate</div>
            </CardContent>
          </Card>

          <Card className="fairai-card">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="fairai-metric-value">{formatCurrency(1280)}</div>
              <div className="fairai-metric">Total Earnings (7 days)</div>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <Card className="fairai-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-orange-500" />
              Recent Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockHistory.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-black">{formatDate(day.date)}</div>
                    <div className="text-sm text-black/60">{day.packages} packages delivered</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-black">{formatCurrency(day.earnings)}</div>
                  {day.bonus > 0 && (
                    <div className="text-sm text-green-600">+{formatCurrency(day.bonus)} bonus</div>
                  )}
                  <Badge variant="secondary" className="mt-1">
                    {day.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}