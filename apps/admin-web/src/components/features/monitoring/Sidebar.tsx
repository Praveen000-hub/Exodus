'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  ArrowLeftRight,
  Activity,
  Shield,
  Target,
  Brain,
  BarChart3,
  Heart,
  Coffee,
  DollarSign,
  Sparkles,
  MapPin,
  FileText,
  Settings,
  Database,
  Lock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

const navigation: NavSection[] = [
  {
    title: 'Main',
    items: [
      { name: 'Overview', href: '/overview', icon: LayoutDashboard },
    ]
  },
  {
    title: '7 AI Innovations',
    items: [
      { name: 'Difficulty & Shadow AI', href: '/difficulty', icon: Target, badge: '1' },
      { name: 'Workload Forecast', href: '/forecast', icon: TrendingUp, badge: '2' },
      { name: 'Health & Safety', href: '/health-safety', icon: Heart, badge: '3' },
      { name: 'Fair Assignment', href: '/fair-assignment', icon: Shield, badge: '4' },
      { name: 'Explainability (SHAP)', href: '/explainability', icon: Brain, badge: '5' },
      { name: 'Fatigue & Breaks', href: '/fatigue', icon: Coffee, badge: '6' },
      { name: 'Earnings Insights', href: '/earnings', icon: DollarSign, badge: '7' },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Driver Management', href: '/drivers', icon: Users },
      { name: 'Assignments', href: '/assignments', icon: Calendar },
      { name: 'Route Monitor', href: '/monitoring', icon: MapPin },
      { name: 'Swap Marketplace', href: '/swaps', icon: ArrowLeftRight },
      { name: 'Incidents', href: '/interventions', icon: AlertTriangle },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Analytics & SLA', href: '/analytics', icon: BarChart3 },
      { name: 'Configuration', href: '/configuration', icon: Settings },
      { name: 'Audit Logs', href: '/audit-logs', icon: Lock },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '7 AI Innovations': true,
    'Operations': true,
  });

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 px-6 pb-4 shadow-xl">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">FaIr_AI</h1>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-6">
            {navigation.map((section) => (
              <li key={section.title}>
                {section.title !== 'Main' && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center justify-between w-full px-2 py-1 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors"
                  >
                    <span>{section.title}</span>
                    {expandedSections[section.title] ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                )}
                {(section.title === 'Main' || expandedSections[section.title]) && (
                  <ul role="list" className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              'group flex items-center justify-between gap-x-3 rounded-lg p-2.5 text-sm font-medium transition-all',
                              isActive
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            )}
                          >
                            <div className="flex items-center gap-x-3">
                              <item.icon
                                className={cn(
                                  'h-5 w-5 shrink-0',
                                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                )}
                              />
                              <span>{item.name}</span>
                            </div>
                            {item.badge && (
                              <span className={cn(
                                "inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full",
                                isActive 
                                  ? "bg-white text-green-600" 
                                  : "bg-green-600 text-white"
                              )}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* System Status */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-center gap-2 text-sm mb-2">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-300">All Systems Operational</span>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span className="text-green-400">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="text-gray-400">v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
