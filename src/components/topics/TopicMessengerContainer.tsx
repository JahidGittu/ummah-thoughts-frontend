"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TopicMessengerView } from './TopicMessengerView';
import { Landmark, Scale, Heart, Globe } from 'lucide-react';

interface TopicContent {
  id: string;
  titleEn: string;
  titleBn: string;
  videoThumbnail?: string;
  contentEn: string;
  contentBn: string;
  responseEn: string;
  responseBn: string;
  icon: React.ElementType;
}

interface TopicMessengerContainerProps {
  selectedTopicId?: string;
  onTopicChange?: (topicId: string) => void;
}

export const TopicMessengerContainer = ({ 
  selectedTopicId = 'khilafah',
  onTopicChange 
}: TopicMessengerContainerProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  // Sample topics data - can be fetched from API
  const topics: TopicContent[] = [
    {
      id: 'khilafah',
      titleEn: 'Khilafah System',
      titleBn: 'খিলাফাহ ব্যবস্থা',
      videoThumbnail: 'https://images.unsplash.com/photo-1639348370207-a8d5d5d5b5c5?w=600&h=400&fit=crop',
      contentEn: 'In Islamic governance, the Khilafah system represents the principle of collective leadership based on consultation (Shura). This system emphasizes the importance of choosing leaders who are righteous and knowledgeable in Islamic principles. The Khalifah must enforce Islamic law and protect the Muslim community while respecting the rights of minorities.',
      contentBn: 'ইসলামী শাসনে খিলাফাহ ব্যবস্থা পরামর্শের ভিত্তিতে যৌথ নেতৃত্বের নীতি প্রতিনিধিত্ব করে। এই ব্যবস্থা সৎ এবং ইসলামী নীতিতে জ্ঞানী নেতাদের নির্বাচনের গুরুত্ব জোর দেয়। খলিফা ইসলামী আইন কার্যকর করবেন এবং মুসলিম সম্প্রদায়কে সুরক্ষিত রাখবেন যখন সংখ্যালঘুদের অধিকার সম্মান করবেন।',
      responseEn: 'This interpretation aligns with classical Islamic jurisprudence where scholars have emphasized that the Khilafah is a religious obligation to establish Islamic law through consultation. The system must be implemented gradually, respecting existing governance structures while working towards Islamic objectives. Key scholars including Al-Mawardi and Ibn Qayyim have detailed how this can work within various political contexts.',
      responseBn: 'এই ব্যাখ্যা ধ্রুপদী ইসলামী ফিকহের সাথে মিলে যায় যেখানে আলেমরা জোর দিয়েছেন যে খিলাফাহ পরামর্শের মাধ্যমে ইসলামী আইন প্রতিষ্ঠার একটি ধর্মীয় বাধ্যবাধকতা। এই ব্যবস্থা ক্রমান্বয়ে বাস্তবায়ন করতে হবে, বিদ্যমান শাসন কাঠামোকে সম্মান করে ইসলামী উদ্দেশ্যের দিকে কাজ করতে হবে। আল-মাওয়ার্দী এবং ইবন কায়্যিম সহ মূল আলেমরা বিস্তারিত করেছেন কীভাবে এটি বিভিন্ন রাজনৈতিক প্রসঙ্গে কাজ করতে পারে।',
      icon: Landmark,
    },
    {
      id: 'shura',
      titleEn: 'Role of Shura (Consultation)',
      titleBn: 'শূরার ভূমিকা (পরামর্শ)',
      videoThumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      contentEn: 'Shura, or consultation, is a fundamental principle in Islamic governance. The Quran emphasizes that leadership decisions should be made through consultation with qualified advisors. This includes economic decisions, judicial matters, and military strategy. Shura ensures that power is not concentrated in one person\'s hands and that diverse perspectives are considered.',
      contentBn: 'শূরা বা পরামর্শ ইসলামী শাসনের একটি মৌলিক নীতি। কোরআন জোর দেয় যে নেতৃত্বের সিদ্ধান্ত দক্ষ পরামর্শদাতাদের সাথে পরামর্শের মাধ্যমে নেওয়া উচিত। এতে অর্থনৈতিক সিদ্ধান্ত, বিচারিক বিষয় এবং সামরিক কৌশল অন্তর্ভুক্ত। শূরা নিশ্চিত করে যে ক্ষমতা এক ব্যক্তির হাতে কেন্দ্রীভূত নয় এবং বিভিন্ন দৃষ্টিভঙ্গি বিবেচনা করা হয়।',
      responseEn: 'Indeed, Shura is clearly mentioned in Surah Ash-Shura (42:38) and Surah Ali Imran (3:159). The Prophet encouraged consultation even in matters of war. This practice was followed by the Rightly Guided Caliphs who made major decisions after consulting the Sahaba. Modern Muslim-majority nations can benefit from applying this principle in their governance structures.',
      responseBn: 'নিশ্চয়ই, শূরা সূরা আশ-শূরা (৪২:৩৮) এবং সূরা আলে ইমরান (৩:১৫৯) এ স্পষ্টভাবে উল্লেখ করা হয়েছে। নবী যুদ্ধের বিষয়েও পরামর্শকে উৎসাহিত করেছেন। এই অনুশীলন সঠিক পথের খলিফারা অনুসরণ করেছিলেন যারা সাহাবাদের পরামর্শের পর বড় সিদ্ধান্ত নিয়েছিলেন। আধুনিক মুসলিম-সংখ্যাগরিষ্ঠ দেশগুলি তাদের শাসন কাঠামোতে এই নীতি প্রয়োগ করে উপকৃত হতে পারে।',
      icon: Scale,
    },
    {
      id: 'social-justice',
      titleEn: 'Economic Justice & Social Reform',
      titleBn: 'অর্থনৈতিক ন্যায়বিচার ও সামাজিক সংস্কার',
      videoThumbnail: 'https://images.unsplash.com/photo-1552365438-9c6e5a48d64e?w=600&h=400&fit=crop',
      contentEn: 'Islamic principles emphasize economic justice and fair distribution of wealth. The system includes mandatory charity (Zakat), prohibition of exploitation, and protection of workers\' rights. This framework aims to eliminate poverty and create a society where everyone\'s basic needs are met while maintaining incentives for productivity and innovation.',
      contentBn: 'ইসলামী নীতিগুলি অর্থনৈতিক ন্যায়বিচার এবং সম্পদের ন্যায্য বিতরণে জোর দেয়। এই ব্যবস্থায় বাধ্যতামূলক দাতব্য (জাকাত), শোষণের নিষেধাজ্ঞা এবং কর্মীদের অধিকার সুরক্ষা অন্তর্ভুক্ত। এই কাঠামোটি দারিদ্র্য নির্মূল করতে এবং এমন একটি সমাজ তৈরি করার লক্ষ্য রাখে যেখানে সবার মৌলিক চাহিদা পূরণ হয়।',
      responseEn: 'The economic model in Islam has been studied by modern economists and many have praised its fairness and sustainability. Countries like Malaysia and Indonesia have successfully implemented Islamic principles in their financial systems. The Zakat system particularly has shown to be more efficient at poverty reduction compared to many conventional welfare programs.',
      responseBn: 'ইসলামে অর্থনৈতিক মডেল আধুনিক অর্থনীতিবিদদের দ্বারা অধ্যয়ন করা হয়েছে এবং অনেকে এর ন্যায্যতা এবং স্থায়িত্বের প্রশংসা করেছেন। মালয়েশিয়া এবং ইন্দোনেশিয়ার মতো দেশগুলি তাদের আর্থিক ব্যবস্থায় ইসলামী নীতিগুলি সফলভাবে প্রয়োগ করেছে। বিশেষত জাকাত ব্যবস্থা অনেক প্রচলিত কল্যাণ কর্মসূচির তুলনায় দারিদ্র্য হ্রাসে আরও কার্যকর প্রমাণিত হয়েছে।',
      icon: Heart,
    },
    {
      id: 'contemporary',
      titleEn: 'Addressing Modern Challenges',
      titleBn: 'আধুনিক চ্যালেঞ্জ মোকাবেলা',
      videoThumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      contentEn: 'Contemporary Islamic thought addresses modern challenges including technology ethics, environmental conservation, women\'s education, and interfaith dialogue. Islamic scholars are actively working on practical solutions that bridge traditional Islamic principles with modern realities, ensuring relevance while maintaining authenticity.',
      contentBn: 'সমসাময়িক ইসলামী চিন্তাভাবনা প্রযুক্তি নৈতিকতা, পরিবেশ সংরক্ষণ, নারী শিক্ষা এবং ধর্মান্তর সংলাপ সহ আধুনিক চ্যালেঞ্জগুলি সম্বোধন করে। ইসলামী আলেমরা ঐতিহ্যবাহী ইসলামী নীতিগুলির সাথে আধুনিক বাস্তবতাকে সেতুবন্ধন করে এমন ব্যবহারিক সমাধানে সক্রিয়ভাবে কাজ করছেন।',
      responseEn: 'The Islamic world has produced many contemporary scholars who have successfully integrated traditional knowledge with modern sciences. Organizations like the International Islamic Fiqh Academy work on these issues systematically. The past two decades have seen remarkable progress in developing Islamic frameworks for bioethics, environmental protection, and technological innovation.',
      responseBn: 'ইসলামী বিশ্ব অনেক সমসাময়িক পণ্ডিত তৈরি করেছে যারা ঐতিহ্যবাহী জ্ঞানকে আধুনিক বিজ্ঞানের সাথে সফলভাবে একীভূত করেছেন। আন্তর্জাতিক ইসলামী ফিকহ একাডেমির মতো সংস্থাগুলি এই বিষয়গুলিতে পদ্ধতিগতভাবে কাজ করে। গত দুই দশকে বায়োএথিক্স, পরিবেশ সুরক্ষা এবং প্রযুক্তিগত উদ্ভাবনের জন্য ইসলামী কাঠামো বিকাশে উল্লেখযোগ্য অগ্রগতি হয়েছে।',
      icon: Globe,
    },
  ];

  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  return (
    <motion.div
      key={selectedTopic.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <TopicMessengerView
        topicTitle={selectedTopic.titleEn}
        topicTitleBn={selectedTopic.titleBn}
        videoThumbnail={selectedTopic.videoThumbnail}
        content={selectedTopic.contentEn}
        contentBn={selectedTopic.contentBn}
        response={selectedTopic.responseEn}
        responseBn={selectedTopic.responseBn}
        icon={selectedTopic.icon}
      />
    </motion.div>
  );
};
