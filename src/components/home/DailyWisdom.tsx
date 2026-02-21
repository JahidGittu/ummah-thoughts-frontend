"use client"

import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Copy, Check, BookOpen, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const wisdomItems = [
  {
    arabic: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الْأَخْلَاقِ',
    translationEn: 'I was only sent to perfect good character.',
    translationBn: 'আমাকে কেবল উত্তম চরিত্রের পূর্ণতা দানের জন্য প্রেরণ করা হয়েছে।',
    source: 'Musnad Ahmad',
    sourceBn: 'মুসনাদে আহমাদ',
    type: 'hadith',
  },
  {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translationEn: 'And whoever fears Allah - He will make for him a way out.',
    translationBn: 'আর যে আল্লাহকে ভয় করে, তিনি তার জন্য বের হওয়ার পথ করে দেন।',
    source: 'Surah At-Talaq, 65:2',
    sourceBn: 'সূরা আত-তালাক, ৬৫:২',
    type: 'quran',
  },
  {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translationEn: 'The best among you are those who learn the Quran and teach it.',
    translationBn: 'তোমাদের মধ্যে সর্বোত্তম সে যে কুরআন শিখে এবং শেখায়।',
    source: 'Sahih al-Bukhari',
    sourceBn: 'সহীহ আল-বুখারী',
    type: 'hadith',
  },
];

export const DailyWisdom = () => {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const wisdom = wisdomItems[currentIndex];
  const isBengali = i18n.language === 'bn';
  const translation = isBengali ? wisdom.translationBn : wisdom.translationEn;
  const source = isBengali ? wisdom.sourceBn : wisdom.source;

  const handleRefresh = () => {
    setCurrentIndex((prev) => (prev + 1) % wisdomItems.length);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${wisdom.arabic}\n\n${translation}\n— ${source}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isQuran = wisdom.type === 'quran';

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-background to-primary/5" />
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              {t('wisdom.badge')}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              {t('wisdom.title')}
            </h2>
          </motion.div>

          {/* Wisdom Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="wisdom-block relative">
                {/* Type indicator — top left badge */}
                <div className="absolute -top-3 left-6">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    isQuran
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {isQuran ? (
                      <BookOpen className="w-3 h-3" />
                    ) : (
                      <MessageCircle className="w-3 h-3" />
                    )}
                    {isQuran ? t('wisdom.quran') : t('wisdom.hadith')}
                  </span>
                </div>

                {/* Dot indicators */}
                <div className="absolute -top-3 right-6 flex items-center gap-1.5">
                  {wisdomItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === currentIndex ? 'bg-secondary w-4' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>

                <div className="pt-6">
                  {/* Arabic Text */}
                  <p className="font-arabic text-3xl sm:text-4xl text-foreground text-center leading-loose mb-6 pt-2">
                    {wisdom.arabic}
                  </p>

                  {/* Divider */}
                  <div className="w-12 h-0.5 bg-secondary/40 mx-auto mb-6" />

                  {/* Translation */}
                  <p className="font-display text-lg sm:text-xl text-foreground/80 text-center italic mb-4 leading-relaxed">
                    {translation}
                  </p>

                  {/* Source */}
                  <p className="text-center text-muted-foreground text-sm">
                    — {source}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-primary" />
                        {t('common.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t('common.copy')}
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t('common.newQuote')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};