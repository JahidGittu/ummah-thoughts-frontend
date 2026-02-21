"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Scale, 
  BookMarked, 
  Users, 
  Landmark, 
  Clock, 
  Shield,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const FeaturedCategories = () => {
  const { t } = useTranslation();

  const categories = [
    {
      icon: Scale,
      titleKey: 'categories.justice.title',
      descriptionKey: 'categories.justice.description',
      count: 87,
      color: 'primary',
      href: '/topics',
    },
    {
      icon: Clock,
      titleKey: 'categories.gradualism.title',
      descriptionKey: 'categories.gradualism.description',
      count: 45,
      color: 'secondary',
      href: '/topics',
    },
    {
      icon: Users,
      titleKey: 'categories.unity.title',
      descriptionKey: 'categories.unity.description',
      count: 62,
      color: 'primary',
      href: '/topics',
    },
    {
      icon: BookMarked,
      titleKey: 'categories.methodology.title',
      descriptionKey: 'categories.methodology.description',
      count: 93,
      color: 'secondary',
      href: '/methodology',
    },
    {
      icon: Landmark,
      titleKey: 'categories.state.title',
      descriptionKey: 'categories.state.description',
      count: 56,
      color: 'primary',
      href: '/topics',
    },
    {
      icon: Shield,
      titleKey: 'categories.doubts.title',
      descriptionKey: 'categories.doubts.description',
      count: 78,
      color: 'secondary',
      href: '/archive',
    },
  ];

  return (
    <section className="py-24 relative bg-muted/20">
      {/* Subtle divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            {t('categories.badge')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('categories.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('categories.subtitle')}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {categories.map((category) => (
            <motion.div key={category.titleKey} variants={item}>
              <Link
                href={category.href}
                className="group block category-card h-full hover:shadow-lg"
              >
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon + count row */}
                  <div className="flex items-start justify-between mb-5">
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        category.color === 'primary' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-secondary/10 text-secondary'
                      }`}
                    >
                      <category.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      category.color === 'primary'
                        ? 'bg-primary/8 text-primary'
                        : 'bg-secondary/8 text-secondary'
                    }`}>
                      {category.count}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {t(category.titleKey)}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {t(category.descriptionKey)}
                  </p>
                  
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    <span>{t('common.discussions')}</span>
                    <ArrowRight className="w-3 h-3 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};