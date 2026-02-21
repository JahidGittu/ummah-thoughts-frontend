import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BiasTransparencyBadgeProps {
  hasDisagreement?: boolean;
  className?: string;
}

export const BiasTransparencyBadge = ({ 
  hasDisagreement = true, 
  className 
}: BiasTransparencyBadgeProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  if (!hasDisagreement) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={className}
        >
          <Badge 
            variant="outline" 
            className="gap-1.5 cursor-help border-secondary/50 text-secondary hover:bg-secondary/10"
          >
            <Search className="w-3 h-3" />
            {isBengali ? 'মতভেদ আছে' : 'Scholarly disagreement exists'}
          </Badge>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">
          {isBengali 
            ? 'এই বিষয়ে আলেমদের মধ্যে মতপার্থক্য রয়েছে। আমরা সকল বৈধ মতামত উপস্থাপন করি।'
            : 'Scholars differ on this topic. We present all valid scholarly opinions with their evidences.'
          }
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

interface SearchExplanationProps {
  filters: {
    topic?: string;
    complexity?: string;
    period?: string;
    scholar?: string;
  };
  className?: string;
}

export const SearchExplanation = ({ filters, className }: SearchExplanationProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const hasFilters = Object.values(filters).some(Boolean);
  if (!hasFilters) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg bg-primary/5 border border-primary/20 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            {isBengali ? 'এই ফলাফলগুলো দেখানো হচ্ছে কারণ:' : 'These results are shown because:'}
          </p>
          <ul className="space-y-1">
            {filters.topic && (
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-medium">{isBengali ? 'বিষয়:' : 'Topic:'}</span> {filters.topic}
              </li>
            )}
            {filters.complexity && (
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-medium">{isBengali ? 'জটিলতা:' : 'Complexity:'}</span> {filters.complexity}
              </li>
            )}
            {filters.period && (
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-medium">{isBengali ? 'সময়কাল:' : 'Period:'}</span> {filters.period}
              </li>
            )}
            {filters.scholar && (
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-medium">{isBengali ? 'আলেম:' : 'Scholar:'}</span> {filters.scholar}
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
