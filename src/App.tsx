/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  GameState,
  WeaponId,
  ItemId,
  ForgeResult,
} from './types/game';
import {
  loadSavedState,
  saveState,
  executeForgeRoll,
  calculateSalePrice,
  INITIAL_GAME_STATE,
  MILESTONE_REWARDS,
  ITEMS,
} from './utils/gameLogic';
import { sound } from './utils/audio';
import { HeaderBar } from './components/HeaderBar';
import { ForgeAnvil } from './components/ForgeAnvil';
import { ItemsPanel } from './components/ItemsPanel';
import { WeaponsDrawer } from './components/WeaponsDrawer';
import { MilestoneModal } from './components/MilestoneModal';
import { RulesModal } from './components/RulesModal';
import { StatsModal } from './components/StatsModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadSavedState());
  const [activeTab, setActiveTab] = useState<'forge' | 'arsenal' | 'items'>('forge');
  const [isForging, setIsForging] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<ForgeResult | null>(null);
  const [shakeType, setShakeType] = useState<'none' | 'normal' | 'intense'>('none');
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Celebration milestone modal
  const [milestoneCelebration, setMilestoneCelebration] = useState<{
    weaponId: WeaponId;
    milestoneLevel: number;
  } | null>(null);

  // Informational modals
  const [showRules, setShowRules] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Save on changes
  useEffect(() => {
    saveState(gameState);
  }, [gameState]);

  // Audio mute toggle
  const handleToggleMute = useCallback(() => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  }, []);

  // Purchase item
  const handleBuyItem = useCallback((itemId: ItemId) => {
    const item = ITEMS[itemId];
    setGameState((prev) => {
      if (prev.gold < item.price) return prev;
      const count = prev.inventory[itemId] || 0;
      const newInventory = {
        ...prev.inventory,
        [itemId]: count + 1,
      };
      // Auto-equip if previously 0
      const newEquipped = {
        ...prev.equipped,
        [itemId]: count === 0 ? true : prev.equipped[itemId],
      };
      return {
        ...prev,
        gold: prev.gold - item.price,
        inventory: newInventory,
        equipped: newEquipped,
        stats: {
          ...prev.stats,
          totalGoldSpent: prev.stats.totalGoldSpent + item.price,
        },
      };
    });
  }, []);

  // Toggle item equipped
  const handleToggleEquipped = useCallback((itemId: ItemId) => {
    setGameState((prev) => {
      const count = prev.inventory[itemId] || 0;
      if (count <= 0) return prev;
      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [itemId]: !prev.equipped[itemId],
        },
      };
    });
  }, []);

  // Switch weapon (only allowed at +0)
  const handleSelectWeapon = useCallback((weaponId: WeaponId) => {
    setGameState((prev) => {
      if (prev.level !== 0) return prev;
      return {
        ...prev,
        weaponId,
      };
    });
    setActiveTab('forge');
  }, []);

  // Cash out / sell
  const handleSell = useCallback(() => {
    if (isForging || gameState.level === 0) return;

    const saleInfo = calculateSalePrice(
      gameState.level,
      gameState.weaponId,
      gameState.consecutiveSuccesses
    );

    sound.playCoin();

    setGameState((prev) => ({
      ...prev,
      gold: prev.gold + saleInfo.salePrice,
      level: 0,
      consecutiveSuccesses: 0, // streak resets on sell
      stats: {
        ...prev.stats,
        totalSales: prev.stats.totalSales + 1,
        totalGoldEarned: prev.stats.totalGoldEarned + saleInfo.salePrice,
      },
    }));

    setLastResult(null);
  }, [isForging, gameState.level, gameState.weaponId, gameState.consecutiveSuccesses]);

  // Main Forge Action
  const handleForge = useCallback(() => {
    if (isForging || gameState.level >= 20) return;

    setIsForging(true);
    setShakeType('none');

    // 1. Hammer strike sound & visual
    sound.playHammerStrike();

    // 2. Suspense duration = 550ms + 90ms per level
    const suspenseMs = 550 + 90 * gameState.level;
    sound.playSuspenseDrone(suspenseMs);

    // 3. Heartbeat at level 8+ during suspense
    if (gameState.level >= 8) {
      sound.startHeartbeat();
    }

    // 4. Calculate roll
    const result = executeForgeRoll(
      gameState.level,
      gameState.weaponId,
      gameState.pityBonus,
      gameState.consecutiveSuccesses,
      gameState.equipped,
      gameState.inventory
    );

    // 5. Deduct items
    const nextInventory = { ...gameState.inventory };
    const nextEquipped = { ...gameState.equipped };

    const consumeItem = (id: ItemId) => {
      if (nextEquipped[id] && nextInventory[id] > 0) {
        nextInventory[id] -= 1;
        if (nextInventory[id] <= 0) {
          nextEquipped[id] = false;
        }
      }
    };

    // Standard per-attempt items
    consumeItem('whetstone');
    consumeItem('anvilWard');
    consumeItem('charm');
    consumeItem('dragonEmber');

    // Hourglass only consumed if triggered!
    if (result.hourglassSaved) {
      consumeItem('hourglass');
    }

    // Wait for suspense pause to finish
    setTimeout(() => {
      sound.stopHeartbeat();

      // Screen shake
      if (result.outcome === 'break' && !result.hourglassSaved) {
        setShakeType('intense');
      } else if (result.outcome === 'damage' && !result.hourglassSaved) {
        setShakeType('normal');
      }

      // Audio feedback
      if (result.hourglassSaved) {
        sound.playHourglass();
      } else if (result.outcome === 'jackpot') {
        sound.playJackpot();
      } else if (result.outcome === 'success') {
        if (result.surgeDelta > 0) {
          sound.playSurge();
        } else {
          sound.playSuccess();
        }
      } else if (result.outcome === 'damage') {
        sound.playDamage();
      } else if (result.outcome === 'break') {
        sound.playBreak();
      } else {
        sound.playNothing();
      }

      setLastResult(result);

      // State calculation
      setGameState((prev) => {
        const isSuccessType = result.outcome === 'success' || result.outcome === 'jackpot';

        // Pity: +2% on any non-success, capped at +10%. Resets to 0 on any success.
        const newPity = isSuccessType ? 0 : Math.min(10, prev.pityBonus + 2);

        // Hot streak: resets on non-success
        const newConsecutive = isSuccessType ? prev.consecutiveSuccesses + 1 : 0;

        // Check Milestone Unlocks (+10, +15, +20)
        let newlyUnlockedMilestone: number | null = null;
        let milestoneBounty = 0;
        const newMilestones = { ...prev.milestonesClaimed };

        const milestonesToCheck = [10, 15, 20];
        for (const m of milestonesToCheck) {
          const key = `${prev.weaponId}_${m}`;
          if (result.finalLevel >= m && !newMilestones[key]) {
            newMilestones[key] = true;
            milestoneBounty += MILESTONE_REWARDS[m];
            newlyUnlockedMilestone = m;
          }
        }

        if (newlyUnlockedMilestone !== null) {
          setTimeout(() => {
            sound.playFanfare();
            setMilestoneCelebration({
              weaponId: prev.weaponId,
              milestoneLevel: newlyUnlockedMilestone!,
            });
          }, 350);
        }

        const newStats = {
          ...prev.stats,
          totalForges: prev.stats.totalForges + 1,
          totalSuccesses: prev.stats.totalSuccesses + (result.outcome === 'success' ? 1 : 0),
          totalJackpots: prev.stats.totalJackpots + (result.outcome === 'jackpot' ? 1 : 0),
          totalDamages:
            prev.stats.totalDamages +
            (result.outcome === 'damage' && !result.hourglassSaved ? 1 : 0),
          totalBreaks:
            prev.stats.totalBreaks +
            (result.outcome === 'break' && !result.hourglassSaved ? 1 : 0),
          totalSurges: prev.stats.totalSurges + (result.surgeDelta > 0 ? 1 : 0),
          totalHourglassSaves:
            prev.stats.totalHourglassSaves + (result.hourglassSaved ? 1 : 0),
          highestLevel: Math.max(prev.stats.highestLevel, result.finalLevel),
          totalGoldEarned: prev.stats.totalGoldEarned + milestoneBounty,
        };

        return {
          ...prev,
          gold: prev.gold + milestoneBounty,
          level: result.finalLevel,
          inventory: nextInventory,
          equipped: nextEquipped,
          pityBonus: newPity,
          consecutiveSuccesses: newConsecutive,
          milestonesClaimed: newMilestones,
          stats: newStats,
        };
      });

      // Clear shake after animation completes
      setTimeout(() => {
        setShakeType('none');
        setIsForging(false);
      }, 550);
    }, suspenseMs);
  }, [isForging, gameState]);

  // Reset Save Data
  const handleResetSave = useCallback(() => {
    sound.playClick();
    setGameState(INITIAL_GAME_STATE);
    setLastResult(null);
    setShakeType('none');
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white">
      {/* Top Header */}
      <HeaderBar
        gold={gameState.gold}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRules={() => setShowRules(true)}
        onOpenStats={() => setShowStats(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Game Container */}
      <main className="flex-1 w-full max-w-lg mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col justify-start">
        {activeTab === 'forge' && (
          <div className="space-y-4">
            {/* The Central Anvil & Weapon */}
            <ForgeAnvil
              level={gameState.level}
              weaponId={gameState.weaponId}
              gold={gameState.gold}
              consecutiveSuccesses={gameState.consecutiveSuccesses}
              pityBonus={gameState.pityBonus}
              equipped={gameState.equipped}
              inventory={gameState.inventory}
              isForging={isForging}
              onForge={handleForge}
              onSell={handleSell}
              lastResult={lastResult}
              shakeType={shakeType}
            />

            {/* Quick Protective Items toggle under the anvil */}
            <ItemsPanel
              gold={gameState.gold}
              inventory={gameState.inventory}
              equipped={gameState.equipped}
              onToggleEquipped={handleToggleEquipped}
              onBuyItem={handleBuyItem}
              isForging={isForging}
            />
          </div>
        )}

        {activeTab === 'arsenal' && (
          <div>
            <WeaponsDrawer
              currentWeaponId={gameState.weaponId}
              level={gameState.level}
              onSelectWeapon={handleSelectWeapon}
              milestonesClaimed={gameState.milestonesClaimed}
              isForging={isForging}
            />
          </div>
        )}

        {activeTab === 'items' && (
          <div>
            <ItemsPanel
              gold={gameState.gold}
              inventory={gameState.inventory}
              equipped={gameState.equipped}
              onToggleEquipped={handleToggleEquipped}
              onBuyItem={handleBuyItem}
              isForging={isForging}
            />
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full py-4 text-center text-xs text-stone-500 border-t border-stone-900">
        <p>Forge Your Sword · Virtual gold upgrade simulation · No real money</p>
      </footer>

      {/* Milestone Fanfare Modal (+10, +15, +20) */}
      {milestoneCelebration && (
        <MilestoneModal
          weaponId={milestoneCelebration.weaponId}
          milestoneLevel={milestoneCelebration.milestoneLevel}
          onDismiss={() => setMilestoneCelebration(null)}
        />
      )}

      {/* Compendium / Rules Modal */}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}

      {/* Career Stats Modal */}
      {showStats && (
        <StatsModal
          stats={gameState.stats}
          onClose={() => setShowStats(false)}
          onResetSave={handleResetSave}
        />
      )}
    </div>
  );
}
