import { HeroSection } from '@/components/home/HeroSection';
import { AudienceSection } from '@/components/home/AudienceSection';
import { LearningLevelSelector } from '@/components/home/LearningLevelSelector';
import { HowToUseGuide } from '@/components/home/HowToUseGuide';
import { FoundationsGrid } from '@/components/home/FoundationsGrid';
import { FeaturedTopic } from '@/components/home/FeaturedTopic';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { DailyWisdom } from '@/components/home/DailyWisdom';
import { FAQSection } from '@/components/home/FAQSection';
import { DownloadableResources } from '@/components/home/DownloadableResources';
import { LiveStatusBar } from '@/components/home/LiveStatusBar';
// import { ScholarlySection } from '@/components/home/ScholarlySection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AudienceSection />
      <LearningLevelSelector />
      <HowToUseGuide />
      <FoundationsGrid />
      <FeaturedTopic />
      <FeaturedCategories />
      <DailyWisdom />
      <FAQSection />
      <DownloadableResources />
      <LiveStatusBar />
      {/* <ScholarlySection /> */}
    </>
  );
}