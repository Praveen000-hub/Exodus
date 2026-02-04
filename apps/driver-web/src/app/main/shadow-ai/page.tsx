'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useShadowAIExplanation } from '@/hooks/useExplanation';
import { useAssignment } from '@/hooks/useAssignment';

export default function ShadowAIPage() {
  const [activeTab, setActiveTab] = useState('current');
  const { data: currentAssignment } = useAssignment(123); // Mock driver ID
  const { explanation, loading, fetchExplanation, submitFeedback, requestAlternative } = useShadowAIExplanation();

  useEffect(() => {
    if (currentAssignment?.id) {
      fetchExplanation(currentAssignment.id.toString());
    }
  }, [currentAssignment?.id, fetchExplanation]);

  const handleFeedback = async (helpful: boolean) => {
    if (currentAssignment?.id) {
      await submitFeedback(currentAssignment.id.toString(), {
        helpful,
        rating: helpful ? 5 : 2
      });
    }
  };

  const handleRequestAlternative = async () => {
    if (currentAssignment?.id) {
      try {
        await requestAlternative(currentAssignment.id.toString(), 'User requested different route from Shadow AI page');
        alert('Alternative route request submitted!');
      } catch (error) {
        alert('Failed to request alternative route');
      }
    }
  };

  const getImpactColor = (impact: number, category: string) => {
    if (category === 'negative') return 'text-red-600';
    if (impact >= 70) return 'text-green-600';
    if (impact >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getImpactBg = (impact: number, category: string) => {
    if (category === 'negative') return 'bg-red-100';
    if (impact >= 70) return 'bg-green-100';
    if (impact >= 50) return 'bg-yellow-100';
    return 'bg-gray-100';
  };

  const getTraditionalSystemExplanation = (factor: string) => {
    const explanations: { [key: string]: string } = {
      'Driver Experience': 'Random assignment, ignores your 4.8★ rating',
      'Location Proximity': 'No location consideration, longer travel',
      'Health Score': 'Ignores wellness (82/100), no fatigue check',
      'Traffic Patterns': 'No traffic analysis, discover issues later',
      'Package Complexity': 'Random fragile item assignment',
      'Workload Balance': 'No workload balancing',
      'Earnings Fairness': 'Same drivers get high-value routes'
    };
    
    return explanations[factor] || 'Not considered in traditional systems';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI explanation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Shadow AI</h1>
          <p className="text-gray-600">
            See why you got this route vs traditional systems
          </p>
        </div>

        {/* Quick Comparison */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-red-50 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-700">Fair AI</div>
              <div className="text-sm text-green-600">Transparent • Fair • Health-focused</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-700">Traditional</div>
              <div className="text-sm text-red-600">Random • Biased • Health-ignored</div>
            </div>
          </div>
        </Card>

        {/* Current Assignment Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Assignment</h2>
            <Badge className="bg-blue-100 text-blue-800">
              AI Confidence: {explanation?.confidence || 89}%
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-xl font-bold text-blue-600">
                {currentAssignment?.total_packages || 24}
              </div>
              <div className="text-xs text-gray-600">Packages</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-xl font-bold text-green-600">
                {currentAssignment?.estimated_time ? `${currentAssignment.estimated_time}h` : '6.5h'}
              </div>
              <div className="text-xs text-gray-600">Duration</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-xl font-bold text-purple-600">
                ${Math.round((currentAssignment?.estimated_time || 6.5) * 28) || 185}
              </div>
              <div className="text-xs text-gray-600">Earnings</div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'current', label: 'Why This Route?' },
              { id: 'alternatives', label: 'Alternative Routes' },
              { id: 'fairness', label: 'Fairness Check' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Current Route Explanation */}
        {activeTab === 'current' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Why You Got This Route</h3>
              <div className="space-y-4">
                {explanation?.factors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{factor.factor}</h4>
                      <div className={`flex items-center space-x-2 ${getImpactColor(Math.abs(factor.impact), factor.category)}`}>
                        <span className="text-sm font-medium">
                          {factor.impact > 0 ? '+' : ''}{factor.impact}%
                        </span>
                        <div className={`w-3 h-3 rounded-full ${getImpactBg(Math.abs(factor.impact), factor.category)}`} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {/* Fair AI */}
                      <div className="bg-green-50 p-3 rounded border-l-2 border-green-500">
                        <div className="text-xs font-medium text-green-700 mb-1">Fair AI</div>
                        <p className="text-sm text-green-800">{factor.description}</p>
                      </div>
                      
                      {/* Traditional */}
                      <div className="bg-red-50 p-3 rounded border-l-2 border-red-500">
                        <div className="text-xs font-medium text-red-700 mb-1">Traditional</div>
                        <p className="text-sm text-red-800">{getTraditionalSystemExplanation(factor.factor)}</p>
                      </div>
                    </div>
                  </div>
                )) || []}
              </div>
            </Card>
          </div>
        )}

        {/* Alternative Routes */}
        {activeTab === 'alternatives' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Other Routes Available</h3>
            <div className="space-y-3">
              {explanation?.alternatives.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{route.name}</div>
                    <div className="text-sm text-gray-600">{route.reason}</div>
                  </div>
                  <Badge variant={route.score >= 70 ? 'default' : route.score >= 50 ? 'secondary' : 'destructive'}>
                    {route.score}%
                  </Badge>
                </div>
              )) || []}
            </div>
          </Card>
        )}

        {/* Fairness Check */}
        {activeTab === 'fairness' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Fairness Check</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Your Routes</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>High-value</span>
                      <span>{explanation?.fairnessMetrics.userDistribution.high || 23}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium-value</span>
                      <span>{explanation?.fairnessMetrics.userDistribution.medium || 54}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low-value</span>
                      <span>{explanation?.fairnessMetrics.userDistribution.low || 23}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Team Average</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>High-value</span>
                      <span>{explanation?.fairnessMetrics.teamAverage.high || 25}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium-value</span>
                      <span>{explanation?.fairnessMetrics.teamAverage.medium || 50}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low-value</span>
                      <span>{explanation?.fairnessMetrics.teamAverage.low || 25}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="font-medium text-green-800">Fairness Check Passed</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Bias Prevention</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Gender</span>
                  <Badge variant={explanation?.fairnessMetrics.biasChecks.gender ? 'default' : 'destructive'}>
                    {explanation?.fairnessMetrics.biasChecks.gender ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Age</span>
                  <Badge variant={explanation?.fairnessMetrics.biasChecks.age ? 'default' : 'destructive'}>
                    {explanation?.fairnessMetrics.biasChecks.age ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Experience</span>
                  <Badge variant={explanation?.fairnessMetrics.biasChecks.experience ? 'default' : 'destructive'}>
                    {explanation?.fairnessMetrics.biasChecks.experience ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Location</span>
                  <Badge variant={explanation?.fairnessMetrics.biasChecks.geographic ? 'default' : 'destructive'}>
                    {explanation?.fairnessMetrics.biasChecks.geographic ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button variant="outline" className="flex-1" onClick={handleRequestAlternative}>
            Request Different Route
          </Button>
          <Button className="flex-1">
            Accept Route
          </Button>
        </div>

        {/* Feedback */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Was this explanation helpful?</h3>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => handleFeedback(true)}>👍 Yes</Button>
            <Button variant="outline" onClick={() => handleFeedback(false)}>👎 No</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}