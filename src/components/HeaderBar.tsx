import React from 'react';
import { Coins, Volume2, VolumeX, BarChart2, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderBarProps {
  gold: number;
  activeTab: 'forge' | 'arsenal' | 'items';
  setActiveTab: (tab: 'forge' | 'arsenal' | 'items') => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  gold,
  activeTab,
  setActiveTab,
  onOpenRules,
  onOpenStats,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/95 backdrop-blur border-b border-stone-800 px-3 sm:px-6 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-base sm:text-lg font-black tracking-wide text-amber-400 truncate">
            Forge Your Sword
          </span>
        </div>

        {/* Zone 2: Clean navigation buttons */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('forge');
            }}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'forge'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            Anvil
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('arsenal');
            }}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'arsenal'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            Arsenal
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('items');
            }}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'items'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            Relics
          </button>
        </nav>

        {/* Zone 3: Gold, Sound, Rules & Stats */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Gold Counter */}
          <div className="flex items-center gap-1 bg-stone-900/90 border border-amber-600/30 px-2.5 py-1 rounded-lg">
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-mono text-xs sm:text-sm font-bold text-amber-400 tabular-nums">
              {gold.toLocaleString()}g
            </span>
          </div>

          {/* Compendium / Rules Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-900 transition-colors"
            title="Blacksmith Compendium & Odds"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Stats Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenStats();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-900 transition-colors"
            title="Blacksmith Records"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg transition-colors ${
              isMuted
                ? 'text-red-400 hover:bg-stone-900'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
