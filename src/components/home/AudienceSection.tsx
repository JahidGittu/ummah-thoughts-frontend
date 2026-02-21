"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, X, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const AudienceSection = () => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const forAudience = [
    {
      en: 'Readers seeking scholarly, evidence-based Islamic political understanding',
      bn: 'যারা দলীলভিত্তিক ইসলামী রাজনৈতিক জ্ঞান খুঁজছেন'
    },
    {
      en: 'Learners interested in methodology, nuance, and historical context',
      bn: 'যারা পদ্ধতি, সূক্ষ্মতা এবং ঐতিহাসিক প্রেক্ষাপটে আগ্রহী'
    },
    {
      en: 'Students of knowledge seeking comprehensive Islamic governance resources',
      bn: 'যারা ব্যাপক ইসলামী শাসন সম্পদ খুঁজছেন'
    }
  ];

  const notForAudience = [
    {
      en: 'Those looking for slogans, emotional debates, or political agitation',
      bn: 'যারা স্লোগান, আবেগপূর্ণ বিতর্ক বা রাজনৈতিক উসকানি খুঁজছেন'
    },
    {
      en: 'Those seeking quick ideological validation without study',
      bn: 'যারা অধ্যয়ন ছাড়াই দ্রুত মতাদর্শগত সমর্থন চান'
    },
    {
      en: 'Those promoting extremism or sectarian division',
      bn: 'যারা চরমপন্থা বা সাম্প্রদায়িক বিভাজন প্রচার করেন'
    }
  ];

  return (
    <section className="py-20 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            {isBengali ? 'এই প্ল্যাটফর্ম কার জন্য' : 'Who This Platform Is For'}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {isBengali ? 'সঠিক পথ খুঁজে পাচ্ছেন?' : 'Is Ummah Thoughts Right For You?'}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            {isBengali
              ? 'আমরা সকলের জন্য নই — এবং এটি ইচ্ছাকৃত।'
              : "We're not for everyone — and that's intentional."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* For This Platform */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-primary/25 p-7 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground">
                {isBengali ? 'এই প্ল্যাটফর্ম আপনার জন্য যদি:' : 'This platform is for you if:'}
              </h3>
            </div>
            <ul className="space-y-4">
              {forAudience.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {isBengali ? item.bn : item.en}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-border">
              <Link href="/topics">
                <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto">
                  {isBengali ? 'শুরু করুন' : 'Start Exploring'}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Not For This Platform */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-destructive/20 p-7 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground">
                {isBengali ? 'এই প্ল্যাটফর্ম আপনার জন্য নয় যদি:' : 'This platform is NOT for you if:'}
              </h3>
            </div>
            <ul className="space-y-4">
              {notForAudience.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-destructive/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-destructive" />
                  </div>
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {isBengali ? item.bn : item.en}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-border">
              <Link href="/methodology">
                <Button size="sm" variant="ghost" className="gap-2 w-full sm:w-auto text-muted-foreground">
                  {isBengali ? 'আমাদের পদ্ধতি পড়ুন' : 'Read Our Methodology'}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};