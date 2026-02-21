"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Compass, BookOpen, Users, Gavel, ArrowRight } from 'lucide-react';

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
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <Compass className="w-4 h-4" />
            {isBengali ? 'কীভাবে ব্যবহার করবেন' : 'How to Use Ummah Thoughts'}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {isBengali ? 'আমাদের পদ্ধতি অনুসরণ করুন' : 'Follow Our Methodology'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
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
                  <div className="bg-card rounded-xl border border-border p-6 flex-1">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {isBengali ? step.titleBn : step.titleEn}
                    </h3>
                    <p className="text-muted-foreground">
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
    </section>
  );
};