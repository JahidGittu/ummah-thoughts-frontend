"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronDown, Scale,
  Landmark, Globe, Heart,
  ArrowRight, AlertTriangle, Flame,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViralReelView } from '@/components/topics/ViralReelView';

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
  title: 'Is Democracy Allowed in Islam? Live Debate',
  titleBn: 'ইসলামে গণতন্ত্র কি বৈধ? লাইভ বিতর্ক',
  source: 'facebook' as const,
  sourceUrl: 'https://facebook.com/watch/?v=123456',
  thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop',
  views: 125400,
  likes: 8900,
  comments: 2340,
  shares: 1200,
  uploadedDate: '2 days ago',
  creatorName: 'Islamic Political Discourse',
  creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop',
  factCheckStatus: 'misleading' as const,
  factCheckReason: 'The reel presents a one-sided view of democracy in Islamic context. While it raises valid points about Islamic governance systems, it oversimplifies scholarly consensus on Shura principles.',
  factCheckReasonBn: 'এই রিলটি ইসলামী প্রসঙ্গে গণতন্ত্রের একপক্ষীয় দৃশ্য উপস্থাপন করে। এটি শূরা নীতি সম্পর্কে আলেমদের সর্বসম্মত মতামতকে সরলীকৃত করে।',
  relatedTopics: [
    { id: 'shura', nameEn: 'Role of Shura', nameBn: 'শূরার ভূমিকা' },
    { id: 'democracy', nameEn: 'Democracy & Islam', nameBn: 'গণতন্ত্র ও ইসলাম' },
    { id: 'leadership', nameEn: 'Leadership Qualities', nameBn: 'নেতৃত্বের গুণাবলী' },
  ],
  overallSentiment: {
    positive: 456,
    negative: 234,
    neutral: 89
  },
  replies: [
    {
      id: 'reply-1',
      authorName: 'Dr. Ahmad Al-Rashid',
      isVerified: true,
      timestamp: '1 hour ago',
      content: 'Important clarification: The video misses the classical Islamic scholars\' nuanced view on consultation (Shura). Scholars like Ibn Taymiyyah and Al-Mawardi clearly outlined that Shura is binding on the leader in many contexts.',
      sentiment: 'negative' as const,
      likes: 289,
      role: 'scholar' as const,
    },
    {
      id: 'reply-2',
      authorName: 'Muhammad Hassan',
      isVerified: false,
      timestamp: '2 hours ago',
      content: 'This is exactly what we need to discuss more! The intersection of Islamic governance and modern political systems is crucial for contemporary Muslim societies.',
      sentiment: 'positive' as const,
      likes: 156,
      role: 'community' as const,
    },
    {
      id: 'reply-3',
      authorName: 'Sister Fatima Al-Zahra',
      isVerified: true,
      timestamp: '3 hours ago',
      content: 'Well presented but needs to cite Quran 42:38 more thoroughly. The verse on Shura has multiple scholarly interpretations that the video glosses over.',
      sentiment: 'neutral' as const,
      likes: 203,
      role: 'writer' as const,
    },
  ],
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
  const [viewMode, setViewMode] = useState<'list' | 'reel'>('list');

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
          id: 'shura', 
          nameEn: 'Role of Shura', 
          nameBn: 'শূরার ভূমিকা', 
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
    if (subtopic.hasViralReel) {
      setViewMode('reel');
    } else {
      setViewMode('list');
    }
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

            {/* RIGHT PANEL: CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {selectedTopic ? (
                  <motion.div
                    key={selectedTopic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Topic Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                          {isBengali ? selectedTopic.nameBn : selectedTopic.nameEn}
                        </h2>
                        <p className="text-muted-foreground mt-2">
                          {isBengali 
                            ? `${selectedSubtopicData?.count} আলোচনা এবং বিশ্লেষণ`
                            : `${selectedSubtopicData?.count} discussions and analyses`
                          }
                        </p>
                      </div>
                    </div>

                    {/* View Mode Tabs - Only show if has viral reel */}
                    {hasViralReel && (
                      <div className="flex gap-2">
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'outline'}
                          onClick={() => setViewMode('list')}
                          className="gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Scholarly Discussions
                        </Button>
                        <Button
                          variant={viewMode === 'reel' ? 'default' : 'outline'}
                          onClick={() => setViewMode('reel')}
                          className="gap-2"
                        >
                          <Flame className="w-4 h-4" />
                          Viral Reel Analysis
                        </Button>
                      </div>
                    )}

                    {/* Content Display */}
                    {viewMode === 'reel' && hasViralReel ? (
                      <ViralReelView reel={selectedSubtopicData?.viralReelData} />
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
                          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50" />
                          <div>
                            <p className="text-lg font-semibold text-foreground">
                              {isBengali ? 'আসছে শীঘ্রই' : 'Coming Soon'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {isBengali 
                                ? 'এই বিষয়ের বিস্তারিত ব্যাখ্যা এবং আলোচনা শীঘ্রই যোগ করা হবে।'
                                : 'Detailed scholarly discussions for this topic will be added soon.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
