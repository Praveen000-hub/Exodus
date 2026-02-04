'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
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
  sunny: 'text-orange-500 bg-orange-50',
  cloudy: 'text-gray-500 bg-gray-50',
  rainy: 'text-orange-500 bg-orange-50',
  snowy: 'text-orange-400 bg-orange-50',
  windy: 'text-orange-500 bg-orange-50',
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
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
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
    setSelectedRoute(null);
  };

  if (loading && monthlyData.length === 0) {
    return (
      <MainLayout title="Forecast AI" subtitle="AI-powered route planning">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weather forecast...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Forecast AI" subtitle="AI-powered route planning and earnings forecast">
      <div className="space-y-6">
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

        {/* No Today's Weather Section */}
        {false && todayWeather && (
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
                <Droplets className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <div className="text-lg font-semibold text-orange-600">{todayWeather.humidity}%</div>
                <div className="text-xs text-gray-600">Humidity</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <Wind className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <div className="text-lg font-semibold text-orange-600">{todayWeather.windSpeed} km/h</div>
                <div className="text-xs text-gray-600">Wind</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <Eye className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <div className="text-lg font-semibold text-orange-600">{todayWeather.visibility} km</div>
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
                          isToday ? 'border-orange-500 bg-orange-50' : 
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

            {/* Selected Day Route Details */}
            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {selectedDate ? `Routes for ${selectedDate}` : 'Select a Day'}
                  </h3>
                  {selectedRoute && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedRoute(null)}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      ← Back to Routes
                    </Button>
                  )}
                </div>
                
                {selectedDate ? (
                  !selectedRoute ? (
                    /* Route List View */
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-4">Select a route to view earnings and benefits</p>
                      {[
                        { id: 1, name: 'Morning Express Route', area: 'MG Road & Koramangala', packages: 8, distance: 45, duration: 6.5, earnings: 530, difficulty: 'Medium' },
                        { id: 2, name: 'Downtown Business Route', area: 'Indiranagar & Whitefield', packages: 12, distance: 62, duration: 8, earnings: 720, difficulty: 'High' },
                        { id: 3, name: 'Residential Light Route', area: 'Jayanagar & BTM Layout', packages: 6, distance: 28, duration: 4.5, earnings: 380, difficulty: 'Easy' },
                        { id: 4, name: 'Tech Park Premium Route', area: 'Electronic City', packages: 10, distance: 55, duration: 7, earnings: 650, difficulty: 'Medium' },
                        { id: 5, name: 'Evening Priority Route', area: 'HSR Layout & Marathahalli', packages: 9, distance: 48, duration: 6, earnings: 580, difficulty: 'Medium' },
                      ].map((route) => (
                        <div 
                          key={route.id}
                          onClick={() => setSelectedRoute(route.id)}
                          className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                  {route.id}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{route.name}</h4>
                                  <p className="text-sm text-gray-600">{route.area}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-3 mt-3 text-center">
                                <div>
                                  <div className="text-xs text-gray-500">Packages</div>
                                  <div className="font-semibold text-gray-900">{route.packages}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Distance</div>
                                  <div className="font-semibold text-gray-900">{route.distance} km</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Duration</div>
                                  <div className="font-semibold text-gray-900">{route.duration} hrs</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Difficulty</div>
                                  <Badge variant={route.difficulty === 'Easy' ? 'secondary' : route.difficulty === 'High' ? 'destructive' : 'default'} className="text-xs">
                                    {route.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold text-green-600">₹{route.earnings}</div>
                              <div className="text-xs text-gray-500">Potential</div>
                              <div className="text-xs text-orange-600 font-medium mt-1 group-hover:underline">View Details →</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Selected Route Details View */
                    (() => {
                      const routes = [
                        { 
                          id: 1, 
                          name: 'Morning Express Route', 
                          packages: 8, 
                          distance: 45, 
                          duration: 6.5,
                          basePay: 320,
                          distanceBonus: 90,
                          onTimeBonus: 50,
                          zeroComplaintsBonus: 30,
                          efficiencyBonus: 40,
                          endTime: '3:30 PM',
                          targetTime: '6 hours',
                          stops: [
                            { id: 1, customer: 'Amit Sharma', address: '123 MG Road', time: '09:00-10:00', priority: 'Normal' },
                            { id: 2, customer: 'Priya Kumar', address: '456 Koramangala', time: '10:00-11:00', priority: 'High' },
                            { id: 3, customer: 'Rajesh Verma', address: '789 Indiranagar', time: '11:00-12:00', priority: 'Normal' },
                            { id: 4, customer: 'Sneha Reddy', address: '321 Whitefield', time: '12:00-13:00', priority: 'Normal' },
                            { id: 5, customer: 'Karthik Menon', address: '654 Jayanagar', time: '13:00-14:00', priority: 'Normal' },
                          ]
                        },
                        { 
                          id: 2, 
                          name: 'Downtown Business Route', 
                          packages: 12, 
                          distance: 62, 
                          duration: 8,
                          basePay: 480,
                          distanceBonus: 124,
                          onTimeBonus: 60,
                          zeroComplaintsBonus: 40,
                          efficiencyBonus: 50,
                          endTime: '5:00 PM',
                          targetTime: '7.5 hours',
                          stops: [
                            { id: 1, customer: 'Tech Corp Ltd', address: 'Indiranagar Tech Park', time: '09:00-10:00', priority: 'High' },
                            { id: 2, customer: 'Business Hub', address: 'Whitefield Plaza', time: '10:00-11:00', priority: 'High' },
                            { id: 3, customer: 'Startup Inc', address: 'Outer Ring Road', time: '11:00-12:00', priority: 'Normal' },
                            { id: 4, customer: 'Corporate Center', address: 'Marathahalli', time: '12:00-13:00', priority: 'High' },
                          ]
                        },
                        { 
                          id: 3, 
                          name: 'Residential Light Route', 
                          packages: 6, 
                          distance: 28, 
                          duration: 4.5,
                          basePay: 240,
                          distanceBonus: 56,
                          onTimeBonus: 40,
                          zeroComplaintsBonus: 25,
                          efficiencyBonus: 30,
                          endTime: '2:00 PM',
                          targetTime: '4 hours',
                          stops: [
                            { id: 1, customer: 'Sunita Rao', address: 'Jayanagar 4th Block', time: '09:00-10:00', priority: 'Normal' },
                            { id: 2, customer: 'Ramesh Kumar', address: 'BTM Layout', time: '10:00-11:00', priority: 'Normal' },
                            { id: 3, customer: 'Lakshmi Nair', address: 'JP Nagar', time: '11:00-12:00', priority: 'Normal' },
                          ]
                        },
                        { 
                          id: 4, 
                          name: 'Tech Park Premium Route', 
                          packages: 10, 
                          distance: 55, 
                          duration: 7,
                          basePay: 400,
                          distanceBonus: 110,
                          onTimeBonus: 55,
                          zeroComplaintsBonus: 35,
                          efficiencyBonus: 45,
                          endTime: '4:00 PM',
                          targetTime: '6.5 hours',
                          stops: [
                            { id: 1, customer: 'Infosys Campus', address: 'Electronic City Phase 1', time: '09:00-10:00', priority: 'High' },
                            { id: 2, customer: 'TCS Building', address: 'Electronic City Phase 2', time: '10:00-11:00', priority: 'High' },
                            { id: 3, customer: 'Wipro Office', address: 'Sarjapur Road', time: '11:00-12:00', priority: 'Normal' },
                          ]
                        },
                        { 
                          id: 5, 
                          name: 'Evening Priority Route', 
                          packages: 9, 
                          distance: 48, 
                          duration: 6,
                          basePay: 360,
                          distanceBonus: 96,
                          onTimeBonus: 50,
                          zeroComplaintsBonus: 30,
                          efficiencyBonus: 40,
                          endTime: '3:00 PM',
                          targetTime: '5.5 hours',
                          stops: [
                            { id: 1, customer: 'Vikram Patel', address: 'HSR Layout Sector 1', time: '09:00-10:00', priority: 'Normal' },
                            { id: 2, customer: 'Anjali Singh', address: 'HSR Layout Sector 6', time: '10:00-11:00', priority: 'High' },
                            { id: 3, customer: 'Deepak Sharma', address: 'Marathahalli Bridge', time: '11:00-12:00', priority: 'Normal' },
                          ]
                        },
                      ];
                      const route = routes.find(r => r.id === selectedRoute)!;
                      const totalBase = route.basePay + route.distanceBonus;
                      const totalBonuses = route.onTimeBonus + route.zeroComplaintsBonus + route.efficiencyBonus;
                      const totalEarnings = totalBase + totalBonuses;
                      
                      return (
                        <div className="space-y-4">
                          {/* Route Header */}
                          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 text-lg mb-3">{route.name}</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <div className="text-sm text-gray-600">Packages</div>
                                <div className="text-2xl font-bold text-orange-600">{route.packages}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Distance</div>
                                <div className="text-2xl font-bold text-orange-600">{route.distance} km</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Duration</div>
                                <div className="text-xl font-bold text-gray-900">{route.duration} hrs</div>
                              </div>
                            </div>
                          </div>

                          {/* Revenue & Rewards Section */}
                          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl">💰</span>
                              </div>
                              <h4 className="font-semibold text-gray-900">Earnings & Rewards Breakdown</h4>
                            </div>
                            
                            {/* Base Earnings */}
                            <div className="space-y-3 mb-4">
                              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                <div>
                                  <div className="text-sm text-gray-600">Base Pay</div>
                                  <div className="text-xs text-gray-500">{route.packages} packages × ₹{route.basePay / route.packages}</div>
                                </div>
                                <div className="text-xl font-bold text-gray-900">₹{route.basePay}</div>
                              </div>
                              
                              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                <div>
                                  <div className="text-sm text-gray-600">Distance Bonus</div>
                                  <div className="text-xs text-gray-500">{route.distance} km × ₹2/km</div>
                                </div>
                                <div className="text-xl font-bold text-gray-900">₹{route.distanceBonus}</div>
                              </div>
                            </div>

                            {/* Potential Bonuses */}
                            <div className="border-t border-gray-200 pt-4">
                              <div className="text-sm font-medium text-gray-700 mb-3">🎁 Achievable Bonuses</div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="text-orange-600">⭐</span>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">On-Time Completion</div>
                                      <div className="text-xs text-gray-600">Complete by {route.endTime}</div>
                                    </div>
                                  </div>
                                  <div className="text-lg font-bold text-orange-600">+₹{route.onTimeBonus}</div>
                                </div>
                                
                                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="text-orange-600">🏆</span>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Zero Complaints</div>
                                      <div className="text-xs text-gray-600">Perfect delivery rating</div>
                                    </div>
                                  </div>
                                  <div className="text-lg font-bold text-orange-600">+₹{route.zeroComplaintsBonus}</div>
                                </div>
                                
                                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="text-orange-600">⚡</span>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Efficiency Bonus</div>
                                      <div className="text-xs text-gray-600">Complete under {route.targetTime}</div>
                                    </div>
                                  </div>
                                  <div className="text-lg font-bold text-orange-600">+₹{route.efficiencyBonus}</div>
                                </div>
                              </div>
                            </div>

                            {/* Total Potential */}
                            <div className="border-t-2 border-gray-300 mt-4 pt-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-sm text-gray-600">Total Potential Earnings</div>
                                  <div className="text-xs text-green-600 font-medium">Base: ₹{totalBase} + Bonuses: ₹{totalBonuses}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl font-bold text-green-600">₹{totalEarnings}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Stops */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Delivery Stops</h4>
                            {route.stops.map((stop, idx) => (
                              <div key={stop.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900">{stop.customer}</div>
                                    <div className="text-sm text-gray-600 mt-1">{stop.address}</div>
                                    <div className="flex items-center gap-3 mt-2">
                                      <span className="text-xs text-gray-500">🕐 {stop.time}</span>
                                      <Badge variant={stop.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                                        {stop.priority}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Route Notes */}
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                              <div className="text-orange-600 mt-0.5">ℹ️</div>
                              <div>
                                <div className="font-medium text-gray-900 mb-1">AI Route Optimization</div>
                                <div className="text-sm text-gray-700">
                                  This route has been optimized for efficiency and fairness. Complete all bonuses to earn the maximum ₹{totalEarnings}!
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Cloud className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Click on a day to see available routes</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}