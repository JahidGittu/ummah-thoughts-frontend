import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldX, AlertOctagon, FileCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const RedLinesSection = () => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const redLines = [
    {
      icon: '🚫',
      titleEn: 'No Takfir',
      titleBn: 'তাকফীর নেই',
      descEn: 'We absolutely do not engage in declaring Muslims as disbelievers. This is a matter for qualified scholars under strict conditions.',
      descBn: 'আমরা মুসলিমদের কাফের ঘোষণা করার বিষয়ে মোটেও জড়িত হই না। এটি কঠোর শর্তে যোগ্য আলেমদের বিষয়।'
    },
    {
      icon: '🚫',
      titleEn: 'No Political Party Formation',
      titleBn: 'রাজনৈতিক দল গঠন নেই',
      descEn: 'Ummah Thoughts is an educational platform, not a political movement. We do not form, endorse, or affiliate with political parties.',
      descBn: 'উম্মাহ থটস একটি শিক্ষামূলক প্ল্যাটফর্ম, রাজনৈতিক আন্দোলন নয়। আমরা রাজনৈতিক দল গঠন, সমর্থন বা সংশ্লিষ্টতা করি না।'
    },
    {
      icon: '🚫',
      titleEn: 'No Incitement to Violence',
      titleBn: 'সহিংসতায় উসকানি নেই',
      descEn: 'We categorically reject any form of violence, terrorism, or extremism. Historical discussions are educational, not prescriptive.',
      descBn: 'আমরা যেকোনো ধরনের সহিংসতা, সন্ত্রাসবাদ বা চরমপন্থা স্পষ্টভাবে প্রত্যাখ্যান করি। ঐতিহাসিক আলোচনা শিক্ষামূলক, নির্দেশমূলক নয়।'
    },
    {
      icon: '🚫',
      titleEn: 'No Sectarian Division',
      titleBn: 'সাম্প্রদায়িক বিভাজন নেই',
      descEn: 'We respect the diversity within Ahlus Sunnah and do not promote one group against another.',
      descBn: 'আমরা আহলুস সুন্নাহর মধ্যে বৈচিত্র্যকে সম্মান করি এবং একটি দলকে অন্যটির বিরুদ্ধে প্রচার করি না।'
    }
  ];

  return (
    <section className="py-16 bg-destructive/5 border-y border-destructive/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-destructive/50 text-destructive">
            <ShieldX className="w-4 h-4 mr-1" />
            {isBengali ? 'আমাদের লাল রেখা' : 'What We Will NEVER Do'}
          </Badge>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {isBengali ? 'আমাদের নৈতিক সীমারেখা' : 'Our Ethical Boundaries'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isBengali 
              ? 'এই মূলনীতিগুলো অলঙ্ঘনীয়। কোনো পরিস্থিতিতেই এগুলো লঙ্ঘন করা হবে না।'
              : 'These principles are non-negotiable. They will not be violated under any circumstances.'
            }
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {redLines.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-destructive/20 p-6 hover:border-destructive/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {isBengali ? item.titleBn : item.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isBengali ? item.descBn : item.descEn}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CorrectionPolicy = () => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-primary/5 rounded-xl border border-primary/20 p-8 max-w-3xl mx-auto"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            {isBengali ? 'পর্যালোচনা ও সংশোধন নীতি' : 'Review & Correction Policy'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isBengali 
              ? 'আমরা জ্ঞানগত বিনয়ের প্রতি প্রতিশ্রুতিবদ্ধ। যদি আমাদের কোনো তথ্য ভুল প্রমাণিত হয়, আমরা তা স্বীকার করব এবং সংশোধন করব।'
              : 'We are committed to intellectual humility. If any of our content is proven inaccurate, we will acknowledge and correct it.'
            }
          </p>
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm font-medium text-foreground mb-2">
              {isBengali ? 'আমাদের প্রতিশ্রুতি:' : 'Our Commitment:'}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {isBengali ? 'যথাযথ প্রমাণ উপস্থাপনের পর সংশোধন' : 'Corrections made upon proper evidence'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {isBengali ? 'সংশোধিত বিষয়ে স্বচ্ছ ঘোষণা' : 'Transparent acknowledgment of corrections'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {isBengali ? 'আলেমদের মতামতের প্রতি সম্মান' : 'Respect for scholarly critique'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
