'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Eye,
  ArrowLeftRight, 
  MapPin, 
  User,
  CloudSun
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/main', icon: Home },
  { name: 'Shadow AI', href: '/main/shadow-ai', icon: Eye },
  { name: 'Swap', href: '/main/swap', icon: ArrowLeftRight },
  { name: 'Forecast', href: '/main/forecast-ai', icon: CloudSun },
  { name: 'Profile', href: '/main/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-5 py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-orange-600'
              )}
            >
              <item.icon className={cn(
                'w-5 h-5 mb-1',
                isActive ? 'text-orange-600' : 'text-gray-400'
              )} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}