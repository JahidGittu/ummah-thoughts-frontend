'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ScholarAnalytics from '@/components/dashboard/scholar/ScholarAnalytics';
import WriterAnalytics from '@/components/dashboard/writer/WriterAnalytics';
import AdminAnalytics from '@/components/dashboard/admin/AdminAnalytics';

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'scholar':
      return <ScholarAnalytics />;
    case 'writer':
      return <WriterAnalytics />;
    case 'admin':
      return <AdminAnalytics />;
    default:
      router.push('/dashboard');
      return null;
  }
}