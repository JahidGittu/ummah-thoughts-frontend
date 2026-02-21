import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DalilProps {
  arabic: string;
  translation: string;
  translationBn?: string;
  source: string;
  sourceBn?: string;
  sourceUrl?: string;
  type: 'quran' | 'hadith';
  className?: string;
}

export const Dalil = ({
  arabic,
  translation,
  translationBn,
  source,
  sourceBn,
  sourceUrl,
  type,
  className,
}: DalilProps) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const isBengali = i18n.language === 'bn';
  const displayTranslation = isBengali && translationBn ? translationBn : translation;
  const displaySource = isBengali && sourceBn ? sourceBn : source;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${arabic}\n\n${displayTranslation}\n— ${displaySource}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFontSize = () => {
    setFontSize((prev) => (prev === 'normal' ? 'large' : 'normal'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('dalil-container', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
            type === 'quran'
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary/10 text-secondary'
          )}
        >
          {type === 'quran' ? t('dalil.quranicVerse') : t('dalil.propheticHadith')}
        </span>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFontSize}
            className="h-8 w-8"
            title="Toggle font size"
          >
            <Type className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8"
            title={t('common.copy')}
          >
            {copied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Arabic Text */}
      <p
        className={cn(
          'font-arabic text-foreground text-center leading-loose mb-4 transition-all',
          fontSize === 'normal' ? 'text-2xl' : 'text-3xl'
        )}
      >
        {arabic}
      </p>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-border" />
        <div className="w-2 h-2 rounded-full bg-primary/30" />
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Translation */}
      <p className="text-foreground/80 text-center italic leading-relaxed mb-4">
        "{displayTranslation}"
      </p>

      {/* Source */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">— {displaySource}</span>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
};
