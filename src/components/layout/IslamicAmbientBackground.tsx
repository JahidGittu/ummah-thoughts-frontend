'use client';

import { motion } from 'framer-motion';

export function IslamicAmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* ── Top Radiant Emerald / Gold Aura ── */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary/20 via-primary/8 to-transparent rounded-full blur-[170px] dark:from-primary/25 dark:via-emerald-500/10" />

      {/* ── Mid-Right Emerald Aura ── */}
      <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-400/12 rounded-full blur-[180px]" />

      {/* ── Mid-Left Amber/Gold Aura ── */}
      <div className="absolute top-2/3 -left-48 w-[550px] h-[550px] bg-amber-500/10 dark:bg-secondary/15 rounded-full blur-[180px]" />

      {/* ── Giant Islamic Arabic Calligraphy Watermarks ── */}
      {/* 1. "أُمَّةً وَاحِدَةً" (One Ummah) */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center w-full opacity-[0.035] dark:opacity-[0.045] pointer-events-none">
        <span className="font-arabic font-bold text-foreground leading-none block whitespace-nowrap text-[14vw] sm:text-[18vw]">
          أُمَّةً وَاحِدَةً
        </span>
      </div>

      {/* 2. "اقْرَأْ بِاسْمِ رَبِّكَ" */}
      <div className="absolute top-[45%] -left-16 opacity-[0.025] dark:opacity-[0.035] transform -rotate-12 hidden xl:block pointer-events-none">
        <span className="font-arabic font-bold text-foreground leading-none block text-[8vw] sm:text-[10vw]">
          اقْرَأْ بِاسْمِ رَبِّكَ
        </span>
      </div>

      {/* 3. "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ" */}
      <div className="absolute top-[75%] -right-16 opacity-[0.025] dark:opacity-[0.035] transform rotate-6 hidden lg:block pointer-events-none">
        <span className="font-arabic font-bold text-foreground leading-none block text-[7vw] sm:text-[9vw]">
          وَاعْتَصِمُوا بِحَبْلِ اللَّهِ
        </span>
      </div>

      {/* ── Rotating Geometric Constellation Rings ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 -right-40 w-96 h-96 border border-primary/10 dark:border-primary/15 rounded-full pointer-events-none hidden md:block"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/3 -left-40 w-80 h-80 border border-secondary/10 dark:border-secondary/15 rounded-full pointer-events-none hidden md:block"
      />
    </div>
  );
}
