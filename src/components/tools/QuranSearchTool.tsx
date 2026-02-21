import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Search, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/badge';
import { toBengaliNumerals } from '@/lib/dateUtils';

interface Props {
  onClose: () => void;
}

interface SearchResult {
  surah: number;
  surahName: string;
  surahNameAr: string;
  ayah: number;
  textAr: string;
  textEn: string;
  textBn: string;
}

// Sample data for demonstration
const sampleVerses: SearchResult[] = [
  {
    surah: 2,
    surahName: 'Al-Baqarah',
    surahNameAr: 'البقرة',
    ayah: 255,
    textAr: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    textEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
    textBn: 'আল্লাহ - তিনি ছাড়া কোন উপাস্য নেই, তিনি চিরঞ্জীব, সবকিছুর ধারক। তাঁকে তন্দ্রা বা নিদ্রা স্পর্শ করে না।',
  },
  {
    surah: 112,
    surahName: 'Al-Ikhlas',
    surahNameAr: 'الإخلاص',
    ayah: 1,
    textAr: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    textEn: 'Say, "He is Allah, [who is] One,"',
    textBn: 'বলুন, "তিনি আল্লাহ, এক,"',
  },
  {
    surah: 1,
    surahName: 'Al-Fatihah',
    surahNameAr: 'الفاتحة',
    ayah: 1,
    textAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    textEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    textBn: 'পরম করুণাময় অতি দয়ালু আল্লাহর নামে।',
  },
  {
    surah: 3,
    surahName: 'Ali Imran',
    surahNameAr: 'آل عمران',
    ayah: 159,
    textAr: 'فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ',
    textEn: 'So by mercy from Allah, you were lenient with them. And if you had been rude and harsh in heart, they would have disbanded from about you.',
    textBn: 'আল্লাহর রহমতেই আপনি তাদের প্রতি কোমল হয়েছিলেন। আপনি যদি রূঢ় ও কঠিন হৃদয়ের হতেন, তাহলে তারা আপনার চারপাশ থেকে সরে যেত।',
  },
  {
    surah: 49,
    surahName: 'Al-Hujurat',
    surahNameAr: 'الحجرات',
    ayah: 13,
    textAr: 'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا',
    textEn: 'O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another.',
    textBn: 'হে মানবজাতি, আমি তোমাদেরকে পুরুষ ও নারী থেকে সৃষ্টি করেছি এবং তোমাদেরকে বিভিন্ন জাতি ও গোত্রে বিভক্ত করেছি যাতে তোমরা একে অপরকে চিনতে পার।',
  },
];

export const QuranSearchTool = ({ onClose }: Props) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(sampleVerses);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setResults(sampleVerses);
    } else {
      const filtered = sampleVerses.filter(verse =>
        verse.textEn.toLowerCase().includes(query.toLowerCase()) ||
        verse.textBn.includes(query) ||
        verse.textAr.includes(query) ||
        verse.surahName.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatReference = (surah: number, ayah: number) => {
    if (isBengali) {
      return `সূরা ${toBengaliNumerals(surah)}:${toBengaliNumerals(ayah)}`;
    }
    return `Surah ${surah}:${ayah}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button variant="ghost" size="sm" onClick={onClose} className="mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isBengali ? 'টুলসে ফিরুন' : 'Back to Tools'}
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {isBengali ? 'কুরআন অনুসন্ধান' : 'Quran Search'}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {isBengali 
                ? 'আয়াত, সূরা বা বিষয় দিয়ে অনুসন্ধান করুন' 
                : 'Search by verse, surah, or topic'
              }
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isBengali ? 'কুরআনে অনুসন্ধান করুন...' : 'Search the Quran...'}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isBengali 
                ? `${toBengaliNumerals(results.length)}টি ফলাফল পাওয়া গেছে` 
                : `${results.length} results found`
              }
            </p>
          </motion.div>

          {/* Results */}
          <div className="space-y-4">
            {results.map((verse, index) => (
              <motion.div
                key={`${verse.surah}-${verse.ayah}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-card border border-border rounded-xl p-5"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-arabic">
                      {verse.surahNameAr}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {verse.surahName}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {formatReference(verse.surah, verse.ayah)}
                  </span>
                </div>

                {/* Arabic Text */}
                <p className="font-arabic text-xl leading-loose text-foreground text-right mb-4 pb-4 border-b border-border/50">
                  {verse.textAr}
                </p>

                {/* Translation */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {isBengali ? verse.textBn : verse.textEn}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopy(`${verse.textAr}\n\n${isBengali ? verse.textBn : verse.textEn}\n\n— ${verse.surahName} ${verse.surah}:${verse.ayah}`, index)}
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 mr-1 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    {copiedIndex === index 
                      ? (isBengali ? 'কপি হয়েছে' : 'Copied') 
                      : (isBengali ? 'কপি' : 'Copy')
                    }
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a 
                      href={`https://quran.com/${verse.surah}/${verse.ayah}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Quran.com
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isBengali ? 'কোন ফলাফল পাওয়া যায়নি' : 'No results found'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
