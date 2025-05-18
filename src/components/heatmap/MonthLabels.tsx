import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';

interface MonthLabelsProps {
  monthsInRange: Date[];
}

const MonthLabels: React.FC<MonthLabelsProps> = ({ monthsInRange }) => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      // Initial check
      setIsMobile(window.innerWidth < 768);
      
      // Add resize listener
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // If RTL, we reverse the order of months
  const displayMonths = isRTL ? [...monthsInRange].reverse() : monthsInRange;
  
  // Format month based on language
  const formatMonth = (date: Date): string => {
    if (language === 'ar') {
      // Use Arabic month names
      const monthIndex = date.getMonth();
      return t.months[monthIndex];
    } else {
      // Use date-fns with appropriate format for screen size
      return format(date, isMobile ? 'M' : 'MMM');
    }
  };

  return (
    <div className={`flex ${isRTL ? 'mr-2' : 'ml-2'} mb-2`}>
      {displayMonths.map((month, i) => {
        const monthYear = formatMonth(month);
        
        // Calculate approximate width based on days in month
        const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
        const scaleFactor = isMobile ? 2.8 : 3.5;
        const width = `${daysInMonth * scaleFactor}px`;
        
        return (
          <div 
            key={i}
            className={`text-xs text-center truncate ${isMobile ? 'px-0.5' : 'px-1'}`}
            style={{ 
              minWidth: width,
              color: i % 2 === 0 ? 'var(--primary)' : 'var(--primary-foreground)'
            }}
          >
            {monthYear}
          </div>
        );
      })}
    </div>
  );
};

export default MonthLabels;
