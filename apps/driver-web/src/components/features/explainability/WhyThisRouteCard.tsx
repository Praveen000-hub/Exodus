'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardSkeleton } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HelpCircle, TrendingUp, TrendingDown, Brain, Target, Zap } from 'lucide-react';
import type { SHAPExplanation } from '@/types/api';

interface WhyThisRouteCardProps {
  explanation: SHAPExplanation | null;
  isLoading: boolean;
}

export function WhyThisRouteCard({ explanation, isLoading }: WhyThisRouteCardProps) {
  const [showAllFactors, setShowAllFactors] = useState(false);

  if (isLoading) {
    return <CardSkeleton className="h-80" />;
  }

  if (!explanation) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-48 text-center">
          <Brain className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-subheading text-black/60 mb-2">No Explanation Available</p>
          <p className="text-body text-black/40">Route analysis in progress</p>
        </CardContent>
      </Card>
    );
  }

  const getDifficultyColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getDifficultyBg = (score: number) => {
    if (score <= 30) return 'bg-green-50';
    if (score <= 60) return 'bg-orange-50';
    return 'bg-red-50';
  };

  const getDifficultyLabel = (score: number) => {
    if (score <= 30) return 'Easy';
    if (score <= 60) return 'Moderate';
    return 'Challenging';
  };

  const factorsToShow = showAllFactors ? explanation.top_factors : explanation.top_factors.slice(0, 3);

  return (
    <Card interactive className="fairai-card-interactive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <HelpCircle className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <span className="text-heading">Why This Route?</span>
              <Badge className="fairai-live-badge ml-2">
                <Brain className="w-3 h-3" />
                AI EXPLAINED
              </Badge>
            </div>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-card">
        {/* Difficulty Score Hero */}
        <div className={`${getDifficultyBg(explanation.total_difficulty)} rounded-xl p-5 text-center hover-lift`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Target className={`w-6 h-6 ${getDifficultyColor(explanation.total_difficulty)}`} />
            <div>
              <div className={`text-display ${getDifficultyColor(explanation.total_difficulty)}`}>
                {explanation.total_difficulty}
              </div>
              <div className="text-caption">Difficulty Score</div>
            </div>
          </div>
          
          <Progress 
            value={explanation.total_difficulty} 
            variant={explanation.total_difficulty <= 30 ? 'success' : explanation.total_difficulty <= 60 ? 'warning' : 'danger'}
            size="lg"
            className="mb-2"
          />
          
          <Badge className={`${
            explanation.total_difficulty <= 30 ? 'fairai-status-good' :
            explanation.total_difficulty <= 60 ? 'fairai-status-warning' : 'fairai-status-alert'
          }`}>
            {getDifficultyLabel(explanation.total_difficulty)} Route
          </Badge>
        </div>

        {/* Key Factors */}
        <div className="space-tight">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-label">Key Decision Factors</h4>
            <Badge variant="secondary" className="text-xs">
              Top {factorsToShow.length}
            </Badge>
          </div>
          
          {factorsToShow.map((factor, index) => {
            const isPositive = factor.impact > 0;
            const impactPercentage = Math.min(Math.abs(factor.impact) * 10, 100);
            
            return (
              <div key={index} className="bg-white border border-gray-100 rounded-lg p-3 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className="font-medium text-black text-sm">
                      {factor.feature}
                    </span>
                  </div>
                  <Badge className={`text-xs ${
                    isPositive ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {isPositive ? '+' : ''}{factor.impact}
                  </Badge>
                </div>
                
                <Progress 
                  value={impactPercentage} 
                  variant={isPositive ? 'warning' : 'success'}
                  size="sm"
                  className="mb-2"
                />
                
                <p className="text-caption text-black/70">
                  {factor.explanation}
                </p>
              </div>
            );
          })}
        </div>

        {/* AI Reasoning */}
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div>
              <p className="text-caption font-medium text-purple-800 mb-1">Smart Assignment</p>
              <p className="text-caption text-purple-700">
                {explanation.total_difficulty <= 30 
                  ? "Perfect match! This route aligns well with your experience and current conditions."
                  : explanation.total_difficulty <= 60
                  ? "Balanced assignment considering your skills and today's factors."
                  : "Challenging but fair - system ensures rotation of difficult routes among all drivers."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-value-sm text-green-600">
                {explanation.top_factors.filter(f => f.impact < 0).length}
              </div>
              <div className="text-caption">Helping factors</div>
            </div>
            <div>
              <div className="text-value-sm text-orange-600">
                {explanation.top_factors.filter(f => f.impact > 0).length}
              </div>
              <div className="text-caption">Challenge factors</div>
            </div>
            <div>
              <div className="text-value-sm text-blue-600">
                {Math.round(Math.abs(explanation.top_factors.reduce((sum, f) => sum + f.impact, 0)))}
              </div>
              <div className="text-caption">Net impact</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setShowAllFactors(!showAllFactors)}
          >
            <Zap className="w-4 h-4 mr-2" />
            {showAllFactors ? 'Show Less' : 'All Factors'}
          </Button>
        </div>

        {/* Fairness Note */}
        <div className="text-center">
          <div className="text-caption text-black/50">
            AI ensures fair distribution based on your profile and conditions
          </div>
        </div>
      </CardContent>
    </Card>
  );
}