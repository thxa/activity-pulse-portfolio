import React, { useState } from 'react';
import { platforms, PlatformInfo } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/context/ThemeContext';

interface PlatformFiltersProps {
  onFilterChange: (selectedPlatforms: string[]) => void;
}

const PlatformFilters: React.FC<PlatformFiltersProps> = ({ onFilterChange }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    platforms.map((platform) => platform.id)
  );
  const { theme } = useTheme();

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((current) => {
      // If already selected, remove it
      if (current.includes(platformId)) {
        const updated = current.filter((id) => id !== platformId);
        // Ensure at least one platform is selected
        if (updated.length === 0) return current;
        onFilterChange(updated);
        return updated;
      } 
      // Otherwise add it
      const updated = [...current, platformId];
      onFilterChange(updated);
      return updated;
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {platforms.map((platform) => (
        <div key={platform.id} className="flex items-center space-x-2">
          <Checkbox
            id={`platform-${platform.id}`}
            checked={selectedPlatforms.includes(platform.id)}
            onCheckedChange={() => handlePlatformToggle(platform.id)}
            className="platform-checkbox"
          />
          <Label
            htmlFor={`platform-${platform.id}`}
            className="flex items-center cursor-pointer"
          >
            {platform.iconSvg ? (
              <span 
                className="w-4 h-4 mr-2 text-foreground" 
                style={{ color: platform.color }}
                dangerouslySetInnerHTML={{ __html: platform.iconSvg }}
              />
            ) : (
              <span 
                className="w-3 h-3 rounded-full inline-block mr-2"
                style={{ backgroundColor: platform.color }}
              ></span>
            )}
            {platform.name}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default PlatformFilters;
