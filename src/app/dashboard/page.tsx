'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ScholarDashboardHome from '@/components/dashboard/roles/ScholarDashboardHome';
import WriterDashboardHome from '@/components/dashboard/roles/WriterDashboardHome';
import UserDashboardHome from '@/components/dashboard/roles/UserDashboardHome';
import AdminDashboardHome from '@/components/dashboard/roles/AdminDashboardHome';

export default function DashboardHomePage() {
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
      return <ScholarDashboardHome />;
    case 'writer':
      return <WriterDashboardHome />;
    case 'admin':
      return <AdminDashboardHome />;
    case 'user':
    default:
      return <UserDashboardHome />;
  }
}