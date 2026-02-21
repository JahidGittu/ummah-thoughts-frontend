import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Methodology = 'salafi' | 'maqasid' | 'fiqh-awlawiyyat' | 'traditional' | 'contemporary';

interface ScholarMethodologyTagProps {
  methodology: Methodology | Methodology[];
  className?: string;
}

const methodologyConfig: Record<Methodology, { en: string; bn: string; descEn: string; descBn: string; color: string }> = {
  'salafi': {
    en: 'Salafi',
    bn: 'সালাফী',
    descEn: 'Following the methodology of the righteous predecessors (Salaf)',
    descBn: 'পূণ্যবান পূর্বসূরীদের (সালাফ) পদ্ধতি অনুসরণ',
    color: 'bg-primary/10 text-primary border-primary/30'
  },
  'maqasid': {
    en: 'Maqasid-based',
    bn: 'মাকাসিদভিত্তিক',
    descEn: 'Emphasizing higher objectives (Maqasid) of Shariah',
    descBn: 'শরীয়াহর উচ্চতর উদ্দেশ্য (মাকাসিদ) এর উপর জোর',
    color: 'bg-secondary/10 text-secondary border-secondary/30'
  },
  'fiqh-awlawiyyat': {
    en: 'Fiqh al-Awlawiyyat',
    bn: 'ফিকহুল আওলাউইয়াত',
    descEn: 'Prioritizing rulings based on importance and context',
    descBn: 'গুরুত্ব ও প্রেক্ষাপট অনুযায়ী বিধান অগ্রাধিকার',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30'
  },
  'traditional': {
    en: 'Traditional',
    bn: 'ঐতিহ্যবাহী',
    descEn: 'Following classical madhab scholarship',
    descBn: 'ধ্রুপদী মাযহাব পাণ্ডিত্য অনুসরণ',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/30'
  },
  'contemporary': {
    en: 'Contemporary',
    bn: 'সমসাময়িক',
    descEn: 'Applying classical principles to modern contexts',
    descBn: 'আধুনিক প্রেক্ষাপটে ধ্রুপদী মূলনীতি প্রয়োগ',
    color: 'bg-teal-500/10 text-teal-600 border-teal-500/30'
  }
};

export const ScholarMethodologyTag = ({ methodology, className }: ScholarMethodologyTagProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const methodologies = Array.isArray(methodology) ? methodology : [methodology];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {methodologies.map((method) => {
        const config = methodologyConfig[method];
        return (
          <Tooltip key={method}>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={`cursor-help ${config.color}`}
              >
                {isBengali ? config.bn : config.en}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm max-w-xs">
                {isBengali ? config.descBn : config.descEn}
              </p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

interface ScholarDisclaimerProps {
  className?: string;
}

export const ScholarDisclaimer = ({ className }: ScholarDisclaimerProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  return (
    <div className={`p-4 rounded-lg bg-muted/50 border border-border ${className}`}>
      <p className="text-sm text-muted-foreground italic">
        {isBengali 
          ? '⚠️ সতর্কতা: এখানে উপস্থাপিত সকল মতামত উম্মাহ থটসের সরকারি অবস্থান নয়। আমরা শিক্ষামূলক উদ্দেশ্যে বিভিন্ন আলেমদের মতামত সংকলন করি।'
          : "⚠️ Disclaimer: Not all opinions presented here reflect Ummah Thoughts' official position. We compile diverse scholarly views for educational purposes."
        }
      </p>
    </div>
  );
};
