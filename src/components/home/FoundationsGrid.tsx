"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Crown, BookOpen, Landmark, Scale } from 'lucide-react';


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
      

      {/* Section Calligraphy Watermark */}
      <div className="absolute top-6 sm:top-8 left-0 right-0 text-center w-full px-4 opacity-[0.045] dark:opacity-[0.06] pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-arabic font-bold text-foreground leading-tight block max-w-4xl mx-auto text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide">
          إِنِ الْحُكْمُ إِلَّا لِلَّهِ
        </span>
      </div>

      {/* Grand Arabic Watermark — Middle Centered */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 text-center w-full px-4 opacity-[0.035] dark:opacity-[0.048] pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-arabic font-bold text-foreground leading-none block max-w-6xl mx-auto text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-wider whitespace-nowrap">
          إِنِ الْحُكْمُ إِلَّا لِلَّهِ
        </span>
      </div>

      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge-islamic mb-4 hover:border-primary/50 transition-all">
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
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {foundations.map((foundation, index) => (
            <motion.div
              key={foundation.titleKey}
              variants={item}
              className={`group relative rounded-3xl p-8 bg-card relative z-10 backdrop-blur-xl border border-border/80 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1.5 cursor-pointer shadow-lg`}
            >
              {/* Islamic Pattern Overlay */}
              
              
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