'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Eye, MapPin, Users, Search, Skull,
  Calendar, Swords, AlertTriangle, CheckCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted flex items-center justify-center">Loading map...</div>
});

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
  muslimForce: number;
  enemyForce: number;
  outcome: string;
  casualties?: { muslimMartyrs: number; enemyDeaths: number };
}

interface InteractiveBattlesMapProps {
  battles: Battle[];
  isBn: boolean;
  onBattleSelect: (battle: Battle) => void;
}

const InteractiveBattlesMap = ({ battles, isBn, onBattleSelect }: InteractiveBattlesMapProps) => {
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<number | null>(null);

  const filteredBattles = useMemo(() => {
    return battles.filter(battle => {
      const matchesSearch =
        battle.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        battle.nameBn.includes(searchQuery) ||
        battle.location.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesYear = yearFilter === null || battle.year === yearFilter;
      
      return matchesSearch && matchesYear;
    });
  }, [battles, searchQuery, yearFilter]);

  const years = useMemo(() => {
    return Array.from(new Set(battles.map(b => b.year))).sort((a, b) => a - b);
  }, [battles]);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'victory': return 'bg-green-500/10 border-green-500/30';
      case 'defeat': return 'bg-red-500/10 border-red-500/30';
      case 'setback': return 'bg-amber-500/10 border-amber-500/30';
      default: return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <div className="w-full h-[750px] flex gap-3 bg-card rounded-lg overflow-hidden border border-border">
      {/* Left Sidebar */}
      <div className="w-72 flex flex-col bg-muted/30 border-r border-border p-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={isBn ? 'যুদ্ধ খুঁজুন...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>

        {/* Year Filter */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">
            {isBn ? 'বছর:' : 'Year:'}
          </p>
          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              variant={yearFilter === null ? 'default' : 'outline'}
              onClick={() => setYearFilter(null)}
              className="h-7 text-xs"
            >
              All
            </Button>
            {years.map((year) => (
              <Button
                key={year}
                size="sm"
                variant={yearFilter === year ? 'default' : 'outline'}
                onClick={() => setYearFilter(year)}
                className="h-7 text-xs"
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Battles List */}
        <div className="flex-1 overflow-y-auto space-y-1.5">
          {filteredBattles.length > 0 ? (
            filteredBattles.map((battle) => (
              <button
                key={battle.id}
                onClick={() => {
                  setSelectedBattle(battle);
                  onBattleSelect(battle);
                }}
                className={`w-full text-left p-2 rounded-lg border text-sm transition-all ${
                  selectedBattle?.id === battle.id
                    ? `border-primary ${getOutcomeColor(battle.outcome)} bg-primary/5`
                    : 'border-border hover:border-primary/50 hover:bg-card'
                }`}
              >
                <div className="font-semibold text-xs mb-0.5 truncate">
                  {isBn ? battle.nameBn : battle.nameEn}
                </div>
                <div className="text-xs text-muted-foreground">
                  {battle.hijriYear} • {battle.location.name.split(',')[0]}
                </div>
                {battle.casualties && (
                  <div className="text-xs flex gap-2 mt-1">
                    <span className="text-green-600">☪ {battle.casualties.muslimMartyrs}</span>
                    <span className="text-red-600">✕ {battle.casualties.enemyDeaths}</span>
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground py-8">
              {isBn ? 'কোনো যুদ্ধ পাওয়া যায়নি' : 'No battles found'}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="border-t border-border pt-2 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{isBn ? 'মোট:' : 'Total:'}</span>
            <span className="font-semibold">{filteredBattles.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{isBn ? 'নির্বাচিত:' : 'Selected:'}</span>
            <span className="font-semibold">{selectedBattle ? (isBn ? selectedBattle.nameBn.slice(0, 12) : selectedBattle.nameEn.slice(0, 12)) : '—'}</span>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 rounded-lg overflow-hidden bg-muted">
        <LeafletMap 
          battles={filteredBattles}
          selectedBattle={selectedBattle}
          onBattleSelect={(battle) => {
            setSelectedBattle(battle);
            onBattleSelect(battle);
          }}
          isBn={isBn}
        />
      </div>
    </div>
  );
};

export default InteractiveBattlesMap;
