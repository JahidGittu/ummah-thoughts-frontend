'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Map,
  Brain,
  ChevronDown,
  BookOpen,
  Users,
  Star,
  ArrowRight,
  Calendar,
  Tag,
  BarChart3,
  X,
  Save,
  AlertCircle,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  SearchExplanation,
  BiasTransparencyBadge,
} from '@/components/shared/BiasTransparencyBadge';
import { toast } from 'sonner';

type ViewType = 'grid' | 'list' | 'timeline' | 'mindmap';

const Archive = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isBengali = i18n.language === 'bn';
  const [view, setView] = useState<ViewType>('grid');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const categories = [
    {
      id: 'khilafah',
      nameEn: 'Khilafah System',
      nameBn: 'খিলাফাহ ব্যবস্থা',
      count: 45,
    },
    {
      id: 'shura',
      nameEn: 'Role of Shura',
      nameBn: 'শূরার ভূমিকা',
      count: 23,
    },
    {
      id: 'democracy',
      nameEn: 'Democracy & Islam',
      nameBn: 'গণতন্ত্র ও ইসলাম',
      count: 38,
    },
    {
      id: 'leadership',
      nameEn: 'Leadership Qualities',
      nameBn: 'নেতৃত্বের গুণাবলী',
      count: 31,
    },
    {
      id: 'gradualism',
      nameEn: 'Gradual Implementation',
      nameBn: 'ক্রমান্বয়ে বাস্তবায়ন',
      count: 29,
    },
    {
      id: 'economics',
      nameEn: 'Islamic Economics',
      nameBn: 'ইসলামী অর্থনীতি',
      count: 42,
    },
    {
      id: 'justice',
      nameEn: 'Social Justice',
      nameBn: 'সামাজিক ন্যায়বিচার',
      count: 35,
    },
    {
      id: 'dawah',
      nameEn: 'Political Dawah',
      nameBn: 'রাজনৈতিক দাওয়াহ',
      count: 27,
    },
    {
      id: 'minorities',
      nameEn: 'Rights of Minorities',
      nameBn: 'সংখ্যালঘুদের অধিকার',
      count: 19,
    },
    {
      id: 'contemporary',
      nameEn: 'Contemporary Issues',
      nameBn: 'সমসাময়িক বিষয়',
      count: 56,
    },
  ];

  const scholars = [
    { id: 'taymiyyah', nameEn: 'Ibn Taymiyyah', nameBn: 'ইবনে তাইমিয়া', count: 78 },
    { id: 'qaradawi', nameEn: 'Dr. Yusuf al-Qaradawi', nameBn: 'ড. ইউসুফ আল-কারাদাওয়ী', count: 65 },
    { id: 'ghazali', nameEn: 'Imam Al-Ghazali', nameBn: 'ইমাম আল-গাজ্জালী', count: 43 },
    { id: 'mawdudi', nameEn: 'Maulana Mawdudi', nameBn: 'মাওলানা মওদুদী', count: 52 },
  ];

  const complexityLevels = [
    { id: 'beginner', nameEn: 'Beginner', nameBn: 'প্রাথমিক' },
    { id: 'intermediate', nameEn: 'Intermediate', nameBn: 'মধ্যবর্তী' },
    { id: 'advanced', nameEn: 'Advanced', nameBn: 'উন্নত' },
  ];

  const discussions = [
    {
      id: 1,
      titleEn: 'Is Participating in Democratic Elections Permissible?',
      titleBn: 'গণতান্ত্রিক নির্বাচনে অংশগ্রহণ কি জায়েজ?',
      excerptEn:
        'A comprehensive analysis of scholarly opinions on Muslim participation in non-Islamic political systems...',
      excerptBn:
        'অনৈসলামিক রাজনৈতিক ব্যবস্থায় মুসলিমদের অংশগ্রহণ সম্পর্কে আলেমদের মতামতের বিস্তৃত বিশ্লেষণ...',
      category: 'Democracy & Islam',
      categoryBn: 'গণতন্ত্র ও ইসলাম',
      scholar: 'Dr. Yusuf al-Qaradawi',
      scholarBn: 'ড. ইউসুফ আল-কারাদাওয়ী',
      references: 12,
      complexity: 'intermediate',
      date: '1445 Rajab 15',
      dateBn: '১৪৪৫ রজব ১৫',
      views: 2340,
    },
    {
      id: 2,
      titleEn: 'The Concept of Gradual Implementation in Islamic History',
      titleBn: 'ইসলামী ইতিহাসে ক্রমান্বয়ে বাস্তবায়নের ধারণা',
      excerptEn:
        'Exploring how the Prophet ﷺ and his companions implemented Islamic rulings gradually...',
      excerptBn:
        'নবী ﷺ এবং তাঁর সাহাবীরা কীভাবে ধাপে ধাপে ইসলামী বিধান বাস্তবায়ন করেছিলেন তা অন্বেষণ...',
      category: 'Gradual Implementation',
      categoryBn: 'ক্রমান্বয়ে বাস্তবায়ন',
      scholar: 'Ibn Taymiyyah',
      scholarBn: 'ইবনে তাইমিয়া',
      references: 18,
      complexity: 'advanced',
      date: '1445 Rajab 10',
      dateBn: '১৪৪৫ রজব ১০',
      views: 1890,
    },
    {
      id: 3,
      titleEn: 'Qualities of an Islamic Leader: A Quranic Perspective',
      titleBn: 'একজন ইসলামী নেতার গুণাবলী: কুরআনিক দৃষ্টিকোণ',
      excerptEn: 'What does the Quran teach us about the essential qualities of leadership?',
      excerptBn: 'নেতৃত্বের অপরিহার্য গুণাবলী সম্পর্কে কুরআন আমাদের কী শেখায়?',
      category: 'Leadership Qualities',
      categoryBn: 'নেতৃত্বের গুণাবলী',
      scholar: 'Imam Al-Ghazali',
      scholarBn: 'ইমাম আল-গাজ্জালী',
      references: 24,
      complexity: 'beginner',
      date: '1445 Rajab 5',
      dateBn: '১৪৪৫ রজব ৫',
      views: 3210,
    },
    {
      id: 4,
      titleEn: 'The Role of Shura in Islamic Governance',
      titleBn: 'ইসলামী শাসনে শূরার ভূমিকা',
      excerptEn:
        'Understanding the consultative process mandated by the Quran and practiced by the Khulafa Rashidun...',
      excerptBn:
        'কুরআন দ্বারা নির্দেশিত এবং খুলাফায়ে রাশেদীন দ্বারা অনুশীলিত পরামর্শ প্রক্র�    <TooltipProvider> 
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Header */}
        <section className="page-hero border-b border-border/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-2 duration-700">
                Knowledge Repository
              </Badge>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
                {t('archive.title')}
              </h1>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl font-medium opacity-80">
                {t('archive.subtitle')}
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-12 max-w-2xl relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder={t('archive.searchPlaceholder')}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-foreground text-lg placeholder:text-muted-foreground/40 shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Sidebar Filters */}
              <motion.aside
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:w-80 shrink-0"
              >
                <div className="sticky top-28 space-y-8 glass p-6 rounded-3xl border-white/10 shadow-2xl shadow-primary/5">
                  {/* Filter Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Filter className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="font-display font-bold text-xl text-foreground">
                        {t('archive.filters')}
                      </h2>
                    </div>
                    {selectedFilters.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
                      >
                        {t('archive.clearAll')}
                      </Button>
                    )}
                  </div>

                  {/* Save Filter Preset */}
                  {selectedFilters.length > 0 && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full gap-3 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-xs font-bold uppercase tracking-widest transition-all duration-300"
                      onClick={() =>
                        toast.success(isBengali ? 'ফিল্টার সংরক্ষিত!' : 'Filter saved!')
                      }
                    >
                      <Save className="w-4 h-4 text-primary" />
                      {isBengali ? 'এই ফিল্টার সংরক্ষণ করুন' : 'Save this filter'}
                      <Badge className="ml-auto text-[9px] bg-secondary text-secondary-foreground font-black">
                        PRO
                      </Badge>
                    </Button>
                  )}

                  {/* Selected Filters Chips */}
                  {selectedFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in duration-500">
                      {selectedFilters.map((filter) => (
                        <Badge key={filter} variant="secondary" className="gap-2 px-3 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                          {filter}
                          <X
                            className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform"
                            onClick={() => toggleFilter(filter)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Separator className="bg-white/5" />

                  {/* Categories Collapsible */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
                      <span className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                        {t('archive.categories')}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1.5 mt-4 animate-in slide-in-from-top-2 duration-300">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent",
                            selectedFilters.includes(category.nameEn) 
                              ? "bg-primary/10 border-primary/20 text-primary shadow-sm shadow-primary/5" 
                              : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-4 h-4 rounded border transition-colors flex items-center justify-center",
                              selectedFilters.includes(category.nameEn) ? "bg-primary border-primary" : "border-white/20"
                            )}>
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={selectedFilters.includes(category.nameEn)}
                                onChange={() => toggleFilter(category.nameEn)}
                              />
                              {selectedFilters.includes(category.nameEn) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm font-semibold tracking-tight">
                              {isBengali ? category.nameBn : category.nameEn}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold opacity-40 px-2 py-0.5 rounded-full bg-black/20">
                            {category.count}
                          </span>
                        </label>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Timeline Filter */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <span className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {t('archive.timeline')}
                    </span>
                    <Select>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl hover:bg-white/[0.08] transition-all">
                        <SelectValue placeholder={t('archive.selectPeriod')} />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        <SelectItem value="all">{t('archive.allTime')}</SelectItem>
                        <SelectItem value="week">{t('archive.thisWeek')}</SelectItem>
                        <SelectItem value="month">{t('archive.thisMonth')}</SelectItem>
                        <SelectItem value="year">{t('archive.thisYear')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.aside>

              {/* Main Content Area */}
              <div className="flex-1 space-y-10">
                {/* View Options & Sort */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 glass rounded-3xl border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t('archive.showing')}{' '}
                      <strong className="text-foreground text-base tracking-tight">{filteredDiscussions.length}</strong>{' '}
                      {t('archive.results')}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* View Toggle */}
                    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-white/5">
                      {(['grid', 'list', 'timeline', 'mindmap'] as ViewType[]).map((viewType) => {
                        const Icon = viewIcons[viewType];
                        return (
                          <button
                            key={viewType}
                            onClick={() => setView(viewType)}
                            className={cn(
                              "p-2.5 rounded-xl transition-all duration-300 transform",
                              view === viewType
                                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                            title={t(`archive.view.${viewType}`)}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Sort */}
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-48 h-11 bg-black/40 border-white/5 rounded-2xl hover:bg-black/60 transition-all font-semibold text-xs uppercase tracking-widest">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        <SelectItem value="newest">{t('archive.sort.newest')}</SelectItem>
                        <SelectItem value="oldest">{t('archive.sort.oldest')}</SelectItem>
                        <SelectItem value="popular">{t('archive.sort.popular')}</SelectItem>
                        <SelectItem value="references">{t('archive.sort.references')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Discussions Grid/List */}
                <div
                  className={
                    view === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                      : 'space-y-6'
                  }
                >
                  {filteredDiscussions.length > 0 ? (
                    filteredDiscussions.map((discussion, index) => (
                    <motion.article
                      key={discussion.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      onClick={() => router.push(`/archive/${discussion.id}`)}
                      className={cn(
                        "premium-card group p-8 flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:scale-[1.02]",
                        view === 'list' && "flex-row min-h-0 py-6 items-center"
                      )}
                    >
                      <div className="space-y-5">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-2">
                             <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border-primary/20 px-2.5 py-1">
                               {isBengali ? discussion.categoryBn : discussion.category}
                             </Badge>
                             <Badge variant="outline" className={cn(
                               "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border-white/10",
                               discussion.complexity === 'advanced' ? "text-secondary border-secondary/20 bg-secondary/5" : "text-muted-foreground"
                             )}>
                               {discussion.complexity}
                             </Badge>
                          </div>
                          {discussion.id % 2 === 0 && (
                            <BiasTransparencyBadge hasDisagreement={true} />
                          )}
                        </div>

                        <h3 className="font-display text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 drop-shadow-sm">
                          {isBengali ? discussion.titleBn : discussion.titleEn}
                        </h3>

                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity">
                          {isBengali ? discussion.excerptBn : discussion.excerptEn}
                        </p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex flex-wrap items-center gap-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                          <div className="flex items-center gap-2 group/meta">
                            <Users className="w-3.5 h-3.5 text-primary group-hover/meta:scale-110 transition-transform" />
                            <span className="text-muted-foreground group-hover/meta:text-foreground transition-colors">{isBengali ? discussion.scholarBn : discussion.scholar}</span>
                          </div>
                          <div className="flex items-center gap-2 group/meta">
                            <BookOpen className="w-3.5 h-3.5 text-secondary group-hover/meta:scale-110 transition-transform" />
                            <span className="text-muted-foreground group-hover/meta:text-foreground transition-colors">
                              {discussion.references} {t('archive.references')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 group/meta">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/30" />
                            <span>{isBengali ? discussion.dateBn : discussion.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                          Explore <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.article>
                    ))
                  ) : (
                    <div className="col-span-full py-32 text-center glass rounded-[40px] border-dashed border-white/5">
                      <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/10">
                        <AlertCircle className="w-10 h-10 text-primary/40 animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-foreground mb-3 font-display">
                        {isBengali ? 'কোনো ফলাফল পাওয়া যায়নি' : 'Silence of the Archive'}
                      </h3>
                      <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm font-medium">
                        {isBengali ? 'আপনার অনুসন্ধান কোনো রেকর্ডের সাথে মেলেনি। ফিল্টার পরিবর্তন করে দেখুন।' : 'No records match your current intellectual journey. Try adjusting your perspective (filters).'}
                      </p>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        size="lg"
                        className="rounded-2xl border-primary/20 hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5 px-8"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {isBengali ? 'ফিল্টার সাফ করুন' : 'Reset My Journey'}
                      </Button>
                    </div>
                  )}
                </div>

                {filteredDiscussions.length > 0 && (
                  <div className="text-center pt-12 pb-24">
                    <Button variant="ghost" size="lg" className="h-16 px-12 rounded-[2rem] border border-white/5 hover:bg-primary hover:text-white transition-all duration-500 group shadow-2xl">
                      <span className="text-xs font-black uppercase tracking-[0.3em] mr-3">Deepen Your Search</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
r gap-1">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>
                              {discussion.views.toLocaleString()} {t('archive.views')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 self-center" />
                    </motion.article>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg text-muted-foreground mb-4">
                        {isBengali ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}
                      </p>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        {isBengali ? 'ফিল্টার সাফ করুন' : 'Clear filters'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button variant="outline" className="gap-2">
                    {t('archive.loadMore')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
};

export default Archive;