'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Eye } from 'lucide-react';

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

// Initialize Leaflet icons only once
let iconMapSet = false;

const initializeIcons = () => {
  if (iconMapSet) return;
  
  try {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
    iconMapSet = true;
  } catch (err) {
    console.warn('Error initializing Leaflet icons:', err);
  }
};

const CenterMapOnBattle = ({ battle }: { battle: Battle | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (battle && map) {
      map.setView([battle.location.lat, battle.location.lng], 8, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [battle, map]);
  
  return null;
};

const LeafletMapComponent = ({
  battles,
  selectedBattle,
  onBattleSelect,
  isBn,
}: LeafletMapComponentProps) => {
  useMemo(() => initializeIcons(), []);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'victory': return 'bg-green-500/10 border-green-500/30';
      case 'defeat': return 'bg-red-500/10 border-red-500/30';
      case 'setback': return 'bg-amber-500/10 border-amber-500/30';
      default: return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  const getOutcomeLabel = (outcome: string) => {
    switch (outcome) {
      case 'victory': return isBn ? 'বিজয়' : 'Victory';
      case 'defeat': return isBn ? 'পরাজয়' : 'Defeat';
      case 'setback': return isBn ? 'বিপর্যয়' : 'Setback';
      default: return isBn ? 'কৌশলগত' : 'Strategic';
    }
  };

  const createCustomIcon = (outcome: string) => {
    const color =
      outcome === 'victory' ? '#22c55e' :
      outcome === 'defeat' ? '#ef4444' :
      outcome === 'setback' ? '#f59e0b' :
      '#3b82f6';

    return L.divIcon({
      className: 'custom-battle-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 12px;
        ">
          <div style="
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            background: ${color};
            opacity: 0.2;
            animation: battlePulse 2s infinite;
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  return (
    <>
      <style>{`
        @keyframes battlePulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        .leaflet-popup-content-wrapper { border-radius: 8px; padding: 0 !important; }
        .leaflet-popup-content { margin: 0; width: 300px !important; }
        .leaflet-container { font-family: inherit; }
      `}</style>

      <MapContainer
        center={[30, 45]}
        zoom={4}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ background: '#1a1a2e' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />

        <CenterMapOnBattle battle={selectedBattle} />

        {battles.map((battle) => (
          <Marker
            key={battle.id}
            position={[battle.location.lat, battle.location.lng]}
            icon={createCustomIcon(battle.outcome)}
            eventHandlers={{
              click: () => onBattleSelect(battle),
            }}
          >
            <Popup maxWidth={320}>
              <div className="p-3">
                <h4 className="font-bold mb-1 text-sm">
                  {isBn ? battle.nameBn : battle.nameEn}
                </h4>
                <Badge variant="outline" className={`text-xs mb-2 ${getOutcomeColor(battle.outcome)}`}>
                  {getOutcomeLabel(battle.outcome)}
                </Badge>
                
                <div className="text-xs space-y-1 mb-2 text-muted-foreground">
                  <div>📍 {battle.location.name}</div>
                  <div>📅 {battle.hijriYear} / {battle.year}</div>
                  <div>⚔️ {battle.muslimForce.toLocaleString()} vs {battle.enemyForce.toLocaleString()}</div>
                </div>

                {battle.casualties && (
                  <div className="text-xs bg-muted p-1.5 rounded mb-2">
                    <div className="flex justify-between">
                      <span>Muslim: {battle.casualties.muslimMartyrs}</span>
                      <span>Enemy: {battle.casualties.enemyDeaths}</span>
                    </div>
                  </div>
                )}

                <Button
                  size="sm"
                  className="w-full h-7 text-xs"
                  onClick={() => onBattleSelect(battle)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {isBn ? 'বিবরণ' : 'Details'}
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 border border-border rounded-lg p-2 text-xs shadow-lg z-[1000]">
        <p className="font-semibold mb-1.5">{isBn ? 'ফলাফল' : 'Outcome'}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Victory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Defeat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Setback</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Strategic</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeafletMapComponent;
