'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Eye, MapPin, Users, Search, Skull,
  Calendar, Swords, Flag, Map, Mountain,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

const MapLibre3DMap = dynamic(() => import('./MapLibre3DMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50 mx-auto mb-4" />
        <p className="text-sm text-white/60">Loading 3D map...</p>
      </div>
    </div>
  ),
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

// ─── Z-index layers (scoped inside the outer stacking context) ───────────────
//
//  Outer wrapper: position:relative + z-index:1
//    → Creates a stacking context with z=1 in the document.
//    → Site navbar is Tailwind z-50 (=50) → navbar always wins.
//    → Nothing inside the map can ever appear above the navbar.
//
//  Inside the wrapper (values relative to this context):
//    z-10  sidebar
//    z-100 map markers (Leaflet/MapLibre managed)
//    z-200 Leaflet built-in controls (zoom, attribution) — NOT overridden
//    z-300 MapLibre built-in controls  — NOT overridden
//    z-400 2D/3D toggle button
//    z-500 hover tooltip  (topmost inside the map)
// ─────────────────────────────────────────────────────────────────────────────

const TOOLTIP_W = 288;
const TOOLTIP_H = 360;
const MARGIN     = 12;

function calcTooltipPos(
  screenX: number,
  screenY: number,
  mapRect: DOMRect,
): { left: string; top: string } {
  const markerX = screenX - mapRect.left;
  const markerY = screenY - mapRect.top;

  let left = markerX - TOOLTIP_W / 2;
  let top  = markerY - TOOLTIP_H - 18;

  if (top < MARGIN) top = markerY + 32;

  left = Math.max(MARGIN, Math.min(left, mapRect.width - TOOLTIP_W - MARGIN));

  if (top + TOOLTIP_H > mapRect.height - MARGIN) {
    top = mapRect.height - TOOLTIP_H - MARGIN;
  }
  top = Math.max(MARGIN, top);

  return { left: `${Math.round(left)}px`, top: `${Math.round(top)}px` };
}

const InteractiveBattlesMap = ({ battles, isBn, onBattleSelect }: InteractiveBattlesMapProps) => {
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [hoveredBattle,  setHoveredBattle]  = useState<Battle | null>(null);
  const [hoverPosition,  setHoverPosition]  = useState<{ x: number; y: number } | null>(null);
  const [tooltipPos,     setTooltipPos]     = useState<{ left: string; top: string }>({ left: '0px', top: '0px' });
  const [mapViewType,    setMapViewType]    = useState<'2d' | '3d'>('2d');

  // Ref to the map AREA div — used only for tooltip coordinate maths.
  // This div must NOT have overflow-hidden so the tooltip is never clipped.
  const mapAreaRef        = useRef<HTMLDivElement>(null);
  const tooltipHoveredRef = useRef(false);

  const [searchQuery,  setSearchQuery]  = useState('');
  const [yearFilter,   setYearFilter]   = useState<number | null>(null);
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  const filteredBattles = useMemo(() => battles.filter(b => {
    const s = searchQuery.toLowerCase();
    const matchSearch = !searchQuery ||
      b.nameEn.toLowerCase().includes(s) ||
      b.nameBn.includes(searchQuery) ||
      b.location.name.toLowerCase().includes(s);
    return matchSearch &&
      (yearFilter   === null  || b.year   === yearFilter) &&
      (periodFilter === 'all' || b.period === periodFilter);
  }), [battles, searchQuery, yearFilter, periodFilter]);

  const hideTooltip = useCallback(() => {
    setHoveredBattle(null);
    setHoverPosition(null);
  }, []);

  const handleBattleHoverEnd = useCallback(() => {
    if (!tooltipHoveredRef.current) hideTooltip();
  }, [hideTooltip]);

  const updateTooltipPos = useCallback(() => {
    if (!hoveredBattle || !hoverPosition || !mapAreaRef.current) return;
    const rect = mapAreaRef.current.getBoundingClientRect();
    setTooltipPos(calcTooltipPos(hoverPosition.x, hoverPosition.y, rect));
  }, [hoveredBattle, hoverPosition]);

  useEffect(() => { updateTooltipPos(); }, [updateTooltipPos]);
  useEffect(() => {
    window.addEventListener('resize', updateTooltipPos, { passive: true });
    return () => window.removeEventListener('resize', updateTooltipPos);
  }, [updateTooltipPos]);

  const years = useMemo(
    () => Array.from(new Set(battles.map(b => b.year))).sort((a, b) => a - b),
    [battles],
  );

  const periods = [
    { id: 'all',      nameEn: 'All Periods', nameBn: 'সব যুগ'    },
    { id: 'rashidun', nameEn: 'Rashidun',    nameBn: 'রাশিদুন'   },
    { id: 'umayyad',  nameEn: 'Umayyad',     nameBn: 'উমাইয়া'   },
    { id: 'abbasid',  nameEn: 'Abbasid',     nameBn: 'আব্বাসীয়' },
    { id: 'ottoman',  nameEn: 'Ottoman',     nameBn: 'উসমানীয়'  },
  ];

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'victory': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'defeat':  return 'bg-red-500/10   text-red-600   border-red-500/30';
      case 'setback': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      default:        return 'bg-blue-500/10  text-blue-600  border-blue-500/30';
    }
  };

  return (
    /*
     * ── Outer wrapper ─────────────────────────────────────────────────────
     * z-[1]          Creates a stacking context scoped to z-index 1.
     *                The site navbar (z-50) always paints above this entire
     *                component, no matter how high child z-indexes get.
     * overflow-hidden Clips children to the rounded rectangle for visuals.
     *                The tooltip is clamped by calcTooltipPos, so it will
     *                never actually try to render outside these bounds.
     * ─────────────────────────────────────────────────────────────────── */
    <div className="relative z-[1] w-full h-[750px] flex bg-card rounded-lg overflow-hidden border border-border">

      {/* ── Sidebar ── z-10 ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-80 flex-shrink-0 flex flex-col bg-muted/30 border-r border-border">

        <div className="p-4 border-b border-border">
          <h3 className="font-semibold flex items-center gap-2">
            <Swords className="w-4 h-4 text-primary" />
            {isBn ? 'যুদ্ধসমূহ' : 'Battles'}
          </h3>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={isBn ? 'যুদ্ধ খুঁজুন...' : 'Search battles...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="p-4 border-b border-border space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              {isBn ? 'যুগ' : 'Period'}
            </label>
            <div className="flex flex-wrap gap-1">
              {periods.map(p => (
                <Button key={p.id} size="sm"
                  variant={periodFilter === p.id ? 'default' : 'outline'}
                  onClick={() => setPeriodFilter(p.id)}
                  className="h-7 text-xs"
                >
                  {isBn ? p.nameBn : p.nameEn}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              {isBn ? 'বছর' : 'Year'}
            </label>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1">
              <Button size="sm"
                variant={yearFilter === null ? 'default' : 'outline'}
                onClick={() => setYearFilter(null)}
                className="h-7 text-xs"
              >
                {isBn ? 'সব' : 'All'}
              </Button>
              {years.map(year => (
                <Button key={year} size="sm"
                  variant={yearFilter === year ? 'default' : 'outline'}
                  onClick={() => setYearFilter(year)}
                  className="h-7 text-xs"
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredBattles.length > 0 ? filteredBattles.map(battle => (
            <button key={battle.id}
              onClick={() => { setSelectedBattle(battle); onBattleSelect(battle); }}
              className={`w-full text-left p-3 rounded-lg border transition-all
                ${selectedBattle?.id === battle.id
                  ? `border-primary ${getOutcomeColor(battle.outcome)} bg-primary/5`
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-medium text-sm">{isBn ? battle.nameBn : battle.nameEn}</span>
                <Badge variant="outline" className="text-[10px] shrink-0">{battle.year}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{battle.location.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{battle.muslimForce.toLocaleString()}</span>
                </div>
                {battle.casualties && (
                  <div className="flex items-center gap-1">
                    <Skull className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">{battle.casualties.muslimMartyrs}</span>
                    <Skull className="w-3 h-3 text-red-600 ml-1" />
                    <span className="text-red-600">{battle.casualties.enemyDeaths}</span>
                  </div>
                )}
              </div>
            </button>
          )) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {isBn ? 'কোনো যুদ্ধ পাওয়া যায়নি' : 'No battles found'}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{isBn ? 'মোট:' : 'Total:'}</span>
            <span className="font-semibold">{filteredBattles.length}</span>
          </div>
        </div>
      </div>

      {/* ── Map area ─────────────────────────────────────────────────────────
           MUST NOT have overflow-hidden — the outer wrapper handles visual
           clipping. Removing overflow-hidden here means the absolutely-
           positioned toggle (z-400) and tooltip (z-500) are not clipped.
      ─────────────────────────────────────────────────────────────────── */}
      <div ref={mapAreaRef} className="relative flex-1">

        {/* 2D / 3D toggle ── z-[400]: above all map-library chrome ──────── */}
        <div className="absolute top-3 right-3 z-[700] flex gap-1 p-1
                        bg-background/90 backdrop-blur-sm rounded-xl
                        border border-border shadow-lg">
          <button
            onClick={() => setMapViewType('2d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                        transition-all duration-200
                        ${mapViewType === '2d'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}
          >
            <Map className="w-3.5 h-3.5" />
            {isBn ? '২ডি' : '2D'}
          </button>
          <button
            onClick={() => setMapViewType('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                        transition-all duration-200
                        ${mapViewType === '3d'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}
          >
            <Mountain className="w-3.5 h-3.5" />
            {isBn ? '৩ডি' : '3D'}
          </button>
        </div>

        {/* Map components ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {mapViewType === '2d' ? (
            <motion.div key="2d" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LeafletMap
                battles={filteredBattles}
                selectedBattle={selectedBattle}
                onBattleSelect={b => { setSelectedBattle(b); onBattleSelect(b); }}
                onBattleHover={(b, pos) => {
                  tooltipHoveredRef.current = false;
                  setHoveredBattle(b);
                  setHoverPosition(pos);
                }}
                onBattleHoverEnd={handleBattleHoverEnd}
                isBn={isBn}
              />
            </motion.div>
          ) : (
            <motion.div key="3d" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <MapLibre3DMap
                battles={filteredBattles}
                selectedBattle={selectedBattle}
                onBattleSelect={b => { setSelectedBattle(b); onBattleSelect(b); }}
                onBattleHover={(b, pos) => {
                  tooltipHoveredRef.current = false;
                  setHoveredBattle(b);
                  setHoverPosition(pos);
                }}
                onBattleHoverEnd={handleBattleHoverEnd}
                isBn={isBn}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip ── z-[500] ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {hoveredBattle && hoverPosition && (
            <motion.div
              key={`tooltip-${hoveredBattle.id}`}
              className="absolute z-[500] cursor-default"
              style={{ left: tooltipPos.left, top: tooltipPos.top, width: TOOLTIP_W }}
              initial={{ opacity: 0, scale: 0.92, y: 6 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{   opacity: 0, scale: 0.92,  y: 6 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.7 }}
              onMouseEnter={() => { tooltipHoveredRef.current = true; }}
              onMouseLeave={() => { tooltipHoveredRef.current = false; hideTooltip(); }}
            >
              <div className="bg-background/97 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden">

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-3 border-b border-border/40">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-foreground text-sm leading-tight">
                        {isBn ? hoveredBattle.nameBn : hoveredBattle.nameEn}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-arabic mt-0.5">
                        {hoveredBattle.nameAr}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-background/60 text-[10px] shrink-0">
                      {hoveredBattle.year} CE
                    </Badge>
                  </div>
                </div>

                <div className="px-4 py-3 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{hoveredBattle.location.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{hoveredBattle.hijriYear}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">{isBn ? 'মুসলিম' : 'Muslim'}</p>
                        <p className="font-bold text-green-600 text-sm leading-none">
                          {hoveredBattle.muslimForce.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold">VS</span>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">{isBn ? 'প্রতিপক্ষ' : 'Enemy'}</p>
                        <p className="font-bold text-red-600 text-sm leading-none">
                          {hoveredBattle.enemyForce.toLocaleString()}
                        </p>
                      </div>
                      <Flag className="w-4 h-4 text-red-600" />
                    </div>
                  </div>

                  {hoveredBattle.casualties && (
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Skull className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-muted-foreground">{isBn ? 'শহীদ:' : 'Martyrs:'}</span>
                        <span className="font-semibold text-green-600">
                          {hoveredBattle.casualties.muslimMartyrs.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Skull className="w-3.5 h-3.5 text-red-600" />
                        <span className="text-muted-foreground">{isBn ? 'নিহত:' : 'Killed:'}</span>
                        <span className="font-semibold text-red-600">
                          {hoveredBattle.casualties.enemyDeaths.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-muted-foreground line-clamp-2 border-t border-border/40 pt-2">
                    {isBn ? hoveredBattle.summaryBn : hoveredBattle.summaryEn}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <Badge className={`text-[10px] px-2 py-0.5
                      ${hoveredBattle.outcome === 'victory' ? 'bg-green-500/15 text-green-600 border-green-500/30' :
                        hoveredBattle.outcome === 'defeat'  ? 'bg-red-500/15   text-red-600   border-red-500/30'   :
                        hoveredBattle.outcome === 'setback' ? 'bg-amber-500/15 text-amber-600 border-amber-500/30' :
                        'bg-blue-500/15 text-blue-600 border-blue-500/30'}`}
                    >
                      {hoveredBattle.outcome === 'victory' ? (isBn ? 'বিজয়'    : 'Victory') :
                       hoveredBattle.outcome === 'defeat'  ? (isBn ? 'পরাজয়'   : 'Defeat')  :
                       hoveredBattle.outcome === 'setback' ? (isBn ? 'বিপর্যয়' : 'Setback') :
                       (isBn ? 'কৌশলগত' : 'Strategic')}
                    </Badge>
                    <button
                      onClick={() => {
                        const b = hoveredBattle;
                        hideTooltip();
                        setSelectedBattle(b);
                        onBattleSelect(b);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px]
                                 font-semibold bg-primary text-primary-foreground
                                 hover:bg-primary/90 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      {isBn ? 'বিস্তারিত' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveBattlesMap;