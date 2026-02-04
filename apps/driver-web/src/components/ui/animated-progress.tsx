'use client';

import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface AnimatedProgressProps {
  value: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedProgress({
  value,
  variant = 'default',
  size = 'md',
  showValue = false,
  duration = 1000,
  delay = 0,
  className = ''
}: AnimatedProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className={`fade-in-up ${className}`}>
      <Progress
        value={animatedValue}
        variant={variant}
        size={size}
        showValue={showValue}
        className="progress-animated"
        style={{
          transition: `all ${duration}ms ease-out`
        }}
      />
    </div>
  );
}