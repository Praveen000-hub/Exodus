'use client';

import React from 'react';
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';

interface StaggeredListProps {
  children: React.ReactNode[];
  delay?: number;
  className?: string;
  itemClassName?: string;
}

export function StaggeredList({ 
  children, 
  delay = 100, 
  className = '',
  itemClassName = ''
}: StaggeredListProps) {
  const visibleItems = useStaggeredAnimation(children.length, delay);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`${itemClassName} ${
            visibleItems.includes(index) 
              ? 'fade-in-up' 
              : 'opacity-0'
          }`}
          style={{
            animationDelay: `${index * delay}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}