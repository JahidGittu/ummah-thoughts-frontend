"use client";

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronDown, Scale,
  Landmark, Globe, Heart,
  ArrowRight, AlertTriangle,
  BookOpen
} from 'lucide-react';

interface Topic {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: React.ElementType;
  count: number;
  subtopics?: {
    id: string;
    nameEn: string;
    nameBn: string;
    count: number;
    hasViralReel?: boolean;
    viralReelData?: any;
  }[];
}

// Sample viral reel data
const sampleViralReel = {
  id: 'reel-001',
  title: 'Why Do Qawmi Scholars Oppose Jamaat-e-Islami? A Critical Analysis',
  titleBn: 'ক্বওমীরা কেন জামাতের এতো বেশি সমালোচনা করে? একটি বিস্তারিত বিশ্লেষণ',
  source: 'facebook' as const,
  sourceUrl: 'https://facebook.com/watch/?v=789456',
  thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop',
  views: 245800,
  likes: 12400,
  comments: 4560,
  shares: 2340,
  uploadedDate: '৫ দিন আগে',
  creatorName: 'শেখ আলী হাসান ওসামা',
  creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop',
  factCheckStatus: 'real' as const,
  factCheckReason: 'This speech contains documented historical facts about Maududi, Jamaat-e-Islami\'s critique of Qawmi education, and legitimate theological differences. The speaker presents factual events like Maududi\'s fatwa against Qadianis and his imprisonment, which are historically accurate.',
  factCheckReasonBn: 'এই বক্তৃতায় মওদূদী, জামাত-ই-ইসলামী এবং ক্বওমী শিক্ষার সমালোচনা সম্পর্কে নথিভুক্ত ঐতিহাসিক তথ্য রয়েছে। স্পিকার মওদূদীর কাদিয়ানীদের বিরুদ্ধে ফতওয়া এবং তার কারাবাসের মতো ঐতিহাসিকভাবে সঠিক ঘটনা উপস্থাপন করেন।',
  relatedTopics: [
    { id: 'jamat-ideology', nameEn: 'Jamaat-e-Islami Ideology', nameBn: 'জামাত-ই-ইসলামীর আদর্শ' },
    { id: 'qawmi-education', nameEn: 'Qawmi Education System', nameBn: 'ক্বওমী শিক্ষা ব্যবস্থা' },
    { id: 'maududi-thought', nameEn: 'Maududi\'s Thought', nameBn: 'মওদূদীর চিন্তাধারা' },
    { id: 'zakir-naik', nameEn: 'Dr. Zakir Naik & Scholars', nameBn: 'ড. জাকির নায়েক এবং আলেমরা' },
  ],
  overallSentiment: {
    positive: 1234,
    negative: 567,
    neutral: 892
  },
  writerAnalysis: `# Critical Analysis: Why Qawmi Scholars Oppose Jamaat-e-Islami

## Three Main Reasons

### 1. Why Qawmi Scholars Oppose Jamaat-e-Islami
Jamaat follows **Maududi's ideology**, which Qawmi scholars fundamentally reject. Maududi criticized some Sahaba's teachings, which is completely unacceptable in Qawmi tradition.

### 2. Why Qawmi Students Oppose Dr. Zakir Naik
Immature students in early classes blindly follow **old propaganda** without understanding. They lack knowledge to differentiate between facts and propaganda.

### 3. Why Qawmis Are Cautious About Naik
Historically, Dr. Zakir Naik had some **controversial theological positions**, so Qawmi scholars were critical. However, he has corrected most errors.

## Current Reality (2024)

**Dr. Zakir Naik's Status:**
- Most top Bangladesh scholars **no longer directly criticize him**
- His contribution to Islamic dawah is **widely acknowledged**
- He is **respected and loved** in contemporary Islamic circles
- Unlike Jamaat, he doesn't criticize Sahaba or follow Maududi

## Key Points

### Jamaat's Core Problem
- Follows **Maududi's anti-Sahaba ideology**
- Takes **Un-Islamic political positions** (supporting secular symbols)
- If in power, would **suppress Qawmi education**
- Is **ideologically incompatible** with traditional Islam

### Dr. Zakir Naik's Difference
- Has **no political agenda**
- Made mistakes but **corrected them**
- **Respects all Islamic scholars**
- Focused purely on **Islamic education & preaching**
- Now has **scholarly consensus support**

## The Bottom Line

Qawmi opposition to Jamaat stems from **fundamentalideological differences**. But Qawmi support for Dr. Naik shows that **mistakes can be forgiven when corrected**.

The Islamic foundation matters most—Qawmis protect Islam, not positions.`,

  writerAnalysisBn: `# গুরুত্বপূর্ণ বিশ্লেষণ: কেন ক্বওমী আলেমরা জামাত-ই-ইসলামীর বিরোধিতা করে

## তিনটি প্রধান কারণ

### ১. ক্বওমীরা কেন জামাত-ই-ইসলামীর বিরোধিতা করে
জামাত **মওদূদীর আদর্শ অনুসরণ** করে, যা ক্বওমী আলেমরা সম্পূর্ণ প্রত্যাখ্যান করে। মওদূদী সাহাবীদের আলোচনা সমালোচনা করেছেন, যা ক্বওমী ঐতিহ্যে অগ্রহণযোগ্য।

### ২. ক্বওমী ছাত্ররা কেন ড. জাকির নায়েকের বিরোধী
প্রাথমিক ক্লাসের অপরিপক্ব ছাত্ররা **পুরনো প্রোপাগান্ডা অন্ধভাবে** অনুসরণ করে। তাদের বাস্তব তথ্য এবং প্রোপাগান্ডার পার্থক্য বোঝার জ্ঞান নেই।

### ৩. ক্বওমীরা কেন নায়েকের ব্যাপারে সতর্ক
ঐতিহাসিকভাবে, ড. জাকির নায়েকের **কিছু ধর্মতাত্ত্বিক অবস্থান সমস্যাজনক** ছিল, তাই ক্বওমী আলেমরা সমালোচনা করেছিলেন। কিন্তু তিনি অধিকাংশ ত্রুটি সংশোধন করেছেন।

## বর্তমান অবস্থা (২০২৪)

**ড. জাকির নায়েকের মর্যাদা:**
- বেশিরভাগ শীর্ষ আলেম এখন **সরাসরি সমালোচনা করেন না**
- দ্বীন প্রচারে তার অবদান **ব্যাপকভাবে স্বীকৃত**
- তিনি **সম্মানিত এবং ভালোবাসেন** আধুনিক ইসলামী মহলে

## মূল পার্থক্য

### জামাতের মূল সমস্যা
- **মওদূদীর আধুনিকবাদী আদর্শ** অনুসরণ করে
- অ-ইসলামী রাজনৈতিক অবস্থান নেয়
- ক্ষমতায় এলে **ক্বওমী শিক্ষা দমন** করবে
- ঐতিহ্যবাহী ইসলামের সাথে **মৌলিকভাবে বিরোধী**

### ড. জাকির নায়েকের পার্থক্য
- কোনো রাজনৈতিক এজেন্ডা নেই
- ভুল করেছেন কিন্তু **সংশোধন করেছেন**
- সকল ইসলামী বিদ্বানদের **সম্মান করেন**
- শুধুমাত্র **ইসলামী শিক্ষা ও দাওয়ায়** মনোনিবেশ করেন

## চূড়ান্ত বার্তা

ক্বওমীদের জামাত-বিরোধিতা **মৌলিক আদর্শগত পার্থক্য** থেকে উদ্ভূত। কিন্তু ড. নায়েকের প্রতি ক্বওমীদের সমর্থন দেখায় যে **সংশোধন গ্রহণ করা হয়**।

ইসলামের ভিত্তি সবচেয়ে গুরুত্বপূর্ণ—ক্বওমীরা ইসলাম রক্ষা করে, পদ রক্ষা করে না।`,
};

