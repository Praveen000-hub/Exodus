'use client';

import { useState, useEffect } from 'react';
import { driversApi } from '@/lib/api';
import type { Driver } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, Filter, Download, UserPlus } from 'lucide-react';
import { formatDate, getRiskColor } from '@/lib/utils';
import Link from 'next/link';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadDrivers();
  }, [statusFilter]);

  const loadDrivers = async () => {
    try {
      setIsLoading(true);
      const data = await driversApi.getDrivers({ 
        status: statusFilter === 'all' ? undefined : statusFilter 
      });
      setDrivers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.id.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage delivery drivers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <UserPlus className="h-5 w-5" />
          Add Driver
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>

          {/* Export */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </Card>

      {/* Drivers Table */}
      <Card>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-600">Loading drivers...</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No drivers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Driver</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Risk Level</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Tenure</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDrivers.map((driver) => {
                  const riskLevel = driver.fitness ? ((5 - driver.fitness) / 5) * 100 : 0;
                  const riskColor = getRiskColor(riskLevel);
                  return (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{driver.name}</p>
                          <p className="text-sm text-gray-500">ID: {driver.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="text-gray-900">{driver.phone}</p>
                          <p className="text-gray-500">{driver.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge status={driver.status}>{driver.status}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${riskColor.bgClass}`} />
                          <span className="text-sm font-medium text-gray-900">
                            {riskLevel.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(driver.created_at)}
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/drivers/${driver.id}`}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
