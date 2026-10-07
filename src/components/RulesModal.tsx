import React, { useState } from 'react';
import {
  BASE_SUCCESS_RATES,
  BASE_BREAK_RATES,
  BASE_DAMAGE_RATES,
  BASE_JACKPOT_RATES,
  BASE_VALUES,
  TIERS,
  WEAPONS,
  ITEMS,
} from '../utils/gameLogic';
import { X, Shield, Swords, Sparkles, BookOpen } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'odds' | 'weapons' | 'mechanics'>('odds');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-lg max-h-[90vh] rounded-2xl bg-stone-950 border border-stone-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h2 className="font-cinzel text-base font-bold text-white tracking-wide">
              Blacksmith Compendium
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-800 bg-stone-900/60 p-1 gap-1">
          <button
            onClick={() => setActiveTab('odds')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'odds' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-white'
            }`}
          >
            Base Odds & Values
          </button>
          <button
            onClick={() => setActiveTab('weapons')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'weapons' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-white'
            }`}
          >
            Weapons & Relics
          </button>
          <button
            onClick={() => setActiveTab('mechanics')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'mechanics' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-white'
            }`}
          >
            Game Mechanics
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-stone-300">
          {activeTab === 'odds' && (
            <div>
              <p className="text-stone-400 mb-3 text-[11px]">
                Base odds per attempt to forge to the next level. Item and weapon modifiers apply on top.
              </p>
              <div className="border border-stone-800 rounded-xl overflow-hidden font-mono tabular-nums">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-stone-900 text-stone-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2">Target</th>
                      <th className="p-2 text-emerald-400">Success</th>
                      <th className="p-2 text-red-400">Break</th>
                      <th className="p-2 text-orange-400">Damage</th>
                      <th className="p-2 text-amber-400">Jackpot</th>
                      <th className="p-2 text-right">Base Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-900">
                    {Array.from({ length: 20 }).map((_, idx) => (
                      <tr key={idx} className="hover:bg-stone-900/40">
                        <td className="p-2 font-bold text-white">+{idx} → +{idx + 1}</td>
                        <td className="p-2 text-emerald-400">{BASE_SUCCESS_RATES[idx]}%</td>
                        <td className="p-2 text-red-400">{BASE_BREAK_RATES[idx]}%</td>
                        <td className="p-2 text-orange-400">{BASE_DAMAGE_RATES[idx]}%</td>
                        <td className="p-2 text-amber-400">{BASE_JACKPOT_RATES[idx]}%</td>
                        <td className="p-2 text-right text-stone-300">{BASE_VALUES[idx + 1].toLocaleString()}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'weapons' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-cinzel text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Weapon Profiles
                </h3>
                <div className="space-y-2">
                  {Object.values(WEAPONS).map((w) => (
                    <div key={w.id} className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
                      <div className="flex items-center justify-between font-bold text-white mb-0.5">
                        <span>{w.name} ({w.tag})</span>
                        <span className="font-mono text-amber-400">×{w.saleMultiplier} Sale</span>
                      </div>
                      <div className="text-[11px] text-stone-400">{w.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-cinzel text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Protective Items
                </h3>
                <div className="space-y-2">
                  {Object.values(ITEMS).map((item) => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
                      <div className="flex items-center justify-between font-bold text-white mb-0.5">
                        <span>{item.name} ({item.price}g)</span>
                        <span className="text-amber-300 text-[11px]">{item.effect}</span>
                      </div>
                      <div className="text-[11px] text-stone-400">{item.description}</div>
                      <div className="text-[10px] text-stone-500 mt-1">{item.consumptionNote}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mechanics' && (
            <div className="space-y-3 leading-relaxed">
              <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
                <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Surge (+1 to +3 Levels)
                </h4>
                <p className="text-stone-400 text-[11px]">
                  After any Success or Jackpot that lands on +10 or higher, there is a 12% chance of surging 1 to 3 extra levels (capped at +20).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
                <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-sky-400" /> Pity & Hot Streak
                </h4>
                <p className="text-stone-400 text-[11px]">
                  Each consecutive non-success (nothing, damage, or break) adds +2% success chance (capped at +10%). Resets on any success.
                  Consecutive streaks of 3 or more successes grant +5% success chance.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
                <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-emerald-400" /> Milestones & Economy
                </h4>
                <p className="text-stone-400 text-[11px]">
                  The first time each weapon type reaches +10, +15, and +20, you receive a one-off 500g, 3,000g, and 25,000g bounty.
                  Selling your weapon awards: Base Value × Weapon Multiplier × (1 + 5% per consecutive success, max +50%).
                </p>
              </div>
            </div>
          )}
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
