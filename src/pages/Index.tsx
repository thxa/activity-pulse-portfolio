import React, { useState } from 'react';
import ProfileHeader from '@/components/ProfileHeader';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import PlatformFilters from '@/components/PlatformFilters';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import { platforms } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';

const Index = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    platforms.map(platform => platform.id)
  );
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  const handleFilterChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
  };

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
                    <PlatformFilters onFilterChange={handleFilterChange} />
                  </div>
                </div>
              </div>
              
              {/* Center heatmap with better alignment */}
              {/* <div className="lg:w-3/4"> */}
              <div className="flex">
                <div className="w-full overflow-x-auto">
                    <ActivityHeatmap selectedPlatforms={selectedPlatforms} />
                </div>
              </div>
            </div>
          </section>
          
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
