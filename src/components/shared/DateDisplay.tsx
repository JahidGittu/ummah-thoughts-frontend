'use client'

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock } from 'lucide-react';
import { formatDate, formatTime, getDualCalendarDate, CalendarType } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

interface DateDisplayProps {
  date: Date;
  showTime?: boolean;
  showDualCalendar?: boolean;
  showToggle?: boolean;
  className?: string;
}

export const DateDisplay = ({
  date,
  showTime = false,
  showDualCalendar = true,
  showToggle = false,
  className,
}: DateDisplayProps) => {
  const { i18n, t } = useTranslation();
  const [calendar, setCalendar] = useState<CalendarType>('gregorian');
  
  const locale = i18n.language;
  const dualDates = getDualCalendarDate(date, locale);
  const timeStr = showTime ? formatTime(date, locale) : null;

  if (showDualCalendar && !showToggle) {
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">{dualDates.gregorian}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 flex items-center justify-center text-xs text-secondary font-arabic">هـ</span>
          <span className="text-muted-foreground">{dualDates.hijri}</span>
        </div>
        {showTime && timeStr && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{timeStr}</span>
          </div>
        )}
      </div>
    );
  }

  if (showToggle) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">
            {calendar === 'gregorian' ? dualDates.gregorian : dualDates.hijri}
          </span>
        </div>
        <button
          onClick={() => setCalendar(c => c === 'gregorian' ? 'hijri' : 'gregorian')}
          className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
        >
          {calendar === 'gregorian' ? t('dates.hijri') : t('dates.gregorian')}
        </button>
        {showTime && timeStr && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{timeStr}</span>
          </div>
        )}
      </div>
    );
  }

  // Simple single date display
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <span className="text-foreground">
        {formatDate(date, { locale, calendar })}
      </span>
      {showTime && timeStr && (
        <>
          <Clock className="w-4 h-4 text-muted-foreground ml-2" />
          <span className="text-muted-foreground">{timeStr}</span>
        </>
      )}
    </div>
  );
};
