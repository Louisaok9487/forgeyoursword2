import React from 'react';
import { ItemId } from '../types/game';
import { ITEMS } from '../utils/gameLogic';
import { sound } from '../utils/audio';
import { Shield, Sparkles, Hourglass, Flame, Wrench, Check } from 'lucide-react';

interface ItemsPanelProps {
  gold: number;
  inventory: Record<ItemId, number>;
  equipped: Record<ItemId, boolean>;
  onToggleEquipped: (itemId: ItemId) => void;
  onBuyItem: (itemId: ItemId) => void;
  isForging: boolean;
}

export const ItemsPanel: React.FC<ItemsPanelProps> = ({
  gold,
  inventory,
  equipped,
  onToggleEquipped,
  onBuyItem,
  isForging,
}) => {
  const getItemIcon = (id: ItemId) => {
    switch (id) {
      case 'whetstone':
        return <Wrench className="w-4 h-4 text-sky-400" />;
      case 'anvilWard':
        return <Shield className="w-4 h-4 text-indigo-400" />;
      case 'charm':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'hourglass':
        return <Hourglass className="w-4 h-4 text-purple-400" />;
      case 'dragonEmber':
        return <Flame className="w-4 h-4 text-orange-400" />;
    }
  };

  const itemOrder: ItemId[] = ['charm', 'whetstone', 'anvilWard', 'hourglass', 'dragonEmber'];

  return (
    <div className="w-full max-w-md mx-auto mt-4 p-4 rounded-2xl bg-stone-950/80 border border-stone-800 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-cinzel text-sm font-bold tracking-wider uppercase text-stone-200">
          Protective Relics & Charms
        </h2>
        <span className="text-xs text-stone-400">Toggle before strike</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {itemOrder.map((id) => {
          const item = ITEMS[id];
          const count = inventory[id] || 0;
          const isEquipped = (equipped[id] && count > 0) || false;
          const canAfford = gold >= item.price;

          return (
            <div
              key={id}
              className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                isEquipped
                  ? 'bg-stone-900/90 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                  : 'bg-stone-950/60 border-stone-800/80'
              }`}
            >
              {/* Left: Checkbox / Toggle */}
              <button
                type="button"
                disabled={isForging || count === 0}
                onClick={() => {
                  sound.playClick();
                  onToggleEquipped(id);
                }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  count === 0
                    ? 'opacity-30 cursor-not-allowed bg-stone-900 border border-stone-800'
                    : isEquipped
                    ? 'bg-amber-600 text-stone-950 border border-amber-400'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-700'
                }`}
                title={count === 0 ? 'Buy item to equip' : 'Toggle item'}
              >
                {isEquipped ? <Check className="w-5 h-5 stroke-[3]" /> : getItemIcon(id)}
              </button>

              {/* Middle: Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-200 truncate">{item.name}</span>
                  <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-stone-800 text-stone-300">
                    ×{count}
                  </span>
                </div>
                <div className="text-[11px] text-amber-300 font-medium">{item.effect}</div>
                <div className="text-[10px] text-stone-400 truncate">{item.consumptionNote}</div>
              </div>

              {/* Right: Buy Button */}
              <button
                type="button"
                disabled={isForging || !canAfford}
                onClick={() => {
                  sound.playCoin();
                  onBuyItem(id);
                }}
                className="shrink-0 px-3 py-2 rounded-lg font-mono text-xs font-semibold bg-stone-900 hover:bg-stone-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-stone-700 hover:border-amber-500/60 text-stone-200 flex flex-col items-center justify-center min-w-[68px]"
              >
                <span className="text-[10px] text-stone-400 uppercase">Buy</span>
                <span className="text-amber-400 font-bold tabular-nums">{item.price}g</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
