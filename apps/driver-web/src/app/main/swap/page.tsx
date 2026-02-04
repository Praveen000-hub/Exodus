'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SwapCard } from '@/components/features/swaps/SwapCard';
import { SwapFilters } from '@/components/features/swaps/SwapFilters';
import { SwapDetailsModal } from '@/components/features/swaps/SwapDetailsModal';
import { 
  ArrowLeftRight, 
  Package, 
  Clock, 
  DollarSign,
  MapPin,
  Heart,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface SwapRequest {
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
}

const mockCurrentAssignment = {
  packages: 10,
  difficulty: 68,
  distance: 18.5,
  estimatedTime: 4.2,
  earnings: 756,
  location: 'Koramangala',
  hasLift: true,
  weatherImpact: 'neutral' as const
};

const mockSwapRequests: SwapRequest[] = [
  {
    id: 1,
    requesterName: 'Rajesh Kumar',
    requesterRating: 4.8,
    difficulty: 45,
    packages: 8,
    distance: 12.3,
    estimatedTime: 3.1,
    compatibilityScore: 0.94,
    reason: 'Family emergency - need to pick up child from school',
    urgency: 'high',
    floorsSaved: 15,
    timeSaved: '1.1 hours',
    earnings: 558,
    location: 'Indiranagar',
    hasLift: true,
    weatherImpact: 'positive',
    timePosted: '5 min ago',
    expiresIn: 25,
    benefits: ['Shorter route', 'Better weather', 'Lift available', 'Less traffic'],
    risks: ['Lower earnings', 'Unfamiliar area']
  },
  {
    id: 2,
    requesterName: 'Priya Sharma',
    requesterRating: 4.6,
    difficulty: 72,
    packages: 12,
    distance: 22.1,
    estimatedTime: 5.3,
    compatibilityScore: 0.87,
    reason: 'Medical appointment cannot be rescheduled',
    urgency: 'medium',
    floorsSaved: -3,
    timeSaved: '-0.8 hours',
    earnings: 954,
    location: 'Whitefield',
    hasLift: false,
    weatherImpact: 'negative',
    timePosted: '12 min ago',
    expiresIn: 48,
    benefits: ['Higher earnings', 'Familiar area', 'Good customer ratings'],
    risks: ['More packages', 'No lift', 'Rain expected']
  },
  {
    id: 3,
    requesterName: 'Amit Patel',
    requesterRating: 4.9,
    difficulty: 58,
    packages: 9,
    distance: 16.8,
    estimatedTime: 3.8,
    compatibilityScore: 0.91,
    reason: 'Vehicle maintenance scheduled',
    urgency: 'low',
    floorsSaved: 8,
    timeSaved: '0.4 hours',
    earnings: 684,
    location: 'HSR Layout',
    hasLift: true,
    weatherImpact: 'neutral',
    timePosted: '18 min ago',
    expiresIn: 72,
    benefits: ['Moderate difficulty', 'Good location', 'Reliable driver'],
    risks: ['Slightly longer route']
  }
];

const mockSwapHistory = [
  {
    id: 101,
    date: '2024-01-15',
    partnerName: 'Suresh Reddy',
    status: 'completed',
    satisfaction: 5,
    savedTime: '1.2 hours',
    reason: 'Traffic jam avoided'
  },
  {
    id: 102,
    date: '2024-01-10',
    partnerName: 'Kavya Nair',
    status: 'completed',
    satisfaction: 4,
    savedTime: '0.8 hours',
    reason: 'Better route efficiency'
  }
];

export default function SwapPage() {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [swapRequests, setSwapRequests] = useState(mockSwapRequests);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSwapRequests(prev => prev.map(swap => ({
        ...swap,
        expiresIn: Math.max(0, swap.expiresIn - 1)
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const filteredSwaps = swapRequests.filter(swap => {
    if (filter === 'urgent') return swap.urgency === 'high';
    if (filter === 'beneficial') return swap.difficulty < mockCurrentAssignment.difficulty;
    if (filter === 'expiring') return swap.expiresIn < 30;
    return true;
  });

  const swapCounts = {
    all: swapRequests.length,
    urgent: swapRequests.filter(s => s.urgency === 'high').length,
    beneficial: swapRequests.filter(s => s.difficulty < mockCurrentAssignment.difficulty).length,
    expiring: swapRequests.filter(s => s.expiresIn < 30).length
  };

  const handleViewDetails = (swap: SwapRequest) => {
    setSelectedSwap(swap);
    setShowDetailsModal(true);
  };

  const handleAcceptSwap = (swapId: number) => {
    // Handle swap acceptance logic
    console.log('Accepting swap:', swapId);
    setShowDetailsModal(false);
  };

  return (
    <MainLayout title="Swap Marketplace" subtitle="Smart route exchanges with AI matching">
      <div className="max-w-7xl mx-auto space-section">
        {/* Header Stats & Actions */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-heading mb-1">Active Swaps Available</h2>
              <p className="text-body">AI-matched opportunities based on your profile</p>
            </div>
            <Badge className="fairai-live-badge">
              <div className="fairai-live-dot" />
              {filteredSwaps.length} LIVE
            </Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-value text-orange-600">{filteredSwaps.length}</div>
              <div className="text-caption">Available</div>
            </div>
            <div className="text-center">
              <div className="text-value text-green-600">{swapCounts.beneficial}</div>
              <div className="text-caption">Easier</div>
            </div>
            <div className="text-center">
              <div className="text-value text-blue-600">{swapCounts.urgent}</div>
              <div className="text-caption">Urgent</div>
            </div>
            <div className="text-center">
              <div className="text-value text-purple-600">{swapCounts.expiring}</div>
              <div className="text-caption">Expiring</div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="current">My Route</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </div>

          <SwapFilters
            activeFilter={filter}
            onFilterChange={setFilter}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            swapCounts={swapCounts}
          />

          <TabsContent value="available" className="fade-in mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSwaps.map((swap) => (
                <SwapCard
                  key={swap.id}
                  swap={swap}
                  currentAssignment={mockCurrentAssignment}
                  onViewDetails={() => handleViewDetails(swap)}
                  onAcceptSwap={() => handleAcceptSwap(swap.id)}
                />
              ))}

              {filteredSwaps.length === 0 && (
                <div className="col-span-2">
                  <Card>
                    <CardContent className="text-center py-12">
                      <ArrowLeftRight className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-subheading text-black/60 mb-2">No swaps match your filters</p>
                      <p className="text-body text-black/40">Try adjusting your filters or check back later</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setFilter('all')}
                      >
                        Show All Swaps
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="current" className="fade-in mt-6">
            <Card interactive className="fairai-card-interactive">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Package className="w-5 h-5 text-orange-500" />
                    </div>
                    Your Current Assignment
                  </CardTitle>
                  <Button className="fairai-button-primary">
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Propose Swap
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-card">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl p-6 hover-lift">
                  <div className="grid grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-value text-orange-600">{mockCurrentAssignment.packages}</div>
                      <div className="text-caption">Packages</div>
                    </div>
                    <div>
                      <div className="text-value text-orange-600">{mockCurrentAssignment.difficulty}/100</div>
                      <div className="text-caption">Difficulty</div>
                    </div>
                    <div>
                      <div className="text-value text-orange-600">{mockCurrentAssignment.distance} km</div>
                      <div className="text-caption">Distance</div>
                    </div>
                    <div>
                      <div className="text-value text-orange-600">{mockCurrentAssignment.estimatedTime}h</div>
                      <div className="text-caption">Est. Time</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-tight">
                    <h4 className="text-label mb-3">Route Details</h4>
                    <div className="fairai-info-row">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{mockCurrentAssignment.location}</span>
                    </div>
                    <div className="fairai-info-row">
                      {mockCurrentAssignment.hasLift ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                      <span>{mockCurrentAssignment.hasLift ? 'Lift available' : 'No lift'}</span>
                    </div>
                  </div>

                  <div className="space-tight">
                    <h4 className="text-label mb-3">Earnings & Benefits</h4>
                    <div className="fairai-info-row">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>₹{mockCurrentAssignment.earnings} estimated</span>
                    </div>
                    <div className="fairai-info-row">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Health score: Good</span>
                    </div>
                    <div className="fairai-info-row">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>Efficiency: 94%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="fade-in mt-6">
            <div className="space-y-4">
              {mockSwapHistory.map((swap) => (
                <Card key={swap.id} className="fairai-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <h3 className="text-subheading">{swap.partnerName}</h3>
                          <p className="text-body text-black/60">{swap.reason}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-caption">{swap.date}</span>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-caption text-green-600">Saved {swap.savedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < swap.satisfaction ? 'bg-yellow-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge className="fairai-status-good">Completed</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockSwapHistory.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-subheading text-black/60 mb-2">No swap history yet</p>
                    <p className="text-body text-black/40">Your completed swaps will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Swap Details Modal */}
        {selectedSwap && (
          <SwapDetailsModal
            swap={selectedSwap}
            currentAssignment={mockCurrentAssignment}
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            onAcceptSwap={() => handleAcceptSwap(selectedSwap.id)}
          />
        )}
      </div>
    </MainLayout>
  );
}