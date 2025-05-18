import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';

const HeatmapLegend: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  
  return (
    <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mt-4 items-center`}>
      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
        <span className="text-xs text-muted-foreground font-medium">
          {t.less}
        </span>
        
        <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-1`}>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`heatmap-cell level-${level} w-3 h-3 md:w-4 md:h-4`}
            />
          ))}
        </div>
        
        <span className="text-xs text-muted-foreground font-medium">
          {t.more}
        </span>
      </div>
    </div>
  );
};

export default HeatmapLegend;
