import React, { useEffect, useRef, useState } from 'react';
import { WeaponId, ForgeResult, OutcomeType } from '../types/game';
import { WeaponVisual } from './WeaponVisual';
import {
  getWeaponDisplayName,
  getTierForLevel,
  calculateOdds,
  calculateSalePrice,
  WEAPONS,
} from '../utils/gameLogic';
import { sound } from '../utils/audio';
import { Flame, ShieldAlert, Sparkles, Coins, Zap } from 'lucide-react';

interface ForgeAnvilProps {
  level: number;
  weaponId: WeaponId;
  gold: number;
  consecutiveSuccesses: number;
  pityBonus: number;
  equipped: Record<string, boolean>;
  inventory: Record<string, number>;
  isForging: boolean;
  onForge: () => void;
  onSell: () => void;
  lastResult: ForgeResult | null;
  shakeType: 'none' | 'normal' | 'intense';
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  gravity: number;
  decay: number;
}

export const ForgeAnvil: React.FC<ForgeAnvilProps> = ({
  level,
  weaponId,
  consecutiveSuccesses,
  pityBonus,
  equipped,
  inventory,
  isForging,
  onForge,
  onSell,
  lastResult,
  shakeType,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SparkParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const [showHammer, setShowHammer] = useState(false);
  const [suspenseActive, setSuspenseActive] = useState(false);
  const [flashColor, setFlashColor] = useState<string | null>(null);

  const odds = calculateOdds(
    level,
    weaponId,
    pityBonus,
    consecutiveSuccesses,
    equipped as Record<any, boolean>,
    inventory as Record<any, number>
  );

  const saleInfo = calculateSalePrice(level, weaponId, consecutiveSuccesses);
  const tier = getTierForLevel(level);

  // Danger zone: break chance >= 20%
  const isDangerZone = odds.breakChance >= 20;
  // Hot streak: 3+ consecutive successes
  const isHotStreak = consecutiveSuccesses >= 3;
  // High level spotlight: +9 and up
  const isSpotlight = level >= 9;

  // Particle Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const render = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const spawnSparks = (type: 'strike' | 'break' | 'success' | 'jackpot') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const count = type === 'jackpot' ? 120 : type === 'break' ? 90 : 50;
    const newParticles: SparkParticle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (type === 'break' ? 8 : 6) + 1.5;

      let color = '#fbbf24';
      if (type === 'break') {
        color = Math.random() > 0.4 ? '#ef4444' : '#71717a';
      } else if (type === 'success') {
        color = Math.random() > 0.3 ? '#22c55e' : '#fde047';
      } else if (type === 'jackpot') {
        const colors = ['#f59e0b', '#38bdf8', '#a855f7', '#ec4899', '#ffffff'];
        color = colors[Math.floor(Math.random() * colors.length)];
      }

      newParticles.push({
        x: centerX + (Math.random() * 20 - 10),
        y: centerY + (Math.random() * 20 - 10),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === 'strike' ? 3 : 1),
        alpha: 1,
        size: Math.random() * (type === 'jackpot' ? 3.5 : 2.5) + 1.2,
        color,
        gravity: 0.15,
        decay: Math.random() * 0.02 + 0.015,
      });
    }

    particlesRef.current.push(...newParticles);
  };

  // Sync hammer animation & suspense visuals when forging
  useEffect(() => {
    if (isForging) {
      setShowHammer(true);
      setSuspenseActive(true);
      spawnSparks('strike');

      const hammerTimer = setTimeout(() => {
        setShowHammer(false);
      }, 450);

      return () => {
        clearTimeout(hammerTimer);
      };
    } else {
      setShowHammer(false);
      setSuspenseActive(false);
    }
  }, [isForging]);

  // Flash color when outcome resolves
  useEffect(() => {
    if (!lastResult) return;

    if (lastResult.outcome === 'break') {
      setFlashColor('rgba(239, 68, 68, 0.45)');
      spawnSparks('break');
    } else if (lastResult.outcome === 'jackpot') {
      setFlashColor('rgba(245, 158, 11, 0.45)');
      spawnSparks('jackpot');
    } else if (lastResult.outcome === 'success') {
      setFlashColor('rgba(34, 197, 94, 0.35)');
      spawnSparks('success');
    } else if (lastResult.outcome === 'damage') {
      setFlashColor('rgba(249, 115, 22, 0.35)');
    } else if (lastResult.hourglassSaved) {
      setFlashColor('rgba(168, 85, 247, 0.45)');
    } else {
      setFlashColor('rgba(161, 161, 170, 0.2)');
    }

    const timer = setTimeout(() => {
      setFlashColor(null);
    }, 450);

    return () => clearTimeout(timer);
  }, [lastResult]);

  const shakeClass =
    shakeType === 'intense' ? 'shake-intense' : shakeType === 'normal' ? 'shake-normal' : '';

  return (
    <div
      className={`relative w-full max-w-md mx-auto rounded-2xl overflow-hidden transition-all duration-500 border border-stone-800 bg-stone-950/90 shadow-2xl ${shakeClass} ${
        isDangerZone ? 'danger-stage-pulse border-red-900/60' : ''
      } ${isHotStreak ? 'hot-streak-stage border-amber-600/50' : ''}`}
    >
      {/* Background Forge Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900/80 via-stone-950 to-black pointer-events-none" />

      {/* Screen Flash on Results */}
      {flashColor && (
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={{ backgroundColor: flashColor }}
        />
      )}

      {/* Level +9 Spotlight Darkening */}
      {isSpotlight && (
        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_50%_45%,_transparent_28%,_rgba(0,0,0,0.85)_75%)]" />
      )}

      {/* Danger Zone Ambient Tint */}
      {isDangerZone && (
        <div className="absolute inset-0 pointer-events-none z-0 bg-red-950/20" />
      )}

      {/* Canvas for Particle Sparks */}
      <canvas
        ref={canvasRef}
        width={400}
        height={340}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* Header Tags: Weapon Name & Tier */}
      <div className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-lg font-bold tracking-wide text-stone-100">
              {getWeaponDisplayName(weaponId, level)}
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded border"
              style={{
                color: tier.glowColor,
                borderColor: `${tier.primaryColor}55`,
                backgroundColor: `${tier.secondaryColor}22`,
              }}
            >
              +{level}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
            <span>Tier {tier.tierIndex}: {tier.name}</span>
            <span>·</span>
            <span className="capitalize">{WEAPONS[weaponId].tag}</span>
            {WEAPONS[weaponId].breakModifier !== 0 && (
              <span className={WEAPONS[weaponId].breakModifier > 0 ? 'text-red-400' : 'text-emerald-400'}>
                ({WEAPONS[weaponId].breakModifier > 0 ? `+${WEAPONS[weaponId].breakModifier}%` : `${WEAPONS[weaponId].breakModifier}%`} break)
              </span>
            )}
          </div>
        </div>

        {/* Status Indicators (Streak, Danger) */}
        <div className="flex items-center gap-1.5">
          {isHotStreak && (
            <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-600/40 text-amber-400 text-xs px-2 py-1 rounded">
              <Flame className="w-3.5 h-3.5 fill-amber-500 animate-pulse" />
              <span className="font-semibold">{consecutiveSuccesses} Streak (+5%)</span>
            </div>
          )}
          {pityBonus > 0 && !isHotStreak && (
            <div className="flex items-center gap-1 bg-sky-950/60 border border-sky-600/40 text-sky-400 text-xs px-2 py-1 rounded">
              <Sparkles className="w-3 h-3" />
              <span>+{pityBonus}% Pity</span>
            </div>
          )}
        </div>
      </div>

      {/* Center Stage: Weapon & Anvil */}
      <div className="relative z-10 flex flex-col items-center justify-center py-4 min-h-[220px]">
        {/* Animated Hammer on Strike */}
        {showHammer && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-hammer">
            <svg width="120" height="120" viewBox="0 0 100 100" className="filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              {/* Wooden shaft */}
              <rect x="46" y="25" width="8" height="65" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              {/* Heavy steel head */}
              <rect x="25" y="10" width="50" height="24" rx="4" fill="#94a3b8" stroke="#334155" strokeWidth="2.5" />
              <rect x="20" y="8" width="10" height="28" rx="2" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
              <rect x="70" y="8" width="10" height="28" rx="2" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
              {/* Spark glow */}
              <circle cx="50" cy="22" r="6" fill="#f59e0b" className="animate-ping opacity-80" />
            </svg>
          </div>
        )}

        {/* Procedural SVG Weapon */}
        <WeaponVisual
          weaponId={weaponId}
          level={level}
          size={190}
          isPulsing={suspenseActive}
        />

        {/* Anvil Base Block */}
        <div className="w-48 h-5 mt-1 bg-gradient-to-t from-stone-900 to-stone-700 rounded-t-lg border-t border-stone-500/50 shadow-inner flex items-center justify-center">
          <div className="w-36 h-1 bg-stone-950/60 rounded-full" />
        </div>

        {/* Suspense status text */}
        {suspenseActive && (
          <div className="absolute bottom-6 flex items-center gap-2 bg-stone-900/90 border border-amber-500/40 px-3 py-1 rounded-full text-xs text-amber-300 font-medium animate-pulse">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Striking anvil...</span>
          </div>
        )}

        {/* Floating Outcome Result Text */}
        {!suspenseActive && lastResult && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none flex flex-col items-center animate-float-result">
            {lastResult.hourglassSaved && (
              <span className="font-cinzel text-lg font-black tracking-wider text-purple-300 drop-shadow-[0_2px_10px_rgba(168,85,247,0.8)]">
                HOURGLASS REWOUND!
              </span>
            )}
            {lastResult.surgeDelta > 0 && (
              <span className="font-cinzel text-xl font-black tracking-wider text-cyan-300 drop-shadow-[0_2px_12px_rgba(34,211,238,0.9)]">
                SURGE! +{lastResult.surgeDelta} LEVELS!
              </span>
            )}
            {lastResult.outcome === 'jackpot' && (
              <span className="font-cinzel text-2xl font-black tracking-wider text-amber-300 drop-shadow-[0_2px_14px_rgba(245,158,11,0.9)]">
                JACKPOT! +2
              </span>
            )}
            {lastResult.outcome === 'success' && (
              <span className="font-cinzel text-xl font-black tracking-wider text-emerald-400 drop-shadow-[0_2px_10px_rgba(34,197,94,0.8)]">
                SUCCESS! +1
              </span>
            )}
            {lastResult.outcome === 'damage' && !lastResult.hourglassSaved && (
              <span className="font-cinzel text-lg font-bold tracking-wider text-orange-400 drop-shadow-[0_2px_8px_rgba(249,115,22,0.8)]">
                DAMAGED! -1
              </span>
            )}
            {lastResult.outcome === 'break' && !lastResult.hourglassSaved && (
              <span className="font-cinzel text-2xl font-black tracking-wider text-red-500 drop-shadow-[0_2px_14px_rgba(239,68,68,0.9)]">
                SHATTERED TO +0!
              </span>
            )}
            {lastResult.outcome === 'nothing' && !lastResult.hourglassSaved && (
              <span className="font-cinzel text-base font-semibold tracking-wider text-stone-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                NOTHING HAPPENED
              </span>
            )}

            {/* Near Miss Banner */}
            {lastResult.nearMiss && (
              <div className="mt-1 bg-stone-900/90 border border-emerald-500/50 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold shadow">
                Phew! Dodged {lastResult.breakChanceAtRoll}% Break!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Odds Breakdown Grid */}
      <div className="relative z-10 px-4 py-2 bg-stone-900/80 border-t border-stone-800/80">
        <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs tabular-nums">
          {/* Success */}
          <div className="bg-stone-950/60 p-1.5 rounded border border-emerald-950">
            <div className="text-[10px] text-stone-400 uppercase tracking-tight">Success</div>
            <div className="font-bold text-emerald-400 text-sm">{odds.successChance}%</div>
          </div>

          {/* Break */}
          <div className={`p-1.5 rounded border ${isDangerZone ? 'bg-red-950/70 border-red-800 text-red-300 animate-pulse' : 'bg-stone-950/60 border-stone-800 text-red-400'}`}>
            <div className="text-[10px] text-stone-400 uppercase tracking-tight">Break</div>
            <div className="font-bold text-sm">{odds.breakChance}%</div>
          </div>

          {/* Damage */}
          <div className="bg-stone-950/60 p-1.5 rounded border border-stone-800">
            <div className="text-[10px] text-stone-400 uppercase tracking-tight">Damage</div>
            <div className="font-bold text-orange-400 text-sm">{odds.damageChance}%</div>
          </div>

          {/* Jackpot */}
          <div className="bg-stone-950/60 p-1.5 rounded border border-stone-800">
            <div className="text-[10px] text-stone-400 uppercase tracking-tight">Jackpot</div>
            <div className="font-bold text-amber-400 text-sm">{odds.jackpotChance}%</div>
          </div>

          {/* Nothing */}
          <div className="bg-stone-950/60 p-1.5 rounded border border-stone-800">
            <div className="text-[10px] text-stone-400 uppercase tracking-tight">Nothing</div>
            <div className="font-bold text-stone-400 text-sm">{odds.nothingChance}%</div>
          </div>
        </div>

        {/* Modifiers Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-stone-400 mt-2">
          {odds.dragonEmberActive && (
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Dragon Ember Active (100%)
            </span>
          )}
          {odds.whetstoneActive && (
            <span className="text-sky-400">Whetstone (Break ÷2)</span>
          )}
          {odds.anvilWardActive && (
            <span className="text-indigo-400">Anvil Ward (0% Loss)</span>
          )}
          {odds.charmBonus > 0 && (
            <span className="text-emerald-400">+10% Charm</span>
          )}
          {odds.hourglassActive && (
            <span className="text-purple-400">Hourglass Ready</span>
          )}
        </div>
      </div>

      {/* Main Interactive Controls: Forge & Sell */}
      <div className="relative z-10 p-4 bg-stone-950 border-t border-stone-800 flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-3">
          {/* Forge Button */}
          <button
            onClick={onForge}
            disabled={isForging || level >= 20}
            className={`relative py-3.5 px-4 rounded-xl font-cinzel font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 ${
              isDangerZone
                ? 'bg-gradient-to-r from-red-700 via-red-600 to-red-800 hover:from-red-600 hover:to-red-700 text-white shadow-red-900/50 animate-pulse border border-red-500'
                : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-amber-900/40 border border-amber-400/50'
            }`}
          >
            {isDangerZone ? <ShieldAlert className="w-4 h-4 text-white" /> : <Zap className="w-4 h-4" />}
            <span>{level >= 20 ? 'Max Level +20' : 'Forge Weapon'}</span>
          </button>

          {/* Sell / Cash Out Button */}
          <button
            onClick={onSell}
            disabled={isForging || level === 0}
            className="py-3.5 px-4 rounded-xl font-cinzel font-bold text-sm tracking-wider uppercase bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-600/40 shadow-lg hover:border-amber-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center justify-center active:scale-95"
          >
            <div className="flex items-center gap-1.5 text-xs text-amber-200">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Cash Out</span>
            </div>
            <div className="font-mono text-sm text-amber-400 font-bold tabular-nums">
              +{saleInfo.salePrice.toLocaleString()}g
            </div>
          </button>
        </div>

        {/* Sell streak bonus info */}
        {level > 0 && (
          <div className="text-center text-[11px] text-stone-400 flex items-center justify-center gap-2">
            <span>Base: {saleInfo.baseValue.toLocaleString()}g</span>
            <span>·</span>
            <span>Mult: ×{saleInfo.weaponMultiplier}</span>
            {consecutiveSuccesses > 0 && (
              <>
                <span>·</span>
                <span className="text-amber-400 font-medium">
                  Streak Bonus: +{Math.round((saleInfo.streakMultiplier - 1) * 100)}%
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
