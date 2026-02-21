'use client'

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Twitter, Youtube, Globe, Heart, ArrowUpRight } from 'lucide-react';
import { DateDisplay } from '@/components/shared/DateDisplay';

export const Footer = () => {
  const { t } = useTranslation();

  const links = {
    archive: [
      { name: t('footer.allDiscussions'), href: '/archive' },
      { name: t('footer.categories'), href: '/topics' },
      { name: t('footer.debates'), href: '/debates' },
      { name: t('nav.scholars'), href: '/scholars' },
      { name: t('footer.timeline'), href: '/timeline' },
    ],
    resources: [
      { name: t('footer.aboutUs'), href: '/about' },
      { name: t('footer.methodology'), href: '/methodology' },
      { name: t('footer.submitQuestion'), href: '/ask' },
      { name: t('footer.contact'), href: '/contact' },
    ],
  };

  const socials = [
    { icon: Twitter, label: 'Twitter / X', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
    { icon: Globe, label: 'Website', href: '#' },
  ];

  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Subtle geometric overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none islamic-pattern" />
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">

          {/* Brand Block */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-primary-foreground/10 flex items-center justify-center ring-1 ring-primary-foreground/15 group-hover:bg-primary-foreground/15 transition-all">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-primary-foreground">Ummah Thoughts</h3>
                <p className="text-primary-foreground/50 text-[10px] tracking-widest uppercase">
                  Islamic Knowledge
                </p>
              </div>
            </Link>

            <p className="text-primary-foreground/65 leading-relaxed text-sm max-w-xs">
              {t('footer.description')}
            </p>

            {/* Arabic ayah */}
            <p className="font-arabic text-lg text-primary-foreground/50 leading-relaxed" dir="rtl">
              وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
            </p>

            {/* Current Date */}
            <div className="p-3.5 rounded-xl bg-primary-foreground/6 border border-primary-foreground/10 inline-block">
              <DateDisplay
                date={new Date()}
                showDualCalendar
                className="text-primary-foreground/70 [&_svg]:text-primary-foreground/50 text-sm"
              />
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-foreground/8 hover:bg-primary-foreground/16 border border-primary-foreground/10 hover:border-primary-foreground/20 transition-all"
                >
                  <Icon className="w-4 h-4 text-primary-foreground/70" />
                </motion.a>
              ))}
              <a
                href="mailto:contact@ummahthoughts.org"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-foreground/8 hover:bg-primary-foreground/16 border border-primary-foreground/10 hover:border-primary-foreground/20 transition-all text-sm text-primary-foreground/70 hover:text-primary-foreground"
              >
                <Mail className="w-3.5 h-3.5" />
                {t('common.getInTouch')}
              </a>
            </div>
          </div>

          {/* Archive Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-base text-primary-foreground/90 tracking-tight">
              {t('footer.archive')}
            </h4>
            <ul className="space-y-2.5">
              {links.archive.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-base text-primary-foreground/90 tracking-tight">
              {t('footer.resources')}
            </h4>
            <ul className="space-y-2.5">
              {links.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter CTA */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-base text-primary-foreground/90 tracking-tight">
              Stay Updated
            </h4>
            <p className="text-sm text-primary-foreground/55 leading-relaxed">
              New debates, discussions & scholarly insights — delivered to your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-xl bg-primary-foreground/6 border border-primary-foreground/12 text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 transition-all"
              />
              <button className="w-full py-2.5 rounded-xl bg-primary-foreground/12 hover:bg-primary-foreground/20 border border-primary-foreground/15 text-sm font-medium text-primary-foreground transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/40">
          <p>© 2024 {t('footer.copyright')}</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-secondary" fill="currentColor" /> for the Ummah
          </p>
          <p className="font-arabic text-base text-primary-foreground/30">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </div>
    </footer>
  );
};