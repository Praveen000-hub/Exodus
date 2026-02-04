'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, ArrowLeftRight, BarChart3, Zap, Navigation, Phone, MessageSquare, Settings, Clock } from 'lucide-react';

const quickActions = [
  {
    id: 'route',
    icon: Map,
    label: 'View Full Route Map',
    description: 'Interactive map with all stops',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    urgent: false,
    action: () => {/* Navigate to route map */}
  },
  {
    id: 'swap',
    icon: ArrowLeftRight,
    label: 'Open Swap Marketplace',
    description: '3 new swap requests available',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    urgent: true,
    action: () => {/* Navigate to swap marketplace */}
  },
  {
    id: 'summary',
    icon: BarChart3,
    label: 'Today\'s Summary',
    description: 'View earnings and performance',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    urgent: false,
    action: () => {/* Navigate to summary */}
  },
  {
    id: 'navigation',
    icon: Navigation,
    label: 'Start Navigation',
    description: 'Begin route with GPS guidance',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    urgent: false,
    action: () => {/* Start navigation */}
  },
  {
    id: 'support',
    icon: Phone,
    label: 'Contact Support',
    description: 'Get help with deliveries',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    urgent: false,
    action: () => {/* Contact support */}
  },
  {
    id: 'feedback',
    icon: MessageSquare,
    label: 'Quick Feedback',
    description: 'Report issues or suggestions',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    urgent: false,
    action: () => {/* Open feedback */}
  }
];

export function QuickActionsCard() {
  const [showAll, setShowAll] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const actionsToShow = showAll ? quickActions : quickActions.slice(0, 4);
  const urgentActions = quickActions.filter(action => action.urgent);

  const handleAction = async (actionId: string, actionFn: () => void) => {
    setLoadingAction(actionId);
    // Simulate action delay
    setTimeout(() => {
      actionFn();
      setLoadingAction(null);
    }, 800);
  };

  return (
    <Card interactive className="fairai-card-interactive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <span className="text-heading">Quick Actions</span>
              {urgentActions.length > 0 && (
                <Badge className="fairai-live-badge ml-2">
                  <Clock className="w-3 h-3" />
                  {urgentActions.length} URGENT
                </Badge>
              )}
            </div>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-card">
        {/* Urgent Actions First */}
        {urgentActions.length > 0 && (
          <div className="space-tight">
            <h4 className="text-label mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Needs Attention
            </h4>
            {urgentActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`w-full justify-start gap-3 h-auto p-3 border-orange-200 hover:bg-orange-50 ${
                    loadingAction === action.id ? 'opacity-50' : ''
                  }`}
                  onClick={() => handleAction(action.id, action.action)}
                  disabled={loadingAction === action.id}
                >
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <Icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-black text-sm">{action.label}</div>
                    <div className="text-caption text-black/60">{action.description}</div>
                  </div>
                  <Badge className="fairai-status-warning">Urgent</Badge>
                </Button>
              );
            })}
          </div>
        )}

        {/* Regular Actions */}
        <div className="space-tight">
          {urgentActions.length > 0 && (
            <h4 className="text-label mb-3">Common Actions</h4>
          )}
          
          <div className="grid grid-cols-1 gap-3">
            {actionsToShow.filter(action => !action.urgent).map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`w-full justify-start gap-3 h-auto p-3 hover-lift ${
                    loadingAction === action.id ? 'opacity-50' : ''
                  }`}
                  onClick={() => handleAction(action.id, action.action)}
                  disabled={loadingAction === action.id}
                >
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <Icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-black text-sm">{action.label}</div>
                    <div className="text-caption text-black/60">{action.description}</div>
                  </div>
                  {loadingAction === action.id && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div>
              <p className="text-caption font-medium text-blue-800 mb-1">Smart Suggestion</p>
              <p className="text-caption text-blue-700">
                {urgentActions.length > 0 
                  ? "Handle urgent swap requests first - they expire in 30 minutes!"
                  : "Start navigation when ready - traffic is light on your route right now."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-value-sm text-blue-600">2</div>
              <div className="text-caption">Active routes</div>
            </div>
            <div>
              <div className="text-value-sm text-green-600">5</div>
              <div className="text-caption">Completed today</div>
            </div>
            <div>
              <div className="text-value-sm text-orange-600">3</div>
              <div className="text-caption">Pending swaps</div>
            </div>
          </div>
        </div>

        {/* Show More/Less Button */}
        {quickActions.length > 4 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={() => setShowAll(!showAll)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAll ? 'Show Less' : `Show All ${quickActions.length} Actions`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}