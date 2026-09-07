import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Compass } from 'lucide-react';
import { ROOMS, Room } from '../../data/campusMapData';

interface CampusMapCardProps {
  onViewFullMap: () => void;
  onSelectLocation?: (loc: Room) => void;
}

export const CampusMapCard: React.FC<CampusMapCardProps> = ({
  onViewFullMap,
  onSelectLocation
}) => {
  // Use Ground Floor as default preview
  const floorRooms = ROOMS.filter(r => r.floor === 'GF');
  const [selectedLoc, setSelectedLoc] = useState<Room | null>(floorRooms[0]);
  const [imgError, setImgError] = useState(false);

  // Rotate selection automatically for a dynamic feel
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      index = (index + 1) % floorRooms.length;
      setSelectedLoc(floorRooms[index]);
    }, 4000);
    return () => clearInterval(timer);
  }, [floorRooms]);

  return (
    <div
      id="campus-map-card"
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between overflow-hidden"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 text-base tracking-tight">Campus Map</h3>
        </div>
        <button
          onClick={onViewFullMap}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <span>View Interactive</span>
          <span>→</span>
        </button>
      </div>

      {/* Visual Map Area */}
      <div className="relative mt-4 w-full h-[220px] rounded-xl overflow-hidden bg-[#e6e2db] shadow-inner group border border-slate-200 cursor-pointer" onClick={onViewFullMap}>
        
        {/* Floor Plan specific to Ground Floor quadrant */}
        <div 
          className="absolute w-[200%] h-[200%] transition-transform duration-700 ease-out origin-top-left group-hover:scale-105"
          style={{ transform: 'translate(0%, 0%)' }} // GF mapping
        >
          {!imgError ? (
            <img
              src="/floors/ground.svg"
              alt="Sathaye College Ground Floor"
              className="w-full h-full object-contain opacity-90"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-center p-4">
              <p className="text-xs font-bold text-slate-500">Image not found</p>
              <p className="text-[10px] text-slate-400 mt-1">Please upload the floor-plan to public/sathaye_floorplan.png</p>
            </div>
          )}
        </div>

        {/* Compass floating badge */}
        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg shadow-sm text-slate-700 pointer-events-none z-10 border border-slate-200">
          <Compass className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
        </div>
        
        <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded shadow-sm text-white text-[10px] font-bold pointer-events-none z-10 tracking-widest">
          GROUND FLOOR
        </div>

        {/* Location Markers */}
        <div className="absolute inset-0">
          {floorRooms.map((room) => {
            const isSelected = selectedLoc?.id === room.id;
            return (
              <div
                key={room.id}
                style={{
                  top: `${room.y}%`,
                  left: `${room.x}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-500 ease-out ${
                  isSelected ? 'scale-110 z-20' : 'scale-90 opacity-80'
                }`}
              >
                <div className={`flex flex-col items-center group`}>
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full shadow-lg border text-white transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-white ring-2 ring-blue-400'
                        : 'bg-slate-800 border-white opacity-80'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                  </div>
                  {isSelected && (
                    <div className="mt-1 px-2 py-0.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-md shadow-lg text-[9px] font-bold text-slate-800 whitespace-nowrap">
                      {room.name}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Quick Location Preview */}
      <div className="mt-4 bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-xs truncate">
              {selectedLoc?.name || 'Loading...'}
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              Ground Floor • {selectedLoc?.type || 'Facility'}
            </p>
          </div>
        </div>
        <button
          onClick={onViewFullMap}
          className="shrink-0 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] rounded-lg transition-colors"
        >
          Route
        </button>
      </div>
    </div>
  );
};
