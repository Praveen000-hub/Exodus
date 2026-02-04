'use client';

import { useState, useEffect } from 'react';
import { driversApi } from '@/lib/api';
import type { Driver } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  Users, 
  Search, 
  Filter, 
  Grid, 
  List, 
  UserPlus,
  Phone,
  Mail,
  Calendar,
  Activity,
  ChevronRight,
  MapPin,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { formatDate, getRiskColor } from '@/lib/utils';

type ViewMode = 'grid' | 'table' | 'cards';
type SortField = 'name' | 'fitness' | 'status' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchDrivers();
  }, [statusFilter, sortField, sortOrder]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await driversApi.getDrivers({
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      const driversList = Array.isArray(data) ? data : data.data || [];
      
      // Sort drivers
      const sorted = [...driversList].sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'fitness':
            comparison = a.fitness - b.fitness;
            break;
          case 'created_at':
            comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      
      setDrivers(sorted);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'suspended': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFitnessLevel = (fitness: number) => {
    if (fitness >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (fitness >= 60) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (fitness >= 40) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-green-600" />
            Drivers
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all delivery drivers
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <Link
            href="/drivers/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Driver
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={`${sortField}_${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('_');
              setSortField(field as SortField);
              setSortOrder(order as SortOrder);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="fitness_desc">Fitness (High-Low)</option>
            <option value="fitness_asc">Fitness (Low-High)</option>
            <option value="created_at_desc">Newest First</option>
            <option value="created_at_asc">Oldest First</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded ${viewMode === 'cards' ? 'bg-white shadow' : 'text-gray-600'}`}
              title="Card View"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-white shadow' : 'text-gray-600'}`}
              title="Table View"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {filteredDrivers.length === 0 && !loading && (
        <EmptyState
          icon={Users}
          title="No drivers found"
          description={searchTerm ? "Try adjusting your search criteria" : "Get started by adding your first driver"}
          action={!searchTerm ? {
            label: "Add Driver",
            onClick: () => window.location.href = '/drivers/new'
          } : undefined}
        />
      )}

      {/* Cards View */}
      {viewMode === 'cards' && filteredDrivers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => {
            const fitnessLevel = getFitnessLevel(driver.fitness);
            return (
              <Link
                key={driver.id}
                href={`/drivers/${driver.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                          {driver.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(driver.status)}`}>
                            {driver.status}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>

                    {/* Fitness Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Fitness Score</span>
                        <span className={`text-sm font-semibold ${fitnessLevel.color}`}>
                          {fitnessLevel.label}
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`absolute h-full transition-all duration-500 ${
                            driver.fitness >= 80 ? 'bg-green-500' :
                            driver.fitness >= 60 ? 'bg-blue-500' :
                            driver.fitness >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${driver.fitness}%` }}
                        />
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-xs font-medium text-gray-600">{driver.fitness}%</span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-gray-600 flex-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{driver.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Joined {formatDate(driver.created_at, 'short')}</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                      <button className="flex-1 text-sm py-2 px-3 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors flex items-center justify-center gap-1">
                        <Activity className="h-4 w-4" />
                        View Stats
                      </button>
                      <button className="flex-1 text-sm py-2 px-3 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Track
                      </button>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredDrivers.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fitness
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrivers.map((driver) => {
                  const fitnessLevel = getFitnessLevel(driver.fitness);
                  return (
                    <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                            <div className="text-sm text-gray-500">ID: {driver.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{driver.email}</div>
                        <div className="text-sm text-gray-500">{driver.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(driver.status)}`}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px]">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  driver.fitness >= 80 ? 'bg-green-500' :
                                  driver.fitness >= 60 ? 'bg-blue-500' :
                                  driver.fitness >= 40 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${driver.fitness}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{driver.fitness}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(driver.created_at, 'short')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/drivers/${driver.id}`}
                          className="text-green-600 hover:text-green-900"
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
        </Card>
      )}
    </div>
  );
}
