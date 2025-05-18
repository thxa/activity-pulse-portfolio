import React from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Activity } from '@/data/mockData';
import DayLabels from './DayLabels';
import MonthLabels from './MonthLabels';
import MonthColumn from './MonthColumn';
import { useLanguage } from '@/context/LanguageContext';

interface HeatmapGridProps {
  monthsInRange: Date[];
  activitiesByDate: Record<string, Activity[]>;
  getActivityLevel: (day: Date) => number;
}

const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  monthsInRange,
  activitiesByDate,
  getActivityLevel
}) => {
  const { isRTL } = useLanguage();
  
  // Get day of week labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // If RTL, we reverse the order of months
  const displayMonths = isRTL ? [...monthsInRange].reverse() : monthsInRange;

  return (
    <div className="heatmap-container">
      <div className="flex flex-col">
        {/* Month labels row */}
        <MonthLabels monthsInRange={monthsInRange} />
        
        <div className="flex">
          {/* Day of week labels - vertical column */}
          <DayLabels dayLabels={dayLabels} />
          
          {/* Calendar grid */}
          <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {displayMonths.map((month, monthIndex) => {
              // Get all days for this month
              const firstDay = startOfMonth(month);
              const lastDay = endOfMonth(month);
              
              // Create a grid for each month
              const daysInMonth = eachDayOfInterval({
                start: firstDay,
                end: lastDay
              });
              
              return (
                <MonthColumn
                  key={monthIndex}
                  monthIndex={monthIndex}
                  daysInMonth={daysInMonth}
                  activitiesByDate={activitiesByDate}
                  getActivityLevel={getActivityLevel}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapGrid;
