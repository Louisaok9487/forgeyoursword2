import React from 'react';
import { WeaponId } from '../types/game';
import { WEAPONS, MILESTONE_REWARDS } from '../utils/gameLogic';
import { WeaponVisual } from './WeaponVisual';
import { sound } from '../utils/audio';
import { Check, Lock, Award } from 'lucide-react';

interface WeaponsDrawerProps {
  currentWeaponId: WeaponId;
  level: number;
  onSelectWeapon: (weaponId: WeaponId) => void;
  milestonesClaimed: Record<string, boolean>;
  isForging: boolean;
}

export const WeaponsDrawer: React.FC<WeaponsDrawerProps> = ({
  currentWeaponId,
  level,
  onSelectWeapon,
  milestonesClaimed,
  isForging,
}) => {
  const weaponIds: WeaponId[] = ['sword', 'hammer', 'axe', 'spear', 'club', 'staff'];
  const canSwitch = level === 0;

  return (
    <div className="w-full max-w-md mx-auto mt-4 p-4 rounded-2xl bg-stone-950/80 border border-stone-800 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-cinzel text-sm font-bold tracking-wider uppercase text-stone-200">
            Blacksmith Arsenal
          </h2>
          <div className="text-[11px] text-stone-400">
            {canSwitch ? (
              <span className="text-emerald-400">Ready to forge or switch weapon</span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Sell or break to +0 to switch weapons
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {weaponIds.map((id) => {
          const weapon = WEAPONS[id];
          const isSelected = currentWeaponId === id;

          // Milestones for this weapon
          const m10 = milestonesClaimed[`${id}_10`];
          const m15 = milestonesClaimed[`${id}_15`];
          const m20 = milestonesClaimed[`${id}_20`];

          return (
            <button
              key={id}
              type="button"
              disabled={isForging || (!canSwitch && !isSelected)}
              onClick={() => {
                if (canSwitch && !isSelected) {
                  sound.playClick();
                  onSelectWeapon(id);
                }
              }}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-stone-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : canSwitch
                  ? 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                  : 'bg-stone-950/40 border-stone-900 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Top Row: Mini visual & Selected check */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 flex items-center justify-center -ml-1">
                  <WeaponVisual weaponId={id} level={isSelected ? level : 0} size={50} />
                </div>
                {isSelected && (
                  <span className="bg-amber-500 text-stone-950 p-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Name & Tag */}
              <div className="mt-2">
                <div className="font-cinzel text-xs font-bold text-stone-100">{weapon.name}</div>
                <div className="text-[10px] text-stone-400 uppercase tracking-tight">
                  {weapon.tag}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-2 text-[11px] font-mono tabular-nums flex items-center justify-between border-t border-stone-800/80 pt-1.5">
                <span className="text-amber-400 font-semibold">×{weapon.saleMultiplier} Sale</span>
                <span
                  className={
                    weapon.breakModifier > 0
                      ? 'text-red-400'
                      : weapon.breakModifier < 0
                      ? 'text-emerald-400'
                      : 'text-stone-400'
                  }
                >
                  {weapon.breakModifier > 0 ? `+${weapon.breakModifier}%` : `${weapon.breakModifier}%`} Break
                </span>
              </div>

              {/* Milestones Indicators */}
              <div className="mt-2 flex items-center gap-1.5 text-[9px] text-stone-400">
                <span className="flex items-center gap-0.5">
                  <Award className={`w-3 h-3 ${m10 ? 'text-amber-400' : 'text-stone-700'}`} />
                  <span className={m10 ? 'text-amber-400' : ''}>+10</span>
                </span>
                <span className="flex items-center gap-0.5">
                  <Award className={`w-3 h-3 ${m15 ? 'text-purple-400' : 'text-stone-700'}`} />
                  <span className={m15 ? 'text-purple-400' : ''}>+15</span>
                </span>
                <span className="flex items-center gap-0.5">
                  <Award className={`w-3 h-3 ${m20 ? 'text-cyan-400' : 'text-stone-700'}`} />
                  <span className={m20 ? 'text-cyan-400' : ''}>+20</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
