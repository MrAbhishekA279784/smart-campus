import fs from 'fs';

let content = `
import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, Compass, Navigation, PersonStanding, Layers } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ROOMS, Room, Floor, FLOOR_LABELS } from '../../data/campusMapData';
import { findRoute, generateInstructions, RoutePath } from '../../lib/pathfinding';
import { CampusMapRouteOverlay } from './CampusMapRouteOverlay';
import mapImage from '../../assets/sathaye_floorplan.png';

interface DesktopFullMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopFullMapModal: React.FC<DesktopFullMapModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeFloor, setActiveFloor] = useState<Floor>('GF');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [startRoom, setStartRoom] = useState<Room | null>(ROOMS.find(r => r.id === 'foyer-gf') || null);
  
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAccessibleRoute, setIsAccessibleRoute] = useState(false);
  const [route, setRoute] = useState<RoutePath | null>(null);
  const [instructions, setInstructions] = useState<{instruction: string, node: string}[]>([]);
  
  const [imgError, setImgError] = useState(false);

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

  if (!isOpen) return null;

  const handleNavigate = () => {
    if (!startRoom || !selectedRoom) return;
    const calculatedRoute = findRoute(startRoom.nodeId, selectedRoom.nodeId, isAccessibleRoute);
    if (calculatedRoute) {
      setRoute(calculatedRoute);
      setInstructions(generateInstructions(calculatedRoute));
      setIsNavigating(true);
      setActiveFloor(startRoom.floor);
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 sm:p-10">
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-40 shadow-sm relative">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Campus Map</h2>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rooms, labs, library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Visual Map Canvas */}
          <div className="relative flex-1 bg-[#e6e2db] overflow-hidden select-none cursor-grab active:cursor-grabbing">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={4}
              centerOnInit
              limitToBounds={false}
            >
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                <div className="relative w-[1200px] h-[1200px] sm:w-[1600px] sm:h-[1600px]">
                  
                  {/* Base Floor Plan Image */}
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
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-sm">
                          <h3 className="font-bold text-slate-800 mb-2">Missing Floor-Plan Image</h3>
                          <p className="text-sm text-slate-600 mb-4">The map cannot render because <strong>sathaye_floorplan.png</strong> is missing or not a valid image.</p>
                          <ol className="text-xs text-slate-500 text-left list-decimal pl-4 space-y-2">
                            <li>Download the floor-plan you attached in the chat.</li>
                            <li>Open the Code Editor file explorer on the left.</li>
                            <li>Upload it into the <strong>src/assets</strong> folder.</li>
                            <li>Make sure it is named exactly <strong>sathaye_floorplan.png</strong>.</li>
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SVG Route Overlay */}
                  {isNavigating && route && (
                    <CampusMapRouteOverlay route={route} activeFloor={activeFloor} />
                  )}

                  {/* Room Markers (Absolute positioning based on % of the quadrant) */}
                  <div className="absolute inset-0 pointer-events-none">
                    {filteredRooms.map((room) => {
                      const isSelected = selectedRoom?.id === room.id;
                      const isStart = isNavigating && startRoom?.id === room.id;
                      const isEnd = isNavigating && selectedRoom?.id === room.id;
                      
                      // During navigation, hide all other markers on the active floor except start/end
                      if (isNavigating && !isStart && !isEnd) return null;

                      return (
                        <div
                          key={room.id}
                          style={{
                            top: \`\${room.y}%\`,
                            left: \`\${room.x}%\`,
                          }}
                          className={\`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-300 ease-out pointer-events-auto \${
                            isSelected || isStart || isEnd ? 'scale-110 z-20' : 'scale-90 opacity-90 hover:scale-100'
                          }\`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoom(room);
                          }}
                        >
                          <div className="flex flex-col items-center group">
                            <div
                              className={\`flex items-center justify-center rounded-full shadow-lg border text-white transition-all \${
                                isStart 
                                  ? 'w-8 h-8 bg-emerald-600 border-white ring-4 ring-emerald-400/50'
                                  : isEnd || isSelected
                                  ? 'w-8 h-8 bg-blue-600 border-white ring-4 ring-blue-400/50'
                                  : 'w-6 h-6 bg-slate-800 border-white opacity-90 group-hover:bg-blue-500'
                              }\`}
                            >
                              <MapPin className={\`\${isSelected || isStart || isEnd ? 'w-4 h-4' : 'w-3 h-3'}\`} />
                            </div>
                            {(isSelected || isStart || isEnd) && (
                              <div className="mt-1 px-2 py-1 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-xl text-[10px] font-bold text-slate-800 whitespace-nowrap">
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
            <div className="absolute right-6 top-6 flex flex-col bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200 z-30 pointer-events-auto">
              {(['3F', '2F', '1F', 'GF'] as Floor[]).map((floor) => (
                <button
                  key={floor}
                  onClick={() => setActiveFloor(floor)}
                  className={\`w-12 h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all \${
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

          {/* Right Side Navigation / Inspector Panel */}
          <div className="w-[340px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-30 shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.05)]">
            
            {/* Context/Location Area */}
            {selectedRoom ? (
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                      {selectedRoom.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 leading-tight">{selectedRoom.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      {FLOOR_LABELS[selectedRoom.floor]}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {selectedRoom.description || \`Academic facility located on the \${FLOOR_LABELS[selectedRoom.floor]}.\`}
                </p>

                {!isNavigating ? (
                  <div className="mt-5 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Starting Point</label>
                      <select 
                        value={startRoom?.id || ''} 
                        onChange={(e) => setStartRoom(ROOMS.find(r => r.id === e.target.value) || null)}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow mb-3"
                      >
                        {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name} ({FLOOR_LABELS[r.floor]})</option>)}
                      </select>
                    </div>
                    
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={isAccessibleRoute}
                        onChange={(e) => setIsAccessibleRoute(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">Wheelchair Accessible Route</span>
                    </label>

                    <button
                      onClick={handleNavigate}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Navigate Here</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStopNavigation}
                    className="mt-5 w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Stop Navigation</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center h-48 border-b border-slate-100">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Location Selected</h3>
                <p className="text-xs text-slate-500 mt-1">Select a room on the map or search to view details.</p>
              </div>
            )}

            {/* Routing / Instructions Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-5">
              {isNavigating && route ? (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Estimated Time</p>
                      <p className="text-xl font-black text-emerald-700">{Math.ceil(route.totalDistance / 15)} min</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Distance</p>
                      <p className="text-xl font-black text-emerald-700">{route.totalDistance}m</p>
                    </div>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:left-[11px] before:w-0.5 before:bg-slate-200">
                    {instructions.map((inst, idx) => (
                      <div key={idx} className="relative">
                        <div className={\`absolute -left-[30px] w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm \${idx === instructions.length - 1 ? 'bg-emerald-500' : 'bg-blue-600'}\`}>
                          {idx === instructions.length - 1 ? <MapPin className="w-3 h-3" /> : <PersonStanding className="w-3 h-3" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{inst.instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                  <Compass className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-medium text-slate-500">Interactive Turn-by-Turn<br/>Pathfinding Enabled</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
`

fs.writeFileSync('src/components/desktop/DesktopFullMapModal.tsx', content);
