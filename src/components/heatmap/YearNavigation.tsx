import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface YearNavigationProps {
  availableYears: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}
const YearNavigation: React.FC<YearNavigationProps> = ({ 
  availableYears, 
  selectedYear, 
  setSelectedYear 
}) => {
  const { isRTL } = useLanguage();

  // Sort years from most recent to oldest
  const sortedYears = [...availableYears].sort((a, b) => b - a);
  
  // Get the current index of the selected year
  const selectedYearIndex = sortedYears.indexOf(selectedYear);
  
  // Navigate to previous year
  const goToPreviousYear = () => {
    const prevYearIndex = selectedYearIndex + 1; // +1 because years are in descending order
    if (prevYearIndex < sortedYears.length) {
      setSelectedYear(sortedYears[prevYearIndex]);
    }
  };
  
  // Navigate to next year
  const goToNextYear = () => {
    const nextYearIndex = selectedYearIndex - 1; // -1 because years are in descending order
    if (nextYearIndex >= 0) {
      setSelectedYear(sortedYears[nextYearIndex]);
    }
  };

  // Get the visible years (selected year, previous year, and next year)
  const getVisibleYears = () => {
    const visibleYears: number[] = [];
    
    // Add previous year if available
    if (selectedYearIndex < sortedYears.length - 1) {
      visibleYears.push(sortedYears[selectedYearIndex + 1]);
    }
    
    // Add selected year
    visibleYears.push(selectedYear);
    
    // Add next year if available
    if (selectedYearIndex > 0) {
      visibleYears.push(sortedYears[selectedYearIndex - 1]);
    }
    
    return visibleYears;
  };

  const visibleYears = getVisibleYears();
  
  return (
    <div className="flex items-center justify-center space-x-2 mb-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={goToPreviousYear} 
        disabled={selectedYearIndex === sortedYears.length - 1}
        title="Previous Year"
      >
        {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className="flex overflow-x-auto px-2 py-1 gap-2 rounded-xl bg-muted/50">
        {visibleYears.map(year => (
          <Button
            key={year}
            variant={selectedYear === year ? "default" : "ghost"}
            className="transition-all min-w-[4rem]"
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </Button>
        ))}
      </div>

      <Button 
        variant="outline" 
        size="icon"
        onClick={goToNextYear} 
        disabled={selectedYearIndex === 0}
        title="Next Year"
      >
        {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default YearNavigation;
