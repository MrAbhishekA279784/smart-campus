import fs from 'fs';

let content = `
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, MapPin, Compass, Navigation, Layers, X, PersonStanding } from 'lucide-react';
import { ROOMS, Room, Floor, FLOOR_LABELS } from '../../data/campusMapData';
import { findRoute, generateInstructions, RoutePath } from '../../lib/pathfinding';
import { CampusMapRouteOverlay } from '../desktop/CampusMapRouteOverlay';
import mapImage from '../../assets/sathaye_floorplan.png';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface MobileMapProps {
  onBack: () => void;
}

export const MobileMap: React.FC<MobileMapProps> = ({ onBack }) => {
  const [activeFloor, setActiveFloor] = useState<Floor>('GF');
  const [searchQuery, setSearchQuery] = useState('');
  const [imgError, setImgError] = useState(false);
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [startRoom, setStartRoom] = useState<Room | null>(ROOMS.find(r => r.id === 'foyer-gf') || null);
  
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAccessibleRoute, setIsAccessibleRoute] = useState(false);
  const [route, setRoute] = useState<RoutePath | null>(null);
  const [instructions, setInstructions] = useState<{instruction: string, node: string}[]>([]);

  const filteredRooms = useMemo(() => {
    return ROOMS.filter(room => {
      if (room.floor !== activeFloor) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return room.name.toLowerCase().includes(q) || 
             room.type.toLowerCase().includes(q) ||
             (room.description && room.description.toLowerCase().includes(q));
    });
  }, [activeFloor, searchQuery]);

  const handleNavigate = () => {
    if (!startRoom || !selectedRoom) return;
    const calculatedRoute = findRoute(startRoom.nodeId, selectedRoom.nodeId, isAccessibleRoute);
    if (calculatedRoute) {
      setRoute(calculatedRoute);
      setInstructions(generateInstructions(calculatedRoute));
      setIsNavigating(true);
      setActiveFloor(startRoom.floor); // Switch to start floor
    } else {
      alert("No route found between these locations.");
    }
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setRoute(null);
    setInstructions([]);
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex flex-col z-50 overflow-hidden">
      {/* 1. Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-slate-200 shrink-0 z-20 shadow-sm">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900">Campus Map</h2>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>
      
      {/* Search */}
      <div className="bg-white px-4 py-2 border-b border-slate-200 shrink-0 z-20">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, labs, library..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 2. Map Area */}
      <div className="relative flex-1 bg-[#e6e2db] overflow-hidden">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit
          limitToBounds={false}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <div className="relative w-[1200px] h-[1200px] sm:w-[1600px] sm:h-[1600px]">
                {/* 2D Campus Floor Plan Base Layer */}
                <div 
                  className="absolute w-[200%] h-[200%] transition-transform duration-700 ease-out origin-top-left"
                  style={{ 
                    transform: activeFloor === 'GF' ? 'translate(0%, 0%)' :
                               activeFloor === '1F' ? 'translate(0%, -50%)' :
                               activeFloor === '2F' ? 'translate(-50%, 0%)' :
                               'translate(-50%, -50%)' // 3F
                  }}
                >
                  {!imgError ? (
                    <img
                      src={mapImage}
                      alt="Sathaye College Floor Plan"
                      className="w-full h-full object-contain opacity-90 pointer-events-none select-none"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-center p-8">
                        <h3 className="font-bold text-slate-800 mb-2">Missing Floor-Plan</h3>
                        <p className="text-sm text-slate-600">Upload to src/assets/sathaye_floorplan.png</p>
                    </div>
                  )}
                </div>

                {/* SVG Route Overlay */}
                {isNavigating && route && (
                  <CampusMapRouteOverlay route={route} activeFloor={activeFloor} />
                )}

                {/* Room Markers */}
                <div className="absolute inset-0 pointer-events-none">
                  {filteredRooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;
                    const isStart = isNavigating && startRoom?.id === room.id;
                    const isEnd = isNavigating && selectedRoom?.id === room.id;
                    
                    if (isNavigating && !isStart && !isEnd) return null; // Hide others during nav

                    return (
                      <div
                        key={room.id}
                        style={{
                          top: \`\${room.y}%\`,
                          left: \`\${room.x}%\`,
                        }}
                        className={\`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer z-10 transition-transform duration-300 ease-out \${
                          isSelected || isStart || isEnd ? 'scale-110 z-20' : 'scale-90 opacity-90 hover:scale-100'
                        }\`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoom(room);
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={\`flex items-center justify-center rounded-full shadow-lg border text-white transition-all \${
                              isStart 
                                ? 'w-8 h-8 bg-emerald-600 border-white ring-4 ring-emerald-400/50'
                                : isEnd || isSelected
                                ? 'w-8 h-8 bg-blue-600 border-white ring-4 ring-blue-400/50'
                                : 'w-6 h-6 bg-slate-800 border-white opacity-90 hover:bg-blue-500'
                            }\`}
                          >
                            <MapPin className={\`\${isSelected || isStart ? 'w-4 h-4' : 'w-3 h-3'}\`} />
                          </div>
                          {(isSelected || isStart || isEnd) && (
                            <div className="mt-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-xl text-[10px] sm:text-xs font-bold text-slate-800 whitespace-nowrap">
                              {isStart ? 'Start: ' : ''}{room.name}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
            </div>
          </TransformComponent>
        </TransformWrapper>

        {/* Floating Floor Selector */}
        <div className="absolute right-4 top-4 flex flex-col bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200 z-30">
          {(['3F', '2F', '1F', 'GF'] as Floor[]).map((floor) => (
            <button
              key={floor}
              onClick={() => setActiveFloor(floor)}
              className={\`w-10 h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all \${
                activeFloor === floor
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }\`}
            >
              <span>{floor}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bottom Panel */}
      <div className="bg-white border-t border-slate-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] shrink-0 z-30 max-h-[40vh] overflow-y-auto">
        {selectedRoom ? (
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                  {selectedRoom.type}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1.5">{selectedRoom.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  {FLOOR_LABELS[selectedRoom.floor]}
                </p>
              </div>
            </div>
            
            {!isNavigating ? (
              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                    <div className="flex-1">
                      <select 
                        value={startRoom?.id || ''} 
                        onChange={(e) => setStartRoom(ROOMS.find(r => r.id === e.target.value) || null)}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                      >
                        {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name} ({FLOOR_LABELS[r.floor]})</option>)}
                      </select>
                    </div>
                </div>
                <button
                  onClick={handleNavigate}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Navigate Here</span>
                </button>
              </div>
            ) : (
              <div className="mt-4">
                {route && (
                   <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-3">
                     <div>
                       <p className="text-[10px] font-bold text-emerald-600 uppercase">Est. Time</p>
                       <p className="text-lg font-black text-emerald-700">{Math.ceil(route.totalDistance / 15)} min</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[10px] font-bold text-emerald-600 uppercase">Distance</p>
                       <p className="text-lg font-black text-emerald-700">{route.totalDistance}m</p>
                     </div>
                   </div>
                )}
                <button
                  onClick={handleStopNavigation}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>Stop Navigation</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500">
            <MapPin className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Select a room to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};
`
fs.writeFileSync('src/components/mobile/MobileMap.tsx', content);
