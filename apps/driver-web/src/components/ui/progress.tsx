import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  pulse?: boolean;
  wave?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = 'default', size = 'md', showValue = false, animated = true, pulse = false, wave = false, ...props }, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'from-green-400 to-green-600';
      case 'warning':
        return 'from-yellow-400 to-yellow-600';
      case 'danger':
        return 'from-red-400 to-red-600';
      default:
        return 'from-orange-400 to-orange-600';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-6';
      default:
        return 'h-4';
    }
  };

  const getAnimationClasses = () => {
    const classes = [];
    if (animated) classes.push('progress-smooth');
    if (pulse) classes.push('progress-pulse');
    if (wave) classes.push('progress-wave');
    return classes.join(' ');
  };

  return (
    <div className="w-full">
      {showValue && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-caption">Progress</span>
          <span className="text-caption font-medium count-up">{value || 0}%</span>
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-gray-200",
          getSizeStyles(),
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 bg-gradient-to-r transition-all duration-700 ease-out",
            getVariantStyles(),
            getAnimationClasses()
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
        {wave && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent progress-wave" />
        )}
      </ProgressPrimitive.Root>
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };