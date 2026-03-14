import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, BookOpen, Users, MapPin, Trophy, Eye, 
  Skull, Swords, Calendar, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Battle {
  id: string;
  nameEn: string;
  nameAr: string;
  nameBn: string;
  year: number;
  hijriYear: string;
  period: string;
  type: string;
  location: { lat: number; lng: number; name: string };
  summaryEn: string;
  summaryBn: string;
  detailsEn: string;
  detailsBn: string;
  muslimForce: number;
  enemyForce: number;
  outcome: string;
  keyFigures: string[];
  quranicReference: string;
  significance: string;
  casualties?: {
    muslimMartyrs: number;
    enemyDeaths: number;
  };
}

interface TimelineViewProps {
  battles: Battle[];
  isBn: boolean;
  periods: Array<{ id: string; nameEn: string; nameBn: string }>;
  onViewDetails: (battle: Battle) => void;
  onStartQuiz?: (battle: Battle) => void;
}

const TimelineView = ({ battles, isBn, periods, onViewDetails, onStartQuiz }: TimelineViewProps) => {
  const [expandedBattle, setExpandedBattle] = useState<string | null>(null);

  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'rashidun': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'umayyad': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'abbasid': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'ottoman': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'victory': return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/40';
      case 'defeat': return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40';
      case 'setback': return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40';
      case 'stalemate': return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/40';
      default: return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40';
    }
  };

  const getOutcomeLabel = (outcome: string) => {
    if (outcome === 'victory') return isBn ? 'বিজয়' : 'Victory';
    if (outcome === 'defeat') return isBn ? 'পরাজয়' : 'Defeat';
    if (outcome === 'setback') return isBn ? 'বিপর্যয়' : 'Setback';
    if (outcome === 'stalemate') return isBn ? 'অচলাবস্থা' : 'Stalemate';
    return isBn ? 'কৌশলগত' : 'Strategic';
  };

  const getOutcomeGlow = (outcome: string) => {
    switch (outcome) {
      case 'victory': return 'shadow-green-500/30';
      case 'defeat': return 'shadow-red-500/30';
      case 'setback': return 'shadow-amber-500/30';
      default: return 'shadow-blue-500/30';
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Animated gradient timeline line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 transform md:-translate-x-1/2">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary to-primary rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary to-primary rounded-full animate-pulse opacity-50" />
      </div>
      
      {battles.map((battle, index) => {
        const isEven = index % 2 === 0;
        
        return (
          <motion.div
            key={battle.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
            className={`relative pb-12 ${isEven ? 'md:pr-[52%]' : 'md:pl-[52%]'} pl-16 md:pl-0`}
          >
            {/* Timeline node with pulse animation */}
            <motion.div 
              className={`absolute left-6 md:left-1/2 transform md:-translate-x-1/2 z-10`}
              whileHover={{ scale: 1.2 }}
            >
              <div className={`w-6 h-6 rounded-full border-4 border-background shadow-lg ${getOutcomeGlow(battle.outcome)} ${
                battle.outcome === 'victory' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                battle.outcome === 'defeat' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                battle.outcome === 'setback' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                'bg-gradient-to-br from-gray-400 to-gray-600'
              }`}>
                <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{
                  background: battle.outcome === 'victory' ? '#22c55e' :
                              battle.outcome === 'defeat' ? '#ef4444' :
                              battle.outcome === 'setback' ? '#f59e0b' : '#6b7280'
                }} />
              </div>
            </motion.div>
            
            {/* Year marker - floating badge */}
            <motion.div 
              className={`absolute ${isEven ? 'left-0 md:right-0 md:left-auto md:mr-[52%] md:pr-8 text-right' : 'left-0 md:left-auto md:ml-[52%] md:pl-8 text-left'} hidden md:block`}
              initial={{ opacity: 0, x: isEven ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 + 0.1 }}
            >
              <div className="inline-flex flex-col items-center px-4 py-2 rounded-xl bg-gradient-to-br from-card to-muted/50 backdrop-blur-sm border shadow-lg">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {battle.year}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{battle.hijriYear}</span>
              </div>
            </motion.div>
            
            {/* Mobile year marker */}
            <div className="absolute left-0 top-0 w-14 text-right md:hidden">
              <span className="text-sm font-bold text-primary">{battle.year}</span>
              <span className="block text-xs text-muted-foreground">{battle.hijriYear}</span>
            </div>

            {/* Battle Card with Glassmorphism */}
            <Card className={`
              overflow-hidden backdrop-blur-md bg-card/80 
              border border-white/10 dark:border-white/5
              hover:shadow-2xl transition-all duration-500 group
              hover:bg-card/95 hover:-translate-y-1
            `}>
              <CardContent className="p-0">
                {/* Battle Header */}
                <div
                  className="p-5 cursor-pointer transition-colors group-hover:bg-muted/20"
                  onClick={() => setExpandedBattle(expandedBattle === battle.id ? null : battle.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={`${getPeriodColor(battle.period)} px-3 py-1`}>
                          <Sparkles className="w-3 h-3 mr-1" />
                          {periods.find(p => p.id === battle.period)?.[isBn ? 'nameBn' : 'nameEn']?.split(' ')[0]}
                        </Badge>
                        <Badge className={`${getOutcomeColor(battle.outcome)} px-3 py-1 font-semibold`}>
                          {getOutcomeLabel(battle.outcome)}
                        </Badge>
                      </div>
                      
                      {/* Title */}
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {isBn ? battle.nameBn : battle.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground font-arabic mt-1">
                          {battle.nameAr}
                        </p>
                      </div>
                      
                      {/* Summary */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {isBn ? battle.summaryBn : battle.summaryEn}
                      </p>
                      
                      {/* Quick Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          {battle.location.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Swords className="w-4 h-4 text-primary" />
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {battle.muslimForce.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">vs</span>
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            {battle.enemyForce.toLocaleString()}
                          </span>
                        </span>
                      </div>
                      
                      {/* Casualties Display */}
                      {battle.casualties && (
                        <div className="flex flex-wrap items-center gap-4 text-sm pt-2 border-t border-border/50">
                          <span className="flex items-center gap-1.5">
                            <Skull className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-muted-foreground">{isBn ? 'শহীদ:' : 'Martyrs:'}</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {battle.casualties.muslimMartyrs.toLocaleString()}
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Skull className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-muted-foreground">{isBn ? 'প্রতিপক্ষ নিহত:' : 'Enemy Killed:'}</span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                              {battle.casualties.enemyDeaths.toLocaleString()}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <motion.div
                        animate={{ rotate: expandedBattle === battle.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedBattle === battle.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 border-t border-border/50 bg-gradient-to-b from-transparent to-muted/20">
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-primary" />
                              {isBn ? 'বিস্তারিত' : 'Details'}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {isBn ? battle.detailsBn : battle.detailsEn}
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                {isBn ? 'প্রধান ব্যক্তিত্ব' : 'Key Figures'}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {battle.keyFigures.map(figure => (
                                  <Badge key={figure} variant="outline" className="text-xs bg-card/50">
                                    {figure}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {battle.quranicReference && (
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-secondary" />
                                  {isBn ? 'কুরআনের রেফারেন্স' : 'Quranic Reference'}
                                </h4>
                                <Badge className="bg-secondary/10 text-secondary border-secondary/30">
                                  {battle.quranicReference}
                                </Badge>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-primary" />
                                {isBn ? 'গুরুত্ব' : 'Significance'}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {battle.significance}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border/50">
                          <Button
                            onClick={() => onViewDetails(battle)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            {isBn ? 'সম্পূর্ণ দেখুন' : 'View Full Story'}
                          </Button>
                          {onStartQuiz && (
                            <Button
                              variant="secondary"
                              onClick={() => onStartQuiz(battle)}
                              className="gap-2"
                            >
                              <Sparkles className="w-4 h-4" />
                              {isBn ? 'কুইজ শুরু' : 'Take Quiz'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TimelineView;