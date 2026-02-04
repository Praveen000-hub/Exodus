import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  value: number;
  label?: string;
  inverse?: boolean; // If true, down is good
}

export function TrendIndicator({ value, label, inverse = false }: TrendIndicatorProps) {
  const isPositive = inverse ? value < 0 : value > 0;
  const isNeutral = value === 0;
  
  const color = isNeutral ? 'text-gray-500' : isPositive ? 'text-green-600' : 'text-red-600';
  const bg = isNeutral ? 'bg-gray-50' : isPositive ? 'bg-green-50' : 'bg-red-50';
  
  const Icon = isNeutral ? Minus : value > 0 ? TrendingUp : TrendingDown;
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${bg}`}>
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className={`text-xs font-semibold ${color}`}>
        {Math.abs(value).toFixed(1)}%
      </span>
      {label && <span className="text-xs text-gray-600 ml-1">{label}</span>}
    </div>
  );
}
