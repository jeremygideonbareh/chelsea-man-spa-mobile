import { Home, Calendar, User, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showManagerIcon: boolean;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'appointments', label: 'Bookings', icon: Calendar },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ activeTab, onTabChange, showManagerIcon }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-full px-2 py-2 flex items-center gap-1 shadow-lg"
      style={{ width: '90%', maxWidth: '380px' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative flex-1 flex flex-col items-center gap-0.5 py-2 rounded-full transition-all"
          >
            {isActive && (
              <div className="absolute inset-0 bg-amber-500/20 rounded-full" />
            )}
            <Icon
              className={`w-5 h-5 transition-colors relative z-10 ${
                isActive ? 'text-amber-500' : 'text-[#525252]'
              }`}
            />
            <span
              className={`text-[9px] font-medium transition-colors relative z-10 ${
                isActive ? 'text-amber-500' : 'text-[#525252]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}

      {showManagerIcon && (
        <button
          onClick={() => onTabChange('manager')}
          className="relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-full"
        >
          {activeTab === 'manager' && (
            <div className="absolute inset-0 bg-amber-500/20 rounded-full" />
          )}
          <Settings
            className={`w-5 h-5 transition-colors relative z-10 ${
              activeTab === 'manager' ? 'text-amber-500' : 'text-[#525252]'
            }`}
          />
          <span
            className={`text-[9px] font-medium transition-colors relative z-10 ${
              activeTab === 'manager' ? 'text-amber-500' : 'text-[#525252]'
            }`}
          >
            Admin
          </span>
        </button>
      )}
    </nav>
  );
}
