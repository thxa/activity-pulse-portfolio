
import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLanguage}
      className="rounded-full w-9 h-9 bg-background border-border"
      aria-label="Toggle language"
    >
      <Languages className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">
        {language === 'en' 
          ? translations[language].arabic 
          : translations[language].english}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;
