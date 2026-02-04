'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, Car, Award, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const driverInfo = {
    name: 'Rajesh Kumar',
    phone: '9876543210',
    email: 'rajesh@example.com',
    driverId: 'DR123',
    vehicleType: 'Bike',
    vehicleNumber: 'KA01AB1234',
    experience: '3.5 years',
    joinDate: '2022-08-15',
    rating: 4.8,
    totalDeliveries: 2847
  };

  return (
    <MainLayout title="Profile" subtitle="Your driver information and statistics">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Info */}
        <Card className="fairai-card">
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">{driverInfo.name}</h2>
                <p className="text-black/60">Driver ID: {driverInfo.driverId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-sm text-black/60">Phone</div>
                    <div className="font-medium text-black">{driverInfo.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-sm text-black/60">Email</div>
                    <div className="font-medium text-black">{driverInfo.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-sm text-black/60">Vehicle</div>
                    <div className="font-medium text-black">{driverInfo.vehicleType} - {driverInfo.vehicleNumber}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-sm text-black/60">Experience</div>
                    <div className="font-medium text-black">{driverInfo.experience}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-sm text-black/60">Rating</div>
                    <div className="font-medium text-black">{driverInfo.rating}/5.0</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-sm text-black/60">Total Deliveries</div>
                    <div className="font-medium text-black">{driverInfo.totalDeliveries.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-orange-100">
              <Button className="fairai-button-primary">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}