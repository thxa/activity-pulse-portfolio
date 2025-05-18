import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';

interface DayLabelsProps {
  dayLabels: string[];
}

const DayLabels: React.FC<DayLabelsProps> = ({ dayLabels }) => {
  const { language, isRTL } = useLanguage();
  const days = translations[language].days;

  // Map the English day labels to the translated day labels
  const translatedDayLabels = dayLabels.map(day => {
    switch (day) {
      case 'Sun': return days.sunday;
      case 'Mon': return days.monday;
      case 'Tue': return days.tuesday;
      case 'Wed': return days.wednesday;
      case 'Thu': return days.thursday;
      case 'Fri': return days.friday;
      case 'Sat': return days.saturday;
      default: return day;
    }
  });

  return (
    <div className={`flex flex-col ${isRTL ? 'ml-2' : 'mr-2'}`}>
      {translatedDayLabels.map((day, i) => (
        <div 
          key={i} 
          className={`h-6 flex items-center ${isRTL ? 'justify-start pl-2' : 'justify-end pr-2'} text-xs text-muted-foreground font-medium`}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default DayLabels;
