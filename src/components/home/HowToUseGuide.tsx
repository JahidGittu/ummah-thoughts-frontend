"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Compass, BookOpen, Users, Gavel } from 'lucide-react';

export const HowToUseGuide = () => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const steps = [
    {
      number: '01',
      icon: BookOpen,
      titleEn: 'Understand the Topic',
      titleBn: 'বিষয়টি বুঝুন',
      descEn: 'Read the foundational content and core evidences from Quran and Sunnah.',
      descBn: 'কুরআন ও সুন্নাহ থেকে মৌলিক বিষয়বস্তু ও মূল দলীল পড়ুন।'
    },
    {
      number: '02',
      icon: Users,
      titleEn: 'Compare Scholarly Opinions',
      titleBn: 'আলেমদের মতামত তুলনা করুন',
      descEn: 'Study different scholarly perspectives and their reasoning.',
      descBn: 'বিভিন্ন আলেমদের দৃষ্টিভঙ্গি ও তাদের যুক্তি অধ্যয়ন করুন।'
    },
    {
      number: '03',
      icon: Gavel,
      titleEn: 'Study Real-World Application',
      titleBn: 'বাস্তব প্রয়োগ অধ্যয়ন করুন',
      descEn: 'Learn how principles apply in contemporary contexts with wisdom.',
      descBn: 'প্রজ্ঞার সাথে সমসাময়িক প্রেক্ষাপটে মূলনীতি কীভাবে প্রযোজ্য তা শিখুন।'
    }
  ];

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-background to-muted/30">
      {/* Section Calligraphy Watermark — Bil Hikmah */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center w-full opacity-[0.035] dark:opacity-[0.045] pointer-events-none select-none z-0">
        <span className="font-arabic font-bold text-foreground leading-none block whitespace-nowrap text-[9vw] sm:text-[12vw]">
          ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ
        </span>
      </div>

      {/* Section Calligraphy Watermark */}
      <div className="absolute top-6 sm:top-8 left-0 right-0 text-center w-full px-4 opacity-[0.045] dark:opacity-[0.06] pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-arabic font-bold text-foreground leading-tight block max-w-4xl mx-auto text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide">
          ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ
        </span>
      </div>

      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="badge-islamic mb-5 hover:border-secondary/50 transition-all">
            <Compass className="w-4 h-4" />
            {isBengali ? 'কীভাবে ব্যবহার করবেন' : 'How to Use Ummah Thoughts'}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {isBengali ? 'আমাদের পদ্ধতি অনুসরণ করুন' : 'Follow Our Methodology'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            {isBengali 
              ? 'আমরা আপনাকে কী ভাবতে হবে তা শেখাই না, কীভাবে ভাবতে হবে তা শেখাই'
              : "We teach you how to think, not what to think"
            }
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-[2.75rem] top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/50 hidden md:block" />

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-6"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                      <step.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  <div className="card-islamic-glow relative overflow-hidden p-7 rounded-2xl border border-border/80 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/15 transition-all duration-300 group shadow-md flex-1">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {isBengali ? step.titleBn : step.titleEn}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {isBengali ? step.descBn : step.descEn}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground italic max-w-lg mx-auto">
              {isBengali 
                ? '"এই পদ্ধতি পাঠককে স্বাধীন চিন্তাবিদ হিসেবে গড়ে তোলে, অন্ধ অনুসারী নয়।"'
                : '"This methodology builds independent thinkers, not blind followers."'
              }
            </p>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 islamic-pattern-arch opacity-50 pointer-events-none" />
    </section>
  );
};
