import React from 'react';
import { format } from 'date-fns';
import { Activity } from '@/data/mockData';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';

interface ActivityCellProps {
  day: Date;
  activitiesByDate: Record<string, Activity[]>;
  getActivityLevel: (day: Date) => number;
}

const ActivityCell: React.FC<ActivityCellProps> = ({ 
  day, 
  activitiesByDate, 
  getActivityLevel 
}) => {
  const level = getActivityLevel(day);
  const dateStr = format(day, 'yyyy-MM-dd');
  const activities = activitiesByDate[dateStr] || [];
  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  // Function to get human-readable details for an activity
  const getActivityDetails = (activity: Activity): string => {
    if (!activity.details) {
      return `${activity.count} ${t.activities}`;
    }

    // Platform-specific translations can be added here
    switch (activity.platform) {
      case 'github':
        return isRTL 
          ? `${activity.details.type} ${t.on} ${activity.details.repo}`
          : `${activity.details.type} ${t.on} ${activity.details.repo}`;
        
      case 'leetcode':
        return `${activity.details.problemName} (${activity.details.difficulty}) - ${activity.details.status}`;
        
      case 'kaggle':
        return `${activity.details.competition} - ${activity.count} ${t.activities}`;
        
      case 'codeforces':
        return `${activity.details.contest} - ${activity.count} ${t.activities}`;
        
      case 'hackthebox':
        return `${activity.details.challenge} - ${activity.count} ${t.activities}`;
        
      case 'hackerrank':
        return `${activity.details.category} - ${activity.count} ${t.activities}`;
        
      case 'vjudge':
        return `${activity.details.contestType} - ${activity.details.difficulty}`;
        
      case 'codewars':
        return `${activity.details.kataRank} - ${activity.details.language}`;
        
      case 'satr':
        return `${activity.details.course} - ${activity.details.progress}`;
        
      case 'cyberhub':
        return `${activity.details.challengeType} - ${activity.details.difficulty}`;
        
      case 'picoctf':
        return `${activity.details.category} - ${activity.details.points} ${t.on}`;
        
      case 'flagyard':
        return `${activity.details.challengeName} - ${activity.details.category}`;
        
      default:
        return `${activity.count} ${t.activities}`;
    }
  };

  // Group activities by platform for cleaner display
  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.platform]) {
      acc[activity.platform] = [];
    }
    acc[activity.platform].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`heatmap-cell level-${level} mx-0.5 ${isToday ? 'current-day' : ''}`}
            data-date={dateStr}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm p-1 max-w-md">
            <p className="font-bold">{format(day, 'MMM d, yyyy')}</p>
            {activities.length === 0 ? (
              <p>{t.activityEmpty}</p>
            ) : (
              <div>
                {Object.entries(groupedActivities).map(([platform, platformActivities]) => (
                  <div key={platform} className="mt-2">
                    <div className="flex items-center font-semibold">
                      <span 
                        className={`w-2 h-2 rounded-full mt-1 ${platform}`} 
                      />
                      <span className="capitalize">{platform} ({platformActivities.length})</span>
                    </div>
                    <ul className={`ml-3 mt-1 list-disc list-inside space-y-1 ${isRTL ? 'rtl' : 'ltr'}`}>
                      {platformActivities.map((activity, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">
                          {getActivityDetails(activity)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActivityCell;
