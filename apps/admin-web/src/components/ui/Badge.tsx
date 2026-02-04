import { cn, getStatusColor } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  status?: string;
  className?: string;
}

export function Badge({ children, variant = 'primary', status, className }: BadgeProps) {
  // If status is provided, use status-based coloring
  if (status) {
    const { bgClass, textClass } = getStatusColor(status);
    return (
      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', bgClass, textClass, className)}>
        {children}
      </span>
    );
  }

  // Otherwise use variant-based coloring
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    status: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClasses[variant], className)}>
      {children}
    </span>
  );
}
