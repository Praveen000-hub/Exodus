'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  ArrowLeftRight, 
  MapPin, 
  BarChart3, 
  History, 
  CloudSun, 
  User, 
  Settings,
  Eye
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/main', icon: Home },
  { name: 'Shadow AI', href: '/main/shadow-ai', icon: Eye },
  { name: 'Swap', href: '/main/swap', icon: ArrowLeftRight },
  { name: 'Tracking', href: '/main/tracking', icon: MapPin },
  { name: 'Summary', href: '/main/summary', icon: BarChart3 },
  { name: 'History', href: '/main/history', icon: History },
  { name: 'Forecast AI', href: '/main/forecast-ai', icon: CloudSun },
  { name: 'Profile', href: '/main/profile', icon: User },
  { name: 'Settings', href: '/main/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-orange-100">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-orange-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-lg font-semibold text-black">FaIr_AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-black/70 hover:bg-orange-50 hover:text-orange-600'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Driver Info */}
      <div className="p-4 border-t border-orange-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black truncate">
              Rajesh Kumar
            </p>
            <p className="text-xs text-black/60 truncate">
              Driver ID: #123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}