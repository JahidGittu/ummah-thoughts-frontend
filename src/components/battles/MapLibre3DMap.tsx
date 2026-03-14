'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, Mountain } from 'lucide-react';

interface Battle {
  id: string;
  nameEn: string;
  nameBn: string;
  location: { lat: number; lng: number; name: string };
  outcome: string;
  year: number;
}

interface MapLibre3DMapProps {
  battles: Battle[];
  selectedBattle: Battle | null;
  onBattleSelect: (battle: Battle) => void;
  onBattleHover: (battle: Battle, position: { x: number; y: number }) => void;
  onBattleHoverEnd: () => void;
  isBn: boolean;
}

const MapLibre3DMap = ({
  battles,
  selectedBattle,
  onBattleSelect,
  onBattleHover,
  onBattleHoverEnd,
  isBn,
}: MapLibre3DMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<any>(null);
  const markersRef      = useRef<any[]>([]);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError,  setHasError]  = useState(false);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'victory':  return '#22c55e';
      case 'defeat':   return '#ef4444';
      case 'setback':  return '#f59e0b';
      case 'stalemate':return '#6b7280';
      default:         return '#3b82f6';
    }
  };

  const scheduleHoverEnd = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(onBattleHoverEnd, 80);
  }, [onBattleHoverEnd]);

  // ── Build / rebuild markers ───────────────────────────────────────────────
  const syncMarkers = useCallback((map: any, maplibregl: any, battleList: Battle[]) => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    battleList.forEach(battle => {
      const color = getOutcomeColor(battle.outcome);

      /*
       * Two-element structure to avoid the left-shift bug:
       *
       * MapLibre wraps the custom element in .maplibregl-marker which already
       * carries  transform: translate(-50%,-50%) translate(Xpx,Ypx).
       * If we apply scale() to `el` (the child), CSS re-evaluates the
       * -50% translation relative to the scaled size → the dot jumps left.
       *
       * Fix: `el` is a transparent 32×32 hit-area that NEVER receives a
       * transform.  Inside it, `dot` is a flex-centered visual circle.
       * Only `dot` gets scale() on hover — it scales around its own centre
       * without disturbing MapLibre's positioning math.
       */
      const el = document.createElement('div');
      el.style.cssText = `
        width:32px; height:32px;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer; position:relative;
      `;

      const dot = document.createElement('div');
      dot.style.cssText = `
        width:20px; height:20px;
        background:${color};
        border:3px solid rgba(255,255,255,0.9);
        border-radius:50%;
        box-shadow:0 2px 10px rgba(0,0,0,0.5);
        transition:transform 0.15s ease, box-shadow 0.15s ease;
        transform-origin:center center;
      `;
      el.appendChild(dot);

      el.addEventListener('mouseenter', (e) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        dot.style.transform  = 'scale(1.5)';
        dot.style.boxShadow  = `0 4px 18px rgba(0,0,0,0.6), 0 0 0 6px ${color}44`;
        // Use raw mouse coords — reliable regardless of map pitch/bearing
        const evt = e as MouseEvent;
        onBattleHover(battle, { x: evt.clientX, y: evt.clientY });
      });

      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'scale(1)';
        dot.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        scheduleHoverEnd();
      });

      el.addEventListener('click', () => onBattleSelect(battle));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([battle.location.lng, battle.location.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [onBattleHover, onBattleSelect, scheduleHoverEnd]);

  // ── Init map once ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const maplibregl = (await import('maplibre-gl' as any)).default;

        if (!document.getElementById('maplibre-css')) {
          const link = document.createElement('link');
          link.id = 'maplibre-css'; link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
          document.head.appendChild(link);
        }

        if (cancelled || !mapContainerRef.current) return;

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: {
            version: 8,
            glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
            sources: {
              osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors',
                maxzoom: 19,
              },
              terrain: {
                type: 'raster-dem',
                url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                tileSize: 256,
              },
            },
            layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 }],
            terrain: { source: 'terrain', exaggeration: 2.5 },
            sky: {
              'sky-color': '#0f172a', 'sky-horizon-blend': 0.4,
              'horizon-color': '#1e293b', 'horizon-fog-blend': 0.5,
              'fog-color': '#0f172a', 'fog-ground-blend': 0.5,
            },
          } as any,
          center: [45, 30], zoom: 4, pitch: 55, bearing: -10, antialias: true,
        });

        mapRef.current = map;

        map.on('load', () => {
          if (!cancelled) { setIsLoading(false); syncMarkers(map, maplibregl, battles); }
        });
        map.on('error', () => { /* silently ignore tile gaps */ });
      } catch {
        if (!cancelled) setHasError(true);
      }
    })();

    return () => {
      cancelled = true;
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-sync markers when battle list changes ──────────────────────────────
  useEffect(() => {
    if (!mapRef.current || isLoading) return;
    (async () => {
      const maplibregl = (await import('maplibre-gl' as any)).default;
      syncMarkers(mapRef.current, maplibregl, battles);
    })();
  }, [battles, isLoading, syncMarkers]);

  // ── Fly to selected battle ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !selectedBattle) return;
    mapRef.current.flyTo({
      center: [selectedBattle.location.lng, selectedBattle.location.lat],
      zoom: 8, pitch: 60, duration: 1600, essential: true,
    });
  }, [selectedBattle]);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-lg">
        <div className="text-center p-8 max-w-sm">
          <Mountain className="w-12 h-12 text-amber-400 mx-auto mb-4 opacity-80" />
          <h3 className="text-white text-lg font-bold mb-2">3D Map Setup Required</h3>
          <p className="text-slate-400 text-sm mb-4">Install MapLibre GL to enable 3D terrain:</p>
          <code className="block bg-slate-800 text-green-400 px-4 py-3 rounded-lg text-sm font-mono">
            npm install maplibre-gl
          </code>
          <p className="text-slate-500 text-xs mt-3">Free &amp; open-source — no API key required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-white/80 text-sm">
              {isBn ? '৩ডি ম্যাপ লোড হচ্ছে...' : 'Loading 3D terrain map...'}
            </p>
          </div>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full rounded-r-lg" />

      {/*
       * Legend and hint use z-[200] — high enough to sit above MapLibre's
       * tile layer (z-auto) but well below the 2D/3D toggle (z-400) and
       * tooltip (z-500) managed by InteractiveBattlesMap.
       * MapLibre's own navigation controls render at their default z-index
       * (~50 inside the map canvas) and are NOT overridden here.
       */}
      {!isLoading && (
        <div className="absolute bottom-4 left-4 z-[200]
                        bg-slate-900/90 backdrop-blur-sm rounded-lg p-3
                        shadow-xl border border-white/10">
          <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-2">
            {isBn ? 'ফলাফল' : 'Outcome'}
          </p>
          {[
            { color: '#22c55e', label: isBn ? 'বিজয়'       : 'Victory'   },
            { color: '#ef4444', label: isBn ? 'পরাজয়'      : 'Defeat'    },
            { color: '#f59e0b', label: isBn ? 'বিপর্যয়'    : 'Setback'   },
            { color: '#6b7280', label: isBn ? 'অচলাবস্থা'  : 'Stalemate' },
            { color: '#3b82f6', label: isBn ? 'কৌশলগত'     : 'Strategic' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 mb-1 last:mb-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-white/70 text-[11px]">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="absolute bottom-4 right-4 z-[200]
                        bg-slate-900/80 backdrop-blur-sm rounded-md px-2.5 py-1.5
                        border border-white/10">
          <p className="text-white/50 text-[10px]">
            {isBn ? 'ড্র্যাগ করুন • স্ক্রোল করুন' : 'Drag to rotate • Scroll to zoom'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapLibre3DMap;