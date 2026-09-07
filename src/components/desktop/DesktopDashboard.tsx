import React from 'react';
import { StudentProfile } from '../../types';
import { StatCards } from './StatCards';
import { TodayScheduleCard } from './TodayScheduleCard';
import { CampusMapCard } from './CampusMapCard';
import { CampusBannerCarousel } from './CampusBannerCarousel';
import { QuickActionsGrid } from './QuickActionsGrid';
import { AnnouncementsCard } from './AnnouncementsCard';
import { UpcomingEventsCard } from './UpcomingEventsCard';
import { CanteenLibraryCards } from './CanteenLibraryCards';
import { BottomCtaBanner } from './BottomCtaBanner';
import { FloatingAiCopilot } from './FloatingAiCopilot';

interface DesktopDashboardProps {
  student: StudentProfile;
  onNavigateSection: (section: any) => void;
  onOpenDigitalId: () => void;
  onOpenFullMap: () => void;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  student,
  onNavigateSection,
  onOpenDigitalId,
  onOpenFullMap,
}) => {
  return (
    <div id="desktop-dashboard-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Greeting Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Good Morning, {student.name.split(' ')[0]}!</span>
            <span className="text-2xl animate-bounce duration-1000">👋</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Here's your campus overview for today.
          </p>
        </div>

        {/* Top Right College Motto Quote */}
        <div className="text-left md:text-right">
          <p className="text-sm font-semibold text-slate-700 font-serif italic">
            “Better Students. A Brighter Tomorrow.”
          </p>
          <p className="text-xs font-semibold text-slate-400 mt-0.5 tracking-wide">
            — Sathaye College
          </p>
        </div>
      </div>

      {/* 2. Four Statistic Cards in One Row */}
      <StatCards onNavigate={onNavigateSection} />

      {/* 3. Three-Column Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1 (Left) */}
        <div className="space-y-6">
          <TodayScheduleCard onViewFullTimetable={() => onNavigateSection('timetable')} />
          <QuickActionsGrid
            onSelectAction={(action) => {
              if (action === 'digital-id') {
                onOpenDigitalId();
              } else if (action === 'map') {
                onOpenFullMap();
              } else {
                onNavigateSection(action);
              }
            }}
          />
        </div>

        {/* Column 2 (Center) */}
        <div className="space-y-6">
          <CampusMapCard
            onViewFullMap={onOpenFullMap}
            onSelectLocation={(loc) => {
              console.log('Selected building:', loc.name);
            }}
          />
          <AnnouncementsCard onViewAll={() => onNavigateSection('notifications')} />
        </div>

        {/* Column 3 (Right) */}
        <div className="space-y-6">
          <CampusBannerCarousel />
          <UpcomingEventsCard onViewAll={() => onNavigateSection('events')} />
          <CanteenLibraryCards
            onViewCanteen={() => onNavigateSection('canteen')}
            onViewLibrary={() => onNavigateSection('library')}
          />
        </div>
      </div>

      {/* 4. Bottom Full-Width Blue CTA Banner */}
      <BottomCtaBanner onExplore={() => onNavigateSection('community')} />

      {/* 5. Floating AI Campus Copilot */}
      <FloatingAiCopilot onOpenAction={(act) => onNavigateSection(act)} />
    </div>
  );
};
