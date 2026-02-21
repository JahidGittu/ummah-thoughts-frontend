// app/scholars/page.tsx
"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search, Users, BookOpen, MessageSquare, Video,
  FileText, Headphones, ExternalLink, Mail, Globe,
  Award, Quote, ArrowRight, Filter, GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ScholarMethodologyTag, ScholarDisclaimer } from '@/components/shared/ScholarMethodologyTag';

interface Scholar {
  id: string;
  nameEn: string;
  nameBn: string;
  specializationEn: string;
  specializationBn: string;
  bioEn: string;
  bioBn: string;
  educationEn: string;
  educationBn: string;
  currentPositionEn: string;
  currentPositionBn: string;
  citationCount: number;
  discussionCount: number;
  researchAreas: { en: string; bn: string }[];
  publications: { titleEn: string; titleBn: string; year: number }[];
  featuredIn: { topicEn: string; topicBn: string; count: number }[];
  media: { type: 'video' | 'audio' | 'pdf'; titleEn: string; titleBn: string }[];
  contact?: { email?: string; website?: string };
  methodology: ('salafi' | 'maqasid' | 'fiqh-awlawiyyat' | 'traditional' | 'contemporary')[];
  influences?: { en: string; bn: string }[];
}

export default function ScholarsPage() {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [selectedScholar, setSelectedScholar] = useState<string>('mannan');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');

  const specializations = [
    { id: 'all', nameEn: 'All Specializations', nameBn: 'সকল বিশেষজ্ঞতা' },
    { id: 'politics', nameEn: 'Islamic Politics', nameBn: 'ইসলামী রাজনীতি' },
    { id: 'fiqh', nameEn: 'Fiqh & Jurisprudence', nameBn: 'ফিকহ ও আইনশাস্ত্র' },
    { id: 'aqeedah', nameEn: 'Aqeedah', nameBn: 'আকীদাহ' },
    { id: 'history', nameEn: 'Islamic History', nameBn: 'ইসলামী ইতিহাস' },
  ];

  const scholars: Scholar[] = [
    {
      id: 'mannan',
      nameEn: 'Dr. Muhammad Abdul Mannan',
      nameBn: 'ড. মুহাম্মদ আবদুল মান্নান',
      specializationEn: 'Islamic State System',
      specializationBn: 'ইসলামী রাষ্ট্রব্যবস্থা',
      bioEn: 'Born in 1960, Chittagong. PhD in Islamic Political Thought from Al-Azhar University. Currently serving as Professor at the Islamic University.',
      bioBn: '১৯৬০ সালে চট্টগ্রামে জন্ম। আল-আজহার বিশ্ববিদ্যালয় থেকে ইসলামী রাজনৈতিক চিন্তায় পিএইচডি। বর্তমানে ইসলামী বিশ্ববিদ্যালয়ে অধ্যাপক হিসেবে কর্মরত।',
      educationEn: 'PhD in Islamic Political Thought, Al-Azhar University',
      educationBn: 'ইসলামী রাজনৈতিক চিন্তায় পিএইচডি, আল-আজহার বিশ্ববিদ্যালয়',
      currentPositionEn: 'Professor, Islamic University',
      currentPositionBn: 'অধ্যাপক, ইসলামী বিশ্ববিদ্যালয়',
      citationCount: 156,
      discussionCount: 45,
      researchAreas: [
        { en: 'Contemporary Forms of Khilafah', bn: 'খিলাফাহর সমসাময়িক রূপ' },
        { en: 'Integration of Democracy & Islam', bn: 'গণতন্ত্র ও ইসলামের সমন্বয়' },
        { en: 'Female Leadership in Islamic Perspective', bn: 'ইসলামী দৃষ্টিতে নারী নেতৃত্ব' },
      ],
      publications: [
        { titleEn: 'Khilafah in Modern Era', titleBn: 'আধুনিক যুগে খিলাফাহ', year: 2015 },
        { titleEn: 'Islamic State: Theory & Practice', titleBn: 'ইসলামী রাষ্ট্র: তত্ত্ব ও অনুশীলন', year: 2018 },
        { titleEn: 'Shariah in Democracy', titleBn: 'গণতন্ত্রে শরীয়াহ', year: 2022 },
      ],
      featuredIn: [
        { topicEn: 'Leadership Criteria', topicBn: 'নেতৃত্বের মানদণ্ড', count: 15 },
        { topicEn: 'Gradual Implementation', topicBn: 'ক্রমান্বয়ে বাস্তবায়ন', count: 22 },
        { topicEn: 'Ruling on Voting', topicBn: 'ভোটদানের বিধান', count: 18 },
      ],
      media: [
        { type: 'video', titleEn: 'Future of Islamic Politics', titleBn: 'ইসলামী রাজনীতির ভবিষ্যৎ' },
        { type: 'audio', titleEn: 'Methodology of Leader Selection', titleBn: 'নেতা নির্বাচনের পদ্ধতি' },
        { type: 'pdf', titleEn: 'Importance of Shura', titleBn: 'শূরার গুরুত্ব' },
      ],
      contact: {
        email: 'scholar@ummahthoughts.org',
        website: 'www.scholarislamic.com',
      },
      methodology: ['salafi', 'contemporary'],
      influences: [
        { en: 'Ibn Taymiyyah', bn: 'ইবনে তাইমিয়া' },
        { en: 'Dr. Yusuf al-Qaradawi', bn: 'ড. ইউসুফ আল-কারাদাওয়ী' }
      ]
    },
    {
      id: 'qaradawi',
      nameEn: 'Dr. Yusuf al-Qaradawi',
      nameBn: 'ড. ইউসুফ আল-কারাদাওয়ী',
      specializationEn: 'Fiqh of Priorities',
      specializationBn: 'ফিকহুল আওলাউইয়াত',
      bioEn: 'One of the most influential Islamic scholars of the 20th century. Known for his balanced approach to Islamic jurisprudence.',
      bioBn: 'বিংশ শতাব্দীর সবচেয়ে প্রভাবশালী ইসলামী পণ্ডিতদের একজন। ইসলামী আইনশাস্ত্রে তার ভারসাম্যপূর্ণ দৃষ্টিভঙ্গির জন্য পরিচিত।',
      educationEn: 'PhD from Al-Azhar University',
      educationBn: 'আল-আজহার বিশ্ববিদ্যালয় থেকে পিএইচডি',
      currentPositionEn: 'President, International Union of Muslim Scholars',
      currentPositionBn: 'সভাপতি, আন্তর্জাতিক মুসলিম পণ্ডিত সংঘ',
      citationCount: 342,
      discussionCount: 78,
      researchAreas: [
        { en: 'Fiqh of Priorities', bn: 'ফিকহুল আওলাউইয়াত' },
        { en: 'Islamic Awakening', bn: 'ইসলামী জাগরণ' },
        { en: 'Halal and Haram', bn: 'হালাল ও হারাম' },
      ],
      publications: [
        { titleEn: 'The Lawful and Prohibited in Islam', titleBn: 'ইসলামে হালাল ও হারাম', year: 1960 },
        { titleEn: 'Fiqh of Zakat', titleBn: 'ফিকহুয যাকাত', year: 1973 },
      ],
      featuredIn: [
        { topicEn: 'Modern Ijtihad', topicBn: 'আধুনিক ইজতিহাদ', count: 45 },
        { topicEn: 'Political Participation', topicBn: 'রাজনৈতিক অংশগ্রহণ', count: 33 },
      ],
      media: [],
      methodology: ['maqasid', 'fiqh-awlawiyyat'],
      influences: [
        { en: 'Hassan al-Banna', bn: 'হাসান আল-বান্না' }
      ]
    },
    {
      id: 'taymiyyah',
      nameEn: 'Ibn Taymiyyah',
      nameBn: 'ইবনে তাইমিয়া',
      specializationEn: 'Aqeedah & Politics',
      specializationBn: 'আকীদাহ ও রাজনীতি',
      bioEn: 'A classical scholar known for his extensive writings on theology, jurisprudence, and political thought. His works continue to influence Islamic scholarship.',
      bioBn: 'ধর্মতত্ত্ব, আইনশাস্ত্র এবং রাজনৈতিক চিন্তায় তাঁর বিস্তৃত লেখার জন্য পরিচিত একজন ধ্রুপদী পণ্ডিত। তাঁর কাজ ইসলামী পাণ্ডিত্যকে প্রভাবিত করে চলেছে।',
      educationEn: 'Classical Islamic Education, Damascus',
      educationBn: 'ধ্রুপদী ইসলামী শিক্ষা, দামেস্ক',
      currentPositionEn: 'Classical Scholar (1263-1328 CE)',
      currentPositionBn: 'ধ্রুপদী পণ্ডিত (১২৬৩-১৩২৮ খ্রি.)',
      citationCount: 523,
      discussionCount: 92,
      researchAreas: [
        { en: 'Siyasah Shariyyah', bn: 'সিয়াসাতুশ শারইয়্যাহ' },
        { en: 'Reformation of Aqeedah', bn: 'আকীদাহ সংস্কার' },
      ],
      publications: [
        { titleEn: 'Al-Siyasah al-Shariyyah', titleBn: 'আস-সিয়াসাতুশ শারইয়্যাহ', year: 1311 },
        { titleEn: 'Majmu al-Fatawa', titleBn: 'মাজমু আল-ফাতাওয়া', year: 1320 },
      ],
      featuredIn: [
        { topicEn: 'Islamic Governance', topicBn: 'ইসলামী শাসন', count: 67 },
        { topicEn: 'Dealing with Rulers', topicBn: 'শাসকদের সাথে আচরণ', count: 25 },
      ],
      media: [],
      methodology: ['salafi', 'traditional'],
      influences: [
        { en: 'Imam Ahmad ibn Hanbal', bn: 'ইমাম আহমদ ইবনে হাম্বল' }
      ]
    },
  ];

  // Filter scholars based on search query
  const filteredScholars = scholars.filter(scholar => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = isBengali 
      ? scholar.nameBn.toLowerCase().includes(searchLower)
      : scholar.nameEn.toLowerCase().includes(searchLower);
    const specializationMatch = isBengali
      ? scholar.specializationBn.toLowerCase().includes(searchLower)
      : scholar.specializationEn.toLowerCase().includes(searchLower);
    
    return nameMatch || specializationMatch;
  });

  // Sort scholars by citation count for "Most Cited" section
  const mostCitedScholars = [...scholars].sort((a, b) => b.citationCount - a.citationCount);

  const currentScholar = scholars.find(s => s.id === selectedScholar) || scholars[0];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">

        {/* Header */}
        <section className="page-hero border-b border-border/50">
          <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {t('scholars.badge')}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
                {t('scholars.title')}
              </h1>
              <div className="w-16 h-0.5 rounded-full bg-secondary mb-5" />
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                {t('scholars.subtitle')}
              </p>
            </motion.div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('scholars.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 h-11 rounded-xl border border-border bg-card/80 backdrop-blur focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm"
                />
              </div>
              <Select 
                value={selectedSpecialization} 
                onValueChange={setSelectedSpecialization}
              >
                <SelectTrigger className="h-11 w-full sm:w-56 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={isBengali ? 'বিশেষজ্ঞতা নির্বাচন' : 'Select specialization'} />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map(spec => (
                    <SelectItem key={spec.id} value={spec.id}>
                      {isBengali ? spec.nameBn : spec.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Scholars List */}
              <div className="space-y-4">
                <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  {t('scholars.mostCited')}
                </h2>

                {mostCitedScholars.map((scholar, index) => (
                  <motion.button
                    key={scholar.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedScholar(scholar.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedScholar === scholar.id
                        ? 'bg-primary/5 border-primary/30'
                        : 'bg-card border-border hover:border-primary/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-display font-bold text-primary">
                          {(isBengali ? scholar.nameBn : scholar.nameEn).charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-foreground truncate">
                          {isBengali ? scholar.nameBn : scholar.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {isBengali ? scholar.specializationBn : scholar.specializationEn}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{scholar.citationCount} {t('scholars.citations')}</span>
                          <span>•</span>
                          <span>{scholar.discussionCount} {t('scholars.discussions')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}

                {/* Scholar Network */}
                <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-dashed border-border">
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {t('scholars.network')}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('scholars.networkDesc')}
                  </p>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    {t('scholars.viewNetwork')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Scholar Profile */}
              <div className="lg:col-span-2">
                <motion.div
                  key={currentScholar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  {/* Profile Header */}
                  <div className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl font-display font-bold text-primary">
                          {(isBengali ? currentScholar.nameBn : currentScholar.nameEn).charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="font-display text-2xl font-bold text-foreground">
                          {isBengali ? currentScholar.nameBn : currentScholar.nameEn}
                        </h2>
                        <p className="text-primary font-medium mt-1">
                          {isBengali ? currentScholar.specializationBn : currentScholar.specializationEn}
                        </p>
                        <p className="text-muted-foreground text-sm mt-2">
                          {isBengali ? currentScholar.currentPositionBn : currentScholar.currentPositionEn}
                        </p>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Award className="w-4 h-4 text-secondary" />
                            <span className="font-semibold text-foreground">{currentScholar.citationCount}</span>
                            <span className="text-muted-foreground">{t('scholars.timesCited')}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-foreground">{currentScholar.discussionCount}</span>
                            <span className="text-muted-foreground">{t('scholars.discussions')}</span>
                          </div>
                        </div>

                        {/* Methodology Tags - Now works because of TooltipProvider */}
                        <div className="mt-4">
                          <ScholarMethodologyTag methodology={currentScholar.methodology} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="p-8 space-y-8">
                    {/* Biography */}
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-3">
                        {t('scholars.biography')}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {isBengali ? currentScholar.bioBn : currentScholar.bioEn}
                      </p>
                    </div>

                    {/* Influence Map */}
                    {currentScholar.influences && currentScholar.influences.length > 0 && (
                      <div>
                        <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-primary" />
                          {isBengali ? 'প্রভাবিত দ্বারা' : 'Influenced by'}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {currentScholar.influences.map((influence, index) => (
                            <Badge key={index} variant="outline" className="cursor-pointer hover:bg-muted">
                              {isBengali ? influence.bn : influence.en}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Research Areas */}
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-3">
                        {t('scholars.researchAreas')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentScholar.researchAreas.map((area, index) => (
                          <Badge key={index} variant="outline">
                            {isBengali ? area.bn : area.en}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Publications */}
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-3">
                        {t('scholars.publications')}
                      </h3>
                      <div className="space-y-2">
                        {currentScholar.publications.map((pub, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-4 h-4 text-primary" />
                              <span className="text-foreground">
                                {isBengali ? pub.titleBn : pub.titleEn}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">({pub.year})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Featured In */}
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-3">
                        {t('scholars.featuredIn')}
                      </h3>
                      <div className="space-y-2">
                        {currentScholar.featuredIn.map((topic, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Quote className="w-4 h-4 text-secondary" />
                              <span className="text-foreground">
                                {isBengali ? topic.topicBn : topic.topicEn}
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {topic.count}x {t('scholars.cited')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Media */}
                    {currentScholar.media.length > 0 && (
                      <div>
                        <h3 className="font-display font-semibold text-foreground mb-3">
                          {t('scholars.mediaLectures')}
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-3">
                          {currentScholar.media.map((item, index) => {
                            const Icon = item.type === 'video' ? Video : item.type === 'audio' ? Headphones : FileText;
                            return (
                              <button
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                              >
                                <Icon className="w-5 h-5 text-primary" />
                                <span className="text-sm text-foreground text-left">
                                  {isBengali ? item.titleBn : item.titleEn}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Contact */}
                    {currentScholar.contact && (
                      <div className="pt-6 border-t border-border">
                        <h3 className="font-display font-semibold text-foreground mb-3">
                          {t('scholars.contact')}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {currentScholar.contact.email && (
                            <Button variant="outline" size="sm" className="gap-2">
                              <Mail className="w-4 h-4" />
                              {currentScholar.contact.email}
                            </Button>
                          )}
                          {currentScholar.contact.website && (
                            <Button variant="outline" size="sm" className="gap-2">
                              <Globe className="w-4 h-4" />
                              {currentScholar.contact.website}
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Related */}
                    <Button className="w-full gap-2">
                      {t('scholars.viewRelated')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Scholarly Disclaimer */}
        <section className="py-8 bg-muted/30">
          <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
            <ScholarDisclaimer />
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}