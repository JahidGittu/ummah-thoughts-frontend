'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  BookOpen,
  BarChart3,
  Users,
  Share2,
  BookmarkIcon,
  ThumbsUp,
  MessageCircle,
  Clock,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface Archive {
  id: number;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  contentEn: string;
  contentBn: string;
  category: string;
  categoryBn: string;
  scholar: string;
  scholarBn: string;
  references: number;
  complexity: string;
  date: string;
  dateBn: string;
  views: number;
}

// Mock data for archive items
const archiveItems: Archive[] = [
  {
    id: 1,
    titleEn: 'Is Participating in Democratic Elections Permissible?',
    titleBn: 'গণতান্ত্রিক নির্বাচনে অংশগ্রহণ কি জায়েজ?',
    excerptEn: 'A comprehensive analysis of scholarly opinions on Muslim participation in non-Islamic political systems...',
    excerptBn: 'অনৈসলামিক রাজনৈতিক ব্যবস্থায় মুসলিমদের অংশগ্রহণ সম্পর্কে আলেমদের মতামতের বিস্তৃত বিশ্লেষণ...',
    contentEn: 'This comprehensive analysis explores various scholarly perspectives on whether Muslims may participate in democratic electoral systems. The discussion covers classical Islamic principles of participation, consultation (Shura), and the modern political context. Multiple viewpoints are presented from contemporary and classical scholars to provide a balanced understanding of this complex issue.',
    contentBn: 'এই বিস্তারিত বিশ্লেষণে বিভিন্ন আলেমের মতামত নিয়ে আলোচনা করা হয়েছে যে মুসলিমরা গণতান্ত্রিক নির্বাচন ব্যবস্থায় অংশগ্রহণ করতে পারে কিনা। আলোচনায় ইসলামী নীতি, পরামর্শ (শূরা), এবং আধুনিক রাজনৈতিক প্রসঙ্গ অন্তর্ভুক্ত রয়েছে।',
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
    titleEn: 'The Islamic Concept of Social Justice',
    titleBn: 'সামাজিক ন্যায়বিচারের ইসলামী ধারণা',
    excerptEn: 'Understanding the Islamic framework for justice in society and economics...',
    excerptBn: 'সমাজ ও অর্থনীতিতে ন্যায়বিচারের জন্য ইসলামী কাঠামো বোঝা...',
    contentEn: 'The Islamic concept of justice encompasses far more than mere legal fairness. It includes distributive justice, economic equity, and social responsibility. This discussion explores classical Islamic sources and their application to modern social contexts.',
    contentBn: 'ইসলামে ন্যায়বিচারের ধারণা শুধুমাত্র আইনি ন্যায্যতার চেয়ে অনেক বেশি বিস্তৃত। এতে পুনর্বণ্টনমূলক ন্যায়বিচার, অর্থনৈতিক সমতা এবং সামাজিক দায়বদ্ধতা অন্তর্ভুক্ত রয়েছে।',
    category: 'Social Justice',
    categoryBn: 'সামাজিক ন্যায়বিচার',
    scholar: 'Imam Al-Ghazali',
    scholarBn: 'ইমাম আল-গাজ্জালী',
    references: 18,
    complexity: 'advanced',
    date: '1445 Muharram 8',
    dateBn: '১৪৪৫ মুহাররম ৮',
    views: 1890,
  },
];

export default function ArchiveDetail() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const isBengali = i18n.language === 'bn';
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);

  const id = params.id as string;
  const archive = archiveItems.find((item) => item.id === parseInt(id));

  if (!archive) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t('notFound.title')}</h1>
            <Button onClick={() => router.push('/archive')} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              {t('notFound.backButton')}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const title = isBengali ? archive.titleBn : archive.titleEn;
  const content = isBengali ? archive.contentBn : archive.contentEn;
  const category = isBengali ? archive.categoryBn : archive.category;
  const scholar = isBengali ? archive.scholarBn : archive.scholar;
  const date = isBengali ? archive.dateBn : archive.date;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => router.push('/archive')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('back')}
          </motion.button>

          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 60, stiffness: 300 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{category}</Badge>
                <Badge variant="outline" className="capitalize">
                  {archive.complexity}
                </Badge>
                <Badge variant="outline">{date}</Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold font-display text-foreground leading-tight">
                {title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{scholar}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {archive.references} {t('archive.references')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>
                    {archive.views.toLocaleString()} {t('archive.views')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>8 min read</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  setIsBookmarked(!isBookmarked);
                  toast.success(
                    isBengali
                      ? isBookmarked ? 'বুকমার্ক সরানো হয়েছে' : 'বুকমার্ক করা হয়েছে'
                      : isBookmarked ? 'Bookmark removed' : 'Bookmarked'
                  );
                }}
                variant={isBookmarked ? 'default' : 'outline'}
                className="gap-2"
              >
                <BookmarkIcon className="w-4 h-4" />
                {isBookmarked ? (t('bookmarked')) : (t('bookmark'))}
              </Button>

              <Button
                onClick={() => {
                  setLikes((prev) => prev + 1);
                  toast.success(isBengali ? 'পছন্দ করা হয়েছে' : 'Liked');
                }}
                variant="outline"
                className="gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                {likes > 0 && likes}
              </Button>

              <Button variant="outline" className="gap-2" onClick={() => toast.info('Share feature coming soon')}>
                <Share2 className="w-4 h-4" />
                {t('share')}
              </Button>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Content */}
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">{content}</p>

              {/* Key Points */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    {isBengali ? 'মূল বিষয়বস্তু' : 'Key Points'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {isBengali
                        ? 'ইসলামী নীতি এবং আধুনিক প্রসঙ্গের মধ্যে সমন্বয় আবশ্যক'
                        : 'Balancing Islamic principles with modern contexts is essential'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {isBengali
                        ? 'বিভিন্ন স্কলারের মতামত বিভিন্ন পরিস্থিতিতে প্রযোজ্য'
                        : 'Different scholarly views apply in different contexts'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {isBengali
                        ? 'ব্যক্তিগত বিচক্ষণতা এবং পরিস্থিতিগত ফিকহ গুরুত্বপূর্ণ'
                        : 'Personal discretion and contextual jurisprudence matter'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* References Section */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isBengali ? 'উল্লেখ' : 'References'} ({archive.references})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {isBengali
                      ? 'এই আলোচনা বিভিন্ন ইসলামী উৎস এবং সমসাময়িক আলেম দ্বারা সমর্থিত।'
                      : 'This discussion is supported by various Islamic sources and contemporary scholars.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border">
              <Button variant="outline" className="gap-2 h-12">
                <MessageCircle className="w-4 h-4" />
                {isBengali ? 'আলোচনা যোগ দিন' : 'Join Discussion'}
              </Button>
              <Button className="gap-2 h-12">
                {isBengali ? 'পরবর্তী আলোচনা' : 'Next Discussion'}
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </Button>
            </div>
          </motion.article>

          {/* Related Items */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-20 pt-12 border-t border-border"
          >
            <h2 className="text-2xl font-bold font-display mb-8">
              {isBengali ? 'সম্পর্কিত আলোচনা' : 'Related Discussions'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {archiveItems.filter((item) => item.id !== archive.id).map((item) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => router.push(`/archive/${item.id}`)}
                >
                  <CardContent className="pt-6">
                    <Badge variant="secondary" className="mb-3">
                      {isBengali ? item.categoryBn : item.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {isBengali ? item.titleBn : item.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {isBengali ? item.excerptBn : item.excerptEn}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{isBengali ? item.scholarBn : item.scholar}</span>
                      <span>{item.views.toLocaleString()} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
