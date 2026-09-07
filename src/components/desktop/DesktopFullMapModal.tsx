import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, Compass, Navigation, PersonStanding, Layers, ArrowUpRight } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ROOMS, Room, Floor, FLOOR_LABELS } from '../../data/campusMapData';
import { findRoute, generateInstructions, RoutePath } from '../../lib/pathfinding';
import { CampusMapRouteOverlay } from './CampusMapRouteOverlay';

interface DesktopFullMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FLOOR_IMAGES: Record<Floor, string> = {
  GF: '/floors/ground.svg',
  '1F': '/floors/first.svg',
  '2F': '/floors/second.svg',
  '3F': '/floors/third.svg'
};

export const DesktopFullMapModal: React.FC<DesktopFullMapModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeFloor, setActiveFloor] = useState<Floor>('GF');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [startRoom, setStartRoom] = useState<Room | null>(ROOMS.find(r => r.id === 'foyer-gf') || null);
  
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAccessibleRoute, setIsAccessibleRoute] = useState(false);
  const [route, setRoute] = useState<RoutePath | null>(null);
  const [instructions, setInstructions] = useState<any[]>([]);

  // Search matches across ALL floors
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return ROOMS.filter(room => 
      room.name.toLowerCase().includes(q) || 
      room.type.toLowerCase().includes(q) ||
      (room.description && room.description.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Rooms visible on current active floor
  const visibleRooms = useMemo(() => {
    return ROOMS.filter(room => room.floor === activeFloor);
  }, [activeFloor]);

  if (!isOpen) return null;

  const handleSelectRoom = (room: Room) => {
    setActiveFloor(room.floor);
    setSelectedRoom(room);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleNavigate = async () => {
    if (!startRoom || !selectedRoom) return;
    const calculatedRoute = await findRoute(startRoom.nodeId, selectedRoom.nodeId, isAccessibleRoute);
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
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-40 shadow-sm relative">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Campus Map</h2>
            <div className="h-6 w-px bg-slate-200"></div>
            
            {/* Search Box with Dropdown */}
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rooms, labs, library..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-64 overflow-y-auto z-50 py-2">
                  {searchResults.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => handleSelectRoom(room)}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{room.name}</p>
                        <p className="text-[10px] text-slate-500">{FLOOR_LABELS[room.floor]} • {room.type}</p>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              )}
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
          <div className="relative flex-1 bg-[#071527] overflow-hidden select-none cursor-grab active:cursor-grabbing">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={4}
              centerOnInit
              limitToBounds={false}
            >
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                <div className="relative w-[1200px] h-[504px] sm:w-[1600px] sm:h-[672px] bg-[#071527] overflow-hidden">
                  
                  {/* Single Floor Image Render */}
                  <img
                    key={activeFloor}
                    src={FLOOR_IMAGES[activeFloor]}
                    alt={`${FLOOR_LABELS[activeFloor]} Plan`}
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />

                  {/* SVG Route Overlay */}
                  {isNavigating && route && (
                    <CampusMapRouteOverlay route={route} activeFloor={activeFloor} />
                  )}

                  {/* Room Markers on Active Floor */}
                  <div className="absolute inset-0 pointer-events-none">
                    {visibleRooms.map((room) => {
                      const isSelected = selectedRoom?.id === room.id;
                      const isStart = isNavigating && startRoom?.id === room.id;
                      const isEnd = isNavigating && selectedRoom?.id === room.id;
                      
                      if (isNavigating && !isStart && !isEnd) return null;

                      return (
                        <div
                          key={room.id}
                          style={{
                            top: `${room.y}%`,
                            left: `${room.x}%`,
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-300 ease-out pointer-events-auto ${
                            isSelected || isStart || isEnd ? 'scale-110 z-20' : 'scale-90 opacity-90 hover:scale-100'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoom(room);
                          }}
                        >
                          <div className="flex flex-col items-center group">
                            <div
                              className={`flex items-center justify-center rounded-full shadow-lg border text-white transition-all ${
                                isStart 
                                  ? 'w-8 h-8 bg-emerald-600 border-white ring-4 ring-emerald-400/50'
                                  : isEnd || isSelected
                                  ? 'w-8 h-8 bg-blue-600 border-white ring-4 ring-blue-400/50'
                                  : 'w-6 h-6 bg-slate-800 border-white opacity-90 group-hover:bg-blue-500'
                              }`}
                            >
                              <MapPin className={`${isSelected || isStart || isEnd ? 'w-4 h-4' : 'w-3 h-3'}`} />
                            </div>
                            {(isSelected || isStart || isEnd) && (
                              <div className="mt-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-xl text-[10px] font-bold text-slate-800 whitespace-nowrap">
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
                  className={`w-12 h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                    activeFloor === floor
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{floor}</span>
                </button>
              ))}
            </div>
            
          </div>

          {/* Sidebar Panel */}
          <div className="w-[340px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-30 shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.05)]">
            
            {/* Selected Location Info */}
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
                  {selectedRoom.description || `Academic facility located on the ${FLOOR_LABELS[selectedRoom.floor]}.`}
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

            {/* Routing Steps */}
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
                        <div className={`absolute -left-[30px] w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm ${idx === instructions.length - 1 ? 'bg-emerald-500' : 'bg-blue-600'}`}>
                          {idx === instructions.length - 1 ? <MapPin className="w-3 h-3" /> : <PersonStanding className="w-3 h-3" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{inst.instruction}</p>
                          {inst.targetFloor && inst.targetFloor !== activeFloor && (
                            <button
                              onClick={() => setActiveFloor(inst.targetFloor as Floor)}
                              className="mt-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1"
                            >
                              <span>View {FLOOR_LABELS[inst.targetFloor as Floor]} Map</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          )}
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
