import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'accepted' | 'rejected' | 'expired' | 'active' | 'inactive' | 'assigned' | 'in_progress' | 'completed' | string;
  className?: string;
}

export function Badge({ children, status = 'info', className = '' }: BadgeProps) {
  const getStatusStyles = () => {
    const statusMap: Record<string, string> = {
      success: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-orange-100 text-orange-700 border-orange-200',
      error: 'bg-red-100 text-red-700 border-red-200',
      info: 'bg-blue-100 text-blue-700 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      expired: 'bg-gray-100 text-gray-700 border-gray-200',
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      assigned: 'bg-blue-100 text-blue-700 border-blue-200',
      in_progress: 'bg-orange-100 text-orange-700 border-orange-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
    };

    return statusMap[status] || statusMap.info;
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()} ${className}`}
    >
      {children}
    </span>
  );
}
