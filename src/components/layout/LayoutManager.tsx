'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LiveStatusBar } from '../home/LiveStatusBar';
import { BackToTop } from '../shared/BackToTop';

const HIDE_LAYOUT_PATHS = [
  '/auth/login',
  '/auth/register',
  '/dashboard',
  '/dashboard/',
];

const HIDE_PATTERN = /^\/dashboard(\/.*)?$/; // Hide on all dashboard subpaths

export function LayoutManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path should hide layout elements
  const shouldHideLayout = 
    HIDE_LAYOUT_PATHS.includes(pathname) || 
    HIDE_PATTERN.test(pathname);

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <LiveStatusBar />
      <Footer />
      <BackToTop />
    </>
  );
}