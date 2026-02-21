"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, BookOpen, MessageSquare, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const FeaturedTopic = () => {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  // Sample featured topic data
  const featuredTopic = {
    titleEn: "The Wisdom of Gradual Implementation",
    titleBn: "ক্রমান্বয়ে বাস্তবায়নের প্রজ্ঞা",
    summaryEn: "Understanding the prophetic methodology of implementing Islamic reforms gradually, as exemplified by the prohibition of alcohol over three stages and the patience shown in Mecca.",
    summaryBn: "ইসলামী সংস্কার ধাপে ধাপে বাস্তবায়নের নবীসুলভ পদ্ধতি বোঝা, যেমন তিন ধাপে মদ নিষিদ্ধকরণ এবং মক্কায় দেখানো ধৈর্যের উদাহরণ।",
    scholarOpinions: [
      { nameEn: "Ibn Taymiyyah", nameBn: "ইবনে তাইমিয়া" },
      { nameEn: "Al-Ghazali", nameBn: "আল-গাজ্জালী" },
      { nameEn: "Dr. Yusuf al-Qaradawi", nameBn: "ড. ইউসুফ আল-কারাদাওয়ী" },
    ],
    evidenceCount: 12,
    discussionCount: 28,
    category: isBengali ? "রাজনৈতিক কৌশল" : "Political Strategy",
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-semibold">{t('featuredTopic.badge')}</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>

          {/* Featured Topic Card */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-8 shadow-lg">
              <Badge variant="secondary" className="mb-4">
                {featuredTopic.category}
              </Badge>
              
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
                {isBengali ? featuredTopic.titleBn : featuredTopic.titleEn}
              </h3>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {isBengali ? featuredTopic.summaryBn : featuredTopic.summaryEn}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span><strong className="text-foreground">{featuredTopic.evidenceCount}</strong> {t('featuredTopic.evidences')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span><strong className="text-foreground">{featuredTopic.discussionCount}</strong> {t('featuredTopic.discussions')}</span>
                </div>
              </div>

              <Button className="gap-2">
                {t('featuredTopic.readMore')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Scholar Opinions Sidebar */}
            <div className="bg-muted/50 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <Quote className="w-5 h-5 text-secondary" />
                <h4 className="font-display font-semibold text-foreground">
                  {t('featuredTopic.scholarOpinions')}
                </h4>
              </div>

              <div className="space-y-4">
                {featuredTopic.scholarOpinions.map((scholar, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {(isBengali ? scholar.nameBn : scholar.nameEn).charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-foreground text-sm">
                      {isBengali ? scholar.nameBn : scholar.nameEn}
                    </span>
                  </motion.div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-6 gap-2">
                {t('featuredTopic.viewAllOpinions')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};