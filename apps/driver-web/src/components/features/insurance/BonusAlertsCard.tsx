'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Clock, CheckCircle, AlertCircle, TrendingUp, Gift, Zap } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

const mockBonuses = [
  {
    id: 1,
    amount: 50,
    reason: 'Traffic jam on MG Road',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    validated: true,
    type: 'traffic' as const
  },
  {
    id: 2,
    amount: 25,
    reason: 'Road closure due to construction',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    validated: true,
    type: 'construction' as const
  },
  {
    id: 3,
    amount: 30,
    reason: 'Heavy rain delay',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    validated: false,
    type: 'weather' as const
  },
  {
    id: 4,
    amount: 15,
    reason: 'Building elevator maintenance',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    validated: true,
    type: 'building' as const
  }
];

export function BonusAlertsCard() {
  const [showAll, setShowAll] = useState(false);

  const totalToday = mockBonuses
    .filter(bonus => new Date(bonus.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, bonus) => sum + bonus.amount, 0);

  const totalValidated = mockBonuses
    .filter(bonus => bonus.validated)
    .reduce((sum, bonus) => sum + bonus.amount, 0);

  const pendingAmount = mockBonuses
    .filter(bonus => !bonus.validated)
    .reduce((sum, bonus) => sum + bonus.amount, 0);

  const bonusesToShow = showAll ? mockBonuses : mockBonuses.slice(0, 3);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'traffic': return AlertCircle;
      case 'construction': return AlertCircle;
      case 'weather': return AlertCircle;
      case 'building': return AlertCircle;
      default: return Gift;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'traffic': return 'text-orange-500';
      case 'construction': return 'text-blue-500';
      case 'weather': return 'text-blue-500';
      case 'building': return 'text-purple-500';
      default: return 'text-green-500';
    }
  };

  return (
    <Card interactive className="fairai-card-interactive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <span className="text-heading">Bonus Alerts</span>
              <Badge className="fairai-live-badge ml-2">
                <Zap className="w-3 h-3" />
                EARNING
              </Badge>
            </div>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-card">
        {/* Hero Stats */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-5 hover-lift">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-value text-orange-600">{formatCurrency(totalToday)}</div>
              <div className="text-caption">Today</div>
            </div>
            <div>
              <div className="text-value text-orange-600">{formatCurrency(totalValidated)}</div>
              <div className="text-caption">Confirmed</div>
            </div>
            <div>
              <div className="text-value text-orange-600">{formatCurrency(pendingAmount)}</div>
              <div className="text-caption">Pending</div>
            </div>
          </div>
        </div>

        {/* Recent Bonuses */}
        <div className="space-tight">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-label">Recent Bonuses</h4>
            <Badge variant="secondary" className="text-xs">
              {mockBonuses.length} total
            </Badge>
          </div>

          {bonusesToShow.length > 0 ? (
            <div className="space-y-3">
              {bonusesToShow.map((bonus) => {
                const TypeIcon = getTypeIcon(bonus.type);
                const typeColor = getTypeColor(bonus.type);
                
                return (
                  <div 
                    key={bonus.id}
                    className="bg-white border border-gray-100 rounded-lg p-3 hover-lift"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon className={`w-4 h-4 ${typeColor}`} />
                        <span className="font-medium text-orange-700 text-sm">
                          {formatCurrency(bonus.amount)}
                        </span>
                        {bonus.validated ? (
                          <CheckCircle className="w-3 h-3 text-orange-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-orange-500" />
                        )}
                      </div>
                      <Badge className={`text-xs ${
                        bonus.validated ? 'fairai-status-good' : 'fairai-status-warning'
                      }`}>
                        {bonus.validated ? 'Confirmed' : 'Pending'}
                      </Badge>
                    </div>
                    
                    <p className="text-caption text-black/70 mb-2">{bonus.reason}</p>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-black/40" />
                      <span className="text-caption text-black/60">
                        {formatRelativeTime(bonus.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-subheading text-black/60 mb-2">No bonuses yet today</p>
              <p className="text-body text-black/40">Keep delivering - bonuses are automatic!</p>
            </div>
          )}
        </div>

        {/* AI Insight */}
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div>
              <p className="text-caption font-medium text-orange-800 mb-1">Bonus Tip</p>
              <p className="text-caption text-orange-700">
                {totalToday > 50 
                  ? "Great earning day! You're getting fair compensation for challenging conditions."
                  : "Bonuses are automatically detected and added when you face unexpected delays."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption">This Week's Bonuses</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-value-sm text-green-600">{formatCurrency(totalValidated + 120)}</span>
            <Badge className="fairai-status-good">+18% vs last week</Badge>
          </div>
        </div>

        {/* Action Button */}
        {mockBonuses.length > 3 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `View All ${mockBonuses.length} Bonuses`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}