import { apiClient } from './client';

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

export const explanationApi = {
  getExplanation: async (assignmentId: string): Promise<ExplanationData> => {
    const response = await apiClient.get(`/assignments/${assignmentId}/explanation`);
    if (!response.data) {
      throw new Error('No explanation data available');
    }
    return response.data as ExplanationData;
  },

  submitFeedback: async (assignmentId: string, feedback: {
    helpful: boolean;
    comments?: string;
    rating: number;
  }) => {
    const response = await apiClient.post(`/assignments/${assignmentId}/explanation/feedback`, feedback);
    return response.data;
  },

  requestAlternativeRoute: async (assignmentId: string, reason: string) => {
    const response = await apiClient.post(`/assignments/${assignmentId}/request-alternative`, { reason });
    return response.data;
  }
};