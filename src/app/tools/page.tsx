// app/tools/page.tsx
"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  Calculator,
  BookOpen,
  Vote,
  Users,
  CheckSquare,
  History,
  FileText,
  Languages,
  Shield,
  Lightbulb,
  Share2,
  Mic,
  Heart,
  TrendingUp,
  Compass,
  Calendar,
  Wallet,
  ArrowRight,
  type LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import dynamic from 'next/dynamic';

// Dynamically import tool components to reduce initial bundle size
const HijriConverterTool = dynamic(() => import('@/components/tools/HijriConverterTool').then(mod => mod.HijriConverterTool), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

const ZakatCalculatorTool = dynamic(() => import('@/components/tools/ZakatCalculatorTool').then(mod => mod.ZakatCalculatorTool), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

const PrayerTimesTool = dynamic(() => import('@/components/tools/PrayerTimesTool').then(mod => mod.PrayerTimesTool), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

const QuranSearchTool = dynamic(() => import('@/components/tools/QuranSearchTool').then(mod => mod.QuranSearchTool), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

import { ToolCredibilityLabel, ToolJustification } from '@/components/shared/ToolCredibilityLabel';

interface Tool {
  id: string;
  category: string;
  icon: LucideIcon;
  nameKey: string;
  descKey: string;
  isWorking: boolean;
  credibility: 'verified' | 'scholarly-review' | 'under-research' | 'beta';
  justificationEn: string;
  justificationBn: string;
}

export default function ToolsPage() {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const categories = [
    { id: 'all', nameKey: 'tools.categories.all' },
    { id: 'worship', nameKey: 'tools.categories.worship' },
    { id: 'political', nameKey: 'tools.categories.political' },
    { id: 'research', nameKey: 'tools.categories.research' },
    { id: 'dawah', nameKey: 'tools.categories.dawah' },
  ];

  const tools: Tool[] = [
    // Daily Worship Tools
    {
      id: 'prayer-times',
      category: 'worship',
      icon: Clock,
      nameKey: 'tools.prayerTimes.name',
      descKey: 'tools.prayerTimes.desc',
      isWorking: true,
      credibility: 'verified',
      justificationEn: 'Helps Muslims maintain their daily prayers with accurate location-based timings.',
      justificationBn: 'সঠিক অবস্থান-ভিত্তিক সময়ের সাথে মুসলিমদের দৈনিক নামাজ বজায় রাখতে সাহায্য করে।'
    },
    {
      id: 'hijri-converter',
      category: 'worship',
      icon: Calendar,
      nameKey: 'tools.hijriConverter.name',
      descKey: 'tools.hijriConverter.desc',
      isWorking: true,
      credibility: 'verified',
      justificationEn: 'Essential for observing Islamic dates, fasting days, and religious occasions.',
      justificationBn: 'ইসলামী তারিখ, রোজার দিন ও ধর্মীয় অনুষ্ঠান পালনের জন্য অপরিহার্য।'
    },
    {
      id: 'quran-search',
      category: 'worship',
      icon: BookOpen,
      nameKey: 'tools.quranSearch.name',
      descKey: 'tools.quranSearch.desc',
      isWorking: true,
      credibility: 'verified',
      justificationEn: 'Facilitates Quran study and research with comprehensive search capabilities.',
      justificationBn: 'ব্যাপক অনুসন্ধান ক্ষমতার সাথে কুরআন অধ্যয়ন ও গবেষণা সহজতর করে।'
    },
    {
      id: 'zakat-calculator',
      category: 'worship',
      icon: Wallet,
      nameKey: 'tools.zakatCalculator.name',
      descKey: 'tools.zakatCalculator.desc',
      isWorking: true,
      credibility: 'scholarly-review',
      justificationEn: 'Helps Muslims fulfill their Zakat obligation accurately and easily.',
      justificationBn: 'মুসলিমদের সঠিকভাবে ও সহজে যাকাত বাধ্যবাধকতা পূরণে সাহায্য করে।'
    },
    // Islamic Political Tools
    {
      id: 'voting-guide',
      category: 'political',
      icon: Vote,
      nameKey: 'tools.votingGuide.name',
      descKey: 'tools.votingGuide.desc',
      isWorking: false,
      credibility: 'under-research',
      justificationEn: 'Provides Islamic criteria for evaluating candidates in democratic elections.',
      justificationBn: 'গণতান্ত্রিক নির্বাচনে প্রার্থী মূল্যায়নের জন্য ইসলামী মানদণ্ড প্রদান করে।'
    },
    {
      id: 'leadership-assessor',
      category: 'political',
      icon: Users,
      nameKey: 'tools.leadershipAssessor.name',
      descKey: 'tools.leadershipAssessor.desc',
      isWorking: false,
      credibility: 'under-research',
      justificationEn: 'Assesses leadership qualities based on Quranic and prophetic standards.',
      justificationBn: 'কুরআনিক ও নবীয় মানদণ্ডের ভিত্তিতে নেতৃত্বের গুণাবলী মূল্যায়ন করে।'
    },
    {
      id: 'manhaj-checker',
      category: 'political',
      icon: CheckSquare,
      nameKey: 'tools.manhajChecker.name',
      descKey: 'tools.manhajChecker.desc',
      isWorking: false,
      credibility: 'under-research',
      justificationEn: 'Helps users understand their methodological alignment with scholarly traditions.',
      justificationBn: 'আলেমদের ঐতিহ্যের সাথে পদ্ধতিগত সামঞ্জস্য বুঝতে সাহায্য করে।'
    },
    {
      id: 'timeline-generator',
      category: 'political',
      icon: History,
      nameKey: 'tools.timelineGenerator.name',
      descKey: 'tools.timelineGenerator.desc',
      isWorking: false,
      credibility: 'under-research',
      justificationEn: 'Creates visual timelines of Islamic political history for education.',
      justificationBn: 'শিক্ষার জন্য ইসলামী রাজনৈতিক ইতিহাসের ভিজ্যুয়াল টাইমলাইন তৈরি করে।'
    },
    // Research & Writing Tools
    {
      id: 'research-template',
      category: 'research',
      icon: FileText,
      nameKey: 'tools.researchTemplate.name',
      descKey: 'tools.researchTemplate.desc',
      isWorking: false,
      credibility: 'under-research',
      justificationEn: 'Standardizes Islamic research papers with proper citation formats.',
      justificationBn: 'সঠিক উদ্ধৃতি ফরম্যাটের সাথে ইসলামী গবেষণা পত্র মানসম্মত করে।'
    },
    {
      id: 'terminology-dictionary',
      category: 'research',
      icon: Languages,
      nameKey: 'tools.terminologyDictionary.name',
      descKey: 'tools.terminologyDictionary.desc',
      isWorking: false,
      credibility: 'scholarly-review',
      justificationEn: 'Bridges language barriers in Islamic studies with accurate translations.',
      justificationBn: 'সঠিক অনুবাদের সাথে ইসলামী অধ্যয়নে ভাষার বাধা দূর করে।'
    },
    {
      id: 'evidence-verifier',
      category: 'research',
      icon: Shield,
      nameKey: 'tools.evidenceVerifier.name',
      descKey: 'tools.evidenceVerifier.desc',
      isWorking: false,
      credibility: 'scholarly-review',
      justificationEn: 'Prevents spread of weak/fabricated hadiths by providing authenticity checks.',
      justificationBn: 'সত্যতা যাচাই প্রদান করে দুর্বল/জাল হাদীস ছড়ানো রোধ করে।'
    },
    {
      id: 'argument-builder',
      category: 'research',
      icon: Lightbulb,
      nameKey: 'tools.argumentBuilder.name',
      descKey: 'tools.argumentBuilder.desc',
      isWorking: false,
      credibility: 'under-research',
      justificationEn: 'Helps structure Islamic arguments with proper evidences and logic.',
      justificationBn: 'সঠিক দলীল ও যুক্তির সাথে ইসলামী যুক্তি গঠনে সাহায্য করে।'
    },
    // Dawah & Education Tools
    {
      id: 'content-generator',
      category: 'dawah',
      icon: Share2,
      nameKey: 'tools.contentGenerator.name',
      descKey: 'tools.contentGenerator.desc',
      isWorking: false,
      credibility: 'under-research',
      justificationEn: 'Facilitates dawah by creating shareable Islamic content for social media.',
      justificationBn: 'সোশ্যাল মিডিয়ার জন্য শেয়ারযোগ্য ইসলামী কন্টেন্ট তৈরি করে দাওয়াহ সহজতর করে।'
    },
    {
      id: 'speech-assistant',
      category: 'dawah',
      icon: Mic,
      nameKey: 'tools.speechAssistant.name',
      descKey: 'tools.speechAssistant.desc',
      isWorking: false,
      credibility: 'under-research',
      justificationEn: 'Assists imams and speakers in preparing structured khutbahs and lectures.',
      justificationBn: 'ইমাম ও বক্তাদের কাঠামোগত খুতবা ও বক্তৃতা প্রস্তুতিতে সহায়তা করে।'
    },
    {
      id: 'family-guidance',
      category: 'dawah',
      icon: Heart,
      nameKey: 'tools.familyGuidance.name',
      descKey: 'tools.familyGuidance.desc',
      isWorking: false,
      credibility: 'under-research',
      justificationEn: 'Supports Islamic family education with structured learning plans.',
      justificationBn: 'কাঠামোগত শেখার পরিকল্পনার সাথে ইসলামী পারিবারিক শিক্ষা সমর্থন করে।'
    },
    {
      id: 'personal-tracker',
      category: 'dawah',
      icon: TrendingUp,
      nameKey: 'tools.personalTracker.name',
      descKey: 'tools.personalTracker.desc',
      isWorking: false,
      credibility: 'under-research',
      justificationEn: 'Encourages consistent worship by tracking daily ibadah and habits.',
      justificationBn: 'দৈনিক ইবাদত ও অভ্যাস ট্র্যাক করে ধারাবাহিক ইবাদতে উৎসাহিত করে।'
    },
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = t(tool.nameKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t(tool.descKey).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToolClick = (toolId: string, isWorking: boolean) => {
    if (isWorking) {
      setActiveTool(toolId);
    }
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'hijri-converter':
        return <HijriConverterTool onClose={() => setActiveTool(null)} />;
      case 'zakat-calculator':
        return <ZakatCalculatorTool onClose={() => setActiveTool(null)} />;
      case 'prayer-times':
        return <PrayerTimesTool onClose={() => setActiveTool(null)} />;
      case 'quran-search':
        return <QuranSearchTool onClose={() => setActiveTool(null)} />;
      default:
        return null;
    }
  };

  if (activeTool) {
    return renderActiveTool();
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">

        {/* Header */}
        <section className="page-hero border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
                <Calculator className="w-3.5 h-3.5" />
                {t('tools.badge')}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-3 text-balance">
                {t('tools.title')}
              </h1>
              <div className="w-16 h-0.5 rounded-full bg-secondary mb-4" />
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('tools.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-4 border-b border-border/50 bg-card/60 backdrop-blur sticky top-16 z-40 shadow-[var(--shadow-xs)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('tools.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 text-sm rounded-xl"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex-shrink-0 text-xs h-8 rounded-xl"
                  >
                    {t(category.nameKey)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleToolClick(tool.id, tool.isWorking)}
                  disabled={!tool.isWorking}
                  className={`group flex flex-col items-start gap-3 p-4 rounded-lg border text-left transition-all ${
                    tool.isWorking
                      ? 'border-border/50 hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                      : 'border-border/30 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="w-full flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      tool.isWorking
                        ? 'bg-primary/10 text-primary group-hover:bg-primary/20'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Tool Credibility Label - Now works because of TooltipProvider */}
                    <ToolCredibilityLabel status={tool.credibility} />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm text-foreground truncate">
                        {t(tool.nameKey)}
                      </h3>
                      {tool.isWorking && (
                        <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {t(tool.descKey)}
                    </p>
                    {!tool.isWorking && (
                      <Badge variant="outline" className="text-[10px] mt-1.5 px-1.5 py-0">
                        {t('tools.comingSoon')}
                      </Badge>
                    )}
                    {/* Why This Tool Exists */}
                    <ToolJustification
                      justificationEn={tool.justificationEn}
                      justificationBn={tool.justificationBn}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <Compass className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">{t('tools.noResults')}</p>
            </div>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
}