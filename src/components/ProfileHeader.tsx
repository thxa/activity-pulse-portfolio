import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Download, Github, ExternalLink, Linkedin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';
import { platforms } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';

const ProfileHeader: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const t = translations[language];
  
  return (
    <div className="animate-fade-in">
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and name section */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
              {/* <AvatarImage src="https://github.com/shadcn.png" alt="Profile Picture" /> */}
              <AvatarImage src="/images/selfy_TH.png" alt="Profile Picture" />
              <AvatarFallback>TH</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">{t.profileTitle}</h1>
            <p className="text-xl text-muted-foreground mb-2">{t.profileSubtitle}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{t.badges.ml}</Badge>
              <Badge variant="secondary">{t.badges.security}</Badge>
              <Badge variant="secondary">{t.badges.developer}</Badge>
            </div>
            
            <div className="flex gap-3 mb-6">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                {t.downloadCV}
              </Button>
              <Button size="sm" className="gap-2">
                {t.contactMe}
              </Button>
            </div>
          </div>
          
          {/* Bio section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">{t.aboutMe}</h2>
            <p className="text-muted-foreground mb-4">
              {t.aboutMeText}
            </p>
            
            <h2 className="text-xl font-semibold mb-2">{t.myProfiles}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {platforms.map(platform => (
                <a 
                  key={platform.id}
                  href={platform.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  {platform.iconSvg ? (
                    <span 
                      className="text-foreground" 
                      dangerouslySetInnerHTML={{ __html: platform.iconSvg }}
                    />
                  ) : (
                    <span className="text-lg">{platform.icon}</span>
                  )}
                  <span>{platform.name}</span>
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileHeader;
