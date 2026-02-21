'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ScholarNotifications from '@/components/dashboard/scholar/ScholarNotifications';
import WriterNotifications from '@/components/dashboard/writer/WriterNotifications';
import UserNotifications from '@/components/dashboard/user/UserNotifications';
import AdminNotifications from '@/components/dashboard/admin/AdminNotifications';

export default function NotificationsPage() {
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
      return <ScholarNotifications />;
    case 'writer':
      return <WriterNotifications />;
    case 'admin':
      return <AdminNotifications />;
    case 'user':
    default:
      return <UserNotifications />;
  }
}