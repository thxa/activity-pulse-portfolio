import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileHeader from '@/components/ProfileHeader';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import PlatformFilters from '@/components/PlatformFilters';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import { platforms } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { ArrowRight, Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import RecentBlogs from "@/components/RecentBlogs";
import Certifications from "@/components/Certifications";

const Index: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const { getRecentPosts, loading } = useBlogPosts();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    platforms.map((platform) => platform.id)
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const handleFilterChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
  };

  const handleLanguageChange = (languages: string[]) => {
    setSelectedLanguages(languages);
  };

  const handleYearChange = (years: string[]) => {
    setSelectedYears(years);
  };

  const recentPosts = getRecentPosts(3);

  // Helper: highlight match
  const highlight = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">{part}</mark> : part
    );
  };

  const filteredPosts = recentPosts;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <header className="py-6 flex justify-end space-x-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </header>
        
        <main className={isRTL ? 'rtl' : 'ltr'}>
          <ProfileHeader />
          
          <section className="my-10">
            <h2 className="section-heading">{t.activityDashboard}</h2>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar with filters */}
              <div className="lg:w-1/4">
                <div className="space-y-6 sticky top-6">
                  <div className="bg-card rounded-lg border p-4 shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">{t.platforms}</h3>
                    <PlatformFilters 
                      selectedPlatforms={selectedPlatforms}
                      onFilterChange={handleFilterChange} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Center heatmap with better alignment */}
              <div className="flex">
                <div className="w-full overflow-x-auto">
                    <ActivityHeatmap selectedPlatforms={selectedPlatforms} />
                </div>
              </div>
            </div>
          </section>
          
          {/* Recent Blogs */}
          <RecentBlogs />

          {/* Certifications */}
          <Certifications />

          <section className="my-12">
            <h2 className="section-heading">{t.comingSoon}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card p-6 hover:translate-y-[-5px] transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-2">{t.platformHighlights}</h3>
                <p className="text-muted-foreground">{t.platformHighlightsDescription}</p>
              </div>
              <div className="card p-6 hover:translate-y-[-5px] transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-2">{t.projectsGallery}</h3>
                <p className="text-muted-foreground">{t.projectsGalleryDescription}</p>
              </div>
              <div className="card p-6 hover:translate-y-[-5px] transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-2">{t.timelineMilestones}</h3>
                <p className="text-muted-foreground">{t.timelineMilestonesDescription}</p>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
