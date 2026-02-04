'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Shield, LogOut, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = React.useState({
    pushEnabled: true,
    healthAlerts: true,
    swapNotifications: true,
    assignmentUpdates: true,
    bonusAlerts: true
  });

  const handleLogout = () => {
    localStorage.removeItem('fairai_token');
    localStorage.removeItem('fairai_user');
    window.location.href = '/login';
  };

  return (
    <MainLayout title="Settings" subtitle="Manage your app preferences">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Notifications */}
        <Card className="fairai-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-black">Push Notifications</div>
                <div className="text-sm text-black/60">Receive notifications on your device</div>
              </div>
              <Switch
                checked={notifications.pushEnabled}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, pushEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-black">Health Alerts</div>
                <div className="text-sm text-black/60">Get notified about health risks</div>
              </div>
              <Switch
                checked={notifications.healthAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, healthAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-black">Swap Notifications</div>
                <div className="text-sm text-black/60">Route swap requests and updates</div>
              </div>
              <Switch
                checked={notifications.swapNotifications}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, swapNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-black">Assignment Updates</div>
                <div className="text-sm text-black/60">Daily assignment notifications</div>
              </div>
              <Switch
                checked={notifications.assignmentUpdates}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, assignmentUpdates: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-black">Bonus Alerts</div>
                <div className="text-sm text-black/60">Insurance bonus notifications</div>
              </div>
              <Switch
                checked={notifications.bonusAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, bonusAlerts: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="fairai-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-orange-500" />
              App Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-black/60">Version</span>
              <span className="font-medium text-black">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">Build</span>
              <span className="font-medium text-black">2026.02.04</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">Last Updated</span>
              <span className="font-medium text-black">Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="fairai-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Settings className="w-4 h-4" />
              Privacy Policy
            </Button>
            
            <Button variant="outline" className="w-full justify-start gap-2">
              <Shield className="w-4 h-4" />
              Terms of Service
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}