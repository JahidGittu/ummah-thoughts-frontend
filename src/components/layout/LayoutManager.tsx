'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LiveStatusBar } from '../home/LiveStatusBar';
import { BackToTop } from '../shared/BackToTop';
import { ErrorBoundary } from '../shared/ErrorBoundary';

const HIDE_LAYOUT_PATHS = [
  '/auth/login',
  '/auth/register',
  '/dashboard',
  '/dashboard/',
];

const HIDE_PATTERN = /^\/dashboard(\/.*)?$/; // Hide on all dashboard subpaths
const STREAM_PATTERN = /^\/debates\/[^/]+\/stream$/; // OBS stream view - no navbar/footer

export function LayoutManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current path should hide layout elements
  const shouldHideLayout =
    HIDE_LAYOUT_PATHS.includes(pathname) ||
    HIDE_PATTERN.test(pathname) ||
    STREAM_PATTERN.test(pathname);

  if (shouldHideLayout) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <LiveStatusBar />
      <Footer />
      <BackToTop />
    </>
  );
}