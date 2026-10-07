import React, { useEffect, useRef } from 'react';
import { WeaponId } from '../types/game';
import { WeaponVisual } from './WeaponVisual';
import { getWeaponDisplayName, MILESTONE_REWARDS } from '../utils/gameLogic';
import { Award, Coins } from 'lucide-react';

interface MilestoneModalProps {
  weaponId: WeaponId;
  milestoneLevel: number; // 10, 15, or 20
  onDismiss: () => void;
}

interface CoinParticle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  rotation: number;
  vRot: number;
  size: number;
  color: string;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  weaponId,
  milestoneLevel,
  onDismiss,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reward = MILESTONE_REWARDS[milestoneLevel] || 0;

  // Auto-dismiss after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 7000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  // Coin shower particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let active = true;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const coins: CoinParticle[] = [];
    const coinColors = ['#f59e0b', '#fbbf24', '#fde047', '#d97706'];

    for (let i = 0; i < 90; i++) {
      coins.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 400,
        vx: (Math.random() - 0.5) * 2.5,
        vy: Math.random() * 4 + 3.5,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 8 + 8,
        color: coinColors[Math.floor(Math.random() * coinColors.length)],
      });
    }

    const render = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const coin of coins) {
        coin.x += coin.vx;
        coin.y += coin.vy;
        coin.rotation += coin.vRot;

        if (coin.y > canvas.height + 30) {
          coin.y = -20;
          coin.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(coin.x, coin.y);
        ctx.rotate(coin.rotation);
        ctx.fillStyle = coin.color;
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.ellipse(0, 0, coin.size, coin.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer select-none animate-fadeIn"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      <div
        className="relative z-20 max-w-sm w-full p-6 rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.4)] text-center flex flex-col items-center"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
      >
        {/* Milestone Badge */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 p-0.5 shadow-lg flex items-center justify-center mb-3">
          <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-400 animate-bounce" />
          </div>
        </div>

        <div className="text-xs uppercase font-cinzel tracking-widest text-amber-400 font-bold">
          Master Blacksmith Milestone
        </div>

        <h2 className="font-cinzel text-2xl font-black text-white mt-1">
          Forged to +{milestoneLevel}!
        </h2>

        {/* Large Weapon Graphic */}
        <div className="my-4 relative">
          <WeaponVisual weaponId={weaponId} level={milestoneLevel} size={220} />
        </div>

        <div className="text-sm font-semibold text-stone-300">
          {getWeaponDisplayName(weaponId, milestoneLevel)}
        </div>

        {/* Reward Grant Box */}
        <div className="mt-4 px-4 py-2.5 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="text-xs text-stone-200">Milestone Bounty Granted:</span>
          <span className="font-mono text-base font-black text-amber-400 tabular-nums">
            +{reward.toLocaleString()}g
          </span>
        </div>

        <p className="mt-4 text-xs text-stone-400">
          Tap anywhere to claim & resume forging (auto-dismiss in 7s)
        </p>
      </div>
    </div>
  );
};
