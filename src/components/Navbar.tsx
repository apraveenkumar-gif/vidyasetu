import React, { useState } from 'react';
import { UserRole, Language, NetworkMode } from '../types';
import { t } from '../data/translations';
import { sounds } from '../services/audio';
import { 
  Wifi, 
  WifiOff, 
  Radio, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  GraduationCap, 
  Menu, 
  X,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  coins: number;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  language,
  setLanguage,
  networkMode,
  setNetworkMode,
  coins,
  streakDays,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    sounds.setSoundEnabled(next);
    if (next) sounds.playClick();
  };

  const handleNavClick = (tabId: string) => {
    sounds.playClick();
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleRoleToggle = () => {
    sounds.playClick();
    const nextRole: UserRole = userRole === 'student' ? 'teacher' : 'student';
    setUserRole(nextRole);
    if (nextRole === 'teacher') {
      setActiveTab('teacher');
    } else {
      setActiveTab('dashboard');
    }
  };

  const navItems = userRole === 'student'
    ? [
        { id: 'dashboard', label: t('navDashboard', language) },
        { id: 'lessons', label: t('navLessons', language) },
        { id: 'doubt_solver', label: t('navDoubtSolver', language) },
        { id: 'leaderboard', label: t('navLeaderboard', language) },
        { id: 'badges', label: t('navBadges', language) },
      ]
    : [
        { id: 'teacher', label: t('teacherTitle', language) },
        { id: 'lessons', label: t('navLessons', language) },
        { id: 'leaderboard', label: t('navLeaderboard', language) },
      ];

  const networkConfig = {
    online: {
      label: t('onlineStatus', language),
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: Wifi,
    },
    low2g: {
      label: t('low2gStatus', language),
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Radio,
    },
    offline: {
      label: t('offlineStatus', language),
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: WifiOff,
    },
  }[networkMode];

  const NetIcon = networkConfig.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick(userRole === 'student' ? 'dashboard' : 'teacher')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-amber-950 font-['Outfit'] whitespace-nowrap leading-none">
                    {t('appName', language)}
                  </span>
                  <span className="text-[10px] font-medium text-amber-800/80 tracking-wide mt-0.5 whitespace-nowrap hidden sm:inline">
                    {t('tagline', language)}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line links with hover underlines) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-stone-600">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive ? 'text-amber-800 font-bold' : 'hover:text-stone-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Essential Controls (Single-line controls) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Gamification Counters for Student */}
            {userRole === 'student' && (
              <div className="hidden sm:flex items-center gap-2.5 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                <span className="flex items-center gap-1 text-amber-800" title="Vidya Coins">
                  <span className="text-sm">🪙</span>
                  <span className="font-mono tabular-nums">{coins}</span>
                </span>
                <span className="text-stone-300" aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-orange-700" title="Daily Streak">
                  <span className="text-sm">🔥</span>
                  <span className="font-mono tabular-nums">{streakDays}d</span>
                </span>
              </div>
            )}

            {/* Network Simulator Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${networkConfig.color}`}
                title="Toggle online / offline mode to test offline capabilities"
              >
                <NetIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline whitespace-nowrap">{networkConfig.label}</span>
              </button>

              {networkDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 font-bold text-stone-500 uppercase tracking-wider text-[10px]">
                    Network Simulator:
                  </div>
                  <button
                    onClick={() => {
                      setNetworkMode('online');
                      setNetworkDropdownOpen(false);
                      sounds.playClick();
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-stone-50 ${
                      networkMode === 'online' ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-stone-700'
                    }`}
                  >
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    Online (Full Broadband)
                  </button>
                  <button
                    onClick={() => {
                      setNetworkMode('low2g');
                      setNetworkDropdownOpen(false);
                      sounds.playClick();
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-stone-50 ${
                      networkMode === 'low2g' ? 'font-bold text-amber-700 bg-amber-50' : 'text-stone-700'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5 text-amber-600" />
                    2G Edge (Rural Low Data)
                  </button>
                  <button
                    onClick={() => {
                      setNetworkMode('offline');
                      setNetworkDropdownOpen(false);
                      sounds.playClick();
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-stone-50 ${
                      networkMode === 'offline' ? 'font-bold text-rose-700 bg-rose-50' : 'text-stone-700'
                    }`}
                  >
                    <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                    Offline (Local Zero-Network)
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
              {(['en', 'te', 'hi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    sounds.playClick();
                    setLanguage(lang);
                  }}
                  className={`px-2 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    language === lang
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'te' ? 'తె' : 'हि'}
                </button>
              ))}
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
              title={soundActive ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            {/* Role Switcher Button */}
            <button
              onClick={handleRoleToggle}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                userRole === 'student'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{userRole === 'student' ? 'Teacher View' : 'Student View'}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === item.id
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
