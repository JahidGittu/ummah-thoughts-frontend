import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, Scale, MessageSquare, Shield, Gavel, CheckCircle, AlertTriangle } from 'lucide-react';

interface TopicSection {
  id: string;
  icon: React.ElementType;
  labelEn: string;
  labelBn: string;
  isActive?: boolean;
  hasWarning?: boolean;
}

interface TopicSidebarMapProps {
  currentSection?: string;
  onSectionClick?: (sectionId: string) => void;
  className?: string;
}

export const TopicSidebarMap = ({ 
  currentSection = 'definition', 
  onSectionClick,
  className 
}: TopicSidebarMapProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const sections: TopicSection[] = [
    { id: 'definition', icon: BookOpen, labelEn: 'Definition', labelBn: 'সংজ্ঞা' },
    { id: 'evidences', icon: Scale, labelEn: 'Core Evidence', labelBn: 'মূল দলীল' },
    { id: 'disagreement', icon: MessageSquare, labelEn: 'Scholarly Disagreement', labelBn: 'আলেমদের মতভেদ', hasWarning: true },
    { id: 'application', icon: Gavel, labelEn: 'Practical Application', labelBn: 'বাস্তব প্রয়োগ' },
    { id: 'misuse', icon: AlertTriangle, labelEn: 'Common Misuse', labelBn: 'সাধারণ অপব্যবহার', hasWarning: true },
    { id: 'scale', icon: CheckCircle, labelEn: 'Application Scale', labelBn: 'প্রয়োগের স্তর' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-card rounded-xl border border-border p-4 ${className}`}
    >
      <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        {isBengali ? 'বিষয় মানচিত্র' : 'Topic Map'}
      </h3>
      
      <nav className="space-y-1">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = currentSection === section.id;
          
          return (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSectionClick?.(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 ${section.hasWarning ? 'text-secondary' : ''}`} />
              <span className="text-sm font-medium">
                {isBengali ? section.labelBn : section.labelEn}
              </span>
              {section.hasWarning && (
                <span className="ml-auto w-2 h-2 rounded-full bg-secondary" />
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};

interface ApplicationScaleProps {
  individual?: boolean;
  social?: boolean;
  state?: 'yes' | 'conditional' | 'no';
  className?: string;
}

export const ApplicationScale = ({ 
  individual = true, 
  social = true, 
  state = 'conditional',
  className 
}: ApplicationScaleProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const levels = [
    { 
      id: 'individual', 
      labelEn: 'Individual level', 
      labelBn: 'ব্যক্তি পর্যায়', 
      status: individual 
    },
    { 
      id: 'social', 
      labelEn: 'Social level', 
      labelBn: 'সামাজিক পর্যায়', 
      status: social 
    },
    { 
      id: 'state', 
      labelEn: 'State level', 
      labelBn: 'রাষ্ট্রীয় পর্যায়', 
      status: state === 'yes', 
      conditional: state === 'conditional' 
    },
  ];

  return (
    <div className={`bg-muted/50 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        {isBengali ? 'প্রয়োগযোগ্যতার স্তর:' : 'Applicable at:'}
      </h4>
      <div className="space-y-2">
        {levels.map((level) => (
          <div key={level.id} className="flex items-center gap-2 text-sm">
            {level.status ? (
              <CheckCircle className="w-4 h-4 text-primary" />
            ) : level.conditional ? (
              <AlertTriangle className="w-4 h-4 text-secondary" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
            )}
            <span className={level.status || level.conditional ? 'text-foreground' : 'text-muted-foreground'}>
              {isBengali ? level.labelBn : level.labelEn}
              {level.conditional && (
                <span className="text-secondary ml-1">
                  ({isBengali ? 'শর্তসাপেক্ষ' : 'conditional'})
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
