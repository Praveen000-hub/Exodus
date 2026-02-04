'use client';

import { useState, useEffect } from 'react';

export interface WeatherData {
  date: string;
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  humidity: number;
  windSpeed: number;
  precipitation: number;
  description: string;
  uvIndex: number;
  visibility: number;
  pressure: number;
}

export interface WeeklyForecast {
  date: string;
  highTemp: number;
  lowTemp: number;
  condition: WeatherData['condition'];
  description: string;
}

const weatherDescriptions = {
  sunny: [
    'Perfect weather for deliveries',
    'Clear skies, excellent visibility',
    'Ideal conditions for outdoor work',
    'Great day for route optimization'
  ],
  cloudy: [
    'Overcast but stable conditions',
    'Mild weather, good for deliveries',
    'Comfortable temperature expected',
    'No weather-related delays expected'
  ],
  rainy: [
    'Rain expected, plan for delays',
    'Wet roads, drive carefully',
    'Allow extra time for deliveries',
    'Secure packages from moisture'
  ],
  snowy: [
    'Snow possible, drive carefully',
    'Icy conditions may occur',
    'Reduced visibility expected',
    'Allow extra travel time'
  ],
  windy: [
    'Windy conditions, secure packages',
    'Strong gusts possible',
    'Be careful with lightweight items',
    'Stable driving conditions needed'
  ]
};

const generateWeatherData = (year: number, month: number): WeatherData[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data: WeatherData[] = [];
  
  // Use a seed based on year and month for consistent data
  const seed = year * 12 + month;
  const random = (index: number) => {
    const x = Math.sin(seed * index) * 10000;
    return x - Math.floor(x);
  };
  
  for (let day = 1; day <= daysInMonth; day++) {
    const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'windy'];
    const conditionIndex = Math.floor(random(day) * conditions.length);
    const condition = conditions[conditionIndex]!; // Non-null assertion since we control the array
    const descriptions = weatherDescriptions[condition];
    
    data.push({
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      temp: Math.floor(random(day + 100) * 15) + 20, // 20-35°C
      condition,
      humidity: Math.floor(random(day + 200) * 40) + 40, // 40-80%
      windSpeed: Math.floor(random(day + 300) * 20) + 5, // 5-25 km/h
      precipitation: condition === 'rainy' ? Math.floor(random(day + 400) * 80) + 10 : 0,
      description: descriptions[Math.floor(random(day + 500) * descriptions.length)]!,
      uvIndex: condition === 'sunny' ? Math.floor(random(day + 600) * 5) + 6 : Math.floor(random(day + 700) * 4) + 1,
      visibility: condition === 'rainy' || condition === 'snowy' ? Math.floor(random(day + 800) * 5) + 3 : Math.floor(random(day + 900) * 3) + 8,
      pressure: Math.floor(random(day + 1000) * 50) + 1000, // 1000-1050 hPa
    });
  }
  
  return data;
};

const generateWeeklyForecast = (): WeeklyForecast[] => {
  const forecast: WeeklyForecast[] = [];
  const today = new Date();
  
  // Use a consistent seed for weekly forecast
  const seed = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();
  const random = (index: number) => {
    const x = Math.sin(seed * index) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'windy'];
    const conditionIndex = Math.floor(random(i + 1) * conditions.length);
    const condition = conditions[conditionIndex]!; // Non-null assertion since we control the array
    const descriptions = weatherDescriptions[condition];
    
    forecast.push({
      date: date.toISOString().split('T')[0]!,
      highTemp: Math.floor(random(i + 10) * 10) + 25, // 25-35°C
      lowTemp: Math.floor(random(i + 20) * 10) + 15, // 15-25°C
      condition,
      description: descriptions[Math.floor(random(i + 30) * descriptions.length)]!
    });
  }
  
  return forecast;
};

export const useWeather = () => {
  const [monthlyData, setMonthlyData] = useState<WeatherData[]>([]);
  const [weeklyForecast, setWeeklyForecast] = useState<WeeklyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyWeather = async (year: number, month: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = generateWeatherData(year, month);
      setMonthlyData(data);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyForecast = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = generateWeeklyForecast();
      setWeeklyForecast(data);
    } catch (err) {
      setError('Failed to fetch weekly forecast');
      console.error('Weekly forecast fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyForecast();
  }, []);

  return {
    monthlyData,
    weeklyForecast,
    loading,
    error,
    fetchMonthlyWeather,
    fetchWeeklyForecast
  };
};