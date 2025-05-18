import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useActivityData } from '@/hooks/useActivityData';
import YearNavigation from './heatmap/YearNavigation';
import HeatmapGrid from './heatmap/HeatmapGrid';
import HeatmapLegend from './heatmap/HeatmapLegend';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityHeatmapProps {
  selectedPlatforms: string[];
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ 
  selectedPlatforms
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const { language, isRTL } = useLanguage();
  
  const {
    activitiesByDate,
    monthsInRange,
    availableYears,
    getActivityLevel,
    loading,
    error
  } = useActivityData(selectedPlatforms, selectedYear);

  // Calculate total activities for the selected year
  const totalActivities = Object.values(activitiesByDate)
    .reduce((total, activities) => total + activities.length, 0);

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Card className="p-6">
          <Skeleton className="h-[200px] w-full" />
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className="p-6 text-center border-destructive">
        <h3 className="text-xl font-semibold mb-2 text-destructive">Error Loading Data</h3>
        <p className="text-muted-foreground mb-4">
          {error.message || "There was a problem retrieving your activity data."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Year navigation outside heatmap */}
      <YearNavigation 
        availableYears={availableYears} 
        selectedYear={selectedYear} 
        setSelectedYear={setSelectedYear} 
      />

      <Card className="p-6 bg-card border-border shadow-md">
        <h3 className="text-xl font-semibold mb-6 text-center">
          {translations[language].activityHeatmapTitle} {selectedYear}
        </h3>
        
        {totalActivities === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {translations[language].noActivity}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {selectedPlatforms.length === 0 
                ? translations[language].selectPlatformsFilter
                : translations[language].selectDifferentYear
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <HeatmapGrid 
              monthsInRange={monthsInRange} 
              activitiesByDate={activitiesByDate} 
              getActivityLevel={getActivityLevel} 
            />
            
            <div className="mt-6">
              <HeatmapLegend />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActivityHeatmap;
