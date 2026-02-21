'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
        'কুরআন দ্বারা নির্দেশিত এবং খুলাফায়ে রাশেদীন দ্বারা অনুশীলিত পরামর্শ প্রক্রিয়া বোঝা...',
      category: 'Role of Shura',
      categoryBn: 'শূরার ভূমিকা',
      scholar: 'Maulana Mawdudi',
      scholarBn: 'মাওলানা মওদুদী',
      references: 15,
      complexity: 'intermediate',
      date: '1445 Jumada II 28',
      dateBn: '১৪৪৫ জুমাদাল আখির ২৮',
      views: 1567,
    },
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const clearFilters = () => setSelectedFilters([]);

  const viewIcons = {
    grid: Grid,
    list: List,
    timeline: Clock,
    mindmap: Brain,
  };

  return (
    <TooltipProvider> 
      <div className="min-h-screen bg-background">

        {/* Header */}
        <section className="pt-32 pb-12 border-b border-border">
          <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                {t('archive.title')}
              </h1>
              <p className="text-muted-foreground text-lg">{t('archive.subtitle')}</p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 max-w-2xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('archive.searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:w-72 flex-shrink-0"
              >
                <div className="sticky top-24 space-y-6">
                  {/* Filter Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-primary" />
                      <h2 className="font-display font-semibold text-foreground">
                        {t('archive.filters')}
                      </h2>
                    </div>
                    {selectedFilters.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        {t('archive.clearAll')}
                      </Button>
                    )}
                  </div>

                  {/* Save Filter Preset */}
                  {selectedFilters.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 border-dashed"
                      onClick={() =>
                        toast.success(isBengali ? 'ফিল্টার সংরক্ষিত!' : 'Filter saved!')
                      }
                    >
                      <Save className="w-4 h-4" />
                      {isBengali ? 'এই ফিল্টার সংরক্ষণ করুন' : 'Save this filter'}
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        {isBengali ? 'শীঘ্রই' : 'Soon'}
                      </Badge>
                    </Button>
                  )}

                  {/* Selected Filters */}
                  {selectedFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedFilters.map((filter) => (
                        <Badge key={filter} variant="secondary" className="gap-1">
                          {filter}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => toggleFilter(filter)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Categories */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                      <span className="font-medium text-foreground">
                        {t('archive.categories')}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-2 mt-2">
                        {categories.map((category) => (
                          <label
                            key={category.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="rounded border-border text-primary focus:ring-primary"
                                checked={selectedFilters.includes(category.nameEn)}
                                onChange={() => toggleFilter(category.nameEn)}
                              />
                              <span className="text-sm text-foreground">
                                {isBengali ? category.nameBn : category.nameEn}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {category.count}
                            </span>
                          </label>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Scholars */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                      <span className="font-medium text-foreground">
                        {t('archive.scholars')}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-2 mt-2">
                        {scholars.map((scholar) => (
                          <label
                            key={scholar.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="rounded border-border text-primary focus:ring-primary"
                                checked={selectedFilters.includes(scholar.nameEn)}
                                onChange={() => toggleFilter(scholar.nameEn)}
                              />
                              <span className="text-sm text-foreground">
                                {isBengali ? scholar.nameBn : scholar.nameEn}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {scholar.count}
                            </span>
                          </label>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Complexity */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                      <span className="font-medium text-foreground">
                        {t('archive.complexity')}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-2 mt-2">
                        {complexityLevels.map((level) => (
                          <label
                            key={level.id}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-border text-primary focus:ring-primary"
                              checked={selectedFilters.includes(level.nameEn)}
                              onChange={() => toggleFilter(level.nameEn)}
                            />
                            <span className="text-sm text-foreground">
                              {isBengali ? level.nameBn : level.nameEn}
                            </span>
                          </label>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Timeline Filter */}
                  <div className="space-y-2">
                    <span className="font-medium text-foreground">
                      {t('archive.timeline')}
                    </span>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('archive.selectPeriod')} />
                      </SelectTrigger>
                      <SelectContent>
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
              <div className="flex-1">
                {/* View Options & Sort */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t('archive.showing')}{' '}
                      <strong className="text-foreground">{discussions.length}</strong>{' '}
                      {t('archive.results')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
                      {(['grid', 'list', 'timeline', 'mindmap'] as ViewType[]).map((viewType) => {
                        const Icon = viewIcons[viewType];
                        return (
                          <button
                            key={viewType}
                            onClick={() => setView(viewType)}
                            className={`p-2 rounded-md transition-colors ${
                              view === viewType
                                ? 'bg-card text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                            title={t(`archive.view.${viewType}`)}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Sort */}
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">{t('archive.sort.newest')}</SelectItem>
                        <SelectItem value="oldest">{t('archive.sort.oldest')}</SelectItem>
                        <SelectItem value="popular">{t('archive.sort.popular')}</SelectItem>
                        <SelectItem value="references">{t('archive.sort.references')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Explainable Search - Why These Results */}
                {selectedFilters.length > 0 && (
                  <SearchExplanation
                    filters={{
                      topic: selectedFilters.find((f) =>
                        categories.some((c) => c.nameEn === f)
                      ),
                      complexity: selectedFilters.find((f) =>
                        complexityLevels.some((l) => l.nameEn === f)
                      ),
                      scholar: selectedFilters.find((f) =>
                        scholars.some((s) => s.nameEn === f)
                      ),
                    }}
                    className="mb-6"
                  />
                )}

                {/* Smart Suggestions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {t('archive.recommended')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {isBengali ? 'নেতৃত্বের বৈশিষ্ট্য' : 'Leadership Qualities'}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {isBengali ? 'শূরা ও পরামর্শ' : 'Shura & Consultation'}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {isBengali ? 'আধুনিক চ্যালেঞ্জ' : 'Modern Challenges'}
                    </Badge>
                  </div>
                </motion.div>

                {/* Discussions Grid/List */}
                <div
                  className={
                    view === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                      : 'space-y-4'
                  }
                >
                  {discussions.map((discussion, index) => (
                    <motion.article
                      key={discussion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`group bg-card rounded-xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer ${
                        view === 'list' ? 'flex gap-6' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {isBengali ? discussion.categoryBn : discussion.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {discussion.complexity}
                          </Badge>
                          {/* Bias Transparency Badge - show on some discussions */}
                          {discussion.id % 2 === 0 && (
                            <BiasTransparencyBadge hasDisagreement={true} />
                          )}
                        </div>

                        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {isBengali ? discussion.titleBn : discussion.titleEn}
                        </h3>

                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {isBengali ? discussion.excerptBn : discussion.excerptEn}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{isBengali ? discussion.scholarBn : discussion.scholar}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>
                              {discussion.references} {t('archive.references')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{isBengali ? discussion.dateBn : discussion.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>
                              {discussion.views.toLocaleString()} {t('archive.views')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
                    </motion.article>
                  ))}
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