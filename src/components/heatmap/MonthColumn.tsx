import React from 'react';
import { getDay } from 'date-fns';
import { Activity } from '@/data/mockData';
import ActivityCell from './ActivityCell';

interface MonthColumnProps {
  monthIndex: number;
  daysInMonth: Date[];
  activitiesByDate: Record<string, Activity[]>;
  getActivityLevel: (day: Date) => number;
  className?: string;
}

const MonthColumn: React.FC<MonthColumnProps> = ({
  monthIndex,
  daysInMonth,
  activitiesByDate,
  getActivityLevel
}) => {
  // Group days by week day (0-6)
  const daysByWeekDay: Date[][] = Array(7).fill(0).map(() => []);
  daysInMonth.forEach(day => {
    const weekDay = getDay(day); // 0-6 (Sunday-Saturday)
    daysByWeekDay[weekDay].push(day);
  });

  return (
    <div 
      className={`month-column ${monthIndex % 2 === 0 ? 'even-month' : 'odd-month'} px-0.5`}
    >
      {/* Render days grouped by weekday */}
      <div className="flex flex-col gap-1">
        {daysByWeekDay.map((days, weekDayIndex) => (
          <div key={weekDayIndex} className="flex h-6 items-start">
            {days.map((day, dayIndex) => (
              <ActivityCell
                key={dayIndex}
                day={day}
                activitiesByDate={activitiesByDate}
                getActivityLevel={getActivityLevel}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthColumn;
