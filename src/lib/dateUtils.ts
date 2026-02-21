// Date utilities for localized formatting and Hijri calendar support

export type CalendarType = 'gregorian' | 'hijri';

interface DateFormatOptions {
  locale?: string;
  calendar?: CalendarType;
  showTime?: boolean;
  use24Hour?: boolean;
}

// Convert Gregorian date to Hijri (Islamic calendar)
export const toHijri = (date: Date): { year: number; month: number; day: number; monthName: string } => {
  // Using the built-in Intl API for Hijri conversion
  const formatter = new Intl.DateTimeFormat('en-u-ca-islamic', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const parts = formatter.formatToParts(date);
  
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const month = getHijriMonthNumber(parts.find(p => p.type === 'month')?.value || '');
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const monthName = parts.find(p => p.type === 'month')?.value || '';
  
  return { year, month, day, monthName };
};

// Hijri month names in Arabic
const HIJRI_MONTHS_AR = [
  'المحرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

// Hijri month names in Bengali
const HIJRI_MONTHS_BN = [
  'মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি',
  'জমাদিউল আউয়াল', 'জমাদিউস সানি', 'রজব', 'শাবান',
  'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'
];

// Hijri month names in English
const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'
];

const getHijriMonthNumber = (monthName: string): number => {
  const monthIndex = HIJRI_MONTHS_EN.findIndex(m => 
    m.toLowerCase() === monthName.toLowerCase() ||
    monthName.toLowerCase().includes(m.toLowerCase().split(' ')[0])
  );
  return monthIndex + 1;
};

export const getHijriMonthName = (month: number, locale: string = 'en'): string => {
  const index = month - 1;
  if (locale === 'bn') return HIJRI_MONTHS_BN[index] || '';
  if (locale === 'ar') return HIJRI_MONTHS_AR[index] || '';
  return HIJRI_MONTHS_EN[index] || '';
};

// Format date based on locale and calendar type
export const formatDate = (
  date: Date,
  options: DateFormatOptions = {}
): string => {
  const { locale = 'en', calendar = 'gregorian', showTime = false, use24Hour } = options;
  
  // Determine 24-hour format based on locale if not specified
  const hour12 = use24Hour !== undefined ? !use24Hour : locale === 'en';
  
  if (calendar === 'hijri') {
    const hijri = toHijri(date);
    const monthName = getHijriMonthName(hijri.month, locale);
    
    if (locale === 'bn') {
      const bnDay = toBengaliNumerals(hijri.day);
      const bnYear = toBengaliNumerals(hijri.year);
      return `${bnDay} ${monthName} ${bnYear} হি.`;
    }
    
    return `${hijri.day} ${monthName} ${hijri.year} AH`;
  }
  
  // Gregorian calendar
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  if (showTime) {
    dateOptions.hour = 'numeric';
    dateOptions.minute = '2-digit';
    dateOptions.hour12 = hour12;
  }
  
  const localeCode = locale === 'bn' ? 'bn-BD' : 'en-US';
  return new Intl.DateTimeFormat(localeCode, dateOptions).format(date);
};

// Format time only
export const formatTime = (date: Date, locale: string = 'en', use24Hour?: boolean): string => {
  const hour12 = use24Hour !== undefined ? !use24Hour : locale === 'en';
  const localeCode = locale === 'bn' ? 'bn-BD' : 'en-US';
  
  return new Intl.DateTimeFormat(localeCode, {
    hour: 'numeric',
    minute: '2-digit',
    hour12,
  }).format(date);
};

// Convert numbers to Bengali numerals
export const toBengaliNumerals = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: Date, locale: string = 'en'): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  const localeCode = locale === 'bn' ? 'bn-BD' : 'en-US';
  const rtf = new Intl.RelativeTimeFormat(localeCode, { numeric: 'auto' });
  
  if (diffDays > 0) return rtf.format(-diffDays, 'day');
  if (diffHours > 0) return rtf.format(-diffHours, 'hour');
  if (diffMins > 0) return rtf.format(-diffMins, 'minute');
  return rtf.format(-diffSecs, 'second');
};

// Get both Gregorian and Hijri dates formatted
export const getDualCalendarDate = (date: Date, locale: string = 'en'): { gregorian: string; hijri: string } => {
  return {
    gregorian: formatDate(date, { locale, calendar: 'gregorian' }),
    hijri: formatDate(date, { locale, calendar: 'hijri' }),
  };
};
