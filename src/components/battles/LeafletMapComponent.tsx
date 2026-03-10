'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  onBattleHover: (battle: Battle, position: { x: number; y: number }) => void;
  onBattleHoverEnd: () => void;
  isBn: boolean;
}

const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

const LeafletMapComponent = ({
  battles,
  selectedBattle,
  onBattleSelect,
  onBattleHover,
  onBattleHoverEnd,
  isBn,
}: LeafletMapComponentProps) => {
  const mapRef          = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef      = useRef<{ [key: string]: L.Marker }>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fixLeafletIcons();
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
        zoomAnimation: true,
      }).setView([30, 45], 4);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // ── Update markers ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    battles.forEach(battle => {
      const color = (() => {
        switch (battle.outcome) {
          case 'victory':  return '#22c55e';
          case 'defeat':   return '#ef4444';
          case 'setback':  return '#f59e0b';
          case 'stalemate':return '#6b7280';
          default:         return '#3b82f6';
        }
      })();

      const isSelected = selectedBattle?.id === battle.id;
      const size       = isSelected ? 32 : 24;
      const anchor     = isSelected ? 16 : 12;

      const icon = L.divIcon({
        className: `battle-marker${isSelected ? ' selected' : ''}`,
        html: `
          <div style="
            width:${size}px; height:${size}px;
            background:${color};
            border:3px solid white;
            border-radius:50%;
            box-shadow:0 2px 10px rgba(0,0,0,0.3);
            position:relative; cursor:pointer;
          ">
            ${isSelected ? `<div style="
              position:absolute; inset:-4px; border-radius:50%;
              background:${color}; opacity:0.3;
              animation:pulse-ring 1.5s infinite;
            "></div>` : ''}
          </div>`,
        iconSize:   [size, size],
        iconAnchor: [anchor, anchor],
      });

      const marker = L.marker([battle.location.lat, battle.location.lng], {
        icon,
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(map);

      marker.on('mouseover', (e) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        const pt   = map.latLngToContainerPoint(e.latlng);
        const rect = mapContainerRef.current!.getBoundingClientRect();
        onBattleHover(battle, { x: rect.left + pt.x, y: rect.top + pt.y });
      });

      marker.on('mouseout', () => {
        hoverTimeoutRef.current = setTimeout(onBattleHoverEnd, 100);
      });

      marker.on('click', () => onBattleSelect(battle));

      markersRef.current[battle.id] = marker;
    });

    if (battles.length > 0) {
      const bounds = L.latLngBounds(battles.map(b => [b.location.lat, b.location.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [battles, selectedBattle, onBattleSelect, onBattleHover, onBattleHoverEnd]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/*
       * Only the pulse-ring animation is injected here.
       * ALL Leaflet z-index rules are intentionally left at their defaults:
       *   .leaflet-pane          z-400
       *   .leaflet-tile-pane     z-200
       *   .leaflet-marker-pane   z-600
       *   .leaflet-top/bottom    z-1000  ← zoom & attribution controls
       *
       * These work correctly inside the outer stacking context (z-[1])
       * set by InteractiveBattlesMap — they can never bleed above the navbar.
       * DO NOT override these values here; doing so hides the zoom buttons.
       */}
      <style>{`
        @keyframes pulse-ring {
          0%,100% { transform:scale(1);   opacity:0.3; }
          50%      { transform:scale(1.5); opacity:0;   }
        }
        .battle-marker { cursor:pointer !important; }
        .battle-marker:hover > div { filter:brightness(1.15); }
      `}</style>
    </div>
  );
};

export default LeafletMapComponent;
