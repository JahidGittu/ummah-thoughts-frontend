"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, UserPlus, MessageSquare, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const LiveStatusBar = () => {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const recentDiscussions = [
    {
      titleEn: "Ruling on Political Alliances",
      titleBn: "রাজনৈতিক জোট সম্পর্কে বিধান",
      timeEn: "2 hours ago",
      timeBn: "২ ঘণ্টা আগে",
    },
    {
      titleEn: "Women in Leadership Roles",
      titleBn: "নেতৃত্বে নারীর ভূমিকা",
      timeEn: "5 hours ago",
      timeBn: "৫ ঘণ্টা আগে",
    },
    {
      titleEn: "Digital Dawah Strategies",
      titleBn: "ডিজিটাল দাওয়াহ কৌশল",
      timeEn: "Yesterday",
      timeBn: "গতকাল",
    },
  ];

  const trendingTopics = [
    { nameEn: "Gradual Implementation", nameBn: "ক্রমান্বয়ে বাস্তবায়ন", views: 1250 },
    { nameEn: "Islamic Economics", nameBn: "ইসলামী অর্থনীতি", views: 980 },
    { nameEn: "Youth Responsibility", nameBn: "যুবকদের দায়িত্ব", views: 856 },
  ];

  const newScholars = [
    { nameEn: "Dr. Ahmad Hassan", nameBn: "ড. আহমাদ হাসান" },
    { nameEn: "Ustadh Ibrahim Ali", nameBn: "উস্তাদ ইব্রাহীম আলী" },
  ];

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <section className="py-16 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              {isBengali ? 'সাম্প্রতিক কার্যক্রম' : 'Live Activity'}
            </h2>
          </div>
          <Link href="/archive" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            {isBengali ? 'সব দেখুন' : 'View all'}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recently Added */}
          <motion.div
            custom={0}
            variants={columnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm">
                {t('statusBar.recentlyAdded')}
              </h3>
            </div>
            
            <div className="space-y-2">
              {recentDiscussions.map((discussion, index) => (
                <Link
                  key={index}
                  href="/archive"
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-card border border-transparent hover:border-border cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {isBengali ? discussion.titleBn : discussion.titleEn}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0">
                    {isBengali ? discussion.timeBn : discussion.timeEn}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Most Read */}
          <motion.div
            custom={1}
            variants={columnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-secondary" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm">
                {t('statusBar.mostRead')}
              </h3>
            </div>
            
            <div className="space-y-2">
              {trendingTopics.map((topic, index) => (
                <Link
                  key={index}
                  href="/topics"
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-card border border-transparent hover:border-border cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground group-hover:text-secondary transition-colors">
                      {isBengali ? topic.nameBn : topic.nameEn}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {topic.views.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* New Scholars */}
          <motion.div
            custom={2}
            variants={columnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-3.5 h-3.5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm">
                {t('statusBar.newScholars')}
              </h3>
            </div>
            
            <div className="space-y-2">
              {newScholars.map((scholar, index) => (
                <Link
                  key={index}
                  href="/scholars"
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-card border border-transparent hover:border-border cursor-pointer transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-xs">
                      {(isBengali ? scholar.nameBn : scholar.nameEn).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                      {isBengali ? scholar.nameBn : scholar.nameEn}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('statusBar.justJoined')}</p>
                  </div>
                </Link>
              ))}

              <Link
                href="/scholars"
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-dashed border-border hover:border-primary/30 hover:bg-muted/50 transition-all group cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors flex-1">
                  {t('statusBar.viewAllScholars')}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};