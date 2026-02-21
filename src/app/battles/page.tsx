"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, MapPin, Calendar, Users, BookOpen, ChevronDown, ChevronUp,
  Filter, X, Clock, Trophy, Shield, Flag, Eye, Skull, Volume2,
  AlertTriangle, CheckCircle, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import dynamic from 'next/dynamic';
const BattlesMap = dynamic(
  () => import('@/components/battles/BattlesMap'),
  { ssr: false }
);
import TimelineView from '@/components/battles/TimelineView';
import BattleQuiz from '@/components/battles/BattleQuiz';
import { EthicsWarningBox } from '@/components/shared/EthicsWarningBox';

// Battle data with comprehensive information including casualties
const battlesData = [
  {
    id: 'badr',
    nameEn: 'Battle of Badr',
    nameAr: 'غزوة بدر',
    nameBn: 'বদর যুদ্ধ',
    year: 624,
    hijriYear: '2 AH',
    period: 'rashidun',
    type: 'defense',
    location: { lat: 23.7833, lng: 38.7667, name: 'Badr, Hejaz' },
    summaryEn: 'The first major battle between Muslims and Quraysh. 313 Muslims defeated 1000 Quraysh.',
    summaryBn: 'মুসলিম ও কুরাইশদের মধ্যে প্রথম বড় যুদ্ধ। ৩১৩ জন মুসলিম ১০০০ কুরাইশকে পরাজিত করেছিল।',
    detailsEn: 'The Battle of Badr was a pivotal moment in Islamic history. Prophet Muhammad (ﷺ) led 313 poorly equipped Muslims against approximately 1,000 well-armed Quraysh warriors. Despite being outnumbered, the Muslims achieved a decisive victory through divine assistance and strategic planning. This battle established the Muslim community as a significant force in Arabia and is referenced in Surah Al-Anfal.',
    detailsBn: 'বদর যুদ্ধ ইসলামী ইতিহাসে একটি যুগান্তকারী মুহূর্ত ছিল। রাসূলুল্লাহ (ﷺ) ৩১৩ জন স্বল্প সজ্জিত মুসলিমকে নেতৃত্ব দিয়ে প্রায় ১,০০০ সুসজ্জিত কুরাইশ যোদ্ধার বিরুদ্ধে লড়াই করেন। সংখ্যায় কম হওয়া সত্ত্বেও, মুসলিমরা আল্লাহর সাহায্য ও কৌশলগত পরিকল্পনার মাধ্যমে নির্ণায়ক বিজয় অর্জন করে।',
    muslimForce: 313,
    enemyForce: 1000,
    outcome: 'victory',
    keyFigures: ['Prophet Muhammad ﷺ', 'Ali ibn Abi Talib', 'Hamza ibn Abdul-Muttalib'],
    quranicReference: 'Surah Al-Anfal (8:5-19)',
    significance: 'First major military victory; divine intervention confirmed',
    casualties: { muslimMartyrs: 14, enemyDeaths: 70 }
  },
  {
    id: 'uhud',
    nameEn: 'Battle of Uhud',
    nameAr: 'غزوة أحد',
    nameBn: 'উহুদ যুদ্ধ',
    year: 625,
    hijriYear: '3 AH',
    period: 'rashidun',
    type: 'defense',
    location: { lat: 24.5005, lng: 39.6136, name: 'Mount Uhud, Medina' },
    summaryEn: 'Quraysh sought revenge for Badr. Initial Muslim success turned due to archers leaving positions.',
    summaryBn: 'কুরাইশরা বদরের প্রতিশোধ নিতে চেয়েছিল। তীরন্দাজদের অবস্থান ত্যাগের কারণে প্রাথমিক মুসলিম সাফল্য ব্যর্থ হয়।',
    detailsEn: 'The Battle of Uhud was fought one year after Badr. The Quraysh, seeking revenge, amassed 3,000 warriors against 700 Muslims. Despite initial success, the Muslim archers abandoned their strategic positions on the hill, allowing Khalid ibn al-Walid (then fighting for Quraysh) to flank the Muslim army. The Prophet (ﷺ) was injured, and 70 Muslims were martyred including Hamza.',
    detailsBn: 'উহুদ যুদ্ধ বদরের এক বছর পর সংঘটিত হয়। প্রতিশোধ নিতে কুরাইশরা ৭০০ মুসলিমের বিরুদ্ধে ৩,০০০ যোদ্ধা সমবেত করে। প্রাথমিক সাফল্য সত্ত্বেও, মুসলিম তীরন্দাজরা পাহাড়ের কৌশলগত অবস্থান ত্যাগ করলে খালিদ ইবনে ওয়ালিদ (তখন কুরাইশদের পক্ষে) মুসলিম সেনাবাহিনীকে ঘিরে ফেলেন।',
    muslimForce: 700,
    enemyForce: 3000,
    outcome: 'setback',
    keyFigures: ['Prophet Muhammad ﷺ', 'Hamza ibn Abdul-Muttalib (martyred)', 'Khalid ibn al-Walid'],
    quranicReference: 'Surah Ali Imran (3:121-179)',
    significance: 'Lesson in discipline and obedience to leadership',
    casualties: { muslimMartyrs: 70, enemyDeaths: 37 }
  },
  {
    id: 'khandaq',
    nameEn: 'Battle of the Trench',
    nameAr: 'غزوة الخندق',
    nameBn: 'খন্দক যুদ্ধ',
    year: 627,
    hijriYear: '5 AH',
    period: 'rashidun',
    type: 'defense',
    location: { lat: 24.4667, lng: 39.6167, name: 'Medina' },
    summaryEn: 'Confederate army of 10,000 besieged Medina. Salman al-Farisi suggested digging a trench.',
    summaryBn: 'মদিনায় ১০,০০০ সৈন্যের মিত্র বাহিনী অবরোধ করে। সালমান আল-ফারসি খন্দক খননের পরামর্শ দেন।',
    detailsEn: 'Also known as the Battle of the Confederates (Ahzab), this was a 27-day siege of Medina by a coalition of Quraysh, Ghatafan, and other tribes totaling 10,000 warriors. Following the advice of Salman al-Farisi, the Muslims dug a trench around the vulnerable parts of Medina. The siege was lifted after internal disputes among the confederates and a severe storm.',
    detailsBn: 'আহযাব যুদ্ধ নামেও পরিচিত, এটি ছিল কুরাইশ, গাতাফান ও অন্যান্য গোত্রের ১০,০০০ যোদ্ধার সমন্বয়ে গঠিত জোটবাহিনীর মদিনার ২৭ দিনের অবরোধ। সালমান আল-ফারসির পরামর্শে মুসলিমরা মদিনার দুর্বল অংশের চারপাশে খন্দক খনন করে।',
    muslimForce: 3000,
    enemyForce: 10000,
    outcome: 'victory',
    keyFigures: ['Prophet Muhammad ﷺ', 'Salman al-Farisi', 'Ali ibn Abi Talib'],
    quranicReference: 'Surah Al-Ahzab (33:9-27)',
    significance: 'Strategic innovation; end of major Quraysh offensive capability',
    casualties: { muslimMartyrs: 6, enemyDeaths: 10 }
  },
  {
    id: 'khaybar',
    nameEn: 'Battle of Khaybar',
    nameAr: 'غزوة خيبر',
    nameBn: 'খায়বার যুদ্ধ',
    year: 628,
    hijriYear: '7 AH',
    period: 'rashidun',
    type: 'conquest',
    location: { lat: 25.6998, lng: 39.2833, name: 'Khaybar, Arabia' },
    summaryEn: 'Conquest of the Jewish fortress of Khaybar. Ali ibn Abi Talib led the final assault.',
    summaryBn: 'খায়বারের ইহুদি দুর্গ বিজয়। আলী ইবনে আবী তালিব চূড়ান্ত আক্রমণে নেতৃত্ব দেন।',
    detailsEn: 'After the Treaty of Hudaybiyyah, the Prophet (ﷺ) turned attention to Khaybar, a wealthy Jewish settlement that had supported the confederates. The fortress fell after Ali ibn Abi Talib, despite illness, led the final assault. This victory secured significant resources and marked the end of organized Jewish military opposition in Arabia.',
    detailsBn: 'হুদায়বিয়ার সন্ধির পর, রাসূলুল্লাহ (ﷺ) খায়বারের দিকে মনোযোগ দেন, যা একটি সমৃদ্ধ ইহুদি বসতি ছিল এবং মিত্রবাহিনীকে সমর্থন করেছিল। অসুস্থতা সত্ত্বেও আলী ইবনে আবী তালিব চূড়ান্ত আক্রমণে নেতৃত্ব দিলে দুর্গটি পতন হয়।',
    muslimForce: 1600,
    enemyForce: 10000,
    outcome: 'victory',
    keyFigures: ['Prophet Muhammad ﷺ', 'Ali ibn Abi Talib', 'Abu Bakr'],
    quranicReference: 'Surah Al-Fath (48:15)',
    significance: 'Economic resources secured; Jewish opposition ended',
    casualties: { muslimMartyrs: 15, enemyDeaths: 93 }
  },
  {
    id: 'makkah',
    nameEn: 'Conquest of Makkah',
    nameAr: 'فتح مكة',
    nameBn: 'মক্কা বিজয়',
    year: 630,
    hijriYear: '8 AH',
    period: 'rashidun',
    type: 'conquest',
    location: { lat: 21.4225, lng: 39.8262, name: 'Makkah' },
    summaryEn: 'Peaceful conquest of Makkah with 10,000 Muslims. General amnesty declared.',
    summaryBn: 'মক্কার শান্তিপূর্ণ বিজয় ১০,০০০ মুসলিমের সাথে। সাধারণ ক্ষমা ঘোষণা করা হয়।',
    detailsEn: 'The conquest of Makkah was a virtually bloodless victory. After Quraysh violated the Treaty of Hudaybiyyah, the Prophet (ﷺ) marched with 10,000 Muslims. The city surrendered, and the Prophet declared a general amnesty, saying "Go, you are all free." The Kaaba was cleansed of 360 idols, and Islam was firmly established in Arabia.',
    detailsBn: 'মক্কা বিজয় ছিল কার্যত রক্তপাতহীন একটি বিজয়। কুরাইশরা হুদায়বিয়ার সন্ধি ভঙ্গ করার পর, রাসূলুল্লাহ (ﷺ) ১০,০০০ মুসলিমের সাথে অগ্রসর হন। শহর আত্মসমর্পণ করে এবং নবী সাধারণ ক্ষমা ঘোষণা করেন।',
    muslimForce: 10000,
    enemyForce: 0,
    outcome: 'victory',
    keyFigures: ['Prophet Muhammad ﷺ', 'Abu Sufyan', 'Bilal ibn Rabah'],
    quranicReference: 'Surah An-Nasr (110:1-3)',
    significance: 'Peaceful victory; Kaaba cleansed; Islam established in Arabia',
    casualties: { muslimMartyrs: 2, enemyDeaths: 12 }
  },
  {
    id: 'hunayn',
    nameEn: 'Battle of Hunayn',
    nameAr: 'غزوة حنين',
    nameBn: 'হুনাইন যুদ্ধ',
    year: 630,
    hijriYear: '8 AH',
    period: 'rashidun',
    type: 'defense',
    location: { lat: 21.3833, lng: 40.3833, name: 'Hunayn Valley' },
    summaryEn: 'Hawazin and Thaqif tribes attacked after Makkah conquest. Initial setback then victory.',
    summaryBn: 'মক্কা বিজয়ের পর হাওয়াযিন ও সাকীফ গোত্র আক্রমণ করে। প্রাথমিক বিপর্যয়ের পর বিজয়।',
    detailsEn: 'Shortly after the conquest of Makkah, the Hawazin and Thaqif tribes assembled 20,000 warriors to attack the Muslims. The 12,000-strong Muslim army, confident in their numbers, was initially routed in an ambush. The Prophet (ﷺ) stood firm with a handful of companions, rallying the troops to ultimate victory.',
    detailsBn: 'মক্কা বিজয়ের অল্প পরেই, হাওয়াযিন ও সাকীফ গোত্র ২০,০০০ যোদ্ধা সমবেত করে মুসলিমদের আক্রমণ করে। সংখ্যায় আত্মবিশ্বাসী ১২,০০০ মুসলিম সেনা প্রাথমিকভাবে অতর্কিত আক্রমণে পিছু হটে।',
    muslimForce: 12000,
    enemyForce: 20000,
    outcome: 'victory',
    keyFigures: ['Prophet Muhammad ﷺ', 'Abu Bakr', 'Ali ibn Abi Talib'],
    quranicReference: 'Surah At-Tawbah (9:25-26)',
    significance: 'Lesson against overconfidence; importance of steadfastness',
    casualties: { muslimMartyrs: 4, enemyDeaths: 70 }
  },
  {
    id: 'tabuk',
    nameEn: 'Expedition of Tabuk',
    nameAr: 'غزوة تبوك',
    nameBn: 'তাবুক অভিযান',
    year: 630,
    hijriYear: '9 AH',
    period: 'rashidun',
    type: 'conquest',
    location: { lat: 28.3838, lng: 36.5550, name: 'Tabuk, Arabia' },
    summaryEn: 'Last military expedition led by Prophet ﷺ. Prepared for Byzantine conflict.',
    summaryBn: 'রাসূলুল্লাহ (ﷺ) নেতৃত্বে শেষ সামরিক অভিযান। বাইজেন্টাইন সংঘর্ষের জন্য প্রস্তুতি।',
    detailsEn: 'The Expedition of Tabuk was the last major military campaign led by the Prophet (ﷺ). News of Byzantine forces gathering prompted a march of 30,000 Muslims in extreme heat. Though no battle occurred, the expedition demonstrated Muslim military capability, and many northern Arab tribes submitted to Islam.',
    detailsBn: 'তাবুক অভিযান ছিল রাসূলুল্লাহ (ﷺ) নেতৃত্বে শেষ বড় সামরিক অভিযান। বাইজেন্টাইন বাহিনী সমাবেশের খবরে প্রচণ্ড গরমে ৩০,০০০ মুসলিম অগ্রসর হন। যুদ্ধ না হলেও, অভিযান মুসলিম সামরিক সক্ষমতা প্রদর্শন করে।',
    muslimForce: 30000,
    enemyForce: 0,
    outcome: 'strategic',
    keyFigures: ['Prophet Muhammad ﷺ', 'Abu Bakr', 'Uthman ibn Affan'],
    quranicReference: 'Surah At-Tawbah (9:38-42)',
    significance: 'Last prophetic expedition; northern expansion of Islam',
    casualties: { muslimMartyrs: 0, enemyDeaths: 0 }
  },
  {
    id: 'yarmouk',
    nameEn: 'Battle of Yarmouk',
    nameAr: 'معركة اليرموك',
    nameBn: 'ইয়ারমুক যুদ্ধ',
    year: 636,
    hijriYear: '15 AH',
    period: 'rashidun',
    type: 'conquest',
    location: { lat: 32.8333, lng: 35.9333, name: 'Yarmouk River, Syria' },
    summaryEn: 'Decisive defeat of Byzantine Empire. Opened Syria and Levant to Islam.',
    summaryBn: 'বাইজেন্টাইন সাম্রাজ্যের নির্ণায়ক পরাজয়। সিরিয়া ও লেভান্ট ইসলামের জন্য উন্মুক্ত করে।',
    detailsEn: 'The Battle of Yarmouk was one of the most decisive battles in history. Under Khalid ibn al-Walid\'s command, 25,000-40,000 Muslims faced approximately 100,000-200,000 Byzantine soldiers. The six-day battle resulted in a devastating Byzantine defeat, permanently ending their control over the Levant.',
    detailsBn: 'ইয়ারমুক যুদ্ধ ইতিহাসের সবচেয়ে নির্ণায়ক যুদ্ধগুলোর একটি। খালিদ ইবনুল ওয়ালিদের নেতৃত্বে ২৫,০০০-৪০,০০০ মুসলিম প্রায় ১,০০,০০০-২,০০,০০০ বাইজেন্টাইন সৈন্যের মুখোমুখি হন।',
    muslimForce: 40000,
    enemyForce: 150000,
    outcome: 'victory',
    keyFigures: ['Khalid ibn al-Walid', 'Abu Ubayda ibn al-Jarrah', 'Amr ibn al-As'],
    quranicReference: '',
    significance: 'End of Byzantine control over Levant; major territorial expansion',
    casualties: { muslimMartyrs: 3000, enemyDeaths: 70000 }
  },
  {
    id: 'qadisiyyah',
    nameEn: 'Battle of Qadisiyyah',
    nameAr: 'معركة القادسية',
    nameBn: 'কাদেসিয়া যুদ্ধ',
    year: 636,
    hijriYear: '15 AH',
    period: 'rashidun',
    type: 'conquest',
    location: { lat: 31.9500, lng: 44.2333, name: 'Qadisiyyah, Iraq' },
    summaryEn: 'Decisive victory over Sassanid Persia. Opened Iraq and Persia to Islam.',
    summaryBn: 'সাসানীয় পারস্যের উপর নির্ণায়ক বিজয়। ইরাক ও পারস্য ইসলামের জন্য উন্মুক্ত করে।',
    detailsEn: 'Under the command of Sa\'d ibn Abi Waqqas, 30,000 Muslims faced the Persian army of 80,000-120,000, including war elephants. The three-day battle ended with the death of Persian commander Rostam and the complete rout of the Sassanid forces. This victory led to the eventual conquest of the entire Persian Empire.',
    detailsBn: 'সাদ ইবনে আবী ওয়াক্কাসের নেতৃত্বে ৩০,০০০ মুসলিম যুদ্ধ হাতি সহ ৮০,০০০-১,২০,০০০ পারসিক সেনার মুখোমুখি হন। তিন দিনের যুদ্ধ পারসিক সেনাপতি রোস্তমের মৃত্যু ও সাসানীয় বাহিনীর সম্পূর্ণ পরাজয়ে শেষ হয়।',
    muslimForce: 30000,
    enemyForce: 100000,
    outcome: 'victory',
    keyFigures: ['Sa\'d ibn Abi Waqqas', 'Rostam Farrokhzad (Persian)', 'Umar ibn al-Khattab (Caliph)'],
    quranicReference: '',
    significance: 'End of Sassanid Empire; Islamization of Persia began',
    casualties: { muslimMartyrs: 8500, enemyDeaths: 30000 }
  },
  {
    id: 'jerusalem',
    nameEn: 'Conquest of Jerusalem',
    nameAr: 'فتح القدس',
    nameBn: 'জেরুজালেম বিজয়',
    year: 637,
    hijriYear: '16 AH',
    period: 'rashidun',
    type: 'conquest',
    location: { lat: 31.7683, lng: 35.2137, name: 'Jerusalem' },
    summaryEn: 'Peaceful surrender to Umar ibn al-Khattab. Al-Aqsa came under Muslim control.',
    summaryBn: 'উমর ইবনুল খাত্তাবের কাছে শান্তিপূর্ণ আত্মসমর্পণ। আল-আকসা মুসলিম নিয়ন্ত্রণে আসে।',
    detailsEn: 'After a siege, Jerusalem surrendered peacefully to Caliph Umar ibn al-Khattab personally. The famous "Assurance of Safety" (Umariyyah Covenant) guaranteed the safety of Christian inhabitants and their churches. Umar refused to pray inside the Church of the Holy Sepulchre to prevent Muslims from later claiming it.',
    detailsBn: 'অবরোধের পর, জেরুজালেম ব্যক্তিগতভাবে খলিফা উমর ইবনুল খাত্তাবের কাছে শান্তিপূর্ণভাবে আত্মসমর্পণ করে। বিখ্যাত "নিরাপত্তার আশ্বাস" (উমরীয়া চুক্তি) খ্রিস্টান বাসিন্দা ও তাদের গির্জার নিরাপত্তার নিশ্চয়তা দেয়।',
    muslimForce: 20000,
    enemyForce: 0,
    outcome: 'victory',
    keyFigures: ['Umar ibn al-Khattab', 'Patriarch Sophronius', 'Abu Ubayda ibn al-Jarrah'],
    quranicReference: 'Surah Al-Isra (17:1)',
    significance: 'Third holiest site in Islam secured; model of religious tolerance',
    casualties: { muslimMartyrs: 0, enemyDeaths: 0 }
  },
  {
    id: 'nahawand',
    nameEn: 'Battle of Nahawand',
    nameAr: 'معركة نهاوند',
    nameBn: 'নাহাওয়ান্দ যুদ্ধ',
    year: 642,
    hijriYear: '21 AH',
    period: 'rashidun',
    type: 'conquest',
    location: { lat: 34.1667, lng: 48.3833, name: 'Nahawand, Persia' },
    summaryEn: '"Victory of Victories" - final defeat of Sassanid Persia.',
    summaryBn: '"বিজয়ের বিজয়" - সাসানীয় পারস্যের চূড়ান্ত পরাজয়।',
    detailsEn: 'Known as the "Victory of Victories" (Fath al-Futuh), this battle marked the final end of Sassanid military power. Under Nu\'man ibn Muqarrin, Muslim forces defeated the last major Persian army of 150,000. The commander was martyred, but the victory opened the Iranian plateau to Islam.',
    detailsBn: '"বিজয়ের বিজয়" (ফাতহুল ফুতুহ) নামে পরিচিত, এই যুদ্ধ সাসানীয় সামরিক শক্তির চূড়ান্ত পতন চিহ্নিত করে। নুমান ইবনে মুকাররিনের নেতৃত্বে মুসলিম বাহিনী ১,৫০,০০০ সৈন্যের শেষ বড় পারসিক সেনাবাহিনীকে পরাজিত করে।',
    muslimForce: 30000,
    enemyForce: 150000,
    outcome: 'victory',
    keyFigures: ['Nu\'man ibn Muqarrin (martyred)', 'Hudhayfa ibn al-Yaman'],
    quranicReference: '',
    significance: 'Complete fall of Sassanid Empire; Islam spreads to Central Asia',
    casualties: { muslimMartyrs: 4000, enemyDeaths: 100000 }
  },
  {
    id: 'siffin',
    nameEn: 'Battle of Siffin',
    nameAr: 'معركة صفين',
    nameBn: 'সিফফিন যুদ্ধ',
    year: 657,
    hijriYear: '37 AH',
    period: 'rashidun',
    type: 'internal',
    location: { lat: 35.9500, lng: 39.0167, name: 'Siffin, Syria' },
    summaryEn: 'Civil war between Ali and Muawiyah. Arbitration called after heavy losses.',
    summaryBn: 'আলী ও মুয়াবিয়ার মধ্যে গৃহযুদ্ধ। ব্যাপক ক্ষয়ক্ষতির পর সালিশ আহ্বান।',
    detailsEn: 'This battle was part of the First Fitna (civil war) between Caliph Ali ibn Abi Talib and Muawiyah ibn Abi Sufyan. After inconclusive fighting and heavy casualties on both sides, Muawiyah\'s forces raised Qurans on their spears, calling for arbitration. This led to the controversial arbitration at Adhruh.',
    detailsBn: 'এই যুদ্ধ ছিল খলিফা আলী ইবনে আবী তালিব ও মুয়াবিয়া ইবনে আবী সুফিয়ানের মধ্যে প্রথম ফিতনার (গৃহযুদ্ধ) অংশ। অমীমাংসিত যুদ্ধ ও উভয় পক্ষে ব্যাপক হতাহতের পর, মুয়াবিয়ার বাহিনী বর্শার উপর কুরআন তুলে সালিশ আহ্বান করে।',
    muslimForce: 80000,
    enemyForce: 120000,
    outcome: 'stalemate',
    keyFigures: ['Ali ibn Abi Talib', 'Muawiyah ibn Abi Sufyan', 'Ammar ibn Yasir (martyred)'],
    quranicReference: '',
    significance: 'First major Muslim civil war; emergence of Khawarij',
    casualties: { muslimMartyrs: 25000, enemyDeaths: 45000 }
  },
  {
    id: 'constantinople717',
    nameEn: 'Siege of Constantinople (717)',
    nameAr: 'حصار القسطنطينية',
    nameBn: 'কনস্টান্টিনোপল অবরোধ (৭১৭)',
    year: 717,
    hijriYear: '99 AH',
    period: 'umayyad',
    type: 'conquest',
    location: { lat: 41.0082, lng: 28.9784, name: 'Constantinople' },
    summaryEn: 'Major Umayyad attempt to conquer Byzantine capital. Unsuccessful due to Greek fire.',
    summaryBn: 'বাইজেন্টাইন রাজধানী জয়ের বড় উমাইয়া প্রচেষ্টা। গ্রিক ফায়ারের কারণে ব্যর্থ।',
    detailsEn: 'Caliph Sulayman ibn Abd al-Malik launched a massive land and naval siege of Constantinople with 120,000 troops and 1,800 ships. The siege lasted a year but failed due to the Byzantine\'s use of Greek fire, harsh winter, Bulgarian attacks on Muslim forces, and internal Byzantine resistance.',
    detailsBn: 'খলিফা সুলায়মান ইবনে আব্দুল মালিক ১,২০,০০০ সৈন্য ও ১,৮০০ জাহাজ নিয়ে কনস্টান্টিনোপলের বিশাল স্থল ও নৌ অবরোধ শুরু করেন। এক বছর অবরোধ চলে কিন্তু গ্রিক ফায়ার, কঠোর শীত ও বুলগেরিয়ান আক্রমণের কারণে ব্যর্থ হয়।',
    muslimForce: 120000,
    enemyForce: 30000,
    outcome: 'defeat',
    keyFigures: ['Maslama ibn Abd al-Malik', 'Emperor Leo III'],
    quranicReference: '',
    significance: 'Last major Arab attempt on Constantinople until 1453',
    casualties: { muslimMartyrs: 30000, enemyDeaths: 5000 }
  },
  {
    id: 'tours',
    nameEn: 'Battle of Tours',
    nameAr: 'معركة بلاط الشهداء',
    nameBn: 'তুর যুদ্ধ',
    year: 732,
    hijriYear: '114 AH',
    period: 'umayyad',
    type: 'conquest',
    location: { lat: 47.3900, lng: 0.6900, name: 'Tours, France' },
    summaryEn: 'Umayyad advance into Europe halted by Frankish forces under Charles Martel.',
    summaryBn: 'চার্লস মার্টেলের অধীনে ফ্রাঙ্কিশ বাহিনী দ্বারা ইউরোপে উমাইয়া অগ্রগতি রুদ্ধ।',
    detailsEn: 'Also known as the Battle of Poitiers or the Battle of the Court of Martyrs (Balat al-Shuhada), this battle marked the furthest extent of Muslim expansion into Western Europe. Abd al-Rahman al-Ghafiqi was killed, and the Umayyad forces withdrew to Iberia.',
    detailsBn: 'পইতিয়ার যুদ্ধ বা শহীদদের দরবার যুদ্ধ (বালাত আশ-শুহাদা) নামেও পরিচিত, এই যুদ্ধ পশ্চিম ইউরোপে মুসলিম সম্প্রসারণের সর্বোচ্চ সীমা চিহ্নিত করে। আব্দুর রহমান আল-গাফিকী নিহত হন এবং উমাইয়া বাহিনী ইবেরিয়ায় ফিরে যায়।',
    muslimForce: 25000,
    enemyForce: 30000,
    outcome: 'defeat',
    keyFigures: ['Abd al-Rahman al-Ghafiqi (killed)', 'Charles Martel'],
    quranicReference: '',
    significance: 'End of Muslim expansion into Western Europe',
    casualties: { muslimMartyrs: 10000, enemyDeaths: 1500 }
  },
  {
    id: 'talas',
    nameEn: 'Battle of Talas',
    nameAr: 'معركة طلاس',
    nameBn: 'তালাস যুদ্ধ',
    year: 751,
    hijriYear: '133 AH',
    period: 'abbasid',
    type: 'conquest',
    location: { lat: 42.5200, lng: 72.2333, name: 'Talas River, Central Asia' },
    summaryEn: 'Abbasid victory over Tang China. Secured Central Asia and spread paper-making.',
    summaryBn: 'তাং চীনের বিরুদ্ধে আব্বাসীয় বিজয়। মধ্য এশিয়া সুরক্ষিত ও কাগজ তৈরি প্রসারিত।',
    detailsEn: 'The Battle of Talas was a significant encounter between the Abbasid Caliphate and the Tang Dynasty of China. The Muslim victory secured Central Asia for Islam and notably led to the spread of paper-making technology to the Islamic world after Chinese prisoners shared their knowledge.',
    detailsBn: 'তালাস যুদ্ধ আব্বাসীয় খিলাফত ও চীনের তাং রাজবংশের মধ্যে একটি গুরুত্বপূর্ণ সংঘর্ষ ছিল। মুসলিম বিজয় ইসলামের জন্য মধ্য এশিয়া সুরক্ষিত করে এবং চীনা বন্দীদের জ্ঞান ভাগাভাগির পর ইসলামী বিশ্বে কাগজ তৈরি প্রযুক্তি প্রসারিত হয়।',
    muslimForce: 30000,
    enemyForce: 30000,
    outcome: 'victory',
    keyFigures: ['Ziyad ibn Salih', 'Gao Xianzhi (Tang)'],
    quranicReference: '',
    significance: 'Central Asia Islamized; paper-making technology acquired',
    casualties: { muslimMartyrs: 2000, enemyDeaths: 10000 }
  },
  {
    id: 'hattin',
    nameEn: 'Battle of Hattin',
    nameAr: 'معركة حطين',
    nameBn: 'হাত্তিন যুদ্ধ',
    year: 1187,
    hijriYear: '583 AH',
    period: 'abbasid',
    type: 'conquest',
    location: { lat: 32.8167, lng: 35.4500, name: 'Horns of Hattin, Palestine' },
    summaryEn: 'Saladin\'s decisive victory over Crusaders. Led to liberation of Jerusalem.',
    summaryBn: 'ক্রুসেডারদের বিরুদ্ধে সালাদিনের নির্ণায়ক বিজয়। জেরুজালেম মুক্তির দিকে নিয়ে যায়।',
    detailsEn: 'Sultan Saladin (Salah ad-Din al-Ayyubi) defeated the Crusader Kingdom of Jerusalem near the Sea of Galilee. The Crusader army was destroyed, the True Cross captured, and Jerusalem was liberated three months later. Saladin showed mercy to the defeated, in contrast to the Crusader conquest of 1099.',
    detailsBn: 'সুলতান সালাদিন (সালাহ আদ-দীন আল-আইয়ুবী) গালীল সাগরের কাছে জেরুজালেম ক্রুসেডার রাজ্যকে পরাজিত করেন। ক্রুসেডার বাহিনী ধ্বংস হয়, ট্রু ক্রস দখল করা হয় এবং তিন মাস পর জেরুজালেম মুক্ত হয়।',
    muslimForce: 30000,
    enemyForce: 20000,
    outcome: 'victory',
    keyFigures: ['Salah ad-Din al-Ayyubi', 'Guy of Lusignan', 'Reynald of Châtillon'],
    quranicReference: '',
    significance: 'Jerusalem liberated from Crusaders; Saladin\'s chivalry became legendary',
    casualties: { muslimMartyrs: 1000, enemyDeaths: 17000 }
  },
  {
    id: 'aynjalut',
    nameEn: 'Battle of Ain Jalut',
    nameAr: 'معركة عين جالوت',
    nameBn: 'আইন জালুত যুদ্ধ',
    year: 1260,
    hijriYear: '658 AH',
    period: 'abbasid',
    type: 'defense',
    location: { lat: 32.5000, lng: 35.3333, name: 'Ain Jalut, Palestine' },
    summaryEn: 'First major defeat of Mongols. Mamluk victory saved Islamic civilization.',
    summaryBn: 'মঙ্গোলদের প্রথম বড় পরাজয়। মামলুক বিজয় ইসলামী সভ্যতা রক্ষা করে।',
    detailsEn: 'The Battle of Ain Jalut was a turning point in world history. The Mamluk Sultanate of Egypt, led by Sultan Qutuz and General Baybars, defeated the "invincible" Mongol army, stopping their westward expansion. This saved Egypt, Arabia, and North Africa from Mongol devastation.',
    detailsBn: 'আইন জালুত যুদ্ধ বিশ্ব ইতিহাসে একটি টার্নিং পয়েন্ট ছিল। সুলতান কুতুজ ও সেনাপতি বাইবার্সের নেতৃত্বে মিশরের মামলুক সালতানাত "অপরাজেয়" মঙ্গোল বাহিনীকে পরাজিত করে, তাদের পশ্চিমমুখী সম্প্রসারণ রুদ্ধ করে।',
    muslimForce: 20000,
    enemyForce: 20000,
    outcome: 'victory',
    keyFigures: ['Sultan Qutuz', 'General Baybars', 'Kitbuqa (Mongol)'],
    quranicReference: '',
    significance: 'First major Mongol defeat; Islamic civilization preserved',
    casualties: { muslimMartyrs: 1500, enemyDeaths: 15000 }
  },
  {
    id: 'constantinople1453',
    nameEn: 'Conquest of Constantinople',
    nameAr: 'فتح القسطنطينية',
    nameBn: 'কনস্টান্টিনোপল বিজয়',
    year: 1453,
    hijriYear: '857 AH',
    period: 'ottoman',
    type: 'conquest',
    location: { lat: 41.0082, lng: 28.9784, name: 'Constantinople' },
    summaryEn: 'Ottoman Sultan Mehmed II conquered Byzantine capital. Fulfilled prophetic hadith.',
    summaryBn: 'উসমানীয় সুলতান দ্বিতীয় মেহমেদ বাইজেন্টাইন রাজধানী জয় করেন। নবীজির হাদীস পূর্ণ হয়।',
    detailsEn: 'Sultan Mehmed II (Fatih), at age 21, conquered Constantinople after a 53-day siege using massive cannons designed by Orban. The conquest fulfilled a hadith of the Prophet (ﷺ) praising the army and commander who would conquer the city. This ended the Byzantine Empire and established Istanbul as the Ottoman capital.',
    detailsBn: 'সুলতান দ্বিতীয় মেহমেদ (ফাতিহ), ২১ বছর বয়সে, অরবান ডিজাইনের বিশাল কামান ব্যবহার করে ৫৩ দিনের অবরোধের পর কনস্টান্টিনোপল জয় করেন। এই বিজয় নবীজির (ﷺ) একটি হাদীস পূর্ণ করে যেখানে তিনি শহর জয়কারী সেনা ও সেনাপতির প্রশংসা করেন।',
    muslimForce: 80000,
    enemyForce: 7000,
    outcome: 'victory',
    keyFigures: ['Sultan Mehmed II (Fatih)', 'Emperor Constantine XI'],
    quranicReference: 'Prophetic Hadith fulfilled',
    significance: 'Byzantine Empire ended; Ottoman golden age began; Prophetic praise fulfilled',
    casualties: { muslimMartyrs: 4000, enemyDeaths: 5000 }
  },
  {
    id: 'mohacs',
    nameEn: 'Battle of Mohács',
    nameAr: 'معركة موهاج',
    nameBn: 'মোহাচ যুদ্ধ',
    year: 1526,
    hijriYear: '932 AH',
    period: 'ottoman',
    type: 'conquest',
    location: { lat: 45.9833, lng: 18.6667, name: 'Mohács, Hungary' },
    summaryEn: 'Suleiman the Magnificent defeated Hungary. Ottoman dominance in Central Europe.',
    summaryBn: 'সুলেমান দ্য ম্যাগনিফিসেন্ট হাঙ্গেরিকে পরাজিত করেন। মধ্য ইউরোপে উসমানীয় আধিপত্য।',
    detailsEn: 'Sultan Suleiman the Magnificent led Ottoman forces to a decisive victory over the Kingdom of Hungary. King Louis II was killed, and the battle led to Ottoman control of most of Hungary for the next 150 years, marking the peak of Ottoman expansion into Europe.',
    detailsBn: 'সুলতান সুলেমান দ্য ম্যাগনিফিসেন্ট হাঙ্গেরি রাজ্যের বিরুদ্ধে উসমানীয় বাহিনীকে নির্ণায়ক বিজয়ে নেতৃত্ব দেন। রাজা দ্বিতীয় লুই নিহত হন এবং যুদ্ধটি পরবর্তী ১৫০ বছর হাঙ্গেরির অধিকাংশে উসমানীয় নিয়ন্ত্রণের দিকে নিয়ে যায়।',
    muslimForce: 100000,
    enemyForce: 25000,
    outcome: 'victory',
    keyFigures: ['Sultan Suleiman I', 'King Louis II (killed)'],
    quranicReference: '',
    significance: 'Peak of Ottoman expansion in Europe; Hungary under Ottoman rule',
    casualties: { muslimMartyrs: 1500, enemyDeaths: 14000 }
  },
  {
    id: 'vienna1683',
    nameEn: 'Battle of Vienna',
    nameAr: 'معركة فيينا',
    nameBn: 'ভিয়েনা যুদ্ধ',
    year: 1683,
    hijriYear: '1094 AH',
    period: 'ottoman',
    type: 'conquest',
    location: { lat: 48.2082, lng: 16.3738, name: 'Vienna, Austria' },
    summaryEn: 'Failed Ottoman siege of Vienna. Marked beginning of Ottoman territorial decline.',
    summaryBn: 'ভিয়েনায় উসমানীয় অবরোধ ব্যর্থ। উসমানীয় আঞ্চলিক পতনের সূচনা।',
    detailsEn: 'The siege of Vienna by Grand Vizier Kara Mustafa Pasha ended in defeat when a relief force led by the Polish King Jan III Sobieski attacked the Ottoman camp. This battle marked the end of Ottoman expansion into Europe and the beginning of their territorial retreat.',
    detailsBn: 'গ্র্যান্ড ভিজির কারা মুস্তফা পাশার ভিয়েনা অবরোধ শেষ হয় পরাজয়ে যখন পোলিশ রাজা তৃতীয় জান সোবিয়েস্কির নেতৃত্বে একটি ত্রাণ বাহিনী উসমানীয় শিবিরে আক্রমণ করে। এই যুদ্ধ ইউরোপে উসমানীয় সম্প্রসারণের সমাপ্তি চিহ্নিত করে।',
    muslimForce: 150000,
    enemyForce: 90000,
    outcome: 'defeat',
    keyFigures: ['Kara Mustafa Pasha', 'Jan III Sobieski', 'Charles V of Lorraine'],
    quranicReference: '',
    significance: 'End of Ottoman expansion; beginning of territorial decline',
    casualties: { muslimMartyrs: 15000, enemyDeaths: 4500 }
  }
];

