"use client"

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const LearningLevelSelector = () => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const levels = [
    {
      id: 'beginner',
      icon: BookOpen,
      titleEn: 'Beginner',
      titleBn: 'প্রাথমিক',
      descEn: 'New to Islamic political thought. Start with foundational concepts.',
      descBn: 'ইসলামী রাজনৈতিক চিন্তায় নতুন। মৌলিক ধারণা দিয়ে শুরু করুন।',
      topicsEn: ['What is Khilafah?', 'Basic Shura Concepts', 'Islamic Leadership Basics'],
      topicsBn: ['খিলাফাহ কী?', 'শূরার মৌলিক ধারণা', 'ইসলামী নেতৃত্বের মূলনীতি'],
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
    <section className="py-20 bg-background">
      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            <GraduationCap className="w-4 h-4 mr-1" />
            {isBengali ? 'আপনার শেখার পথ' : 'Your Learning Path'}
          </Badge>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {isBengali ? 'আপনার স্তর নির্বাচন করুন' : 'What is your learning level?'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isBengali 
              ? 'আপনার জ্ঞানের স্তর অনুযায়ী কিউরেটেড কন্টেন্ট পান'
              : 'Get curated content tailored to your knowledge level'
            }
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedLevel(level.id)}
              className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                selectedLevel === level.id
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/30 bg-card'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
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

              <p className="text-muted-foreground text-sm mb-4">
                {isBengali ? level.descBn : level.descEn}
              </p>

              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground uppercase tracking-wide">
                  {isBengali ? 'সুপারিশকৃত বিষয়:' : 'Recommended Topics:'}
                </p>
                <ul className="space-y-1">
                  {(isBengali ? level.topicsBn : level.topicsEn).map((topic, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {topic}
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
                  <Button className="w-full gap-2">
                    {isBengali ? 'শুরু করুন' : 'Start Learning'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};