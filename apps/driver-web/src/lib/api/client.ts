// Mock API client for development
const mockExplanationData = {
  assignmentId: '123',
  confidence: 0.85,
  factors: [
    {
      factor: 'Experience Level',
      impact: -2.5,
      description: 'Your high experience level reduces difficulty',
      category: 'positive' as const
    },
    {
      factor: 'Weather Conditions',
      impact: 1.8,
      description: 'Light rain increases delivery complexity',
      category: 'negative' as const
    },
    {
      factor: 'Building Accessibility',
      impact: 0.5,
      description: 'Most buildings have lift access',
      category: 'neutral' as const
    }
  ],
  alternatives: [
    {
      id: 'alt-1',
      name: 'Route B',
      reason: 'Fewer stairs, similar distance',
      score: 75
    }
  ],
  fairnessMetrics: {
    userDistribution: { high: 20, medium: 60, low: 20 },
    teamAverage: { high: 25, medium: 50, low: 25 },
    biasChecks: { gender: true, age: true, experience: true, geographic: true }
  },
  decisionProcess: [
    {
      step: 'Data Collection',
      description: 'Gathered driver profile and route data',
      status: 'completed' as const
    }
  ]
};

export const apiClient = {
  get: async (url: string) => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (url.includes('/explanation')) {
      return { data: mockExplanationData };
    }
    
    return { data: null };
  },
  post: async (url: string, data: any) => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { success: true } };
  },
  put: async (url: string, data: any) => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { success: true } };
  },
  delete: async (url: string) => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { success: true } };
  }
};