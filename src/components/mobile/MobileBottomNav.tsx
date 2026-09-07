import React from 'react';
import { Home, GraduationCap, MapPin, Users, User, Calendar } from 'lucide-react';
import { MobileTab } from '../../types';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as MobileTab, label: 'Home', icon: Home },
    { id: 'academics' as MobileTab, label: 'Academics', icon: GraduationCap },
    { id: 'map' as MobileTab, label: 'Map', icon: MapPin },
    { id: 'events' as MobileTab, label: 'Community', icon: Users },
    { id: 'profile' as MobileTab, label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.03)]"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-blue-600 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1 tracking-tight leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
