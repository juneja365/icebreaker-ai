import React from 'react';
import { Sparkles, MessageSquare, Bot, Bookmark, Compass, RefreshCw, Heart, Camera, Palette } from 'lucide-react';
import { ToolType, ThemeMode, CustomBranding } from '../types';

interface NavbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  branding: CustomBranding;
  onOpenDemos: () => void;
  onOpenFavorites: () => void;
  onOpenSettings: () => void;
  backendStatus: { status: string; engine: string };
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTool,
  setActiveTool,
  theme,
  setTheme,
  branding,
  onOpenDemos,
  onOpenFavorites,
  onOpenSettings,
  backendStatus,
  savedCount
}) => {
  const tools: { id: ToolType; label: string; icon: React.ReactNode }[] = [
    { id: 'icebreaker', label: 'Icebreakers', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'reply_coach', label: 'Reply Coach', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'rescue', label: 'Rescue', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'rewrite', label: 'Tone Tuner', icon: <Bot className="w-4 h-4" /> },
    { id: 'bio_maker', label: 'Bio Maker', icon: <Heart className="w-4 h-4" /> },
    { id: 'screenshot_scan', label: 'Vision Scan', icon: <Camera className="w-4 h-4" /> },
  ];

  const themes: { id: ThemeMode; label: string; icon: string }[] = [
    { id: 'sunset', label: 'Sunset Glow', icon: '🌅' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', icon: '⚡' },
    { id: 'obsidian', label: 'Obsidian Minimal', icon: '🖤' },
    { id: 'emerald', label: 'Mint Emerald', icon: '🍃' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20 ring-1 ring-white/20 text-lg">
            {branding.logoEmoji || '🧊'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {branding.appName || 'Icebreaker AI'}
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {branding.tagline || 'Turn awkward silences into natural conversations'}
            </p>
          </div>
        </div>

        {/* Center Tool Navigation Tabs */}
        <nav className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner overflow-x-auto max-w-full">
          {tools.map((t) => {
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Change UI Theme"
            >
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[11px] hidden sm:inline capitalize">{theme}</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-50 min-w-[140px]">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                    theme === th.id ? 'bg-pink-600/20 text-pink-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{th.icon}</span>
                  <span>{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Demo Scenarios for Judges */}
          <button
            onClick={onOpenDemos}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/50 hover:text-indigo-200 transition-all"
            title="Instant scenarios to demo for Build Night judges"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Judge Demos</span>
          </button>

          {/* Saved Favorites */}
          <button
            onClick={onOpenFavorites}
            className="relative flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:bg-slate-700 hover:text-white transition-all"
            title="View saved openers"
          >
            <Bookmark className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Settings & Custom Branding */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700 transition-all"
            title="Customize Branding & AI Keys"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] hidden lg:inline truncate max-w-[100px]">
              {backendStatus.engine}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
