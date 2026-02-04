'use client';

import React from 'react';
import { useCountUp } from '@/hooks/useStaggeredAnimation';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trigger?: boolean;
}

export function AnimatedCounter({ 
  value, 
  duration = 1000, 
  className = '', 
  prefix = '', 
  suffix = '',
  decimals = 0,
  trigger = true
}: AnimatedCounterProps) {
  const count = useCountUp(value, duration, 0, trigger);
  
  const formatValue = (num: number) => {
    if (decimals > 0) {
      return (num / Math.pow(10, decimals)).toFixed(decimals);
    }
    return num.toString();
  };

  return (
    <span className={`count-up ${className}`}>
      {prefix}{formatValue(count)}{suffix}
    </span>
  );
}