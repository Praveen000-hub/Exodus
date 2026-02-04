'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, Package } from 'lucide-react';

export default function TrackingPage() {
  return (
    <MainLayout title="Live Tracking" subtitle="Real-time delivery progress">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Current Status */}
        <Card className="fairai-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Status</CardTitle>
              <Badge variant="live" className="fairai-live-badge">
                <div className="fairai-live-dot" />
                LIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <Package className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className="fairai-metric-value">3/10</div>
                <div className="fairai-metric">Delivered</div>
              </div>
              <div>
                <MapPin className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className="fairai-metric-value">12.3 km</div>
                <div className="fairai-metric">Covered</div>
              </div>
              <div>
                <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className="fairai-metric-value">2.5h</div>
                <div className="fairai-metric">Active</div>
              </div>
              <div>
                <Navigation className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className="fairai-metric-value">25 km/h</div>
                <div className="fairai-metric">Speed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="fairai-card">
          <CardContent className="p-0">
            <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-black/20 mx-auto mb-4" />
                <p className="text-black/60">Interactive map will be integrated here</p>
                <p className="text-sm text-black/40">Google Maps API integration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}