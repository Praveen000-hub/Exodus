'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SHAPExplanation } from '@/types/api';

// Extended interface for Shadow AI page
export interface ExplanationData {
  assignmentId: string;
  confidence: number;
  factors: {
    factor: string;
    impact: number;
    description: string;
    category: 'positive' | 'negative' | 'neutral';
  }[];
  alternatives: {
    id: string;
    name: string;
    reason: string;
    score: number;
  }[];
  fairnessMetrics: {
    userDistribution: {
      high: number;
      medium: number;
      low: number;
    };
    teamAverage: {
      high: number;
      medium: number;
      low: number;
    };
    biasChecks: {
      gender: boolean;
      age: boolean;
      experience: boolean;
      geographic: boolean;
    };
  };
  decisionProcess: {
    step: string;
    description: string;
    status: 'completed' | 'in-progress' | 'pending';
  }[];
}

const mockExplanation: SHAPExplanation = {
  total_difficulty: 68,
  top_factors: [
    {
      feature: 'Traffic Conditions',
      impact: 8,
      explanation: 'Rush hour traffic increases difficulty'
    },
    {
      feature: 'Experience Level',
      impact: 5,
      explanation: 'Your experience allows harder routes'
    },
    {
      feature: 'Recent Performance',
      impact: -3,
      explanation: 'You\'ve been doing well, so slightly easier'
    }
  ]
};

// Original hook for SHAP explanations
export function useExplanation(driverId: number) {
  return useQuery({
    queryKey: ['explanation', driverId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockExplanation;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// New hook for Shadow AI transparency page
export const useShadowAIExplanation = () => {
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = useCallback(async (assignmentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock comprehensive explanation data
      const mockData: ExplanationData = {
        assignmentId,
        confidence: 89,
        factors: [
          {
            factor: 'Driver Experience',
            impact: 85,
            description: 'Your 4.8/5 rating and 2+ years experience made you ideal for this complex route',
            category: 'positive'
          },
          {
            factor: 'Location Proximity',
            impact: 72,
            description: 'Starting point is 3.2km from your home address',
            category: 'positive'
          },
          {
            factor: 'Health Score',
            impact: 68,
            description: 'Your current wellness score of 82/100 supports moderate workload',
            category: 'positive'
          },
          {
            factor: 'Traffic Patterns',
            impact: -15,
            description: 'Expected 20% higher traffic during peak hours on this route',
            category: 'negative'
          },
          {
            factor: 'Package Complexity',
            impact: 45,
            description: 'Mix of standard and fragile items matches your handling expertise',
            category: 'positive'
          }
        ],
        alternatives: [
          {
            id: '1',
            name: 'Downtown Express',
            reason: 'Higher traffic, lower driver experience match',
            score: 72
          },
          {
            id: '2',
            name: 'Suburban Loop',
            reason: 'Further from your location, similar complexity',
            score: 68
          },
          {
            id: '3',
            name: 'Industrial Zone',
            reason: 'Heavy packages, not optimal for your health profile',
            score: 45
          }
        ],
        fairnessMetrics: {
          userDistribution: { high: 23, medium: 54, low: 23 },
          teamAverage: { high: 25, medium: 50, low: 25 },
          biasChecks: {
            gender: true,
            age: true,
            experience: true,
            geographic: true
          }
        },
        decisionProcess: [
          {
            step: 'Data Collection',
            description: 'Analyzed your profile, location, and performance history',
            status: 'completed'
          },
          {
            step: 'Route Matching',
            description: 'Compared 47 available routes against your profile',
            status: 'completed'
          },
          {
            step: 'Fairness Validation',
            description: 'Ensured equitable distribution across all drivers',
            status: 'completed'
          },
          {
            step: 'Final Assignment',
            description: 'Selected optimal route with 89% confidence',
            status: 'completed'
          }
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExplanation(mockData);
    } catch (err) {
      setError('Failed to fetch explanation');
      console.error('Explanation fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitFeedback = useCallback(async (assignmentId: string, feedback: {
    helpful: boolean;
    comments?: string;
    rating: number;
  }) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Feedback submitted:', { assignmentId, feedback });
      return true;
    } catch (err) {
      console.error('Feedback submission error:', err);
      return false;
    }
  }, []);

  const requestAlternative = useCallback(async (assignmentId: string, reason: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Alternative route requested:', { assignmentId, reason });
      return { success: true, message: 'Alternative route request submitted' };
    } catch (err) {
      console.error('Alternative route request error:', err);
      throw err;
    }
  }, []);

  return {
    explanation,
    loading,
    error,
    fetchExplanation,
    submitFeedback,
    requestAlternative
  };
};