const periods = [
  { id: 'all', nameEn: 'All Periods', nameBn: 'সব যুগ' },
  { id: 'rashidun', nameEn: 'Rashidun (632-661)', nameBn: 'রাশিদুন (৬৩২-৬৬১)' },
  { id: 'umayyad', nameEn: 'Umayyad (661-750)', nameBn: 'উমাইয়া (৬৬১-৭৫০)' },
  { id: 'abbasid', nameEn: 'Abbasid (750-1258)', nameBn: 'আব্বাসীয় (৭৫০-১২৫৮)' },
  { id: 'ottoman', nameEn: 'Ottoman (1299-1922)', nameBn: 'উসমানীয় (১২৯৯-১৯২২)' }
];

const battleTypes = [
  { id: 'all', nameEn: 'All Types', nameBn: 'সব ধরন' },
  { id: 'conquest', nameEn: 'Conquest', nameBn: 'বিজয়' },
  { id: 'defense', nameEn: 'Defense', nameBn: 'প্রতিরক্ষা' },
  { id: 'internal', nameEn: 'Internal Conflict', nameBn: 'অভ্যন্তরীণ সংঘর্ষ' }
];

const Battles = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [expandedBattle, setExpandedBattle] = useState<string | null>(null);
  const [selectedBattle, setSelectedBattle] = useState<typeof battlesData[0] | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');
  const [quizBattle, setQuizBattle] = useState<typeof battlesData[0] | null>(null);

  const filteredBattles = battlesData.filter(battle => {
    const periodMatch = selectedPeriod === 'all' || battle.period === selectedPeriod;
    const typeMatch = selectedType === 'all' || battle.type === selectedType;
    return periodMatch && typeMatch;
  });

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'victory': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'defeat': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'setback': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'stalemate': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'strategic': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'rashidun': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'umayyad': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'abbasid': return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      case 'ottoman': return 'bg-rose-500/10 text-rose-600 border-rose-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">


      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
              <Swords className="w-4 h-4 mr-2" />
              {isBn ? 'ইসলামী ইতিহাস' : 'Islamic History'}
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {isBn ? 'ইসলামী যুদ্ধসমূহ' : 'Islamic Battles'}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {isBn
                ? 'রাশিদুন থেকে উসমানীয় - ইসলামী সভ্যতার সামরিক ইতিহাস অন্বেষণ করুন'
                : 'Explore the military history of Islamic civilization from Rashidun to Ottoman'}
            </p>

            {/* NEW: Ethics & Modern Misuse Warning Boxes */}
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
              <EthicsWarningBox variant="war-ethics" />
              <EthicsWarningBox variant="misuse-warning" />
            </div>

            {/* View Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                onClick={() => setViewMode('timeline')}
                className="gap-2"
              >
                <Clock className="w-4 h-4" />
                {isBn ? 'টাইমলাইন' : 'Timeline'}
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                {isBn ? 'ম্যাপ' : 'Map'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-y py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{isBn ? 'ফিল্টার:' : 'Filters:'}</span>
            </div>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isBn ? 'যুগ নির্বাচন' : 'Select Period'} />
              </SelectTrigger>
              <SelectContent>
                {periods.map(period => (
                  <SelectItem key={period.id} value={period.id}>
                    {isBn ? period.nameBn : period.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isBn ? 'ধরন নির্বাচন' : 'Select Type'} />
              </SelectTrigger>
              <SelectContent>
                {battleTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {isBn ? type.nameBn : type.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedPeriod !== 'all' || selectedType !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPeriod('all');
                  setSelectedType('all');
                }}
                className="gap-1"
              >
                <X className="w-4 h-4" />
                {isBn ? 'রিসেট' : 'Reset'}
              </Button>
            )}

            <Badge variant="outline" className="ml-auto">
              {filteredBattles.length} {isBn ? 'যুদ্ধ' : 'battles'}
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {viewMode === 'timeline' ? (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <TimelineView
                  battles={filteredBattles}
                  isBn={isBn}
                  periods={periods}
                  onViewDetails={(battle) => setSelectedBattle(battle as typeof selectedBattle)}
                  onStartQuiz={(battle) => setQuizBattle(battle as typeof quizBattle)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-6xl mx-auto"
              >
                {/* Interactive Leaflet Map */}
                <BattlesMap
                  battles={filteredBattles}
                  isBn={isBn}
                  onBattleSelect={(battle) => setSelectedBattle(battle as typeof selectedBattle)}
                />

                {/* Battle Grid below map */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {filteredBattles.map((battle, index) => (
                    <motion.div
                      key={battle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card
                        className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                        onClick={() => setSelectedBattle(battle)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={getPeriodColor(battle.period)} variant="outline">
                              {battle.hijriYear}
                            </Badge>
                            <Badge className={getOutcomeColor(battle.outcome)}>
                              {battle.outcome === 'victory' ? (isBn ? 'বিজয়' : 'Victory') :
                               battle.outcome === 'defeat' ? (isBn ? 'পরাজয়' : 'Defeat') :
                               battle.outcome === 'setback' ? (isBn ? 'বিপর্যয়' : 'Setback') :
                               battle.outcome === 'stalemate' ? (isBn ? 'অচলাবস্থা' : 'Stalemate') :
                               (isBn ? 'কৌশলগত' : 'Strategic')}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-foreground mb-1">
                            {isBn ? battle.nameBn : battle.nameEn}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {isBn ? battle.summaryBn : battle.summaryEn}
                          </p>

                          {/* Casualty preview */}
                          {battle.casualties && (
                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/50 text-xs">
                              <span className="flex items-center gap-1">
                                <Skull className="w-3 h-3 text-green-600" />
                                <span className="text-green-600 font-medium">{battle.casualties.muslimMartyrs}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Skull className="w-3 h-3 text-red-600" />
                                <span className="text-red-600 font-medium">{battle.casualties.enemyDeaths}</span>
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Battle Detail Modal */}
      <Dialog open={!!selectedBattle} onOpenChange={() => setSelectedBattle(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBattle && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className={getPeriodColor(selectedBattle.period)}>
                    {periods.find(p => p.id === selectedBattle.period)?.[isBn ? 'nameBn' : 'nameEn']}
                  </Badge>
                  <Badge className={getOutcomeColor(selectedBattle.outcome)}>
                    {selectedBattle.outcome === 'victory' ? (isBn ? 'বিজয়' : 'Victory') :
                     selectedBattle.outcome === 'defeat' ? (isBn ? 'পরাজয়' : 'Defeat') :
                     selectedBattle.outcome === 'setback' ? (isBn ? 'বিপর্যয়' : 'Setback') :
                     selectedBattle.outcome === 'stalemate' ? (isBn ? 'অচলাবস্থা' : 'Stalemate') :
                     (isBn ? 'কৌশলগত' : 'Strategic')}
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    {selectedBattle.year} CE / {selectedBattle.hijriYear}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl">
                  {isBn ? selectedBattle.nameBn : selectedBattle.nameEn}
                </DialogTitle>
                <p className="text-lg font-arabic text-muted-foreground">{selectedBattle.nameAr}</p>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Forces */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-500/5 border-green-500/20">
                    <CardContent className="p-4 text-center">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold text-green-600">
                        {selectedBattle.muslimForce.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isBn ? 'মুসলিম সৈন্য' : 'Muslim Forces'}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-500/5 border-red-500/20">
                    <CardContent className="p-4 text-center">
                      <Flag className="w-8 h-8 mx-auto mb-2 text-red-600" />
                      <p className="text-2xl font-bold text-red-600">
                        {selectedBattle.enemyForce.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isBn ? 'প্রতিপক্ষ সৈন্য' : 'Enemy Forces'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Casualties Section */}
                {selectedBattle.casualties && (
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-green-500/5 border-green-500/20">
                      <CardContent className="p-4 text-center">
                        <Skull className="w-6 h-6 mx-auto mb-2 text-green-600" />
                        <p className="text-xl font-bold text-green-600">
                          {selectedBattle.casualties.muslimMartyrs.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isBn ? 'মুসলিম শহীদ' : 'Muslim Martyrs'}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-500/5 border-red-500/20">
                      <CardContent className="p-4 text-center">
                        <Skull className="w-6 h-6 mx-auto mb-2 text-red-600" />
                        <p className="text-xl font-bold text-red-600">
                          {selectedBattle.casualties.enemyDeaths.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isBn ? 'প্রতিপক্ষ নিহত' : 'Enemy Deaths'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{selectedBattle.location.name}</span>
                </div>

                {/* Full Story */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    {isBn ? 'সম্পূর্ণ গল্প' : 'Full Story'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {isBn ? selectedBattle.detailsBn : selectedBattle.detailsEn}
                  </p>
                </div>

                {/* Key Figures */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {isBn ? 'প্রধান ব্যক্তিত্ব' : 'Key Figures'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBattle.keyFigures.map(figure => (
                      <Badge key={figure} variant="secondary" className="text-sm">
                        {figure}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Quranic Reference */}
                {selectedBattle.quranicReference && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      {isBn ? 'কুরআনের রেফারেন্স' : 'Quranic Reference'}
                    </h3>
                    <p className="text-primary font-medium">{selectedBattle.quranicReference}</p>
                  </div>
                )}

                {/* Significance */}
                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-secondary-foreground" />
                    {isBn ? 'ঐতিহাসিক গুরুত্ব' : 'Historical Significance'}
                  </h3>
                  <p className="text-muted-foreground">{selectedBattle.significance}</p>
                </div>

                {/* NEW: Lessons Section */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    {isBn ? 'এই যুদ্ধ থেকে শিক্ষা' : 'Lessons from this Battle'}
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{isBn ? 'কৌশলগত পরিকল্পনা ও ধৈর্যের গুরুত্ব' : 'Importance of strategic planning and patience'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{isBn ? 'নেতৃত্বের প্রতি ঐক্য ও আনুগত্য' : 'Unity and obedience to leadership'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{isBn ? 'আল্লাহর উপর তাওয়াক্কুল সহ বাস্তব পদক্ষেপ' : 'Trust in Allah while taking practical measures'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{isBn ? 'সংঘাতের সময়েও দয়া ও ন্যায়বিচার' : 'Mercy and justice even in times of conflict'}</span>
                    </li>
                  </ul>
                </div>

                {/* NEW: Modern Context Warning */}
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    {isBn ? 'গুরুত্বপূর্ণ সতর্কতা' : 'Important Warning'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isBn
                      ? 'এই ঐতিহাসিক ঘটনাগুলো আধুনিক সহিংসতা বা চরমপন্থার ন্যায্যতা নয়। প্রেক্ষাপট ও পরিস্থিতি তাদের সময়ের জন্য অনন্য ছিল। জিহাদের কঠোর শর্ত ও আলেমদের তত্ত্বাবধান রয়েছে।'
                      : 'These historical events are not justification for modern violence or extremism. Context and circumstances were unique to their time. Jihad has strict conditions and requires scholarly oversight.'
                    }
                  </p>
                </div>

                {/* Quiz Button */}
                <div className="flex justify-center pt-4 border-t">
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => {
                      setSelectedBattle(null);
                      setQuizBattle(selectedBattle);
                    }}
                  >
                    <Swords className="w-4 h-4" />
                    {isBn ? 'এই যুদ্ধের কুইজ নিন' : 'Take Quiz on This Battle'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Quiz Modal */}
      <BattleQuiz
        battle={quizBattle}
        isOpen={!!quizBattle}
        onClose={() => setQuizBattle(null)}
        isBn={isBn}
      />

      <Footer />
    </div>
  );
};

export default Battles;
