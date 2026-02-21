import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, BookCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type CredibilityStatus = 'verified' | 'scholarly-review' | 'under-research' | 'beta';

interface ToolCredibilityLabelProps {
  status: CredibilityStatus;
  className?: string;
}

const statusConfig: Record<CredibilityStatus, { 
  icon: React.ElementType; 
  en: string; 
  bn: string; 
  descEn: string; 
  descBn: string; 
  color: string 
}> = {
  'verified': {
    icon: CheckCircle2,
    en: 'Verified',
    bn: 'যাচাইকৃত',
    descEn: 'This tool has been reviewed and verified by our scholarly council',
    descBn: 'এই টুল আমাদের আলেম পরিষদ দ্বারা পর্যালোচিত ও যাচাইকৃত',
    color: 'bg-primary/10 text-primary border-primary/30'
  },
  'scholarly-review': {
    icon: BookCheck,
    en: 'Requires Scholarly Review',
    bn: 'আলেম পর্যালোচনা প্রয়োজন',
    descEn: 'This tool is functional but awaits formal scholarly review',
    descBn: 'এই টুল কার্যকর তবে আনুষ্ঠানিক আলেম পর্যালোচনার অপেক্ষায়',
    color: 'bg-secondary/10 text-secondary border-secondary/30'
  },
  'under-research': {
    icon: FlaskConical,
    en: 'Under Research',
    bn: 'গবেষণাধীন',
    descEn: 'This tool is currently being developed and researched',
    descBn: 'এই টুল বর্তমানে উন্নয়ন ও গবেষণাধীন',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30'
  },
  'beta': {
    icon: AlertCircle,
    en: 'Beta',
    bn: 'বেটা',
    descEn: 'This tool is in beta testing - use with caution',
    descBn: 'এই টুল বেটা পরীক্ষায় - সতর্কতার সাথে ব্যবহার করুন',
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/30'
  }
};

export const ToolCredibilityLabel = ({ status, className }: ToolCredibilityLabelProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant="outline" 
          className={`cursor-help gap-1 ${config.color} ${className}`}
        >
          <Icon className="w-3 h-3" />
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
};

interface ToolJustificationProps {
  justificationEn: string;
  justificationBn: string;
  className?: string;
}

export const ToolJustification = ({ justificationEn, justificationBn, className }: ToolJustificationProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  return (
    <div className={`text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded ${className}`}>
      <span className="font-medium">{isBengali ? 'কেন এই টুল:' : 'Why this tool:'}</span>{' '}
      {isBengali ? justificationBn : justificationEn}
    </div>
  );
};
