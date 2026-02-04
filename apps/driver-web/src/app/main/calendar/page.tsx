'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ForecastCalendar } from '@/components/features/forecast/ForecastCalendar';
import { useForecast } from '@/hooks/useForecast';

export default function CalendarPage() {
  const driverId = 123;
  const { data: forecast, isLoading } = useForecast(driverId);

  return (
    <MainLayout title="Calendar & Forecast" subtitle="Plan your schedule with AI predictions">
      <div className="max-w-6xl mx-auto">
        <ForecastCalendar forecast={forecast || null} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
}