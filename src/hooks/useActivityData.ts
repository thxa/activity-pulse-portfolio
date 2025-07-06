import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  eachDayOfInterval, 
  getDay, 
  addMonths,
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  getYear, 
  startOfYear, 
  endOfYear,
  parseISO
} from 'date-fns';
import { Activity, mockActivities, getAllActivities } from '@/data/mockData';

export const useActivityData = (
  selectedPlatforms: string[], 
  selectedYear: number
) => {
  const [activitiesByDate, setActivitiesByDate] = useState<Record<string, Activity[]>>({});
  const [calendarWeeks, setCalendarWeeks] = useState<Date[][]>([]);
  const [monthsInRange, setMonthsInRange] = useState<Date[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);

  const currentYear = new Date().getFullYear();

  // Load all activities including real data
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const activities = await getAllActivities();
        setAllActivities(activities);
      } catch (err) {
        console.error('Error loading activities:', err);
        setError(err instanceof Error ? err : new Error('Error loading activity data'));
        // Fallback to mock data
        setAllActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  // Find all available years in the data
  useEffect(() => {
    if (allActivities.length === 0) return;
    
    try {
      const years = allActivities.reduce((acc, activity) => {
        const year = getYear(parseISO(activity.date));
        if (!acc.includes(year)) {
          acc.push(year);
        }
        return acc;
      }, [] as number[]);
      
      // Sort years in descending order (newest first)
      const sortedYears = [...new Set(years)].sort((a, b) => b - a);
      
      // If no activities or current year not in data, add current year
      if (!sortedYears.includes(currentYear)) {
        sortedYears.unshift(currentYear);
      }
      
      setAvailableYears(sortedYears);
    } catch (err) {
      console.error('Error determining available years:', err);
      setError(err instanceof Error ? err : new Error('Error processing data'));
    }
  }, [allActivities, currentYear]);

  // Filter activities based on selected platforms and year
  useEffect(() => {
    if (allActivities.length === 0) return;
    
    try {
      setLoading(true);
      
      // Filter activities by platform and year
      const filtered = allActivities.filter(activity => 
        selectedPlatforms.includes(activity.platform) && 
        getYear(parseISO(activity.date)) === selectedYear
      );
      
      // Group activities by date
      const byDate = filtered.reduce((acc, activity) => {
        if (!acc[activity.date]) {
          acc[activity.date] = [];
        }
        acc[activity.date].push(activity);
        return acc;
      }, {} as Record<string, Activity[]>);
      
      setActivitiesByDate(byDate);
    } catch (err) {
      console.error('Error filtering activities:', err);
      setError(err instanceof Error ? err : new Error('Error processing data'));
    } finally {
      setLoading(false);
    }
  }, [allActivities, selectedPlatforms, selectedYear]);

  // Generate calendar data for selected year
  useEffect(() => {
    const yearStart = startOfYear(new Date(selectedYear, 0, 1));
    const yearEnd = endOfYear(yearStart);
    
    // Generate all weeks in the year
    const weeks: Date[][] = [];
    let currentWeekStart = startOfWeek(yearStart, { weekStartsOn: 0 });
    
    while (currentWeekStart <= yearEnd) {
      const week = eachDayOfInterval({
        start: currentWeekStart,
        end: endOfWeek(currentWeekStart, { weekStartsOn: 0 })
      });
      weeks.push(week);
      currentWeekStart = addWeeks(currentWeekStart, 1);
    }
    
    setCalendarWeeks(weeks);
    
    // Generate month labels for the year
    const months: Date[] = [];
    let currentMonth = startOfMonth(yearStart);
    
    while (currentMonth <= yearEnd) {
      months.push(currentMonth);
      currentMonth = addMonths(currentMonth, 1);
    }
    
    setMonthsInRange(months);
  }, [selectedYear]);

  // Calculate the activity level for a specific day
  const getActivityLevel = (day: Date): number => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const activities = activitiesByDate[dateStr] || [];
    
    if (activities.length === 0) return 0;
    
    // Sum up all activity counts for the day
    const count = activities.reduce((sum, activity) => sum + activity.count, 0);
    
    // Determine level based on count
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  return {
    activitiesByDate,
    calendarWeeks,
    monthsInRange,
    availableYears,
    getActivityLevel,
    currentYear,
    loading,
    error
  };
};
