'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('fairai_token');
    if (token) {
      router.replace('/main');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center animate-pulse">
        <span className="text-white font-bold text-2xl">F</span>
      </div>
    </div>
  );
}