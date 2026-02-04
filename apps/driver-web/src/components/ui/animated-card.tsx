'use client';

import React from 'react';
import { Card, type CardProps } from '@/components/ui/card';
import { useScrollAnimation, useMouseParallax } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends CardProps {
  animation?: 'fade-up' | 'slide-left' | 'slide-right' | 'scale' | 'bounce' | 'float';
  delay?: number;
  parallax?: boolean;
  parallaxIntensity?: number;
  hover3d?: boolean;
}

export function AnimatedCard({ 
  children, 
  className, 
  animation = 'fade-up',
  delay = 0,
  parallax = false,
  parallaxIntensity = 0.1,
  hover3d = false,
  ...props 
}: AnimatedCardProps) {
  const [scrollRef, isVisible] = useScrollAnimation(0.1);
  const [parallaxRef, parallaxPosition] = useMouseParallax(parallaxIntensity);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0';
    
    switch (animation) {
      case 'slide-left':
        return 'slide-in-left';
      case 'slide-right':
        return 'slide-in-right';
      case 'scale':
        return 'scale-in';
      case 'bounce':
        return 'bounce-in';
      case 'float':
        return 'animate-float';
      default:
        return 'fade-in-up';
    }
  };

  const getHover3dStyle = () => {
    if (!hover3d || !parallax) return {};
    
    return {
      transform: `perspective(1000px) rotateX(${parallaxPosition.y * 0.1}deg) rotateY(${parallaxPosition.x * 0.1}deg) translateZ(0)`,
      transition: 'transform 0.1s ease-out',
    };
  };

  return (
    <Card
      ref={(el) => {
        scrollRef.current = el;
        if (parallax) parallaxRef.current = el;
      }}
      className={cn(
        'scroll-reveal gpu-accelerated',
        getAnimationClass(),
        hover3d && 'hover-3d',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        ...getHover3dStyle(),
      }}
      {...props}
    >
      {children}
    </Card>
  );
}