const Topics = () => {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [expandedTopics, setExpandedTopics] = useState<string[]>(['islamic-state']);
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    nameEn: string;
    nameBn: string;
    parentId?: string;
  } | null>(null);

  // Function to render formatted analysis
  const renderAnalysis = (text: string): React.ReactElement[] => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // H1: # text
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-4">
            {line.replace(/^# /, '')}
          </h1>
        );
      }
      // H2: ## text
      else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl font-bold text-primary mt-5 mb-3">
            {line.replace(/^## /, '')}
          </h2>
        );
      }
      // H3: ### text
      else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2">
            {line.replace(/^### /, '')}
          </h3>
        );
      }
      // Table
      else if (line.includes('|')) {
        const tableLines = [];
        while (i < lines.length && lines[i].includes('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        i--; // Back up one since loop will increment

        const rows = tableLines.map(l => l.split('|').filter(c => c.trim()).map(c => c.trim()));
        
        if (rows.length > 1) {
          elements.push(
            <div key={i} className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary/10">
                    {rows[0].map((cell, colIdx) => (
                      <th key={colIdx} className="border border-border px-3 py-2 font-semibold text-left">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(2).map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-muted/50">
                      {row.map((cell, colIdx) => (
                        <td key={colIdx} className="border border-border px-3 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }
      // Empty lines
      else if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
      }
      // Regular text with inline formatting
      else {
        const parts = line.split(/(\*\*.*?\*\*|\*(?!\*).*?(?<!\*)\*|__.*?__)/);
        elements.push(
          <p key={i} className="text-sm text-foreground leading-relaxed mb-3">
            {parts.map((part, idx) => {
              if (!part) return null;
              // Bold: **text**
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={idx} className="font-bold text-foreground">
                    {part.replace(/\*\*/g, '')}
                  </strong>
                );
              }
              // Italic: *text*
              if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
                return (
                  <em key={idx} className="italic text-primary">
                    {part.replace(/\*/g, '')}
                  </em>
                );
              }
              // Underline: __text__
              if (part.startsWith('__') && part.endsWith('__')) {
                return (
                  <u key={idx} className="underline">
                    {part.replace(/__/g, '')}
                  </u>
                );
              }
              return <span key={idx}>{part}</span>;
            })}
          </p>
        );
      }
      i++;
    }

    return elements;
  };

  const topicCategories: Topic[] = [
    {
      id: 'islamic-state',
      nameEn: 'Islamic State System',
      nameBn: 'ইসলামী রাষ্ট্রব্যবস্থা',
      icon: Landmark,
      count: 124,
      subtopics: [
        { 
          id: 'khilafah', 
          nameEn: 'Khilafah System', 
          nameBn: 'খিলাফাহ ব্যবস্থা', 
          count: 45 
        },
        { 
          id: 'qawmi-jammat-opposition', 
          nameEn: 'Why Do Qawmi Scholars Oppose Jamaat', 
          nameBn: 'ক্বওমীরা কেন জামাতের এতো বেশি সমালোচনা করে', 
          count: 23,
          hasViralReel: true,
          viralReelData: sampleViralReel
        },
        { 
          id: 'ameer', 
          nameEn: 'Qualities of Ameer', 
          nameBn: 'আমীরের গুণাবলী', 
          count: 31 
        },
        { 
          id: 'minorities', 
          nameEn: 'Rights of Non-Muslims', 
          nameBn: 'অমুসলিমদের অধিকার', 
          count: 25 
        },
      ],
    },
    {
      id: 'political-strategy',
      nameEn: 'Political Strategy',
      nameBn: 'রাজনৈতিক কৌশল',
      icon: Scale,
      count: 98,
      subtopics: [
        { 
          id: 'gradualism', 
          nameEn: 'Gradual Implementation', 
          nameBn: 'ক্রমান্বয়ে বাস্তবায়ন', 
          count: 29 
        },
        { 
          id: 'alliances', 
          nameEn: 'Alliances & Conditions', 
          nameBn: 'জোট ও শর্তাবলী', 
          count: 18 
        },
        { 
          id: 'democracy', 
          nameEn: 'Participation in Democracy', 
          nameBn: 'গণতন্ত্রে অংশগ্রহণ', 
          count: 35,
          hasViralReel: true,
          viralReelData: sampleViralReel
        },
        { 
          id: 'amr-bil-maruf', 
          nameEn: "Enjoining Good & Forbidding Evil", 
          nameBn: 'সৎকাজের আদেশ ও অসৎকাজের নিষেধ', 
          count: 16 
        },
      ],
    },
    {
      id: 'social-reformation',
      nameEn: 'Social Reformation',
      nameBn: 'সামাজিক সংস্কার',
      icon: Heart,
      count: 87,
      subtopics: [
        { 
          id: 'hijab', 
          nameEn: 'Hijab & Gender Reform', 
          nameBn: 'হিজাব ও লিঙ্গ সংস্কার', 
          count: 22 
        },
        { 
          id: 'economics', 
          nameEn: 'Economic Justice', 
          nameBn: 'অর্থনৈতিক ন্যায়বিচার', 
          count: 28 
        },
        { 
          id: 'education', 
          nameEn: 'Education System', 
          nameBn: 'শিক্ষা ব্যবস্থা', 
          count: 19 
        },
        { 
          id: 'justice', 
          nameEn: 'Establishing Justice', 
          nameBn: 'ন্যায়বিচার প্রতিষ্ঠা', 
          count: 18 
        },
      ],
    },
    {
      id: 'contemporary',
      nameEn: 'Contemporary Challenges',
      nameBn: 'সমসাময়িক চ্যালেঞ্জ',
      icon: Globe,
      count: 76,
      subtopics: [
        { 
          id: 'secularism', 
          nameEn: 'Countering Secularism', 
          nameBn: 'ধর্মনিরপেক্ষতার মোকাবেলা', 
          count: 21 
        },
        { 
          id: 'media', 
          nameEn: 'Media Warfare', 
          nameBn: 'মিডিয়া যুদ্ধ', 
          count: 15 
        },
        { 
          id: 'youth', 
          nameEn: 'Youth Responsibility', 
          nameBn: 'যুবকদের দায়িত্ব', 
          count: 24 
        },
        { 
          id: 'digital', 
          nameEn: 'Digital Dawah', 
          nameBn: 'ডিজিটাল দাওয়াহ', 
          count: 16 
        },
      ],
    },
  ];

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSelectSubtopic = (subtopic: any, parentId: string) => {
    setSelectedTopic({
      id: subtopic.id,
      nameEn: subtopic.nameEn,
      nameBn: subtopic.nameBn,
      parentId
    });
  };

  // Find selected subtopic data
  const selectedSubtopicData = selectedTopic 
    ? topicCategories
        .find(cat => cat.id === selectedTopic.parentId)
        ?.subtopics
        ?.find(sub => sub.id === selectedTopic.id)
    : null;

  const hasViralReel = selectedSubtopicData?.hasViralReel;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {isBengali ? 'বিষয়াবলী' : 'Topics'}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {isBengali ? 'ইসলামী রাজনৈতিক চিন্তা' : 'Islamic Political Thought'}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {isBengali 
                ? 'সাম্প্রতিক সোশ্যাল মিডিয়া আলোচনা থেকে শুরু করে গভীর আলেমসুলভ বিশ্লেষণ পর্যন্ত' 
                : 'From viral social media discussions to deep scholarly analysis'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            
            {/* LEFT PANEL: TOPIC LIST - Same UI Design as page.tsx */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {topicCategories.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => toggleTopic(topic.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <topic.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-display font-semibold text-foreground">
                            {isBengali ? topic.nameBn : topic.nameEn}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {topic.count} {isBengali ? 'আলোচনা' : 'discussions'}
                          </p>
                        </div>
                      </div>
                      {expandedTopics.includes(topic.id) ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    {expandedTopics.includes(topic.id) && topic.subtopics && (
                      <div className="border-t border-border bg-muted/20">
                        {topic.subtopics.map(subtopic => (
                          <button
                            key={subtopic.id}
                            onClick={() => handleSelectSubtopic(subtopic, topic.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 pl-14 hover:bg-muted/50 transition-colors text-left ${
                              selectedTopic?.id === subtopic.id ? 'bg-primary/10 border-l-2 border-primary' : ''
                            }`}
                          >
                            <span className={`text-sm ${selectedTopic?.id === subtopic.id ? 'text-primary font-semibold' : 'text-foreground'}`}>
                              {isBengali ? subtopic.nameBn : subtopic.nameEn}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {subtopic.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT PANEL: SIMPLIFIED REEL VIEW */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {selectedTopic && hasViralReel ? (
                  <motion.div
                    key={selectedTopic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* SECTION 1: Reel Video + Overview (Side by Side) */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Reel Thumbnail/Video */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl overflow-hidden border border-border bg-muted"
                      >
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <img 
                            src={selectedSubtopicData?.viralReelData?.thumbnail}
                            alt={selectedSubtopicData?.viralReelData?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </motion.div>

                      {/* Reel Overview */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-5"
                      >
                        {/* Title */}
                        <div>
                          <h2 className="font-display text-2xl font-bold text-foreground">
                            {isBengali 
                              ? selectedSubtopicData?.viralReelData?.titleBn
                              : selectedSubtopicData?.viralReelData?.title}
                          </h2>
                        </div>

                        {/* Creator Info */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <img 
                            src={selectedSubtopicData?.viralReelData?.creatorAvatar}
                            alt="creator"
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {selectedSubtopicData?.viralReelData?.creatorName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedSubtopicData?.viralReelData?.uploadedDate}
                            </p>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                            <p className="text-xs text-muted-foreground mb-1">{isBengali ? 'ভিউ' : 'Views'}</p>
                            <p className="font-bold text-foreground">
                              {(selectedSubtopicData?.viralReelData?.views / 1000).toFixed(1)}K
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                            <p className="text-xs text-muted-foreground mb-1">{isBengali ? 'লাইক' : 'Likes'}</p>
                            <p className="font-bold text-foreground">
                              {(selectedSubtopicData?.viralReelData?.likes / 1000).toFixed(1)}K
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                            <p className="text-xs text-muted-foreground mb-1">{isBengali ? 'মন্তব্য' : 'Comments'}</p>
                            <p className="font-bold text-foreground">
                              {(selectedSubtopicData?.viralReelData?.comments / 1000).toFixed(1)}K
                            </p>
                          </div>
                        </div>

                        {/* Fact-Check Badge */}
                        <div className={`p-3 rounded-lg border-2 ${
                          selectedSubtopicData?.viralReelData?.factCheckStatus === 'fake' ? 'bg-red-500/10 border-red-500/30' :
                          selectedSubtopicData?.viralReelData?.factCheckStatus === 'misleading' ? 'bg-amber-500/10 border-amber-500/30' :
                          selectedSubtopicData?.viralReelData?.factCheckStatus === 'real' ? 'bg-green-500/10 border-green-500/30' :
                          'bg-gray-500/10 border-gray-500/30'
                        }`}>
                          <p className="text-xs font-semibold uppercase mb-1 text-muted-foreground">
                            {isBengali ? 'সত্যতা যাচাই' : 'Fact Check'}
                          </p>
                          <p className={`text-sm font-bold ${
                            selectedSubtopicData?.viralReelData?.factCheckStatus === 'fake' ? 'text-red-500' :
                            selectedSubtopicData?.viralReelData?.factCheckStatus === 'misleading' ? 'text-amber-500' :
                            selectedSubtopicData?.viralReelData?.factCheckStatus === 'real' ? 'text-green-500' :
                            'text-gray-500'
                          }`}>
                            {selectedSubtopicData?.viralReelData?.factCheckStatus?.toUpperCase()}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* SECTION 2: Writer's Analysis */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="font-display text-xl font-bold text-foreground">
                        {isBengali ? 'লেখকের বিশ্লেষণ' : "Writer's Analysis"}
                      </h3>

                      {/* Writer's Analysis Message */}
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 bg-card rounded-2xl rounded-tl-sm p-6 border border-border/50 space-y-3">
                          <div className="space-y-2">
                            {/* Display writer's analysis with proper formatting */}
                            {renderAnalysis(
                              isBengali 
                                ? selectedSubtopicData?.viralReelData?.writerAnalysisBn
                                : selectedSubtopicData?.viralReelData?.writerAnalysis
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : selectedTopic ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-96 rounded-xl border border-dashed border-border bg-muted/30"
                  >
                    <div className="text-center">
                      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        {isBengali 
                          ? 'এই বিষয়ে ভাইরাল রিল নেই'
                          : 'No viral reel for this topic'
                        }
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-96 rounded-xl border border-dashed border-border bg-muted/30"
                  >
                    <div className="text-center">
                      <ArrowRight className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        {isBengali 
                          ? 'বিষয় নির্বাচন করুন শুরু করতে'
                          : 'Select a topic to begin'
                        }
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Topics;
