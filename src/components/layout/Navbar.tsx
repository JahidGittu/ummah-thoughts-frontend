'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  BookOpen,
  Moon,
  Sun,
  LayoutDashboard,
  LogIn,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

export const Navbar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Always start with false (light) to match server render
  const [isDark, setIsDark] = useState(false);

  // After hydration, load the actual theme preference
  useEffect(() => {
    const stored = localStorage.getItem('ummahthoughts-theme');
    if (stored) {
      setIsDark(stored === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Sync document class and localStorage when theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ummahthoughts-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ummahthoughts-theme', 'light');
    }
  }, [isDark]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  const navLinks: NavLink[] = [
    { name: t('nav.archive'), href: '/archive' },
    { name: t('nav.topics'), href: '/topics' },
    { name: t('nav.debates'), href: '/debates' },
    { name: t('nav.battles'), href: '/battles' },
    { name: t('nav.tools'), href: '/tools' },
    { name: t('nav.scholars'), href: '/scholars' },
    { name: t('nav.methodology'), href: '/methodology' },
    { name: t('nav.about'), href: '/about' },
  ];

  const handleThemeToggle = () => {
    setIsDark(prev => !prev);
  };

  const handleSearch = () => {
    router.push('/search');
  };

  const handleDashboard = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === href;
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              prefetch={false}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all"
              >
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </motion.div>

              <div className="hidden sm:block">
                <h1 className="font-display text-lg font-bold text-foreground leading-none tracking-tight">
                  Ummah Thoughts
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5 font-body">
                  {t('app.tagline', 'Islamic Knowledge')}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(link.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                  prefetch={true}
                >
                  {link.name}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearch}
                className="hidden sm:flex h-9 w-9 rounded-xl hover:bg-muted/60"
                aria-label={t('common.search')}
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Language switcher */}
              <LanguageSwitcher variant="minimal" className="hidden sm:flex" />

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="h-9 w-9 rounded-xl hover:bg-muted/60"
                aria-label={t('common.toggleTheme', 'Toggle theme')}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDark ? 'sun' : 'moon'}
                    initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>

              {/* Auth buttons */}
              {!isLoading && (
                <>
                  {user ? (
                    <div className="hidden sm:flex items-center gap-2">
                      <Button
                        onClick={handleDashboard}
                        className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm text-sm px-4 gap-1.5"
                        size="sm"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        {t('nav.dashboard', 'Dashboard')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="h-9 w-9 rounded-xl hover:bg-muted/60"
                        aria-label={t('common.logout', 'Logout')}
                      >
                        <User className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => router.push('/auth/login')}
                      className="hidden sm:flex h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm text-sm px-4 gap-1.5"
                      size="sm"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      {t('common.signIn', 'Sign In')}
                    </Button>
                  )}
                </>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 rounded-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? t('common.close') : t('common.menu')}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isMobileMenuOpen ? 'x' : 'menu'}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-border/50 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-5 space-y-1">
                {/* Mobile navigation links */}
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive(link.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted/60'
                      )}
                    >
                      <span>{link.name}</span>
                      {isActive(link.href) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile auth section */}
                {!isLoading && user && (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.04 }}
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <span>{t('common.logout', 'Logout')}</span>
                    </button>
                  </motion.div>
                )}

                {/* Mobile footer actions */}
                <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3">
                  <LanguageSwitcher variant="toggle" className="flex-1 justify-center" />

                  {!user && !isLoading && (
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push('/auth/login');
                      }}
                      className="flex-1 rounded-xl h-9 text-sm gap-2"
                      variant="default"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      {t('common.signIn', 'Sign In')}
                    </Button>
                  )}

                  <Button
                    onClick={handleSearch}
                    variant="outline"
                    className="flex-1 rounded-xl h-9 text-sm gap-2"
                  >
                    <Search className="w-3.5 h-3.5" />
                    {t('common.search', 'Search')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};