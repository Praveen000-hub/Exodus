'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Star, 
  Clock, 
  Package, 
  Target, 
  DollarSign,
  TrendingUp, 
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ThumbsUp,
  Eye,
  ArrowRight,
  Sparkles,
  Timer
} from 'lucide-react';

interface SwapCardProps {
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
  };
  onViewDetails: () => void;
  onAcceptSwap: () => void;
}

export function SwapCard({ swap, currentAssignment, onViewDetails, onAcceptSwap }: SwapCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getComparisonIcon = (current: number, proposed: number, reverse = false) => {
    const isImprovement = reverse ? proposed > current : proposed < current;
    return isImprovement ? (
      <TrendingDown className="w-3 h-3 text-green-500" />
    ) : proposed === current ? null : (
      <TrendingUp className="w-3 h-3 text-orange-500" />
    );
  };

  return (
    <Card 
      interactive 
      className="fairai-card-interactive"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`}>
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-subheading">{swap.requesterName}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-caption">{swap.requesterRating}</span>
                </div>
                <span className="text-caption text-black/40">•</span>
                <span className="text-caption">{swap.timePosted}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge className={`text-xs border ${getUrgencyColor(swap.urgency)}`}>
              {swap.urgency.toUpperCase()}
            </Badge>
            <div className="text-caption mt-1 flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {swap.expiresIn}m left
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-card">
        {/* AI Compatibility Score */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label">AI Compatibility</span>
            <span className="text-value-sm text-green-600">
              {Math.round(swap.compatibilityScore * 100)}%
            </span>
          </div>
          <Progress 
            value={swap.compatibilityScore * 100} 
            variant="success" 
            className="mb-2"
            animated
          />
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-green-500" />
            <span className="text-caption text-green-700">
              {swap.compatibilityScore > 0.9 ? 'Excellent match' : 
               swap.compatibilityScore > 0.8 ? 'Good match' : 'Fair match'} for your profile
            </span>
          </div>
        </div>

        {/* Route Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-compact">
            <div className="text-caption text-black/60 mb-2">Your Current</div>
            <div className="space-y-2">
              <div className="fairai-info-row">
                <Package className="w-4 h-4 text-gray-500" />
                <span>{currentAssignment.packages}</span>
              </div>
              <div className="fairai-info-row">
                <Target className="w-4 h-4 text-gray-500" />
                <span>{currentAssignment.difficulty}/100</span>
              </div>
              <div className="fairai-info-row">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{currentAssignment.estimatedTime}h</span>
              </div>
              <div className="fairai-info-row">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span>₹{currentAssignment.earnings}</span>
              </div>
            </div>
          </div>

          <div className="space-compact">
            <div className="text-caption text-black/60 mb-2">Proposed</div>
            <div className="space-y-2">
              <div className="fairai-info-row">
                <Package className="w-4 h-4 text-orange-500" />
                <span>{swap.packages}</span>
                {getComparisonIcon(currentAssignment.packages, swap.packages)}
              </div>
              <div className="fairai-info-row">
                <Target className="w-4 h-4 text-orange-500" />
                <span>{swap.difficulty}/100</span>
                {getComparisonIcon(currentAssignment.difficulty, swap.difficulty)}
              </div>
              <div className="fairai-info-row">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{swap.estimatedTime}h</span>
                {getComparisonIcon(currentAssignment.estimatedTime, swap.estimatedTime)}
              </div>
              <div className="fairai-info-row">
                <DollarSign className="w-4 h-4 text-orange-500" />
                <span>₹{swap.earnings}</span>
                {getComparisonIcon(currentAssignment.earnings, swap.earnings, true)}
              </div>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5" />
            <div>
              <p className="text-caption font-medium text-blue-800 mb-1">Reason for Swap</p>
              <p className="text-caption text-blue-700">{swap.reason}</p>
            </div>
          </div>
        </div>

        {/* Benefits & Risks */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-caption font-medium text-green-700 mb-2 flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              Benefits
            </div>
            <div className="space-y-1">
              {swap.benefits.slice(0, 2).map((benefit, index) => (
                <div key={index} className="text-caption text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-caption font-medium text-orange-700 mb-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Consider
            </div>
            <div className="space-y-1">
              {swap.risks.slice(0, 2).map((risk, index) => (
                <div key={index} className="text-caption text-orange-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {risk}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 hover-lift"
            onClick={onViewDetails}
          >
            <Eye className="w-4 h-4 mr-2" />
            Details
          </Button>
          <Button 
            className="flex-1 button-press"
            disabled={swap.expiresIn < 5}
            onClick={onAcceptSwap}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Accept
          </Button>
        </div>

        {/* Expiring Soon Warning */}
        {swap.expiresIn < 10 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-caption text-red-700 font-medium">
                Expires in {swap.expiresIn} minutes!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}