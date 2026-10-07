import React, { useState } from 'react';
import { PlayerStats } from '../types/game';
import { X, Trophy, RotateCcw, AlertTriangle } from 'lucide-react';

interface StatsModalProps {
  stats: PlayerStats;
  onClose: () => void;
  onResetSave: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose, onResetSave }) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-stone-950 border border-stone-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="font-cinzel text-base font-bold text-white tracking-wide">
              Blacksmith Records
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 font-mono text-xs tabular-nums text-stone-300">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <div className="text-[10px] text-stone-400 uppercase font-sans">Highest Level</div>
              <div className="text-xl font-bold text-cyan-400 mt-0.5">+{stats.highestLevel}</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <div className="text-[10px] text-stone-400 uppercase font-sans">Total Forges</div>
              <div className="text-xl font-bold text-white mt-0.5">{stats.totalForges.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <div className="text-[10px] text-stone-400 uppercase font-sans">Successes</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">{stats.totalSuccesses.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <div className="text-[10px] text-stone-400 uppercase font-sans">Jackpots (+2)</div>
              <div className="text-base font-bold text-amber-400 mt-0.5">{stats.totalJackpots.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <div className="text-[10px] text-stone-400 uppercase font-sans">Shatters / Breaks</div>
              <div className="text-base font-bold text-red-400 mt-0.5">{stats.totalBreaks.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <div className="text-[10px] text-stone-400 uppercase font-sans">Levels Damaged</div>
              <div className="text-base font-bold text-orange-400 mt-0.5">{stats.totalDamages.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <div className="text-[10px] text-stone-400 uppercase font-sans">Surges Triggered</div>
              <div className="text-base font-bold text-cyan-400 mt-0.5">{stats.totalSurges.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <div className="text-[10px] text-stone-400 uppercase font-sans">Hourglass Saves</div>
              <div className="text-base font-bold text-purple-400 mt-0.5">{stats.totalHourglassSaves.toLocaleString()}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-between">
            <span className="text-stone-400 font-sans">Total Gold Earned from Sales:</span>
            <span className="font-bold text-amber-400">{stats.totalGoldEarned.toLocaleString()}g</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-between">
            <span className="text-stone-400 font-sans">Weapons Cashed Out:</span>
            <span className="font-bold text-white">{stats.totalSales.toLocaleString()}</span>
          </div>

          {/* Reset Save Section */}
          <div className="pt-2 border-t border-stone-900">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-red-950/40 text-stone-400 hover:text-red-400 border border-stone-800 text-xs font-sans transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Save Data</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/80 space-y-2 font-sans">
                <div className="flex items-center gap-2 text-red-300 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Reset everything to starting state (100g, +0 sword)?</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetSave();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                  >
                    Yes, Reset Game
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-800 bg-stone-950 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-lg text-xs font-semibold border border-stone-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
