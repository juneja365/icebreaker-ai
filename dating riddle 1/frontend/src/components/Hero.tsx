import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Zap, MessageCircle, Heart, Camera } from 'lucide-react';
import { CustomBranding } from '../types';

interface HeroProps {
  branding?: CustomBranding;
}

export const Hero: React.FC<HeroProps> = ({ branding }) => {
  return (
    <section className="relative pt-6 pb-6 text-center max-w-4xl mx-auto px-4">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-3xl -z-10 pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
        <span>Build Night Edition • AI Conversation Engineering</span>
      </div>

      {/* Main Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
        Your next conversation <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text text-transparent">
          starts here naturally.
        </span>
      </h2>

      {/* Subtitle */}
      <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
        {branding?.tagline || "Stop staring at a blank screen or sending boring “Hey, what's up?”. Tell the AI who you're talking to and get personalized, low-pressure messages tailored to your vibe."}
      </p>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-6 max-w-3xl mx-auto text-left">
        <div className="glass-card p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">Context-Aware</h4>
          </div>
          <p className="text-[11px] text-slate-400">Campus, stories, dating apps, or team channels.</p>
        </div>

        <div className="glass-card p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <Heart className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">Bio Architect</h4>
          </div>
          <p className="text-[11px] text-slate-400">High-converting Hinge prompts & Tinder 1-liners.</p>
        </div>

        <div className="glass-card p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">Vision Reader</h4>
          </div>
          <p className="text-[11px] text-slate-400">Drop screenshots to extract environmental hooks.</p>
        </div>

        <div className="glass-card p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">Respect Guard</h4>
          </div>
          <p className="text-[11px] text-slate-400">Anti-creep filters guarantee non-pushy communication.</p>
        </div>
      </div>
    </section>
  );
};
