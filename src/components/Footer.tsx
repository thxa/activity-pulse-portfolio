import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <footer className="mt-12 py-6 border-t relative z-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Thamer Alharbi. {t.copyright}
            </p>
          </div>
          <div className="flex gap-4">
            {/* <a 
              href="https://github.com/thxa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a> */}
            <a 
              href="https://linkedin.com/in/7h4m3r"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.linkedin}
            </a>
            {/* <a 
              href="mailto:contact@example.com"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Email
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
