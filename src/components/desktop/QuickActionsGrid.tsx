import React from 'react';
import {
  Navigation,
  Utensils,
  BookOpen,
  Calendar,
  AlertTriangle,
  Search,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { DesktopNavSection } from '../../types';

interface QuickActionsGridProps {
  onSelectAction: (actionId: DesktopNavSection | string) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onSelectAction }) => {
  const actions = [
    {
      id: 'map',
      label: 'Find Location',
      icon: Navigation,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100/70',
      target: 'map',
    },
    {
      id: 'canteen',
      label: 'Canteen',
      icon: Utensils,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-100/70',
      target: 'canteen',
    },
    {
      id: 'library',
      label: 'Library',
      icon: BookOpen,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100/70',
      target: 'library',
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-100/70',
      target: 'events',
    },
    {
      id: 'report-issue',
      label: 'Report Issue',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-100/70',
      target: 'report-issue',
    },
    {
      id: 'lost-found',
      label: 'Lost & Found',
      icon: Search,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100/70',
      target: 'lost-found',
    },
    {
      id: 'digital-id',
      label: 'My ID',
      icon: CreditCard,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100/70',
      target: 'digital-id',
    },
    {
      id: 'copilot',
      label: 'AI Copilot',
      icon: Sparkles,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-100/70',
      target: 'copilot',
    },
  ];

  return (
    <div
      id="quick-actions-card"
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)]"
    >
      <h3 className="font-bold text-slate-900 text-base tracking-tight mb-4">Quick Actions</h3>

      <div className="grid grid-cols-4 gap-3">
        {actions.map((act) => {
          const IconComp = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onSelectAction(act.target)}
              className="group flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-200 transition-all text-center"
            >
              <div
                className={`w-11 h-11 rounded-full ${act.bgColor} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
              >
                <IconComp className={`w-5 h-5 ${act.iconColor}`} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
