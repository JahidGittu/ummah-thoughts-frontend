import { useEffect, useRef, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MapPin, Users, Loader2 } from 'lucide-react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

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
}

interface BattlesMapProps {
  battles: Battle[];
  isBn: boolean;
  onBattleSelect: (battle: Battle) => void;
}

// Global flag to prevent duplicate initialization
let leafletInitialized = false;

// Store reference to prevent remounting in Strict Mode
const initLeaflet = () => {
  if (leafletInitialized) return;
  
  try {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
    leafletInitialized = true;
  } catch (err) {
    console.warn('Leaflet icon setup:', err);
  }
};

const BattlesMap = ({ battles, isBn, onBattleSelect }: BattlesMapProps) => {
  // Initialize Leaflet only once
  useMemo(() => {
    initLeaflet();
  }, []);

  const getOutcomeLabel = (outcome: string) => {
    if (outcome === 'victory') return isBn ? 'বিজয়' : 'Victory';
    if (outcome === 'defeat') return isBn ? 'পরাজয়' : 'Defeat';
    if (outcome === 'setback') return isBn ? 'বিপর্যয়' : 'Setback';
    if (outcome === 'stalemate') return isBn ? 'অচলাবস্থা' : 'Stalemate';
    return isBn ? 'কৌশলগত' : 'Strategic';
  };

  const getOutcomeColor = (outcome: string) => {
    if (outcome === 'victory') return 'bg-green-500/10 text-green-600 border-green-500/30';
    if (outcome === 'defeat') return 'bg-red-500/10 text-red-600 border-red-500/30';
    if (outcome === 'setback') return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
    if (outcome === 'stalemate') return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
    return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
  };

  const createCustomIcon = (outcome: string) => {
    const color = 
      outcome === 'victory' ? '#22c55e' :
      outcome === 'defeat' ? '#ef4444' :
      outcome === 'setback' ? '#f59e0b' :
      outcome === 'stalemate' ? '#6b7280' :
      '#3b82f6';
    
    return L.divIcon({
      className: 'custom-battle-marker',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: ${color};
            opacity: 0.3;
            animation: battlePulse 2s infinite;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  // Show loading state
  if (!battles) {
    return (
      <div className="w-full h-[500px] rounded-lg border bg-muted flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{isBn ? 'ম্যাপ লোড হচ্ছে...' : 'Loading map...'}</span>
        </div>
      </div>
    );
  }

  // Component to fit bounds when battles change
  const FitBounds = () => {
    const map = useMap();
    
    useEffect(() => {
      if (battles.length > 0) {
        const bounds = L.latLngBounds(
          battles.map((b: Battle) => [b.location.lat, b.location.lng])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
      }
    }, [map, battles]);
    
    return null;
  };

  const center: [number, number] = [30, 45];

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border">
      {/* CSS for pulse animation */}
      <style>{`
        @keyframes battlePulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
          min-width: 250px;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
      
      <MapContainer
          center={center}
          zoom={4}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
          style={{ background: '#1a1a2e' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
          
          <FitBounds />
          
          {battles.map((battle) => {
            const icon = createCustomIcon(battle.outcome);
            if (!icon) return null;
            
            return (
              <Marker
                key={battle.id}
                position={[battle.location.lat, battle.location.lng]}
                icon={icon}
              >
                <Popup>
                  <div className="p-3 min-w-[250px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getOutcomeColor(battle.outcome)}>
                        {getOutcomeLabel(battle.outcome)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {battle.hijriYear}
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-foreground text-lg mb-1">
                      {isBn ? battle.nameBn : battle.nameEn}
                    </h3>
                    <p className="text-sm text-muted-foreground font-arabic mb-2">
                      {battle.nameAr}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{battle.location.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Users className="w-3 h-3" />
                      <span>{battle.muslimForce.toLocaleString()} vs {battle.enemyForce.toLocaleString()}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {isBn ? battle.summaryBn : battle.summaryEn}
                    </p>
                    
                    <Button 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => onBattleSelect(battle)}
                    >
                      <Eye className="w-4 h-4" />
                      {isBn ? 'সম্পূর্ণ দেখুন' : 'View Details'}
                    </Button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <p className="text-xs font-semibold mb-2">{isBn ? 'ফলাফল' : 'Outcome'}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs">{isBn ? 'বিজয়' : 'Victory'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs">{isBn ? 'পরাজয়' : 'Defeat'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs">{isBn ? 'বিপর্যয়' : 'Setback'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-xs">{isBn ? 'অচলাবস্থা' : 'Stalemate'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs">{isBn ? 'কৌশলগত' : 'Strategic'}</span>
          </div>
        </div>
      </div>
      
      {/* Map Controls Hint */}
      <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-[1000] text-xs text-muted-foreground">
        {isBn ? 'জুম করতে স্ক্রোল করুন • টানুন প্যান করতে' : 'Scroll to zoom • Drag to pan'}
      </div>
    </div>
  );
};

export default BattlesMap;