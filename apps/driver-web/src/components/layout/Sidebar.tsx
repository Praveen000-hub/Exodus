'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="text-white font-bold text-sm">F</span>
          </motion.div>
          <span className="text-lg font-semibold text-black">FaIr_AI</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative overflow-hidden group',
                  isActive
                    ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
                    : 'text-black/70 hover:bg-orange-50 hover:text-orange-600'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-100/0 via-orange-100/50 to-orange-100/0 -z-10"
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
                
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <item.icon className="w-5 h-5 relative z-10" />
                </motion.div>
                <span className="relative z-10">{item.name}</span>
                
                {/* Ripple effect on click */}
                {isActive && (
                  <motion.div
                    className="absolute right-2 w-1.5 h-1.5 bg-orange-600 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Driver Info */}
      <motion.div 
        className="p-4 border-t border-orange-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.div 
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div 
            className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <User className="w-5 h-5 text-orange-600" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black truncate">
              Rajesh Kumar
            </p>
            <p className="text-xs text-black/60 truncate">
              Driver ID: #123
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}