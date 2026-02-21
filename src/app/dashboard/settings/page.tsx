'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ScholarSettings from '@/components/dashboard/scholar/ScholarSettings';
import WriterSettings from '@/components/dashboard/writer/WriterSettings';
import UserSettings from '@/components/dashboard/user/UserSettings';
import AdminSystemSettings from '@/components/dashboard/admin/AdminSystemSettings';

export default function SettingsPage() {
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
      return <ScholarSettings />;
    case 'writer':
      return <WriterSettings />;
    case 'user':
      return <UserSettings />;
    case 'admin':
      return <AdminSystemSettings />;
    default:
      router.push('/dashboard');
      return null;
  }
}