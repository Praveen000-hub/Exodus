import React from 'react';

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="animate-pulse space-y-3">
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-8 w-32" />
        <LoadingSkeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center py-4">
          <LoadingSkeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
          <LoadingSkeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="h-80 flex items-end gap-2 px-4">
      {Array.from({ length: 12 }).map((_, i) => {
        const height = Math.random() * 60 + 40;
        return (
          <div 
            key={i} 
            className="flex-1 animate-pulse bg-gray-200 rounded"
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}
