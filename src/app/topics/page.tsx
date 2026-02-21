"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ChevronRight, ChevronDown, Scale,
  Landmark, Globe, Heart,
  ArrowRight, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TopicSidebarMap, ApplicationScale } from '@/components/shared/TopicSidebarMap';


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
  }[];
}

const Topics = () => {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [expandedTopics, setExpandedTopics] = useState<string[]>(['islamic-state']);
  const [currentSection, setCurrentSection] = useState('definition');

  const topicCategories: Topic[] = [
    {
      id: 'islamic-state',
      nameEn: 'Islamic State System',
      nameBn: 'ইসলামী রাষ্ট্রব্যবস্থা',
      icon: Landmark,
      count: 124,
      subtopics: [
        { id: 'khilafah', nameEn: 'Khilafah System', nameBn: 'খিলাফাহ ব্যবস্থা', count: 45 },
        { id: 'shura', nameEn: 'Role of Shura', nameBn: 'শূরার ভূমিকা', count: 23 },
        { id: 'ameer', nameEn: 'Qualities of Ameer', nameBn: 'আমীরের গুণাবলী', count: 31 },
        { id: 'minorities', nameEn: 'Rights of Non-Muslims', nameBn: 'অমুসলিমদের অধিকার', count: 25 },
      ],
    },
    {
      id: 'political-strategy',
      nameEn: 'Political Strategy',
      nameBn: 'রাজনৈতিক কৌশল',
      icon: Scale,
      count: 98,
      subtopics: [
        { id: 'gradualism', nameEn: 'Gradual Implementation', nameBn: 'ক্রমান্বয়ে বাস্তবায়ন', count: 29 },
        { id: 'alliances', nameEn: 'Alliances & Conditions', nameBn: 'জোট ও শর্তাবলী', count: 18 },
        { id: 'democracy', nameEn: 'Participation in Democracy', nameBn: 'গণতন্ত্রে অংশগ্রহণ', count: 35 },
        { id: 'amr-bil-maruf', nameEn: "Enjoining Good & Forbidding Evil", nameBn: 'সৎকাজের আদেশ ও অসৎকাজের নিষেধ', count: 16 },
      ],
    },
    {
      id: 'social-reformation',
      nameEn: 'Social Reformation',
      nameBn: 'সামাজিক সংস্কার',
      icon: Heart,
      count: 87,
      subtopics: [
        { id: 'hijab', nameEn: 'Hijab & Gender Reform', nameBn: 'হিজাব ও লিঙ্গ সংস্কার', count: 22 },
        { id: 'economics', nameEn: 'Economic Justice', nameBn: 'অর্থনৈতিক ন্যায়বিচার', count: 28 },
        { id: 'education', nameEn: 'Education System', nameBn: 'শিক্ষা ব্যবস্থা', count: 19 },
        { id: 'justice', nameEn: 'Establishing Justice', nameBn: 'ন্যায়বিচার প্রতিষ্ঠা', count: 18 },
      ],
    },
    {
      id: 'contemporary',
      nameEn: 'Contemporary Challenges',
      nameBn: 'সমসাময়িক চ্যালেঞ্জ',
      icon: Globe,
      count: 76,
      subtopics: [
        { id: 'secularism', nameEn: 'Countering Secularism', nameBn: 'ধর্মনিরপেক্ষতার মোকাবেলা', count: 21 },
        { id: 'media', nameEn: 'Media Warfare', nameBn: 'মিডিয়া যুদ্ধ', count: 15 },
        { id: 'youth', nameEn: 'Youth Responsibility', nameBn: 'যুবকদের দায়িত্ব', count: 24 },
        { id: 'digital', nameEn: 'Digital Dawah', nameBn: 'ডিজিটাল দাওয়াহ', count: 16 },
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

  // Common misuse examples
  const commonMisuse = [
    {
      en: 'Using Khilafah concept to justify violence against established governments',
      bn: 'প্রতিষ্ঠিত সরকারের বিরুদ্ধে সহিংসতার ন্যায্যতা দিতে খিলাফাহ ধারণার ব্যবহার'
    },
    {
      en: 'Ignoring gradualism and demanding immediate implementation',
      bn: 'ক্রমান্বয়ে বাস্তবায়ন উপেক্ষা করে তাৎক্ষণিক বাস্তবায়ন দাবি করা'
    },
    {
      en: 'Applying rulings meant for states to individual actions',
      bn: 'রাষ্ট্রের জন্য প্রযোজ্য বিধান ব্যক্তিগত কাজে প্রয়োগ করা'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="page-hero border-b border-border/50">
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t('topics.badge')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              {t('topics.title')}
            </h1>
            <div className="w-16 h-0.5 rounded-full bg-secondary mb-5" />
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              {t('topics.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Topics Tree */}
      <section className="py-16 lg:py-24">
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left: Topics Navigation */}
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
                            {topic.count} {t('topics.discussions')}
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
                            className="w-full flex items-center justify-between px-4 py-3 pl-14 hover:bg-muted/50 transition-colors text-left"
                          >
                            <span className="text-sm text-foreground">
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

            {/* Middle: Topic Content Structure Preview */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Landmark className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">{t('topics.preview')}</Badge>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {isBengali ? 'খিলাফাহ ব্যবস্থা' : 'Khilafah System'}
                    </h2>
                  </div>
                </div>

                <p className="text-muted-foreground mb-8">
                  {isBengali
                    ? 'ইসলামী খিলাফাহ ব্যবস্থা সম্পর্কে বিস্তারিত আলোচনা, এর ইতিহাস, মূলনীতি এবং আধুনিক প্রয়োগ।'
                    : 'Detailed discussion on the Islamic Khilafah system, its history, principles, and modern application.'
                  }
                </p>

                {/* Application Scale */}
                <div className="mb-8">
                  <ApplicationScale
                    individual={true}
                    social={true}
                    state="conditional"
                  />
                </div>

                {/* Common Misuse Warning Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-8 p-5 rounded-xl bg-destructive/5 border border-destructive/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display font-semibold text-foreground mb-3">
                        {isBengali ? 'সাধারণ অপব্যবহার সতর্কতা' : 'Common Misuse Warning'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isBengali
                          ? 'এই বিষয়টি প্রায়ই নিম্নলিখিত উপায়ে অপব্যবহার করা হয়:'
                          : 'This topic is often misused in the following ways:'
                        }
                      </p>
                      <ul className="space-y-2">
                        {commonMisuse.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-destructive font-bold">⚠</span>
                            <span>{isBengali ? item.bn : item.en}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-8 pt-6 border-t border-border">
                  <Button className="gap-2">
                    {t('topics.exploreTopic')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-xl border border-border p-6 text-center"
                >
                  <p className="text-3xl font-display font-bold text-primary mb-1">385</p>
                  <p className="text-sm text-muted-foreground">{t('topics.totalDiscussions')}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-xl border border-border p-6 text-center"
                >
                  <p className="text-3xl font-display font-bold text-secondary mb-1">16</p>
                  <p className="text-sm text-muted-foreground">{t('topics.mainCategories')}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card rounded-xl border border-border p-6 text-center"
                >
                  <p className="text-3xl font-display font-bold text-primary mb-1">50+</p>
                  <p className="text-sm text-muted-foreground">{t('topics.scholars')}</p>
                </motion.div>
              </div>
            </div>

            {/* Right: Topic Sidebar Map */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24">
                <TopicSidebarMap
                  currentSection={currentSection}
                  onSectionClick={setCurrentSection}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Topics;
