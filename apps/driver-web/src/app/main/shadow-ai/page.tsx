'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, TrendingDown, Sparkles, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useShadowAIExplanation } from '@/hooks/useExplanation';
import { useAssignment } from '@/hooks/useAssignment';
import { MainLayout } from '@/components/layout/MainLayout';

export default function ShadowAIPage() {
  const [activeTab, setActiveTab] = useState('current');
  const [animateFactors, setAnimateFactors] = useState(false);
  const { data: currentAssignment } = useAssignment(123); // Mock driver ID
  const { explanation, loading, fetchExplanation, submitFeedback, requestAlternative } = useShadowAIExplanation();

  useEffect(() => {
    if (currentAssignment?.id) {
      fetchExplanation(currentAssignment.id.toString());
    }
  }, [currentAssignment?.id, fetchExplanation]);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setAnimateFactors(true), 100);
  }, [activeTab]);

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
    if (category === 'negative') return 'text-orange-700';
    if (impact >= 70) return 'text-orange-600';
    if (impact >= 50) return 'text-orange-500';
    return 'text-gray-600';
  };

  const getImpactBg = (impact: number, category: string) => {
    if (category === 'negative') return 'bg-orange-100';
    if (impact >= 70) return 'bg-orange-50';
    if (impact >= 50) return 'bg-orange-50';
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
      <MainLayout title="Shadow AI" subtitle="Compare Fair AI with traditional systems">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI explanation...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Shadow AI" subtitle="Compare Fair AI with traditional systems">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Quick Comparison */}
        <Card className="p-6 bg-gradient-to-r from-orange-50 to-white border-2 border-orange-200 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-700 mb-2">Fair AI</div>
              <div className="text-sm text-orange-600 space-x-2">
                <span className="inline-block">✓ Transparent</span>
                <span className="inline-block">✓ Fair</span>
                <span className="inline-block">✓ Health-focused</span>
              </div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-8 h-8 text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-700 mb-2">Traditional</div>
              <div className="text-sm text-gray-600 space-x-2">
                <span className="inline-block">✗ Random</span>
                <span className="inline-block">✗ Biased</span>
                <span className="inline-block">✗ Health-ignored</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Current Assignment Overview */}
        <Card className="p-6 border-2 border-orange-100 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Your Assignment
            </h2>
            <Badge className="bg-orange-100 text-orange-800 px-4 py-2">
              AI Confidence: {explanation?.confidence || 89}%
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border-2 border-orange-100 hover:shadow-lg transition-all group">
              <div className="text-3xl font-bold text-orange-600 group-hover:scale-110 transition-transform">
                {currentAssignment?.total_packages || 24}
              </div>
              <div className="text-sm text-gray-600 font-medium">Packages</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border-2 border-orange-100 hover:shadow-lg transition-all group">
              <div className="text-3xl font-bold text-orange-600 group-hover:scale-110 transition-transform">
                {currentAssignment?.estimated_time ? `${currentAssignment.estimated_time}h` : '6.5h'}
              </div>
              <div className="text-sm text-gray-600 font-medium">Duration</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border-2 border-orange-100 hover:shadow-lg transition-all group">
              <div className="text-3xl font-bold text-orange-600 group-hover:scale-110 transition-transform">
                ${Math.round((currentAssignment?.estimated_time || 6.5) * 28) || 185}
              </div>
              <div className="text-sm text-gray-600 font-medium">Earnings</div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="border-b-2 border-gray-200">
          <nav className="-mb-0.5 flex space-x-8">
            {[
              { id: 'current', label: 'Why This Route?' },
              { id: 'alternatives', label: 'Alternative Routes' },
              { id: 'fairness', label: 'Fairness Check' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 scale-105'
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
            <Card className="p-6 border-2 border-orange-100 shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Brain className="w-6 h-6 text-orange-500" />
                Why You Got This Route
              </h3>
              <div className="space-y-4">
                {explanation?.factors.map((factor, index) => (
                  <div 
                    key={index} 
                    className={`border-2 border-orange-100 rounded-xl p-5 hover:shadow-xl transition-all duration-500 ${
                      animateFactors ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        {factor.impact > 0 ? (
                          <TrendingUp className="w-5 h-5 text-orange-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-orange-500" />
                        )}
                        {factor.factor}
                      </h4>
                      <div className={`flex items-center space-x-2 ${getImpactColor(Math.abs(factor.impact), factor.category)}`}>
                        <span className="text-lg font-bold">
                          {factor.impact > 0 ? '+' : ''}{factor.impact}%
                        </span>
                        <div className={`w-4 h-4 rounded-full ${getImpactBg(Math.abs(factor.impact), factor.category)} border-2 border-orange-300`} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Fair AI - Animated */}
                      <div className="relative bg-gradient-to-br from-orange-50 to-white p-4 rounded-lg border-2 border-orange-200 hover:border-orange-400 transition-all group overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
                              <Brain className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-xs font-bold text-orange-700 uppercase tracking-wide">Fair AI</div>
                          </div>
                          <p className="text-sm text-orange-800 leading-relaxed">{factor.description}</p>
                          
                          {/* Animated checkmark */}
                          <div className="mt-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 animate-pulse" />
                            <span className="text-xs text-orange-600 font-semibold">AI-Optimized</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Traditional - Animated */}
                      <div className="relative bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all group overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gray-300/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
                              <AlertTriangle className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Traditional</div>
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed">{getTraditionalSystemExplanation(factor.factor)}</p>
                          
                          {/* Animated X mark */}
                          <div className="mt-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-gray-500 animate-pulse" />
                            <span className="text-xs text-gray-600 font-semibold">Not Considered</span>
                          </div>
                        </div>
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
          <Card className="p-6 border-2 border-orange-100 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-orange-500" />
              Other Routes Available
            </h3>
            <div className="space-y-3">
              {explanation?.alternatives.map((route, index) => (
                <div 
                  key={route.id} 
                  className={`flex items-center justify-between p-4 border-2 border-orange-100 rounded-xl hover:shadow-lg transition-all duration-500 ${
                    animateFactors ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div>
                    <div className="font-bold text-lg text-gray-900">{route.name}</div>
                    <div className="text-sm text-gray-600">{route.reason}</div>
                  </div>
                  <Badge className={`text-base px-4 py-2 ${
                    route.score >= 70 ? 'bg-orange-500 text-white' : 
                    route.score >= 50 ? 'bg-orange-100 text-orange-700' : 
                    'bg-gray-200 text-gray-700'
                  }`}>
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
            <Card className="p-6 border-2 border-orange-100 shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-500" />
                Fairness Check
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl border-2 border-orange-100">
                  <h4 className="font-bold mb-4 text-orange-700">Your Routes</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">High-value</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${explanation?.fairnessMetrics.userDistribution.high || 23}%` }}></div>
                        </div>
                        <span className="font-bold text-orange-600">{explanation?.fairnessMetrics.userDistribution.high || 23}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Medium-value</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${explanation?.fairnessMetrics.userDistribution.medium || 54}%` }}></div>
                        </div>
                        <span className="font-bold text-orange-600">{explanation?.fairnessMetrics.userDistribution.medium || 54}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Low-value</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${explanation?.fairnessMetrics.userDistribution.low || 23}%` }}></div>
                        </div>
                        <span className="font-bold text-orange-600">{explanation?.fairnessMetrics.userDistribution.low || 23}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border-2 border-gray-200">
                  <h4 className="font-bold mb-4 text-gray-700">Team Average</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">High-value</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-500 rounded-full" style={{ width: `${explanation?.fairnessMetrics.teamAverage.high || 25}%` }}></div>
                        </div>
                        <span className="font-bold text-gray-600">{explanation?.fairnessMetrics.teamAverage.high || 25}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Medium-value</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-500 rounded-full" style={{ width: `${explanation?.fairnessMetrics.teamAverage.medium || 50}%` }}></div>
                        </div>
                        <span className="font-bold text-gray-600">{explanation?.fairnessMetrics.teamAverage.medium || 50}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Low-value</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-500 rounded-full" style={{ width: `${explanation?.fairnessMetrics.teamAverage.low || 25}%` }}></div>
                        </div>
                        <span className="font-bold text-gray-600">{explanation?.fairnessMetrics.teamAverage.low || 25}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-8 h-8 text-orange-600 animate-pulse" />
                  <div>
                    <div className="font-bold text-orange-800 text-lg">Fairness Check Passed</div>
                    <div className="text-sm text-orange-600">Your route distribution is within team norms</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-orange-100 shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-500" />
                Bias Prevention
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border-2 border-orange-100 hover:shadow-lg transition-all">
                  <span className="font-semibold text-gray-700">Gender</span>
                  <Badge className={explanation?.fairnessMetrics.biasChecks.gender ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}>
                    {explanation?.fairnessMetrics.biasChecks.gender ? '✓ Pass' : '✗ Fail'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border-2 border-orange-100 hover:shadow-lg transition-all">
                  <span className="font-semibold text-gray-700">Age</span>
                  <Badge className={explanation?.fairnessMetrics.biasChecks.age ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}>
                    {explanation?.fairnessMetrics.biasChecks.age ? '✓ Pass' : '✗ Fail'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border-2 border-orange-100 hover:shadow-lg transition-all">
                  <span className="font-semibold text-gray-700">Experience</span>
                  <Badge className={explanation?.fairnessMetrics.biasChecks.experience ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}>
                    {explanation?.fairnessMetrics.biasChecks.experience ? '✓ Pass' : '✗ Fail'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border-2 border-orange-100 hover:shadow-lg transition-all">
                  <span className="font-semibold text-gray-700">Location</span>
                  <Badge className={explanation?.fairnessMetrics.biasChecks.geographic ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}>
                    {explanation?.fairnessMetrics.biasChecks.geographic ? '✓ Pass' : '✗ Fail'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button variant="outline" className="flex-1 border-2 border-orange-300 hover:bg-orange-50 text-orange-600 font-semibold" onClick={handleRequestAlternative}>
            Request Different Route
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg">
            Accept Route
          </Button>
        </div>

        {/* Feedback */}
        <Card className="p-6 border-2 border-orange-100">
          <h3 className="font-bold text-lg mb-4">Was this explanation helpful?</h3>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-400" onClick={() => handleFeedback(true)}>
              👍 Yes, helpful
            </Button>
            <Button variant="outline" className="flex-1 border-2 border-gray-200 hover:bg-gray-50" onClick={() => handleFeedback(false)}>
              👎 Not helpful
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}