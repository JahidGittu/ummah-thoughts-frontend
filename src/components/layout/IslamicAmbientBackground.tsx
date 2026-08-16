'use client';

import { motion } from 'framer-motion';

export function IslamicAmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* ── Top Radiant Emerald / Gold Aura ── */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-full blur-[170px] dark:from-primary/25 dark:via-emerald-500/10" />

      {/* ── Mid-Right Emerald Aura ── */}
      <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-emerald-500/8 dark:bg-emerald-400/10 rounded-full blur-[180px]" />

      {/* ── Mid-Left Warm Gold/Amber Aura ── */}
      <div className="absolute top-2/3 -left-48 w-[550px] h-[550px] bg-amber-500/8 dark:bg-secondary/10 rounded-full blur-[180px]" />

      {/* ── Smooth Rotating Geometric Constellation Rings ── */}
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
