import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EthicsWarningBoxProps {
  variant?: 'war-ethics' | 'misuse-warning' | 'lessons';
  className?: string;
}

export const EthicsWarningBox = ({ variant = 'war-ethics', className }: EthicsWarningBoxProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const content = {
    'war-ethics': {
      icon: Shield,
      titleEn: 'Islamic Rules of Engagement',
      titleBn: 'ইসলামী যুদ্ধের বিধান',
      items: [
        { en: 'Protection of non-combatants (women, children, elderly)', bn: 'অযোদ্ধাদের সুরক্ষা (নারী, শিশু, বৃদ্ধ)' },
        { en: 'No destruction of crops, trees, or property', bn: 'ফসল, গাছ বা সম্পত্তি ধ্বংস নিষিদ্ধ' },
        { en: 'Humane treatment of prisoners of war', bn: 'যুদ্ধবন্দীদের মানবিক আচরণ' },
        { en: 'No mutilation of bodies', bn: 'মৃতদেহ বিকৃত করা নিষিদ্ধ' },
        { en: 'Respect for religious places and clergy', bn: 'ধর্মীয় স্থান ও ধর্মযাজকদের সম্মান' }
      ],
      color: 'primary'
    },
    'misuse-warning': {
      icon: AlertTriangle,
      titleEn: 'Important Disclaimer',
      titleBn: 'গুরুত্বপূর্ণ সতর্কতা',
      items: [
        { en: 'These historical events are NOT justification for modern violence', bn: 'এই ঐতিহাসিক ঘটনাগুলো আধুনিক সহিংসতার ন্যায্যতা নয়' },
        { en: 'Context and circumstances were unique to their time', bn: 'প্রেক্ষাপট ও পরিস্থিতি তাদের সময়ের জন্য অনন্য ছিল' },
        { en: 'Jihad has strict conditions and scholarly oversight', bn: 'জিহাদের কঠোর শর্ত ও আলেমদের তত্ত্বাবধান রয়েছে' },
        { en: 'Individual action without authority is prohibited', bn: 'কর্তৃপক্ষ ছাড়া ব্যক্তিগত পদক্ষেপ নিষিদ্ধ' }
      ],
      color: 'destructive'
    },
    'lessons': {
      icon: CheckCircle,
      titleEn: 'Key Lessons',
      titleBn: 'মূল শিক্ষা',
      items: [
        { en: 'Strategic planning and patience', bn: 'কৌশলগত পরিকল্পনা ও ধৈর্য' },
        { en: 'Unity and obedience to leadership', bn: 'ঐক্য ও নেতৃত্বের প্রতি আনুগত্য' },
        { en: 'Trust in Allah while taking practical measures', bn: 'বাস্তব পদক্ষেপ নেওয়ার পাশাপাশি আল্লাহর উপর ভরসা' },
        { en: 'Mercy even in times of conflict', bn: 'সংঘাতের সময়েও দয়া' }
      ],
      color: 'secondary'
    }
  };

  const config = content[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Alert className={`border-${config.color}/30 bg-${config.color}/5`}>
        <Icon className={`h-5 w-5 text-${config.color}`} />
        <AlertTitle className="text-foreground font-display font-semibold">
          {isBengali ? config.titleBn : config.titleEn}
        </AlertTitle>
        <AlertDescription className="mt-3">
          <ul className="space-y-2">
            {config.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <div className={`w-1.5 h-1.5 rounded-full bg-${config.color} mt-2 flex-shrink-0`} />
                <span>{isBengali ? item.bn : item.en}</span>
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
