"use client"

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export const FAQSection = () => {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const faqs = [
    {
      questionEn: "Is participating in democratic elections permissible in Islam?",
      questionBn: "ইসলামে গণতান্ত্রিক নির্বাচনে অংশগ্রহণ কি জায়েজ?",
      answerEn: "Scholars have differed on this issue. The majority view holds that participation is permissible when it leads to reducing harm or increasing benefit for Muslims, following the principle of choosing the lesser of two evils.",
      answerBn: "এই বিষয়ে আলেমদের মতভেদ রয়েছে। অধিকাংশের মতে, যখন এটি মুসলিমদের ক্ষতি কমাতে বা উপকার বাড়াতে সাহায্য করে, তখন অংশগ্রহণ জায়েজ - দুই মন্দের মধ্যে কম মন্দ বেছে নেওয়ার নীতি অনুসরণ করে।",
    },
    {
      questionEn: "What is the Islamic stance on gradual implementation of Shariah?",
      questionBn: "শরীয়াহর ধাপে ধাপে বাস্তবায়ন সম্পর্কে ইসলামী অবস্থান কী?",
      answerEn: "The Quran itself was revealed over 23 years, and many rulings were implemented gradually (like the prohibition of alcohol). This indicates the wisdom of gradual implementation based on society's readiness.",
      answerBn: "কুরআন নিজেই ২৩ বছরে নাযিল হয়েছে, এবং অনেক বিধান ধাপে ধাপে বাস্তবায়িত হয়েছে (যেমন মদ নিষিদ্ধকরণ)। এটি সমাজের প্রস্তুতির উপর ভিত্তি করে ধীরে ধীরে বাস্তবায়নের প্রজ্ঞা নির্দেশ করে।",
    },
    {
      questionEn: "Can Muslims form alliances with non-Muslims for political purposes?",
      questionBn: "রাজনৈতিক উদ্দেশ্যে মুসলিমরা কি অমুসলিমদের সাথে জোট গঠন করতে পারে?",
      answerEn: "Yes, with conditions. The Prophet ﷺ participated in Hilf al-Fudul (a pre-Islamic alliance for justice) and later said he would join such alliances even after Islam. The key is that the alliance must be for justice and not against Islamic principles.",
      answerBn: "হ্যাঁ, শর্তসাপেক্ষে। নবী ﷺ হিলফুল ফুযূলে (ন্যায়বিচারের জন্য প্রাক-ইসলামী জোট) অংশ নিয়েছিলেন এবং পরে বলেছিলেন যে তিনি ইসলামের পরেও এই ধরনের জোটে যোগ দেবেন। মূল কথা হল জোটটি অবশ্যই ন্যায়বিচারের জন্য এবং ইসলামী নীতির বিরুদ্ধে নয়।",
    },
    {
      questionEn: "What are the qualities of an Islamic leader (Ameer)?",
      questionBn: "একজন ইসলামী নেতার (আমীর) গুণাবলী কী কী?",
      answerEn: "Key qualities include: knowledge of Shariah, justice, consultation (shura), piety, capability, and concern for the welfare of the people. The leader should be chosen through consultation and must be accountable.",
      answerBn: "মূল গুণাবলীর মধ্যে রয়েছে: শরীয়াহর জ্ঞান, ন্যায়বিচার, পরামর্শ (শূরা), তাকওয়া, যোগ্যতা এবং জনগণের কল্যাণে উদ্বেগ। নেতা পরামর্শের মাধ্যমে নির্বাচিত হওয়া উচিত এবং জবাবদিহি করতে হবে।",
    },
    {
      questionEn: "How should Muslims deal with unjust rulers?",
      questionBn: "মুসলিমদের অন্যায়কারী শাসকদের সাথে কীভাবে আচরণ করা উচিত?",
      answerEn: "The scholarly position emphasizes advising rulers privately, making dua, and avoiding armed rebellion that leads to greater harm. However, speaking truth to power is considered one of the greatest forms of jihad.",
      answerBn: "আলেমদের অবস্থান ব্যক্তিগতভাবে শাসকদের উপদেশ দেওয়া, দোয়া করা এবং বৃহত্তর ক্ষতির দিকে নিয়ে যায় এমন সশস্ত্র বিদ্রোহ এড়ানোর উপর জোর দেয়। তবে, ক্ষমতাধরদের কাছে সত্য বলা জিহাদের অন্যতম শ্রেষ্ঠ রূপ হিসাবে বিবেচিত।",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              {t('faq.badge')}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('faq.title')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('faq.subtitle')}
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline py-5">
                    {isBengali ? faq.questionBn : faq.questionEn}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {isBengali ? faq.answerBn : faq.answerEn}
                    <Button variant="link" className="px-0 mt-2 gap-1">
                      {t('faq.readMore')}
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Button variant="outline" className="gap-2">
              {t('faq.viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};