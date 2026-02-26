'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, Eye } from 'lucide-react';
import {
  Map,
  MapTileLayer,
  MapMarker,
  MapPopup,
  MapZoomControl,
} from '@/components/ui/map';

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

interface LeafletMapComponentProps {
  battles: Battle[];
  selectedBattle: Battle | null;
  onBattleSelect: (battle: Battle) => void;
  isBn: boolean;
}

const LeafletMapComponent = ({
  battles,
  selectedBattle,
  onBattleSelect,
  isBn,
}: LeafletMapComponentProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Compute bounds of all battles so we can "zoom" into that region
  const bounds = useMemo(() => {
    if (!battles.length) {
      return {
        minLat: -60,
        maxLat: 80,
        minLng: -180,
        maxLng: 180,
      };
    }

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    for (const b of battles) {
      minLat = Math.min(minLat, b.location.lat);
      maxLat = Math.max(maxLat, b.location.lat);
      minLng = Math.min(minLng, b.location.lng);
      maxLng = Math.max(maxLng, b.location.lng);
    }

    // Add a bit of padding so markers aren't at the extreme edge
    const latPadding = (maxLat - minLat || 1) * 0.1;
    const lngPadding = (maxLng - minLng || 1) * 0.1;

    return {
      minLat: minLat - latPadding,
      maxLat: maxLat + latPadding,
      minLng: minLng - lngPadding,
      maxLng: maxLng + lngPadding,
    };
  }, [battles]);

  // Project lat/lng into the "zoomed" bounding box so all battles are together
  const projectCoords = (lat: number, lng: number) => {
    const { minLat, maxLat, minLng, maxLng } = bounds;
    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    const xNorm = (lng - minLng) / lngRange; // 0–1 within battles region
    const yNorm = (maxLat - lat) / latRange; // 0–1 within battles region

    // Keep a margin inside the map so markers don’t touch borders
    const margin = 0.1; // 10% padding
    const x = margin + xNorm * (1 - margin * 2);
    const y = margin + yNorm * (1 - margin * 2);

    return {
      left: `${x * 100}%`,
      top: `${y * 100}%`,
    };
  };

  const outcomeConfig = useMemo(
    () => ({
      victory: { color: 'bg-emerald-500', labelBn: 'বিজয়', labelEn: 'Victory' },
      defeat: { color: 'bg-red-500', labelBn: 'পরাজয়', labelEn: 'Defeat' },
      setback: { color: 'bg-amber-500', labelBn: 'বিপর্যয়', labelEn: 'Setback' },
      strategic: { color: 'bg-blue-500', labelBn: 'কৌশলগত', labelEn: 'Strategic' },
      default: { color: 'bg-slate-500', labelBn: 'অন্যান্য', labelEn: 'Other' },
    }),
    []
  );

  const getOutcomeMeta = (outcome: string) =>
    outcomeConfig[outcome as keyof typeof outcomeConfig] ?? outcomeConfig.default;

  return (
    <div className="relative w-full h-full rounded-xl border overflow-hidden bg-background">
      <Map center={[30, 20]} className="w-full h-full">
        <MapTileLayer />
        <MapZoomControl />

        {battles.map((battle) => {
          const isSelected = selectedBattle?.id === battle.id;
          const isHovered = hoveredId === battle.id;
          const { color } = getOutcomeMeta(battle.outcome);

          return (
            <MapMarker
              key={battle.id}
              position={[battle.location.lat, battle.location.lng]}
              eventHandlers={{
                click: () => onBattleSelect(battle),
                mouseover: () => setHoveredId(battle.id),
                mouseout: () =>
                  setHoveredId((id) => (id === battle.id ? null : id)),
              }}
              icon={
                <div
                  className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-white/80 shadow-md transition-transform duration-200 ${color} ${
                    isSelected || isHovered ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {(isSelected || isHovered) && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-white/20 blur-[8px]" />
                  )}
                </div>
              }
            >
              <MapPopup>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {isBn ? battle.nameBn : battle.nameEn}
                      </div>
                      <div className="font-arabic text-muted-foreground text-xs">
                        {battle.nameAr}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {battle.hijriYear} • {battle.year}
                    </Badge>
                  </div>

                  <div className="text-muted-foreground text-[11px]">
                    {battle.location.name}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {battle.muslimForce.toLocaleString()} vs{' '}
                      {battle.enemyForce.toLocaleString()}
                    </span>
                    <Badge
                      variant="outline"
                      className={`border ${getOutcomeMeta(battle.outcome).color} text-[10px]`}
                    >
                      {isBn ? getOutcomeMeta(battle.outcome).labelBn : getOutcomeMeta(battle.outcome).labelEn}
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    className="w-full h-7 gap-1 text-[11px] mt-1"
                    onClick={() => onBattleSelect(battle)}
                  >
                    <Eye className="w-3 h-3" />
                    {isBn ? 'বিস্তারিত দেখুন' : 'View details'}
                  </Button>
                </div>
              </MapPopup>
            </MapMarker>
          );
        })}
      </Map>

      {/* Selected battle info card */}
      {selectedBattle && (
        <div className="absolute left-4 top-4 z-20 max-w-xs rounded-xl border border-slate-700/80 bg-background/95 p-4 shadow-xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground truncate">
                {isBn ? selectedBattle.nameBn : selectedBattle.nameEn}
              </h3>
              <p className="text-xs font-arabic text-muted-foreground">
                {selectedBattle.nameAr}
              </p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {selectedBattle.hijriYear} • {selectedBattle.year}
            </Badge>
          </div>

          <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary" />
              {selectedBattle.location.name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              {selectedBattle.muslimForce.toLocaleString()} vs{' '}
              {selectedBattle.enemyForce.toLocaleString()}
            </span>
          </div>

          <p className="mb-3 line-clamp-3 text-xs text-muted-foreground">
            {isBn ? selectedBattle.summaryBn : selectedBattle.summaryEn}
          </p>

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>
                {selectedBattle.year} • {selectedBattle.hijriYear}
              </span>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {isBn ? 'ম্যাপ ভিউ' : 'Map view'}
            </Badge>
          </div>

          <Button
            size="sm"
            className="h-8 w-full gap-2 text-xs"
            onClick={() => onBattleSelect(selectedBattle)}
          >
            <Eye className="h-3.5 w-3.5" />
            {isBn ? 'সম্পূর্ণ বিবরণ দেখুন' : 'View full details'}
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 rounded-lg border border-slate-700/80 bg-background/95 p-3 text-[11px] text-foreground shadow-lg backdrop-blur">
        <p className="mb-1.5 font-semibold">{isBn ? 'ফলাফল' : 'Outcome'}</p>
        <div className="space-y-1">
          {(['victory', 'defeat', 'setback', 'strategic'] as const).map((o) => {
            const meta = getOutcomeMeta(o);
            return (
              <div key={o} className="flex items-center gap-2 text-muted-foreground">
                <span className={`h-2.5 w-2.5 rounded-full ${meta.color}`} />
                <span>{isBn ? meta.labelBn : meta.labelEn}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zoom controls + Hint */}
      <div className="absolute right-4 top-4 z-20 flex flex-col items-end gap-2">
        <div className="flex flex-col rounded-lg border border-slate-700/70 bg-background/95 shadow-lg backdrop-blur">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-none border-b border-slate-700/40"
            onClick={handleZoomIn}
          >
            +
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-none"
            onClick={handleZoomOut}
          >
            −
          </Button>
        </div>
        <div className="rounded-lg border border-slate-700/70 bg-background/95 px-3 py-2 text-[11px] text-muted-foreground shadow-lg backdrop-blur">
          {isBn
            ? 'বিন্দুগুলোর উপর জুম ইন/আউট করুন এবং ক্লিক করে বিস্তারিত দেখুন।'
            : 'Zoom in/out then click any point to view that battle.'}
        </div>
      </div>
    </div>
  );
};

export default LeafletMapComponent;
