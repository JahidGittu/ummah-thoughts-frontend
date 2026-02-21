import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Lightbulb, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalogyCardProps {
  title: string;
  titleBn?: string;
  analogy: string;
  analogyBn?: string;
  explanation: string;
  explanationBn?: string;
  className?: string;
}

export const AnalogyCard = ({
  title,
  titleBn,
  analogy,
  analogyBn,
  explanation,
  explanationBn,
  className,
}: AnalogyCardProps) => {
  const { t, i18n } = useTranslation();
  
  const isBengali = i18n.language === 'bn';
  const displayTitle = isBengali && titleBn ? titleBn : title;
  const displayAnalogy = isBengali && analogyBn ? analogyBn : analogy;
  const displayExplanation = isBengali && explanationBn ? explanationBn : explanation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('analogy-card', className)}
    >
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <span className="text-xs font-medium text-secondary uppercase tracking-wide">
            {t('analogy.badge')}
          </span>
          <h4 className="font-display text-lg font-semibold text-foreground">
            {displayTitle}
          </h4>
        </div>
      </div>

      {/* Analogy Quote */}
      <div className="relative z-10 bg-secondary/5 rounded-lg p-5 mb-4 border-l-4 border-secondary">
        <Quote className="absolute top-3 right-3 w-6 h-6 text-secondary/20" />
        <p className="text-foreground font-medium italic leading-relaxed pr-8">
          "{displayAnalogy}"
        </p>
      </div>

      {/* Explanation */}
      <div className="relative z-10">
        <p className="text-muted-foreground leading-relaxed">
          {displayExplanation}
        </p>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-xl">
        <div className="absolute top-3 right-3 w-16 h-16 border-2 border-secondary/10 rounded-lg rotate-12 transform origin-center" />
      </div>
    </motion.div>
  );
};
