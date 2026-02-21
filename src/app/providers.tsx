"use client"

import { AuthProvider } from '@/contexts/AuthContext';
import { AdminActivityProvider } from '@/contexts/AdminActivityContext';
import { ReactNode } from 'react';
import i18n from '@/i18n';
import { I18nextProvider } from 'react-i18next';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <AdminActivityProvider>
          {children}
        </AdminActivityProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}