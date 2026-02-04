'use client';

import React from 'react';
import { Bell, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [currentTime, setCurrentTime] = React.useState<Date | null>(null);
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    // Set initial time only on client
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-orange-100 flex items-center justify-between px-6">
      {/* Title Section */}
      <div>
        <h1 className="text-xl font-semibold text-black">{title}</h1>
        {subtitle && (
          <p className="text-sm text-black/60">{subtitle}</p>
        )}
      </div>

      {/* Status Section */}
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-orange-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-orange-600" />
          )}
          <Badge variant={isOnline ? 'secondary' : 'destructive'} className="text-xs">
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>

        {/* Current Time */}
        <div className="text-sm text-black/80 font-medium">
          {currentTime ? formatTime(currentTime) : '--:--'}
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}