// components/shared/LanguageSwitcher.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { changeLanguage } from '@/i18n';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
];

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'toggle' | 'minimal';
  className?: string;
}

export const LanguageSwitcher = ({ variant = 'dropdown', className }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const handleLanguageChange = (code: string) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'toggle') {
    return (
      <div className={cn('flex items-center gap-1 p-1 rounded-lg bg-muted', className)}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              i18n.language === lang.code
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {lang.nativeName}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => {
          const nextLang = i18n.language === 'en' ? 'bn' : 'en';
          handleLanguageChange(nextLang);
        }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
          'text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
          className
        )}
        title={i18n.language === 'en' ? 'বাংলা' : 'English'}
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang.nativeName}</span>
      </button>
    );
  }

  // Dropdown variant (default) - FIXED: Menu items always show both languages
  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
          'border border-border bg-background hover:bg-muted transition-colors',
          isOpen && 'ring-2 ring-primary/20'
        )}
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-base">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
        <ChevronDown className={cn(
          'w-4 h-4 text-muted-foreground transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu - Always show both languages clearly */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[200px] py-1 bg-card border border-border rounded-lg shadow-lg"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                    i18n.language === lang.code
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex-1 flex flex-col items-start">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-muted-foreground">
                      {lang.name} {/* Always show English name for clarity */}
                    </span>
                  </div>
                  {i18n.language === lang.code && (
                    <Check className="w-4 h-4 ml-2" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};