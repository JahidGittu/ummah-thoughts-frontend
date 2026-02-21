import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowLeftRight, Calendar, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { toHijri, toBengaliNumerals } from '@/lib/dateUtils';

interface Props {
  onClose: () => void;
}

const hijriMonths = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
];

const hijriMonthsBn = [
  'মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি',
  'জুমাদাল উলা', 'জুমাদাস সানি', 'রজব', 'শাবান',
  'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'
];

const gregorianMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const HijriConverterTool = ({ onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  
  const today = new Date();
  const [gregorianDate, setGregorianDate] = useState(today.toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);

  const hijriDate = toHijri(new Date(gregorianDate));
  const monthNames = isBengali ? hijriMonthsBn : hijriMonths;

  const formatHijriDate = () => {
    const day = isBengali ? toBengaliNumerals(hijriDate.day) : hijriDate.day;
    const year = isBengali ? toBengaliNumerals(hijriDate.year) : hijriDate.year;
    return `${day} ${monthNames[hijriDate.month - 1]} ${year} AH`;
  };

  const formatGregorianDate = () => {
    const date = new Date(gregorianDate);
    const day = isBengali ? toBengaliNumerals(date.getDate()) : date.getDate();
    const year = isBengali ? toBengaliNumerals(date.getFullYear()) : date.getFullYear();
    return `${day} ${gregorianMonths[date.getMonth()]} ${year}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatHijriDate());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const importantDates = [
    { hijri: '1 Muharram', event: isBengali ? 'ইসলামী নববর্ষ' : 'Islamic New Year' },
    { hijri: '10 Muharram', event: isBengali ? 'আশুরা' : 'Ashura' },
    { hijri: '12 Rabi al-Awwal', event: isBengali ? 'মিলাদুন্নবী' : 'Mawlid al-Nabi' },
    { hijri: '27 Rajab', event: isBengali ? 'ইসরা ও মিরাজ' : 'Isra and Miraj' },
    { hijri: '15 Shaban', event: isBengali ? 'শবে বরাত' : 'Mid-Shaban' },
    { hijri: '1 Ramadan', event: isBengali ? 'রমজান শুরু' : 'Start of Ramadan' },
    { hijri: '27 Ramadan', event: isBengali ? 'লাইলাতুল কদর' : 'Laylat al-Qadr' },
    { hijri: '1 Shawwal', event: isBengali ? 'ঈদুল ফিতর' : 'Eid al-Fitr' },
    { hijri: '10 Dhu al-Hijjah', event: isBengali ? 'ঈদুল আযহা' : 'Eid al-Adha' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" size="sm" onClick={onClose} className="mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('tools.backToTools')}
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {t('tools.hijriConverter.name')}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {t('tools.hijriConverter.desc')}
            </p>
          </motion.div>

          {/* Converter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6 mb-6"
          >
            <div className="space-y-6">
              {/* Input */}
              <div>
                <Label htmlFor="gregorian-date" className="text-sm font-medium">
                  {isBengali ? 'গ্রেগরিয়ান তারিখ' : 'Gregorian Date'}
                </Label>
                <Input
                  id="gregorian-date"
                  type="date"
                  value={gregorianDate}
                  onChange={(e) => setGregorianDate(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Output */}
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {isBengali ? 'হিজরী তারিখ' : 'Hijri Date'}
                    </p>
                    <p className="font-display text-xl font-semibold text-primary">
                      {formatHijriDate()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatGregorianDate()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Important Islamic Dates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h2 className="font-medium text-foreground mb-4">
              {isBengali ? 'গুরুত্বপূর্ণ ইসলামী তারিখ' : 'Important Islamic Dates'}
            </h2>
            <div className="space-y-3">
              {importantDates.map((date, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{date.hijri}</span>
                  <span className="text-sm font-medium text-foreground">{date.event}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
