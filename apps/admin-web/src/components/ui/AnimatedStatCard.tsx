import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TrendIndicator } from './TrendIndicator';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface AnimatedStatCardProps {
  title: string;
  value: number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  format?: 'number' | 'currency' | 'percentage';
  subtitle?: string;
  loading?: boolean;
}

export function AnimatedStatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
  format = 'number',
  subtitle,
  loading = false,
}: AnimatedStatCardProps) {
  const formatValue = () => {
    if (loading) return '---';
    if (value === undefined || value === null || isNaN(value)) {
      return format === 'currency' ? '$0' : format === 'percentage' ? '0%' : '0';
    }
    
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return formatNumber(value);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
              {formatValue()}
            </h3>
            {change !== undefined && !loading && (
              <TrendIndicator value={change} />
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      
      {/* Mini sparkline placeholder */}
      <div className="h-8 flex items-end gap-0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 bg-gradient-to-t ${iconBgColor} rounded-t opacity-40 group-hover:opacity-60 transition-opacity`}
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
    </div>
  );
}
