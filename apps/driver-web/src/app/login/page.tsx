'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, Lock, Eye, EyeOff } from 'lucide-react';
import { isValidPhone } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Mock login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      localStorage.setItem('fairai_token', 'mock_jwt_token');
      localStorage.setItem('fairai_user', JSON.stringify({
        id: 123,
        name: 'Rajesh Kumar',
        phone: formData.phone
      }));
      
      // Show transition animation
      setShowTransition(true);
      
      // Navigate after animation completes
      setTimeout(() => {
        router.push('/main');
      }, 2200);
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Success Transition Animation */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center"
          >
            {/* Loading Bar Container */}
            <div className="text-center">
              {/* Loading Bar */}
              <div className="relative w-96 h-16 bg-white border-4 border-gray-200 rounded-full overflow-hidden mb-8 shadow-xl">
                {/* Animated Fill */}
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                >
                  {/* Shine Effect */}
                  <motion.div
                    animate={{ 
                      x: [-200, 400]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                </motion.div>
              </div>

              {/* Loading Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-gray-900"
              >
                Loading
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </motion.div>

              {/* Success Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-orange-600 text-lg mt-4 font-medium"
              >
                Preparing your dashboard
              </motion.p>
            </div>

            {/* Animated Delivery Truck */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ 
                x: window.innerWidth + 300, 
                opacity: [0, 1, 1, 0],
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut",
                opacity: { times: [0, 0.1, 0.9, 1] }
              }}
              className="absolute bottom-32 z-10"
            >
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, -0.5, 0, 0.5, 0]
                }}
                transition={{ 
                  duration: 0.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
                style={{ width: '120px', height: '80px' }}
              >
                {/* Orange Delivery Truck SVG */}
                <svg viewBox="0 0 200 120" className="w-full h-full filter drop-shadow-xl">
                  {/* Truck Body */}
                  <rect x="20" y="40" width="90" height="50" fill="#f97316" rx="5" />
                  {/* Cargo Box */}
                  <rect x="110" y="30" width="70" height="60" fill="#ea580c" rx="5" />
                  {/* Cargo Details */}
                  <rect x="120" y="40" width="20" height="15" fill="#fff" opacity="0.3" rx="2" />
                  <rect x="145" y="40" width="20" height="15" fill="#fff" opacity="0.3" rx="2" />
                  {/* Cabin Window */}
                  <rect x="30" y="48" width="35" height="25" fill="#fff" opacity="0.8" rx="3" />
                  {/* Front Details */}
                  <rect x="15" y="55" width="8" height="8" fill="#fed7aa" rx="1" />
                  <rect x="15" y="68" width="8" height="8" fill="#fed7aa" rx="1" />
                  {/* Wheels */}
                  <circle cx="50" cy="95" r="12" fill="#422006" />
                  <circle cx="50" cy="95" r="7" fill="#78716c" />
                  <circle cx="150" cy="95" r="12" fill="#422006" />
                  <circle cx="150" cy="95" r="7" fill="#78716c" />
                  {/* Wheel Spokes */}
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "50px 95px" }}
                  >
                    <line x1="50" y1="88" x2="50" y2="102" stroke="#fff" strokeWidth="2" />
                    <line x1="43" y1="95" x2="57" y2="95" stroke="#fff" strokeWidth="2" />
                  </motion.g>
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "150px 95px" }}
                  >
                    <line x1="150" y1="88" x2="150" y2="102" stroke="#fff" strokeWidth="2" />
                    <line x1="143" y1="95" x2="157" y2="95" stroke="#fff" strokeWidth="2" />
                  </motion.g>
                </svg>

                {/* Speed Lines */}
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    x: [-10, -30]
                  }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-20"
                >
                  <div className="flex flex-col gap-2">
                    <div className="w-12 h-1.5 bg-orange-500 rounded-full"></div>
                    <div className="w-8 h-1.5 bg-orange-400 rounded-full"></div>
                    <div className="w-5 h-1.5 bg-orange-300 rounded-full"></div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Decorative Background Elements */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-20 left-20 w-40 h-40 bg-orange-400 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute bottom-20 right-20 w-48 h-48 bg-orange-300 rounded-full blur-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h1 className="text-2xl font-bold text-black">FaIr_AI Driver</h1>
          <p className="text-black/60">Fair AI for Delivery Assignment</p>
        </div>

        <Card className="fairai-card">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.general}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 w-4 h-4 text-black/40" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10"
                    maxLength={10}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-black/40" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-black/40 hover:text-black/60"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full fairai-button-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-black/60">
                Demo credentials: 9876543210 / TestDriver123!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}