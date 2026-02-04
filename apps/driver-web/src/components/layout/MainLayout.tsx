'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageTransition } from '@/components/ui/PageTransition';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header title={title} subtitle={subtitle} />
        
        {/* Content with Page Transition */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}