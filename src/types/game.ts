export type WeaponId = 'sword' | 'hammer' | 'axe' | 'spear' | 'club' | 'staff';

export interface WeaponInfo {
  id: WeaponId;
  name: string;
  saleMultiplier: number;
  breakModifier: number;
  tag: string;
  description: string;
}

export type ItemId = 'whetstone' | 'anvilWard' | 'charm' | 'hourglass' | 'dragonEmber';

export interface ItemInfo {
  id: ItemId;
  name: string;
  price: number;
  effect: string;
  description: string;
  consumptionNote: string;
}

export type OutcomeType = 'jackpot' | 'success' | 'nothing' | 'damage' | 'break';

export interface ForgeResult {
  outcome: OutcomeType;
  levelDelta: number;
  surgeDelta: number;
  hourglassSaved: boolean;
  nearMiss: boolean;
  finalLevel: number;
  breakChanceAtRoll: number;
  successChanceAtRoll: number;
  damageChanceAtRoll: number;
}

export interface PlayerStats {
  totalForges: number;
  totalSuccesses: number;
  totalJackpots: number;
  totalDamages: number;
  totalBreaks: number;
  totalSurges: number;
  totalHourglassSaves: number;
  highestLevel: number;
  totalGoldEarned: number;
  totalGoldSpent: number;
  totalSales: number;
}

export interface GameState {
  gold: number;
  weaponId: WeaponId;
  level: number;
  inventory: Record<ItemId, number>;
  equipped: Record<ItemId, boolean>;
  pityBonus: number; // 0 to 10 (%)
  consecutiveSuccesses: number;
  milestonesClaimed: Record<string, boolean>; // e.g. "sword_10": true
  stats: PlayerStats;
}

export interface TierInfo {
  tierIndex: number;
  minLevel: number;
  maxLevel: number;
  name: string;
  clubName: string;
  staffName: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  hasGem: boolean;
  hasRunes: boolean;
  hasFlames: boolean;
  hasHalo: boolean;
  hasDiamonds: boolean;
  hasLightning: boolean;
  hasColorCycle: boolean;
}
