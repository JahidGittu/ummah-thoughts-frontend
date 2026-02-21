"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, Download, BookOpen, Presentation, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const DownloadableResources = () => {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const resources = [
    {
      icon: FileText,
      type: 'PDF',
      titleEn: "Guide to Islamic Political Thought",
      titleBn: "ইসলামী রাজনৈতিক চিন্তার নির্দেশিকা",
      descriptionEn: "Comprehensive introduction to core concepts",
      descriptionBn: "মৌলিক ধারণাগুলোর বিস্তৃত পরিচিতি",
      size: "2.4 MB",
      downloads: 1250,
    },
    {
      icon: Presentation,
      type: 'Slides',
      titleEn: "Khilafah: Past, Present & Future",
      titleBn: "খিলাফাহ: অতীত, বর্তমান ও ভবিষ্যৎ",
      descriptionEn: "Lecture slides with historical timeline",
      descriptionBn: "ঐতিহাসিক সময়রেখাসহ বক্তৃতার স্লাইড",
      size: "5.1 MB",
      downloads: 890,
    },
    {
      icon: BookOpen,
      type: 'Paper',
      titleEn: "Gradual Implementation: A Scholarly Study",
      titleBn: "ক্রমান্বয়ে বাস্তবায়ন: একটি আলেমসুলভ গবেষণা",
      descriptionEn: "Research paper with 50+ references",
      descriptionBn: "৫০+ রেফারেন্সসহ গবেষণা পত্র",
      size: "1.8 MB",
      downloads: 2100,
    },
    {
      icon: FileSpreadsheet,
      type: 'Reference',
      titleEn: "Quranic Verses on Governance",
      titleBn: "শাসন সম্পর্কিত কুরআনের আয়াতসমূহ",
      descriptionEn: "Categorized list with tafsir links",
      descriptionBn: "তাফসীর লিঙ্কসহ শ্রেণীবদ্ধ তালিকা",
      size: "450 KB",
      downloads: 3400,
    },
  ];

  return (
    <section className="py-24 bg-muted/30 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            {t('resources.badge')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('resources.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('resources.subtitle')}
          </p>
        </motion.div>

        {/* Resources Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group bg-card rounded-xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <resource.icon className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {resource.type}
                </Badge>
              </div>

              <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {isBengali ? resource.titleBn : resource.titleEn}
              </h3>

              <p className="text-muted-foreground text-sm mb-4">
                {isBengali ? resource.descriptionBn : resource.descriptionEn}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>{resource.size}</span>
                <span>{resource.downloads.toLocaleString()} {t('resources.downloads')}</span>
              </div>

              <Button variant="outline" size="sm" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Download className="w-4 h-4" />
                {t('resources.download')}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="ghost" className="gap-2">
            {t('resources.viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};