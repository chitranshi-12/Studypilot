import React from 'react';
import { UserProfile } from '../types';
import {
  LayoutDashboard,
  Library,
  UploadCloud,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'dashboard' | 'library' | 'upload';
  setCurrentTab: (tab: 'dashboard' | 'library' | 'upload') => void;
  user: UserProfile;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenDoc?: (docId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  isDark,
  toggleTheme,
}) => {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col justify-between p-4 shrink-0 h-screen sticky top-0 hidden md:flex">
      {/* Brand */}
      <div>
        <div className="px-3 py-3 mb-6">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                StudyPilot
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Exam Preparation</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('library')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              currentTab === 'library'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>My Library</span>
          </button>

          <button
            onClick={() => setCurrentTab('upload')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              currentTab === 'upload'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New PDF</span>
          </button>
        </nav>
      </div>

      {/* User Profile & Theme Controls */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            <span>{isDark ? 'Light Appearance' : 'Dark Appearance'}</span>
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* User Card */}
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName)}`}
              alt={user.displayName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user.displayName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out"
            className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
