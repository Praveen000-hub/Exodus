'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X,
  Users, 
  Star, 
  Clock, 
  Package, 
  Target, 
  DollarSign,
  MapPin,
  TrendingUp, 
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ThumbsUp,
  ArrowRight,
  Sparkles,
  Timer,
  Route,
  Building,
  Cloud,
  Phone,
  Calendar,
  Award
} from 'lucide-react';

interface SwapDetailsModalProps {
  swap: {
    id: number;
    requesterName: string;
    requesterRating: number;
    difficulty: number;
    packages: number;
    distance: number;
    estimatedTime: number;
    compatibilityScore: number;
    reason: string;
    urgency: 'low' | 'medium' | 'high';
    floorsSaved: number;
    timeSaved: string;
    earnings: number;
    location: string;
    hasLift: boolean;
    weatherImpact: 'positive' | 'neutral' | 'negative';
    timePosted: string;
    expiresIn: number;
    benefits: string[];
    risks: string[];
  };
  currentAssignment: {
    packages: number;
    difficulty: number;
    estimatedTime: number;
    earnings: number;
    location: string;
    hasLift: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
  onAcceptSwap: () => void;
}

export function SwapDetailsModal({ 
  swap, 
  currentAssignment, 
  isOpen, 
  onClose, 
  onAcceptSwap 
}: SwapDetailsModalProps) {
  if (!isOpen) return null;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getWeatherIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return '☀️';
      case 'negative': return '🌧️';
      default: return '⛅';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-heading">Swap Details</h2>
            <p className="text-body">Complete route comparison and driver information</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-section">
          {/* Driver Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-subheading">{swap.requesterName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-label">{swap.requesterRating} rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span className="text-label">Verified driver</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge className={`border ${getUrgencyColor(swap.urgency)}`}>
                  {swap.urgency.toUpperCase()} PRIORITY
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-label text-blue-800 mb-2">Reason for Swap Request</p>
                    <p className="text-body text-blue-700">{swap.reason}</p>
                    <div className="flex items-center gap-4 mt-3 text-caption text-blue-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Posted {swap.timePosted}
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        Expires in {swap.expiresIn} minutes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Compatibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                AI Compatibility Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-subheading">Match Score</span>
                  <span className="text-display text-green-600">
                    {Math.round(swap.compatibilityScore * 100)}%
                  </span>
                </div>
                <Progress 
                  value={swap.compatibilityScore * 100} 
                  variant="success" 
                  size="lg"
                  className="mb-4"
                  animated
                />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-value-sm text-green-600">95%</div>
                    <div className="text-caption">Route Similarity</div>
                  </div>
                  <div>
                    <div className="text-value-sm text-green-600">92%</div>
                    <div className="text-caption">Skill Match</div>
                  </div>
                  <div>
                    <div className="text-value-sm text-green-600">88%</div>
                    <div className="text-caption">Preference Fit</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5 text-orange-500" />
                Detailed Route Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Current Route */}
                <div className="space-tight">
                  <h4 className="text-label mb-3 text-gray-600">Your Current Route</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="fairai-info-row">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span>{currentAssignment.packages} packages</span>
                    </div>
                    <div className="fairai-info-row">
                      <Target className="w-4 h-4 text-gray-500" />
                      <span>{currentAssignment.difficulty}/100 difficulty</span>
                    </div>
                    <div className="fairai-info-row">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{currentAssignment.estimatedTime}h estimated</span>
                    </div>
                    <div className="fairai-info-row">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span>₹{currentAssignment.earnings} earnings</span>
                    </div>
                    <div className="fairai-info-row">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{currentAssignment.location}</span>
                    </div>
                    <div className="fairai-info-row">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span>{currentAssignment.hasLift ? 'Lift available' : 'No lift'}</span>
                    </div>
                  </div>
                </div>

                {/* Proposed Route */}
                <div className="space-tight">
                  <h4 className="text-label mb-3 text-orange-600">Proposed Route</h4>
                  <div className="bg-orange-50 rounded-lg p-4 space-y-3">
                    <div className="fairai-info-row">
                      <Package className="w-4 h-4 text-orange-500" />
                      <span>{swap.packages} packages</span>
                      {swap.packages < currentAssignment.packages && (
                        <TrendingDown className="w-4 h-4 text-green-500 ml-auto" />
                      )}
                    </div>
                    <div className="fairai-info-row">
                      <Target className="w-4 h-4 text-orange-500" />
                      <span>{swap.difficulty}/100 difficulty</span>
                      {swap.difficulty < currentAssignment.difficulty && (
                        <TrendingDown className="w-4 h-4 text-green-500 ml-auto" />
                      )}
                    </div>
                    <div className="fairai-info-row">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{swap.estimatedTime}h estimated</span>
                      {swap.estimatedTime < currentAssignment.estimatedTime && (
                        <TrendingDown className="w-4 h-4 text-green-500 ml-auto" />
                      )}
                    </div>
                    <div className="fairai-info-row">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      <span>₹{swap.earnings} earnings</span>
                      {swap.earnings > currentAssignment.earnings && (
                        <TrendingUp className="w-4 h-4 text-green-500 ml-auto" />
                      )}
                    </div>
                    <div className="fairai-info-row">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{swap.location}</span>
                    </div>
                    <div className="fairai-info-row">
                      <Building className="w-4 h-4 text-orange-500" />
                      <span>{swap.hasLift ? 'Lift available' : 'No lift'}</span>
                    </div>
                    <div className="fairai-info-row">
                      <Cloud className="w-4 h-4 text-orange-500" />
                      <span>{getWeatherIcon(swap.weatherImpact)} Weather impact</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits & Risks */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <ThumbsUp className="w-5 h-5" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {swap.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-body text-green-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="w-5 h-5" />
                  Things to Consider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {swap.risks.map((risk, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-body text-orange-700">{risk}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              disabled={swap.expiresIn < 5}
              onClick={onAcceptSwap}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Accept This Swap
            </Button>
          </div>

          {swap.expiresIn < 10 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-label text-red-800">Urgent: This swap expires soon!</p>
                  <p className="text-caption text-red-600">
                    Only {swap.expiresIn} minutes remaining to accept this offer.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}