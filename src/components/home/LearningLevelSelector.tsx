"use client"

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LearningLevelSelector = () => {
  const { i18n } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const isBengali = i18n.language === 'bn';

  const levels = [
    {
      id: 'beginner',
      icon: BookOpen,
      titleEn: 'Beginner',
      titleBn: 'প্রাথমিক',
      descEn: 'New to Islamic political thought. Start with foundational concepts.',
      descBn: 'ইসলামী রাজনৈতিক চিন্তায় নতুন। মৌলিক ধারণা দিয়ে শুরু করুন।',
      topicsEn: ['What is Khilafah?', 'Basic Shura Concepts', 'Islamic Leadership Basics'],
      topicsBn: ['খিলাফত কি?', 'মৌলিক শূরা ধারণা', 'ইসলামী নেতৃত্বের ভিত্তি'],
      color: 'primary'
    },
    {
      id: 'intermediate',
      icon: GraduationCap,
      titleEn: 'Intermediate',
      titleBn: 'মধ্যবর্তী',
      descEn: 'Familiar with basics. Ready for deeper scholarly discussions.',
      descBn: 'মৌলিক বিষয়ে পরিচিত। গভীর আলোচনার জন্য প্রস্তুত।',
      topicsEn: ['Democracy vs. Shura', 'Gradual Implementation', 'Contemporary Challenges'],
      topicsBn: ['গণতন্ত্র বনাম শূরা', 'ক্রমান্বয়ে বাস্তবায়ন', 'সমসাময়িক চ্যালেঞ্জ'],
      color: 'secondary'
    },
    {
      id: 'advanced',
      icon: Brain,
      titleEn: 'Advanced',
      titleBn: 'উন্নত',
      descEn: 'Deep knowledge seeker. Engage with scholarly debates and research.',
      descBn: 'গভীর জ্ঞান অন্বেষণকারী। আলেমদের বিতর্ক ও গবেষণায় অংশ নিন।',
      topicsEn: ['Ijtihad in Politics', 'Comparative Governance', 'Maqasid al-Shariah'],
      topicsBn: ['রাজনীতিতে ইজতিহাদ', 'তুলনামূলক শাসন', 'মাকাসিদ আশ-শরীয়াহ'],
      color: 'primary'
    }
  ];

  return (
    <section className="relative overflow-hidden py-20 bg-muted/20">
      {/* Section Calligraphy Watermark — Rabbi Zidnee Ilma */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center w-full opacity-[0.035] dark:opacity-[0.045] pointer-events-none select-none z-0">
        <span className="font-arabic font-bold text-foreground leading-none block whitespace-nowrap text-[10vw] sm:text-[13vw]">
          وَقُل رَّبِّ زِدْنِي عِلْمًا
        </span>
      </div>

      {/* Section Calligraphy Watermark */}
      <div className="absolute top-6 sm:top-8 left-0 right-0 text-center w-full px-4 opacity-[0.045] dark:opacity-[0.06] pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-arabic font-bold text-foreground leading-tight block max-w-4xl mx-auto text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide">
          وَقُل رَّبِّ زِدْنِي عِلْمًا
        </span>
      </div>

      {/* Grand Arabic Watermark — Middle Centered */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 text-center w-full px-4 opacity-[0.035] dark:opacity-[0.048] pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-arabic font-bold text-foreground leading-none block max-w-6xl mx-auto text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-wider whitespace-nowrap">
          وَقُل رَّبِّ زِدْنِي عِلْمًا
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
            <BookOpen className="w-4 h-4" />
            {isBengali ? 'আপনার শেখার পথ' : 'Your Learning Path'}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {isBengali ? 'আপনার জ্ঞানের স্তর কত?' : 'What is your learning level?'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            {isBengali 
              ? 'আপনার জ্ঞানের স্তর অনুযায়ী সাজানো বিষয়বস্তু পান'
              : 'Get curated content tailored to your knowledge level'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedLevel(level.id)}
              className={`card-islamic-glow relative overflow-hidden p-7 rounded-3xl border transition-all duration-300 relative z-10 cursor-pointer group ${
                selectedLevel === level.id 
                  ? 'border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/20' 
                  : 'border-border/80 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedLevel === level.id ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  <level.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {isBengali ? level.titleBn : level.titleEn}
                  </h3>
                </div>
              </div>

              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {isBengali ? level.descBn : level.descEn}
              </p>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {isBengali ? 'সুপারিশকৃত বিষয়:' : 'Recommended Topics:'}
                </p>
                <ul className="space-y-1.5">
                  {(isBengali ? level.topicsBn : level.topicsEn).map((topic, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedLevel === level.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Button className="w-full gap-2 rounded-xl">
                    {isBengali ? 'শুরু করুন' : 'Start Learning'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 islamic-pattern-stars opacity-50 pointer-events-none" />
    </section>
  );
};
