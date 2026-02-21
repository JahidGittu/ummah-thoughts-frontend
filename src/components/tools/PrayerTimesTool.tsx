import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Compass, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { toBengaliNumerals, toHijri } from '@/lib/dateUtils';

interface Props {
  onClose: () => void;
}

interface PrayerTime {
  name: string;
  nameBn: string;
  time: string;
  arabic: string;
}

export const PrayerTimesTool = ({ onClose }: Props) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number; city: string } | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentPrayer, setCurrentPrayer] = useState<string>('');

  // Calculate prayer times based on location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Default to Dhaka
        let lat = 23.8103;
        let lng = 90.4125;
        let city = isBengali ? 'ঢাকা' : 'Dhaka';

        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            city = isBengali ? 'আপনার অবস্থান' : 'Your Location';
          } catch {
            // Use default location
          }
        }

        setLocation({ lat, lng, city });
        calculatePrayerTimes(lat, lng);
      } catch (error) {
        console.error('Location error:', error);
        setLoading(false);
      }
    };

    fetchLocation();
  }, [isBengali]);

  const calculatePrayerTimes = (lat: number, lng: number) => {
    // Simplified prayer time calculation (for demonstration)
    // In production, use a proper library like adhan-js
    const now = new Date();
    const baseHour = 5; // Fajr base
    
    // Simple approximation based on date
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const seasonalOffset = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.5;

    const times: PrayerTime[] = [
      { 
        name: 'Fajr', 
        nameBn: 'ফজর', 
        time: formatTime(5, 0 + Math.floor(seasonalOffset * 30)), 
        arabic: 'الفجر' 
      },
      { 
        name: 'Sunrise', 
        nameBn: 'সূর্যোদয়', 
        time: formatTime(6, 15 + Math.floor(seasonalOffset * 30)), 
        arabic: 'الشروق' 
      },
      { 
        name: 'Dhuhr', 
        nameBn: 'যোহর', 
        time: formatTime(12, 15), 
        arabic: 'الظهر' 
      },
      { 
        name: 'Asr', 
        nameBn: 'আসর', 
        time: formatTime(15, 45 - Math.floor(seasonalOffset * 20)), 
        arabic: 'العصر' 
      },
      { 
        name: 'Maghrib', 
        nameBn: 'মাগরিব', 
        time: formatTime(18, 0 - Math.floor(seasonalOffset * 30)), 
        arabic: 'المغرب' 
      },
      { 
        name: 'Isha', 
        nameBn: 'ইশা', 
        time: formatTime(19, 30 - Math.floor(seasonalOffset * 30)), 
        arabic: 'العشاء' 
      },
    ];

    setPrayerTimes(times);
    determineCurrentPrayer(times);
    setLoading(false);
  };

  const formatTime = (hour: number, minute: number) => {
    const h = Math.max(0, Math.min(23, hour));
    const m = Math.max(0, Math.min(59, minute));
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const timeStr = `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
    return isBengali ? convertToBengaliTime(timeStr) : timeStr;
  };

  const convertToBengaliTime = (time: string) => {
    return time
      .replace(/\d+/g, (match) => toBengaliNumerals(parseInt(match)))
      .replace('AM', 'AM')
      .replace('PM', 'PM');
  };

  const determineCurrentPrayer = (times: PrayerTime[]) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    for (let i = prayerOrder.length - 1; i >= 0; i--) {
      const prayer = times.find(t => t.name === prayerOrder[i]);
      if (prayer) {
        const timeMatch = prayer.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const period = timeMatch[3].toUpperCase();
          
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          
          const prayerMinutes = hours * 60 + minutes;
          
          if (currentMinutes >= prayerMinutes) {
            setCurrentPrayer(prayerOrder[i]);
            return;
          }
        }
      }
    }
    setCurrentPrayer('Isha');
  };

  const today = new Date();
  const hijriDate = toHijri(today);
  const hijriMonths = isBengali 
    ? ['মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জুমাদাল উলা', 'জুমাদাস সানি', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ']
    : ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button variant="ghost" size="sm" onClick={onClose} className="mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isBengali ? 'টুলসে ফিরুন' : 'Back to Tools'}
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {isBengali ? 'নামাযের সময়' : 'Prayer Times'}
              </h1>
            </div>
          </motion.div>

          {/* Location & Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary/5 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">{location?.city || (isBengali ? 'লোড হচ্ছে...' : 'Loading...')}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">
                {isBengali ? toBengaliNumerals(hijriDate.day) : hijriDate.day} {hijriMonths[hijriDate.month - 1]} {isBengali ? toBengaliNumerals(hijriDate.year) : hijriDate.year}
              </p>
              <p className="text-sm text-muted-foreground">
                {today.toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </motion.div>

          {/* Prayer Times List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                {isBengali ? 'লোড হচ্ছে...' : 'Loading...'}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {prayerTimes.map((prayer, index) => (
                  <motion.div
                    key={prayer.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`flex items-center justify-between p-4 ${
                      currentPrayer === prayer.name ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        currentPrayer === prayer.name ? 'bg-primary' : 'bg-muted'
                      }`} />
                      <div>
                        <p className="font-medium text-foreground">
                          {isBengali ? prayer.nameBn : prayer.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-arabic">
                          {prayer.arabic}
                        </p>
                      </div>
                    </div>
                    <span className={`font-mono text-sm ${
                      currentPrayer === prayer.name ? 'text-primary font-semibold' : 'text-foreground'
                    }`}>
                      {prayer.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Qibla Direction Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-card border border-border rounded-xl p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
              <Compass className="w-8 h-8 text-secondary" />
            </div>
            <p className="font-medium text-foreground mb-1">
              {isBengali ? 'কিবলা দিক' : 'Qibla Direction'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isBengali ? '≈ ২৮০° পশ্চিম-উত্তর-পশ্চিম' : '≈ 280° West-Northwest'}
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
