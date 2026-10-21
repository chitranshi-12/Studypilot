import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Menu,
  X,
  LayoutDashboard,
  Library,
  UploadCloud,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

interface MobileHeaderProps {
  currentTab: 'dashboard' | 'library' | 'upload';
  setCurrentTab: (tab: 'dashboard' | 'library' | 'upload') => void;
  user: UserProfile;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  isDark,
  toggleTheme,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
            StudyPilot
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            AI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full p-5 flex flex-col justify-between shadow-2xl z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                    StudyPilot
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    AI
                  </span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                <button
                  onClick={() => {
                    setCurrentTab('dashboard');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    currentTab === 'dashboard'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab('library');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    currentTab === 'library'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Library className="w-4 h-4" />
                  <span>My Library</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab('upload');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    currentTab === 'upload'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload PDF</span>
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName)}`}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user.displayName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
