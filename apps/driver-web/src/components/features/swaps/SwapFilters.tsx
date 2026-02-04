'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  TrendingUp, 
  Timer, 
  Filter,
  RefreshCw,
  Zap
} from 'lucide-react';

interface SwapFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  swapCounts: {
    all: number;
    urgent: number;
    beneficial: number;
    expiring: number;
  };
}

export function SwapFilters({ 
  activeFilter, 
  onFilterChange, 
  onRefresh, 
  isRefreshing, 
  swapCounts 
}: SwapFiltersProps) {
  const filters = [
    {
      id: 'all',
      label: 'All Swaps',
      icon: Filter,
      count: swapCounts.all,
      color: 'default'
    },
    {
      id: 'urgent',
      label: 'Urgent',
      icon: AlertCircle,
      count: swapCounts.urgent,
      color: 'destructive'
    },
    {
      id: 'beneficial',
      label: 'Easier',
      icon: TrendingUp,
      count: swapCounts.beneficial,
      color: 'secondary'
    },
    {
      id: 'expiring',
      label: 'Expiring',
      icon: Timer,
      count: swapCounts.expiring,
      color: 'outline'
    }
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(filter.id)}
              className={`relative hover-lift ${isActive ? 'shadow-md' : ''}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {filter.label}
              {filter.count > 0 && (
                <Badge 
                  className={`ml-2 text-xs ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : filter.id === 'urgent' 
                        ? 'bg-orange-100 text-orange-700'
                        : filter.id === 'beneficial'
                          ? 'bg-orange-100 text-orange-700'
                          : filter.id === 'expiring'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {filter.count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-caption text-black/60">
          <Zap className="w-4 h-4 text-orange-500" />
          <span>AI-powered matching</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="hover-lift"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
}