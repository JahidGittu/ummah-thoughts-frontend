"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  BookOpen, Heart, Target, Shield, Users, Mail, Phone,
  MapPin, Twitter, Youtube, Facebook, MessageSquare,
  PenTool, DollarSign, HandHeart, Send, ArrowRight,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RedLinesSection, CorrectionPolicy } from '@/components/about/RedLinesSection';

const About = () => {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const sections = [
    {
      id: 'story',
      icon: BookOpen,
      titleEn: 'Our Story',
      titleBn: 'আমাদের গল্প',
      contentEn: 'Ummah Thoughts was born from a simple observation: scholarly discussions on Islamic political thought were scattered, inaccessible, or lost to time. Our founders, a group of dedicated students of knowledge, envisioned a digital sanctuary where these invaluable conversations could be preserved, organized, and shared with the global Ummah.',
      contentBn: 'উম্মাহ থটস একটি সরল পর্যবেক্ষণ থেকে জন্ম নিয়েছে: ইসলামী রাজনৈতিক চিন্তা সম্পর্কে আলেমদের আলোচনা ছড়িয়ে-ছিটিয়ে ছিল, অপ্রাপ্য ছিল, অথবা সময়ের সাথে হারিয়ে যাচ্ছিল। আমাদের প্রতিষ্ঠাতারা, জ্ঞান অন্বেষণকারী একদল নিবেদিতপ্রাণ শিক্ষার্থী, একটি ডিজিটাল আশ্রয়ের কল্পনা করেছিলেন যেখানে এই অমূল্য কথোপকথনগুলো সংরক্ষিত, সংগঠিত এবং বিশ্ব উম্মাহর সাথে ভাগ করা যেতে পারে।',
    },
    {
      id: 'philosophy',
      icon: Heart,
      titleEn: 'Our Philosophy',
      titleBn: 'আমাদের দর্শন',
      contentEn: 'We believe in a balanced approach to Islamic thinking—one that honors classical scholarship while engaging with contemporary realities. Our philosophy rests on three pillars: Ideological Clarity (understanding what Islam truly teaches about governance), Practical Reality (acknowledging the complexities of implementing these ideals), and Scholarly Approach with Accessible Language (making deep knowledge available to everyone).',
      contentBn: 'আমরা ইসলামী চিন্তায় একটি ভারসাম্যপূর্ণ দৃষ্টিভঙ্গিতে বিশ্বাস করি—যা ধ্রুপদী পাণ্ডিত্যকে সম্মান করে এবং সমসাময়িক বাস্তবতার সাথে সম্পৃক্ত হয়। আমাদের দর্শন তিনটি স্তম্ভের উপর নির্ভর করে: মতাদর্শগত স্পষ্টতা, বাস্তব প্রয়োগ, এবং সহজবোধ্য ভাষায় আলেমসুলভ দৃষ্টিভঙ্গি।',
    },
    {
      id: 'methodology',
      icon: Target,
      titleEn: 'Our Methodology (Manhaj)',
      titleBn: 'আমাদের পদ্ধতি (মানহাজ)',
      contentEn: 'Our methodology is firmly grounded in the Quran and Authentic Sunnah. We follow the understanding of the Salaf (righteous predecessors) while applying their principles to contemporary contexts. We appreciate the essence of all recognized madhabs and avoid sectarianism. Every claim is backed by evidence, and we present scholarly differences with respect.',
      contentBn: 'আমাদের পদ্ধতি কুরআন ও সহীহ সুন্নাহতে দৃঢ়ভাবে প্রোথিত। আমরা সালাফদের (পূণ্যবান পূর্বসূরি) বুঝ অনুসরণ করি এবং তাদের মূলনীতিগুলো সমসাময়িক প্রেক্ষাপটে প্রয়োগ করি। আমরা সকল স্বীকৃত মাযহাবের সারমর্ম অনুধাবন করি এবং সাম্প্রদায়িকতা এড়িয়ে চলি।',
    },
    {
      id: 'objectives',
      icon: Target,
      titleEn: 'Our Objectives',
      titleBn: 'আমাদের উদ্দেশ্য',
      points: [
        { en: 'Short-term: Islamic political awareness', bn: 'স্বল্পমেয়াদী: ইসলামী রাজনৈতিক সচেতনতা' },
        { en: 'Medium-term: Ideological leadership development', bn: 'মধ্যমেয়াদী: মতাদর্শগত নেতৃত্ব উন্নয়ন' },
        { en: 'Long-term: Shariah-based society building', bn: 'দীর্ঘমেয়াদী: শরীয়াহভিত্তিক সমাজ গঠন' },
      ],
    },
    {
      id: 'principles',
      icon: Shield,
      titleEn: 'Our Principles',
      titleBn: 'আমাদের মূলনীতি',
      points: [
        { en: 'Respect for all scholars and differing opinions', bn: 'সকল আলেম ও ভিন্ন মতের প্রতি সম্মান' },
        { en: 'Evidence-based discussions only', bn: 'শুধুমাত্র দলীলভিত্তিক আলোচনা' },
        { en: 'Avoid personal attacks and takfeer', bn: 'ব্যক্তিগত আক্রমণ ও তাকফীর পরিহার' },
        { en: 'Following Ahlus Sunnah wal Jamaah', bn: 'আহলুস সুন্নাহ ওয়াল জামাআহ অনুসরণ' },
      ],
    },
  ];

  const teamMembers = [
    { roleEn: 'Lead Researcher', roleBn: 'প্রধান গবেষক', count: 3 },
    { roleEn: 'Scholar Council', roleBn: 'আলেম পরিষদ', count: 5 },
    { roleEn: 'Technical Team', roleBn: 'প্রযুক্তি দল', count: 4 },
    { roleEn: 'Volunteers', roleBn: 'স্বেচ্ছাসেবক', count: 20 },
  ];

  const participationWays = [
    {
      icon: GraduationCap,
      titleEn: 'Lerner',
      titleBn: 'শিক্ষার্থী',
      descEn: 'Begin Increse you Islamic knowledge',
      descBn: 'এখনই শরু করুন আপনার ইসলামিক জ্ঞান চর্চা'
    },
    {
      icon: PenTool,
      titleEn: 'Become a Writer',
      titleBn: 'লেখক হন',
      descEn: 'Contribute articles, research, and insights',
      descBn: 'প্রবন্ধ, গবেষণা এবং অন্তর্দৃষ্টি অবদান রাখুন'
    },
    {
      icon: DollarSign,
      titleEn: 'Financial Support',
      titleBn: 'আর্থিক সহায়তা',
      descEn: 'Help fund our operations and growth',
      descBn: 'আমাদের কার্যক্রম ও বৃদ্ধিতে সহায়তা করুন'
    },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="page-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t('about.badge')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              {t('about.title')}
            </h1>
            <div className="w-16 h-0.5 rounded-full bg-secondary mx-auto mb-5" />
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Quote */}
      <section className="py-16 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="font-arabic text-3xl sm:text-4xl text-foreground mb-4 leading-relaxed">
              وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
            </p>
            <p className="font-display text-xl italic text-muted-foreground mb-2">
              {isBengali
                ? '"তোমরা সৎকর্ম ও তাকওয়ায় পরস্পরকে সাহায্য কর"'
                : '"Cooperate in righteousness and piety"'
              }
            </p>
            <cite className="text-sm text-primary">
              — {isBengali ? 'সূরা আল-মায়িদাহ ৫:২' : 'Surah Al-Ma\'idah 5:2'}
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto space-y-16">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                      {isBengali ? section.titleBn : section.titleEn}
                    </h2>
                    {section.contentEn && (
                      <p className="text-muted-foreground leading-relaxed">
                        {isBengali ? section.contentBn : section.contentEn}
                      </p>
                    )}
                    {section.points && (
                      <ul className="space-y-3 mt-4">
                        {section.points.map((point, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-muted-foreground">
                              {isBengali ? point.bn : point.en}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4">
              <Users className="w-4 h-4 mr-1" />
              {t('about.team')}
            </Badge>
            <h2 className="font-display text-3xl font-bold text-foreground">
              {isBengali ? 'আমাদের দল' : 'Our Team'}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6 text-center"
              >
                <p className="text-4xl font-display font-bold text-primary mb-2">
                  {member.count}
                </p>
                <p className="text-muted-foreground">
                  {isBengali ? member.roleBn : member.roleEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Participate */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              {isBengali ? 'অংশগ্রহণের উপায়' : 'Ways to Participate'}
            </h2>
            <p className="text-muted-foreground">
              {isBengali
                ? 'এই মহৎ কাজে আপনিও অবদান রাখতে পারেন'
                : 'You too can contribute to this noble work'
              }
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {participationWays.map((way, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <way.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {isBengali ? way.titleBn : way.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isBengali ? way.descBn : way.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4">{t('about.contact')}</Badge>
              <h2 className="font-display text-3xl font-bold text-foreground">
                {isBengali ? 'যোগাযোগ করুন' : 'Get in Touch'}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {isBengali ? 'ঠিকানা' : 'Address'}
                    </h3>
                    <p className="text-muted-foreground">
                      {isBengali
                        ? 'ঢাকা, বাংলাদেশ'
                        : 'Dhaka, Bangladesh'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {isBengali ? 'ইমেইল' : 'Email'}
                    </h3>
                    <p className="text-muted-foreground">info@ummahthoughts.org</p>
                    <p className="text-muted-foreground">research@ummahthoughts.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {isBengali ? 'ফোন' : 'Phone'}
                    </h3>
                    <p className="text-muted-foreground">+880 1XXX-XXXXXX</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" size="icon">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Youtube className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl border border-border p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBengali ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBengali ? 'ইমেইল' : 'Email'}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBengali ? 'বার্তা' : 'Message'}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                </div>
                <Button className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  {isBengali ? 'পাঠান' : 'Send Message'}
                </Button>
              </motion.form>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: What We Will NEVER Do - Red Lines */}
      <RedLinesSection />

      {/* NEW: Review & Correction Policy */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CorrectionPolicy />
        </div>
      </section>
    </div>
  );
};

export default About;
