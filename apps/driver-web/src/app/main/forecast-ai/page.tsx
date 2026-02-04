'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Cloud, Sun, CloudRain, CloudSnow, Wind, Eye, Droplets, Gauge } from 'lucide-react';
import { useWeather, type WeatherData } from '@/hooks/useWeather';

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  windy: Wind,
};

const weatherColors = {
  sunny: 'text-yellow-500 bg-yellow-50',
  cloudy: 'text-gray-500 bg-gray-50',
  rainy: 'text-blue-500 bg-blue-50',
  snowy: 'text-blue-300 bg-blue-50',
  windy: 'text-green-500 bg-green-50',
};

const getRouteImpact = (condition: WeatherData['condition'], precipitation: number) => {
  if (condition === 'rainy' && precipitation > 50) {
    return { level: 'High', color: 'destructive', delay: '20-30%', message: 'Significant delays expected' };
  } else if (condition === 'rainy' || condition === 'snowy') {
    return { level: 'Medium', color: 'secondary', delay: '10-15%', message: 'Moderate delays possible' };
  } else if (condition === 'windy') {
    return { level: 'Low', color: 'default', delay: '5%', message: 'Minor impact on deliveries' };
  }
  return { level: 'Minimal', color: 'default', delay: '0%', message: 'Optimal delivery conditions' };
};

export default function ForecastAIPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'weekly'>('calendar');
  
  const { monthlyData, weeklyForecast, loading, fetchMonthlyWeather } = useWeather();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date().toISOString().split('T')[0];
  
  const selectedWeather = selectedDate ? monthlyData.find(w => w.date === selectedDate) : null;
  const todayWeather = monthlyData.find(w => w.date === today);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  useEffect(() => {
    fetchMonthlyWeather(year, month);
  }, [year, month, fetchMonthlyWeather]);
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
  };
  
  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  if (loading && monthlyData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weather forecast...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Forecast AI</h1>
          <p className="text-gray-600">
            AI-powered weather insights for optimal delivery planning
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-1 border">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
              className="mr-1"
            >
              Monthly Calendar
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'outline'}
              onClick={() => setViewMode('weekly')}
            >
              7-Day Forecast
            </Button>
          </div>
        </div>

        {/* Today's Weather Highlight */}
        {todayWeather && (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Today's Weather</h2>
                <p className="text-gray-600">Current conditions and AI recommendations</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${weatherColors[todayWeather.condition]}`}>
                  {(() => {
                    const Icon = weatherIcons[todayWeather.condition];
                    return <Icon className="w-8 h-8" />;
                  })()}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{todayWeather.temp}°C</div>
                  <div className="text-sm text-gray-600 capitalize">{todayWeather.condition}</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-white rounded-lg">
                <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <div className="text-lg font-semibold text-blue-600">{todayWeather.humidity}%</div>
                <div className="text-xs text-gray-600">Humidity</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <Wind className="w-5 h-5 mx-auto mb-1 text-green-500" />
                <div className="text-lg font-semibold text-green-600">{todayWeather.windSpeed} km/h</div>
                <div className="text-xs text-gray-600">Wind</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <Eye className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <div className="text-lg font-semibold text-purple-600">{todayWeather.visibility} km</div>
                <div className="text-xs text-gray-600">Visibility</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <Gauge className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <div className="text-lg font-semibold text-orange-600">{todayWeather.pressure}</div>
                <div className="text-xs text-gray-600">Pressure</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">AI Recommendation</div>
              <div className="text-sm text-gray-600">{todayWeather.description}</div>
            </div>
          </Card>
        )}

        {viewMode === 'weekly' ? (
          /* Weekly Forecast View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {weeklyForecast.map((day, index) => {
              const date = new Date(day.date);
              const dayName = index === 0 ? 'Today' : 
                            index === 1 ? 'Tomorrow' : 
                            date.toLocaleDateString('en-US', { weekday: 'short' });
              const Icon = weatherIcons[day.condition];
              
              return (
                <Card key={day.date} className="p-4 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="font-medium text-gray-900 mb-2">{dayName}</div>
                    <div className="text-sm text-gray-600 mb-3">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    
                    <div className={`inline-flex p-3 rounded-full ${weatherColors[day.condition]} mb-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-gray-900">{day.highTemp}°</div>
                      <div className="text-sm text-gray-600">{day.lowTemp}°</div>
                      <div className="text-xs text-gray-500 capitalize">{day.condition}</div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-600">
                      {day.description}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Calendar View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    {monthNames[month]} {year}
                  </h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div key={`empty-${i}`} className="p-2 h-20"></div>
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const weather = monthlyData.find(w => w.date === dateStr);
                    const isToday = dateStr === today;
                    const isSelected = dateStr === selectedDate;
                    
                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        className={`p-2 h-20 border rounded-lg hover:bg-gray-50 transition-colors ${
                          isToday ? 'border-blue-500 bg-blue-50' : 
                          isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="text-sm font-medium">{day}</div>
                        {weather && (
                          <>
                            <div className="flex items-center justify-center mt-1">
                              {(() => {
                                const Icon = weatherIcons[weather.condition];
                                return <Icon className={`w-4 h-4 ${weatherColors[weather.condition].split(' ')[0]}`} />;
                              })()}
                            </div>
                            <div className="text-xs text-gray-600">{weather.temp}°</div>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Selected Day Details */}
            <div>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedDate ? 'Day Details' : 'Select a Day'}
                </h3>
                
                {selectedWeather ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`inline-flex p-4 rounded-full ${weatherColors[selectedWeather.condition]}`}>
                        {(() => {
                          const Icon = weatherIcons[selectedWeather.condition];
                          return <Icon className="w-8 h-8" />;
                        })()}
                      </div>
                      <div className="mt-2">
                        <div className="text-2xl font-bold">{selectedWeather.temp}°C</div>
                        <div className="text-sm text-gray-600 capitalize">
                          {selectedWeather.condition}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Humidity</span>
                        <span className="font-medium">{selectedWeather.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wind Speed</span>
                        <span className="font-medium">{selectedWeather.windSpeed} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visibility</span>
                        <span className="font-medium">{selectedWeather.visibility} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">UV Index</span>
                        <span className="font-medium">{selectedWeather.uvIndex}</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">AI Recommendation</div>
                      <div className="text-sm text-gray-600">{selectedWeather.description}</div>
                    </div>
                    
                    {/* Route Impact */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Delivery Impact</div>
                      {(() => {
                        const impact = getRouteImpact(selectedWeather.condition, selectedWeather.precipitation);
                        return (
                          <>
                            <div className="flex items-center space-x-2">
                              <Badge variant={impact.color as any}>
                                {impact.level} Impact
                              </Badge>
                              <span className="text-sm text-gray-600">+{impact.delay} time</span>
                            </div>
                            <div className="text-xs text-gray-600">{impact.message}</div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Cloud className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Click on a day to see detailed weather forecast and AI insights</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}