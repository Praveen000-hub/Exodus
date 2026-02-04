'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardSkeleton } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, Package, Clock, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import type { Assignment } from '@/types/api';

interface ShadowComparisonCardProps {
  assignment: Assignment | null;
  isLoading: boolean;
}

export function ShadowComparisonCard({ assignment, isLoading }: ShadowComparisonCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return <CardSkeleton className="h-64" />;
  }

  if (!assignment?.shadow_comparison) {
    return null;
  }

  const { shadow_packages, shadow_difficulty, savings_hours } = assignment.shadow_comparison;
  const floorsSaved = Math.floor(savings_hours * 8); // Estimate floors saved
  const packageDifference = shadow_packages - assignment.total_packages;
  const difficultyReduction = shadow_difficulty - assignment.difficulty_score;

  return (
    <Card interactive className="fairai-card-interactive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingDown className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <span className="text-heading">Fair vs Traditional</span>
              <Badge className="fairai-live-badge ml-2">
                <CheckCircle2 className="w-3 h-3" />
                IMPROVED
              </Badge>
            </div>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-card">
        {/* Hero Comparison */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-5 hover-lift">
          <div className="text-center mb-4">
            <div className="text-caption text-black/60 mb-1">You saved today</div>
            <div className="text-display text-green-600">{packageDifference}</div>
            <div className="text-caption">fewer packages</div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-value-sm text-red-600">{shadow_packages}</div>
              <div className="text-caption text-red-600/80">Traditional</div>
            </div>
            
            <ArrowRight className="w-5 h-5 text-green-500" />
            
            <div className="text-center">
              <div className="text-value-sm text-green-600">{assignment.total_packages}</div>
              <div className="text-caption text-green-600/80">Fair AI</div>
            </div>
          </div>
        </div>

        {/* Savings Breakdown */}
        <div className="space-tight">
          <h4 className="text-label mb-3">What You Saved</h4>
          
          <div className="fairai-info-row">
            <Clock className="w-4 h-4 text-green-500" />
            <span>{formatDuration(savings_hours)} less work time</span>
            <Badge className="fairai-status-good ml-auto">-{Math.round(savings_hours * 60)}min</Badge>
          </div>
          
          <div className="fairai-info-row">
            <Package className="w-4 h-4 text-green-500" />
            <span>~{floorsSaved} fewer floors to climb</span>
            <Badge className="fairai-status-good ml-auto">Easier</Badge>
          </div>
          
          <div className="fairai-info-row">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Difficulty reduced by {difficultyReduction} points</span>
            <Badge className="fairai-status-good ml-auto">Fairer</Badge>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div>
              <p className="text-caption font-medium text-blue-800 mb-1">Fairness Insight</p>
              <p className="text-caption text-blue-700">
                Traditional systems often overload experienced drivers. Our AI ensures everyone gets balanced workloads based on real-time conditions.
              </p>
            </div>
          </div>
        </div>

        {/* System Comparison */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-caption text-black/60 mb-1">Traditional System</div>
              <div className="text-value-sm text-red-600">{shadow_difficulty}%</div>
              <div className="text-caption">difficulty</div>
            </div>
            <div>
              <div className="text-caption text-black/60 mb-1">Fair AI System</div>
              <div className="text-value-sm text-green-600">{assignment.difficulty_score}%</div>
              <div className="text-caption">difficulty</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'How It Works'}
        </Button>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-tight fade-in">
            <h5 className="text-label mb-3">Fairness Algorithm</h5>
            <div className="space-y-2 text-caption text-black/70">
              <p>• Analyzes your recent workload history</p>
              <p>• Considers current weather and traffic</p>
              <p>• Balances difficulty across all drivers</p>
              <p>• Adjusts for building accessibility</p>
              <p>• Ensures equal earning opportunities</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}