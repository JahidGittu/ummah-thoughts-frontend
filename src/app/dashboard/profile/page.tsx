'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ScholarProfile from '@/components/dashboard/scholar/ScholarProfile';
import WriterProfile from '@/components/dashboard/writer/WriterProfile';
import UserProfile from '@/components/dashboard/user/UserProfile';

export default function ProfilePage() {
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
      return <ScholarProfile />;
    case 'writer':
      return <WriterProfile />;
    case 'user':
      return <UserProfile />;
    default:
      router.push('/dashboard');
      return null;
  }
}