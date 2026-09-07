import React, { useState, useEffect } from 'react';
import { Layers, MapPin, Search, Calendar, Clock, AlertTriangle, CheckCircle2, Wrench, ShieldCheck, Plus, X, Lock } from 'lucide-react';
import { api } from '../../lib/api';

const FLOOR_IMAGES: Record<string, string> = {
  'GF': '/floors/ground.svg',
  '1F': '/floors/first.svg',
  '2F': '/floors/second.svg',
  '3F': '/floors/third.svg'
};

const FLOOR_NAMES: Record<string, string> = {
  'GF': 'Ground Floor',
  '1F': 'First Floor',
  '2F': 'Second Floor',
  '3F': 'Third Floor'
};

export const AdminCampusMapOccupancy: React.FC = () => {
  const [activeFloor, setActiveFloor] = useState<string>('GF');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [occupancyData, setOccupancyData] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

  // Booking Modal State
  const [showBookModal, setShowBookModal] = useState<boolean>(false);
  const [bookingPurpose, setBookingPurpose] = useState<string>('');
  const [bookingStartTime, setBookingStartTime] = useState<string>('10:00');
  const [bookingEndTime, setBookingEndTime] = useState<string>('11:00');
  const [bookingDept, setBookingDept] = useState<string>('Information Technology');
  const [bookingFaculty, setBookingFaculty] = useState<string>('Dr. R. Mehta');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState<boolean>(false);

  // Maintenance Toggle State
  const [maintenanceReason, setMaintenanceReason] = useState<string>('Facility Servicing & Air Conditioning');
  const [isTogglingMaint, setIsTogglingMaint] = useState<boolean>(false);

  const loadOccupancy = () => {
    setIsLoading(true);
    api.admin.getOccupancy(activeFloor, selectedDate, selectedTime)
      .then((res) => {
        setOccupancyData(res);
      })
      .catch((err) => {
        console.warn('Occupancy error:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadOccupancy();
  }, [activeFloor, selectedDate, selectedTime]);

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room);
    setBookingStartTime(selectedTime || '10:00');
    // Default 1 hour duration
    const [h, m] = (selectedTime || '10:00').split(':').map(Number);
    const endH = String((h + 1) % 24).padStart(2, '0');
    setBookingEndTime(`${endH}:${String(m).padStart(2, '0')}`);
  };

  const handleBookRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    setIsSubmittingBooking(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const res = await api.admin.bookRoom({
        buildingId: 'mb',
        floor: activeFloor,
        roomNumber: selectedRoom.roomNumber,
        roomId: selectedRoom.id || `r-${selectedRoom.roomNumber.toLowerCase()}`,
        date: selectedDate,
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        purpose: bookingPurpose,
        department: bookingDept,
        bookedBy: bookingFaculty
      });

      setBookingSuccess(res.message);
      loadOccupancy();
      setTimeout(() => {
        setShowBookModal(false);
        setBookingPurpose('');
        setBookingSuccess(null);
      }, 1500);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to book room');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleToggleMaintenance = async (isMaintenance: boolean) => {
    if (!selectedRoom) return;

    setIsTogglingMaint(true);
    try {
      const res = await api.admin.toggleMaintenance({
        roomNumber: selectedRoom.roomNumber,
        isMaintenance,
        reason: maintenanceReason
      });

      alert(res.message);
      loadOccupancy();
      setSelectedRoom(null);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle maintenance');
    } finally {
      setIsTogglingMaint(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
              REAL-TIME BACKEND ENGINE
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live DB Sync
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Campus Map & Room Occupancy Engine</h2>
          <p className="text-xs text-slate-500">
            Four Floor Plan visualization with priority hierarchy (Maintenance &gt; Manual Booking &gt; Timetable &gt; Available).
          </p>
        </div>

        {/* Filter Controls: Floor, Date, Time */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {(['GF', '1F', '2F', '3F'] as const).map((fl) => (
              <button
                key={fl}
                onClick={() => {
                  setActiveFloor(fl);
                  setSelectedRoom(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFloor === fl
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {fl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent outline-none font-bold text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700">
            <Clock className="w-4 h-4 text-slate-400" />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="bg-transparent outline-none font-bold text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Status Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          <div>
            <p className="font-bold text-slate-900">Available ({occupancyData?.availableCount || 0})</p>
            <p className="text-[10px] text-slate-500">Ready for class / booking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-rose-100" />
          <div>
            <p className="font-bold text-slate-900">Occupied ({occupancyData?.occupiedCount || 0})</p>
            <p className="text-[10px] text-slate-500">Class or reserved event</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-slate-500 ring-4 ring-slate-200" />
          <div>
            <p className="font-bold text-slate-900">Maintenance ({occupancyData?.maintenanceCount || 0})</p>
            <p className="text-[10px] text-slate-500">Under facility service</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
          <div>
            <p className="font-bold text-slate-900">Selected</p>
            <p className="text-[10px] text-slate-500">Click room for details</p>
          </div>
        </div>
      </div>

      {/* Main Floor Visual Map & Sidebar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Floor Plan Display Box */}
        <div className="lg:col-span-2 relative bg-[#071527] rounded-3xl border border-slate-800 p-4 min-h-[420px] flex flex-col items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-xl text-white text-xs font-bold border border-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>{FLOOR_NAMES[activeFloor]} Asset Plan</span>
          </div>

          <img
            key={activeFloor}
            src={FLOOR_IMAGES[activeFloor]}
            alt={`${FLOOR_NAMES[activeFloor]} Plan`}
            className="w-full max-h-[460px] object-contain select-none"
          />

          {/* Interactive Room Badges Grid */}
          <div className="mt-4 w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 z-10">
            {occupancyData?.rooms?.map((rm: any) => {
              const isSelected = selectedRoom?.roomNumber === rm.roomNumber;
              let bgClass = 'bg-emerald-500 hover:bg-emerald-600 text-white';
              if (rm.status === 'OCCUPIED') bgClass = 'bg-rose-500 hover:bg-rose-600 text-white';
              if (rm.status === 'MAINTENANCE') bgClass = 'bg-slate-600 hover:bg-slate-700 text-white';
              if (isSelected) bgClass = 'bg-blue-600 text-white ring-4 ring-blue-400/50 scale-105';

              return (
                <button
                  key={rm.roomNumber}
                  onClick={() => handleRoomClick(rm)}
                  className={`p-2.5 rounded-2xl text-left font-bold text-xs transition-all shadow-md cursor-pointer flex flex-col justify-between ${bgClass}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono">{rm.roomNumber}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-black/30 font-semibold">
                      {rm.status}
                    </span>
                  </div>
                  <p className="text-[11px] truncate font-normal opacity-90 mt-1">{rm.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Room Details & Management Panel */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 flex flex-col justify-between">
          {selectedRoom ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                      {selectedRoom.type}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedRoom.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Room Number: {selectedRoom.roomNumber} • {FLOOR_NAMES[activeFloor]}</p>
                  </div>
                  
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedRoom.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedRoom.status === 'OCCUPIED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {selectedRoom.status}
                  </span>
                </div>
              </div>

              {/* Occupant Details Card */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Occupancy Status at {selectedTime}</h4>
                {selectedRoom.occupantDetails ? (
                  <div className="space-y-1.5">
                    {selectedRoom.occupantDetails.type === 'TIMETABLE' && (
                      <>
                        <p><span className="font-bold text-slate-600">Scheduled Class:</span> {selectedRoom.occupantDetails.subject}</p>
                        <p><span className="font-bold text-slate-600">Course & Division:</span> {selectedRoom.occupantDetails.course} ({selectedRoom.occupantDetails.division})</p>
                        <p><span className="font-bold text-slate-600">Faculty Member:</span> {selectedRoom.occupantDetails.faculty}</p>
                        <p><span className="font-bold text-slate-600">Slot Time:</span> {selectedRoom.occupantDetails.startTime} - {selectedRoom.occupantDetails.endTime}</p>
                      </>
                    )}

                    {selectedRoom.occupantDetails.type === 'MANUAL_BOOKING' && (
                      <>
                        <p><span className="font-bold text-slate-600">Manual Reservation:</span> {selectedRoom.occupantDetails.purpose}</p>
                        <p><span className="font-bold text-slate-600">Department:</span> {selectedRoom.occupantDetails.department}</p>
                        <p><span className="font-bold text-slate-600">Organized By:</span> {selectedRoom.occupantDetails.bookedBy}</p>
                        <p><span className="font-bold text-slate-600">Reserved Slot:</span> {selectedRoom.occupantDetails.startTime} - {selectedRoom.occupantDetails.endTime}</p>
                      </>
                    )}

                    {selectedRoom.occupantDetails.type === 'MAINTENANCE' && (
                      <>
                        <p className="text-rose-700 font-bold">⚠ CLOSED FOR MAINTENANCE</p>
                        <p><span className="font-bold text-slate-600">Reason:</span> {selectedRoom.occupantDetails.reason}</p>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-emerald-700 font-semibold">✓ Room is currently unoccupied and available for booking.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setShowBookModal(true)}
                  disabled={selectedRoom.status === 'MAINTENANCE'}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Reserve / Book Room Manual</span>
                </button>

                {selectedRoom.status === 'MAINTENANCE' ? (
                  <button
                    onClick={() => handleToggleMaintenance(false)}
                    disabled={isTogglingMaint}
                    className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    Mark Maintenance Resolved (Set Available)
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleMaintenance(true)}
                    disabled={isTogglingMaint}
                    className="w-full py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Set Room to Maintenance</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <MapPin className="w-10 h-10 mx-auto opacity-50" />
              <p className="text-xs font-bold text-slate-700">No Room Selected</p>
              <p className="text-[11px] text-slate-500">Click any room tile above on the floor plan to view live details and manage reservations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Room Booking Modal */}
      {showBookModal && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleBookRoom} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Book Room {selectedRoom.roomNumber} ({FLOOR_NAMES[activeFloor]})
              </h3>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{bookingError}</span>
              </div>
            )}

            {bookingSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{bookingSuccess}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Purpose / Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Guest Lecture on Quantum Computing"
                value={bookingPurpose}
                onChange={(e) => setBookingPurpose(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Start Time</label>
                <input
                  type="time"
                  required
                  value={bookingStartTime}
                  onChange={(e) => setBookingStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">End Time</label>
                <input
                  type="time"
                  required
                  value={bookingEndTime}
                  onChange={(e) => setBookingEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
              <input
                type="text"
                value={bookingDept}
                onChange={(e) => setBookingDept(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Faculty Organizer</label>
              <input
                type="text"
                value={bookingFaculty}
                onChange={(e) => setBookingFaculty(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingBooking}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                {isSubmittingBooking ? 'Checking Conflicts...' : 'Confirm Reservation'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
