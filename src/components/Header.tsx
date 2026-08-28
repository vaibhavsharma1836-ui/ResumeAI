import { Sparkles, ShieldCheck, FileCheck2, Layout, FileText, Target, Sparkle } from 'lucide-react';

interface HeaderProps {
  currentTab?: 'optimizer' | 'studio';
  onSelectTab?: (tab: 'optimizer' | 'studio') => void;
  documentTitle?: string;
  matchScore?: number;
}

export function Header({ 
  currentTab = 'optimizer', 
  onSelectTab,
  documentTitle = 'ATS-Optimized Resume',
  matchScore
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer" onClick={() => onSelectTab?.('optimizer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center">
                Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">.io</span>
                <span className="text-xs ml-1 text-slate-400 font-medium">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200/60 shadow-2xs">
                <Sparkle className="w-2.5 h-2.5 text-indigo-500 fill-indigo-500" />
                Pro Suite
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden md:block">
              Intelligent Resume Builder & ATS Job Match Engine
            </p>
          </div>
        </div>

        {/* Navigation Mode Switcher (Resume.io style segmented pill) */}
        {onSelectTab && (
          <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => onSelectTab('optimizer')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                currentTab === 'optimizer'
                  ? 'bg-white text-indigo-600 shadow-xs scale-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Optimizer & Match</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('studio')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                currentTab === 'studio'
                  ? 'bg-white text-indigo-600 shadow-xs scale-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Resume Studio</span>
              <span className="hidden lg:inline-flex text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700">
                6 Templates
              </span>
            </button>
          </div>
        )}

        {/* Right Info Badges */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-medium">
          {matchScore !== undefined && matchScore > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Match: {matchScore}%</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Zero Hallucinations</span>
          </div>
        </div>
      </div>
    </header>
  );
}
