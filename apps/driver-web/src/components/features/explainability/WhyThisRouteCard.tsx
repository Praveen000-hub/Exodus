'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardSkeleton } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HelpCircle, TrendingUp, TrendingDown, Brain, Target, Zap, Info, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { SHAPExplanation } from '@/types/api';

interface WhyThisRouteCardProps {
  explanation: SHAPExplanation | null;
  isLoading: boolean;
}

export function WhyThisRouteCard({ explanation, isLoading }: WhyThisRouteCardProps) {
  const [showAllFactors, setShowAllFactors] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<number | null>(null);
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    if (explanation) {
      setTimeout(() => setAnimateScore(true), 100);
    }
  }, [explanation]);

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
    if (score <= 30) return {
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      progress: 'bg-orange-400',
      icon: 'text-orange-500'
    };
    if (score <= 60) return {
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      progress: 'bg-orange-500',
      icon: 'text-orange-500'
    };
    return {
      text: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      progress: 'bg-orange-600',
      icon: 'text-orange-600'
    };
  };

  const getDifficultyLabel = (score: number) => {
    if (score <= 30) return 'Easy Route';
    if (score <= 60) return 'Moderate Route';
    return 'Challenging Route';
  };

  const colors = getDifficultyColor(explanation.total_difficulty);
  const factorsToShow = showAllFactors ? explanation.top_factors : explanation.top_factors.slice(0, 3);
  const helpingFactors = explanation.top_factors.filter(f => f.impact < 0).length;
  const challengeFactors = explanation.top_factors.filter(f => f.impact > 0).length;
  const netImpact = Math.round(Math.abs(explanation.top_factors.reduce((sum, f) => sum + f.impact, 0)));

  return (
    <Card interactive className="fairai-card-interactive">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-heading">Why This Route?</span>
              <Badge className="ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md animate-pulse">
                <Brain className="w-3 h-3 mr-1" />
                AI EXPLAINED
              </Badge>
            </div>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Interactive Difficulty Score */}
        <div className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all cursor-pointer`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative">
                <Target className={`w-12 h-12 ${colors.icon} group-hover:rotate-180 transition-transform duration-500`} />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className={`w-5 h-5 ${colors.icon} animate-pulse`} />
                </div>
              </div>
              <div className="text-center">
                <div className={`text-6xl font-bold ${colors.text} transition-all duration-1000 ${animateScore ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                  {explanation.total_difficulty}
                </div>
                <div className="text-sm text-gray-600 font-medium">Difficulty Score</div>
              </div>
            </div>
            
            <div className="relative h-4 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className={`h-full ${colors.progress} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: animateScore ? `${explanation.total_difficulty}%` : '0%' }}
              >
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            <div className="mt-3 flex justify-center">
              <Badge className={`${colors.bg} ${colors.text} border-2 ${colors.border} font-semibold px-4 py-1.5 shadow-sm`}>
                {getDifficultyLabel(explanation.total_difficulty)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Interactive Key Factors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Key Decision Factors
            </h4>
            <Badge className="bg-orange-500 text-white text-xs shadow-sm">
              Top {factorsToShow.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {factorsToShow.map((factor, index) => {
              const isPositive = factor.impact > 0;
              const impactPercentage = Math.min(Math.abs(factor.impact) * 10, 100);
              const isSelected = selectedFactor === index;
              
              return (
                <div 
                  key={index} 
                  className={`bg-white border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? `${isPositive ? 'border-orange-400 shadow-lg scale-[1.02]' : 'border-orange-300 shadow-lg scale-[1.02]'}`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedFactor(isSelected ? null : index)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isPositive ? 'bg-gradient-to-br from-orange-100 to-orange-200' : 'bg-gradient-to-br from-orange-50 to-orange-100'
                      }`}>
                        {isPositive ? (
                          <TrendingUp className="w-5 h-5 text-orange-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900 text-sm block">
                          {factor.feature}
                        </span>
                        <span className="text-xs text-gray-500">{factor.explanation}</span>
                      </div>
                    </div>
                    <Badge className={`text-xs font-bold shadow-sm ${
                      isPositive 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                        : 'bg-white border-2 border-orange-500 text-orange-600'
                    }`}>
                      {isPositive ? '+' : ''}{factor.impact}
                    </Badge>
                  </div>
                  
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isPositive ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gradient-to-r from-orange-300 to-orange-500'
                      }`}
                      style={{ width: `${impactPercentage}%` }}
                    >
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-900">
                          <strong>Impact Explanation:</strong> {factor.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Smart Assignment Box */}
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain className="w-32 h-32 text-purple-500" />
          </div>
          <div className="relative flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                Smart Assignment
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-sm text-purple-800 leading-relaxed">
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

        {/* Interactive Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200 hover:shadow-lg hover:scale-105 transition-all cursor-pointer group">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-2xl font-bold text-white">{helpingFactors}</span>
            </div>
            <div className="text-xs text-green-700 font-medium">Helping factors</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 text-center border border-orange-200 hover:shadow-lg hover:scale-105 transition-all cursor-pointer group">
            <div className="w-12 h-12 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-2xl font-bold text-white">{challengeFactors}</span>
            </div>
            <div className="text-xs text-orange-700 font-medium">Challenge factors</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-200 hover:shadow-lg hover:scale-105 transition-all cursor-pointer group">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-2xl font-bold text-white">{netImpact}</span>
            </div>
            <div className="text-xs text-blue-700 font-medium">Net impact</div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 hover:border-purple-300 hover:shadow-md transition-all group"
          onClick={() => setShowAllFactors(!showAllFactors)}
        >
          <Zap className="w-4 h-4 mr-2 text-purple-600 group-hover:animate-pulse" />
          <span className="font-semibold text-purple-700">
            {showAllFactors ? 'Show Less Factors' : `View All ${explanation.top_factors.length} Factors`}
          </span>
          {showAllFactors ? (
            <ChevronUp className="w-4 h-4 ml-2 text-purple-600" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2 text-purple-600" />
          )}
        </Button>

        {/* Fairness Footer */}
        <div className="text-center bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <Target className="w-4 h-4 text-green-500" />
            <span>AI ensures fair distribution based on your profile and conditions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}