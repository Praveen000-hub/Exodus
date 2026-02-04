'use client';

import { useState, useEffect } from 'react';
import { driverApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Package, MapPin, Clock, DollarSign } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface Assignment {
  id: number;
  date: string;
  total_packages: number;
  total_distance: number;
  estimated_time: number;
  earnings: number;
  difficulty_score: number;
  status: string;
  packages: Array<{
    id: number;
    delivery_address: string;
    weight: number;
    status: string;
  }>;
}

export default function AssignmentPage() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAssignment();
  }, []);

  const loadAssignment = async () => {
    try {
      setIsLoading(true);
      const data = await driverApi.getAssignment();
      setAssignment(data);
    } catch (error) {
      console.error('Error loading assignment:', error);
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

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">No Active Assignment</h2>
        <p className="text-gray-600 mt-2">Check back later for new assignments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Today's Assignment</h1>
        <p className="text-gray-600 mt-1">Your delivery route for {new Date(assignment.date).toLocaleDateString()}</p>
      </div>

      {/* Assignment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Packages</p>
              <p className="text-xl font-bold text-gray-900">{assignment.total_packages}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(assignment.total_distance)} km</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Est. Time</p>
              <p className="text-xl font-bold text-gray-900">{(assignment.estimated_time / 60).toFixed(1)}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Earnings</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(assignment.earnings)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Package List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Stops ({assignment.packages.length})</h2>
        <div className="space-y-3">
          {assignment.packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{pkg.delivery_address}</p>
                <p className="text-sm text-gray-600 mt-1">Weight: {pkg.weight} kg</p>
              </div>
              <Badge status={pkg.status}>{pkg.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
