"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Crown, BookOpen, Landmark, Scale } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export const FoundationsGrid = () => {
  const { t } = useTranslation();

  const foundations = [
    {
      icon: Crown,
      titleKey: 'foundations.tawheed.title',
      descriptionKey: 'foundations.tawheed.description',
      gradient: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: BookOpen,
      titleKey: 'foundations.prophetic.title',
      descriptionKey: 'foundations.prophetic.description',
      gradient: 'from-secondary/20 to-secondary/5',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      icon: Landmark,
      titleKey: 'foundations.khilafah.title',
      descriptionKey: 'foundations.khilafah.description',
      gradient: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: Scale,
      titleKey: 'foundations.shariah.title',
      descriptionKey: 'foundations.shariah.description',
      gradient: 'from-secondary/20 to-secondary/5',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('foundations.badge')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('foundations.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('foundations.subtitle')}
          </p>
        </motion.div>

        {/* Foundations Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {foundations.map((foundation, index) => (
            <motion.div
              key={foundation.titleKey}
              variants={item}
              className={`group relative rounded-2xl p-8 bg-gradient-to-br ${foundation.gradient} border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl cursor-pointer`}
            >
              {/* Islamic Pattern Overlay */}
              <div className="absolute inset-0 islamic-pattern opacity-30 rounded-2xl" />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-xl ${foundation.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <foundation.icon className={`w-8 h-8 ${foundation.iconColor}`} />
                </div>
                
                <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {t(foundation.titleKey)}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {t(foundation.descriptionKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};