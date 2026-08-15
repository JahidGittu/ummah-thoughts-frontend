"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search, Users, BookOpen, MessageSquare, Video,
  FileText, Headphones, ExternalLink, Mail, Globe,
  Award, Quote, ArrowRight, Filter, GitBranch, Shield
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
import { SkeletonScholarGrid } from "@/components/shared/SkeletonCard";
import { ScholarDisclaimer } from '@/components/shared/ScholarMethodologyTag';
import Link from 'next/link';
import { userApi } from '@/lib/api';

// Simple debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface ScholarAPI {
  id: string;
  name: string;
  email: string;
  specialization: string | null;
}

export default function ScholarsPage() {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  
  const [scholars, setScholars] = useState<ScholarAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    userApi.getScholars(debouncedSearch).then(({ data }) => {
      if (data?.scholars) {
        setScholars(data.scholars);
      }
      setLoading(false);
    });
  }, [debouncedSearch]);

  const specializations = [
    { id: 'all', nameEn: 'All Specializations', nameBn: 'সকল বিশেষজ্ঞতা' },
    { id: 'politics', nameEn: 'Islamic Politics', nameBn: 'ইসলামী রাজনীতি' },
    { id: 'fiqh', nameEn: 'Fiqh & Jurisprudence', nameBn: 'ফিকহ ও আইনশাস্ত্র' },
    { id: 'aqeedah', nameEn: 'Aqeedah', nameBn: 'আকীদাহ' },
    { id: 'history', nameEn: 'Islamic History', nameBn: 'ইসলামী ইতিহাস' },
  ];

  // Client-side drop down filter
  const filteredScholars = scholars.filter(scholar => {
    if (selectedSpecialization === 'all') return true;
    return scholar.specialization?.toLowerCase().includes(selectedSpecialization.toLowerCase());
  });

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">

        {/* Header */}
        <section className="page-hero relative overflow-hidden border-b border-border/50">
        {/* Background Islamic Pattern */}
        <div className="absolute inset-0 islamic-pattern-arch opacity-60 pointer-events-none" />
        <div className="absolute top-4 right-4 w-48 h-48 islamic-pattern-stars opacity-30 pointer-events-none rounded-full blur-[1px]" />
        <div className="absolute bottom-4 left-4 w-48 h-48 islamic-pattern-arch opacity-30 pointer-events-none" />
          <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl mb-8 border-b-0 pb-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {t('scholars.badge', 'Islamic Scholars Directory')}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
                {t('scholars.title', 'Our Scholars')}
              </h1>
              <div className="w-16 h-0.5 rounded-full bg-secondary mb-5" />
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                {t('scholars.subtitle', 'Discover and learn from renowned Islamic scholars.')}
              </p>
            </motion.div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('scholars.searchPlaceholder', 'Search scholars...')}
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
            <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-8">
              <Users className="w-5 h-5 text-primary" />
              {t('scholars.directory', 'Scholar Directory')}
            </h2>
            
            {loading ? (
                <SkeletonScholarGrid count={8} />
            ) : filteredScholars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredScholars.map((scholar, index) => (
                    <Link href={`/scholars/${scholar.id}`} key={scholar.id} className="group">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="relative bg-card hover:bg-card/90 border border-border rounded-2xl p-6 transition-all h-full flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30"
                        >
                            {/* Decorative background element */}
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                            
                            <div className="relative">
                              <div className="flex items-center gap-4 mb-5">
                                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-secondary/10 flex items-center justify-center flex-shrink-0 border border-primary/10 group-hover:border-primary/30 transition-colors">
                                      <span className="text-2xl font-display font-bold text-primary group-hover:scale-110 transition-transform">
                                          {scholar.name.charAt(0)}
                                      </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h3 className="font-display font-bold text-foreground truncate text-lg group-hover:text-primary transition-colors">
                                          {scholar.name}
                                      </h3>
                                      <div className="flex items-center gap-1.5 mt-1 text-primary">
                                          <Shield className="w-3 h-3" />
                                          <p className="text-xs font-semibold truncate uppercase tracking-wider">
                                              {scholar.specialization || "Islamic Scholar"}
                                          </p>
                                      </div>
                                  </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-6 italic">
                                {isBengali 
                                  ? `একজন বিশিষ্ট ইসলামী স্কলার যিনি ${scholar.specialization || 'দ্বীনী ইলম'} নিয়ে নিরলস কাজ করছেন।`
                                  : `A distinguished Islamic scholar dedicated to ${scholar.specialization || 'sacred knowledge'}.`}
                              </p>
                            </div>
                            
                            <div className="relative mt-auto pt-4 border-t border-border/60 flex justify-between items-center text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[120px]">{scholar.email}</span>
                                </div>
                                <div className="flex items-center gap-1 text-primary font-bold">
                                  {isBengali ? 'বিস্তারিত' : 'Details'}
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No scholars found matching your criteria.</p>
                </div>
            )}
          </div>
        </section>

        {/* Scholarly Disclaimer */}
        <section className="py-8 bg-muted/30 mt-auto">
          <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
            <ScholarDisclaimer />
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}