import React from 'react';
import { Compass, GraduationCap, Github, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { AppScreen } from '../types/viora';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onReset: () => void;
  onOpenShare?: () => void;
  studentName?: string;
  hasReport: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onReset,
  onOpenShare,
  studentName,
  hasReport
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                Viora
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                EduTech
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Student Learning &amp; Portfolio Growth
            </p>
          </div>
        </div>

        {/* Step Flow indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/70">
          <span className={`px-2 py-0.5 rounded-full transition-colors ${currentScreen === 'landing' || currentScreen === 'onboarding' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'}`}>
            1. Evidence Review
          </span>
          <span className="text-slate-300">&rarr;</span>
          <span className={`px-2 py-0.5 rounded-full transition-colors ${currentScreen === 'interview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'}`}>
            2. AI Interview
          </span>
          <span className="text-slate-300">&rarr;</span>
          <span className={`px-2 py-0.5 rounded-full transition-colors ${currentScreen === 'dashboard' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'}`}>
            3. Growth Roadmap
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {hasReport && currentScreen === 'dashboard' && onOpenShare && (
            <button
              onClick={onOpenShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share Profile</span>
            </button>
          )}

          {currentScreen !== 'landing' && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Start a new student assessment"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          )}

          {currentScreen === 'landing' && (
            <button
              onClick={() => onNavigate('onboarding')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm hover:shadow-indigo-200/50"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Start My Assessment</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
