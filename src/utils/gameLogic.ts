import {
  WeaponId,
  WeaponInfo,
  ItemId,
  ItemInfo,
  GameState,
  TierInfo,
  ForgeResult,
  OutcomeType,
} from '../types/game';

export const WEAPONS: Record<WeaponId, WeaponInfo> = {
  sword: {
    id: 'sword',
    name: 'Longsword',
    saleMultiplier: 1.0,
    breakModifier: 0,
    tag: 'Balanced',
    description: 'Standard steel forged for knights. Reliable balance between risk and payout.',
  },
  hammer: {
    id: 'hammer',
    name: 'War Hammer',
    saleMultiplier: 1.3,
    breakModifier: 4,
    tag: 'Heavy',
    description: 'Crushing mass yields high gold value, but brittle shock shatters steel faster (+4% break).',
  },
  axe: {
    id: 'axe',
    name: 'Battle Axe',
    saleMultiplier: 1.15,
    breakModifier: 2,
    tag: 'Bold',
    description: 'Razor-edged double crescent. Solid reward boost with modest risk (+2% break).',
  },
  spear: {
    id: 'spear',
    name: 'Winged Spear',
    saleMultiplier: 0.9,
    breakModifier: -3,
    tag: 'Steady',
    description: 'Long defensive haft that deflects anvil cracks (-3% break). Safe climbing.',
  },
  club: {
    id: 'club',
    name: 'Trunk Club',
    saleMultiplier: 0.7,
    breakModifier: -5,
    tag: 'Very Safe',
    description: 'Dense gnarled heartwood. Low sale price, but incredibly resilient against destruction (-5% break).',
  },
  staff: {
    id: 'staff',
    name: 'Mage Staff',
    saleMultiplier: 1.6,
    breakModifier: 7,
    tag: 'Volatile',
    description: 'Infused with chaotic arcane essence. Huge gold multiplier with terrifying shatter hazard (+7% break).',
  },
};

export const ITEMS: Record<ItemId, ItemInfo> = {
  whetstone: {
    id: 'whetstone',
    name: 'Blessed Whetstone',
    price: 60,
    effect: 'Halves break chance',
    description: 'Holy mineral oils smooth microscopic fissures in the blade.',
    consumptionNote: 'Consumed per forge attempt when equipped.',
  },
  anvilWard: {
    id: 'anvilWard',
    name: 'Anvil Ward',
    price: 80,
    effect: 'Damage chance becomes 0%',
    description: 'A runic sigil stamped on the anvil face prevents weapon level loss.',
    consumptionNote: 'Consumed per forge attempt when equipped.',
  },
  charm: {
    id: 'charm',
    name: 'Lucky Charm',
    price: 50,
    effect: '+10% Success chance',
    description: 'A braided talisman of mountain heather that draws favorable sparks.',
    consumptionNote: 'Consumed per forge attempt when equipped.',
  },
  hourglass: {
    id: 'hourglass',
    name: 'Time Hourglass',
    price: 150,
    effect: 'Rewinds damage or break',
    description: 'Sands of eternity reverse a fatal strike, keeping the weapon intact.',
    consumptionNote: 'Consumed ONLY when it triggers to save your weapon.',
  },
  dragonEmber: {
    id: 'dragonEmber',
    name: 'Dragon Ember',
    price: 400,
    effect: '100% Guaranteed Success',
    description: 'A roaring ancient core that guarantees a flawless level upgrade.',
    consumptionNote: 'Consumed per forge attempt when equipped. (No jackpot, damage or break).',
  },
};

export const BASE_VALUES: number[] = [
  5, 15, 35, 70, 120, 200, 330, 520, 820, 1300, 2100, 3400, 5500, 9000, 15000, 30000, 60000, 110000, 200000, 400000, 1000000,
];

// Levels 0 to 19 base odds (%)
export const BASE_SUCCESS_RATES: number[] = [
  90, 85, 80, 75, 70, 62, 55, 48, 42, 36, 30, 25, 20, 15, 10, 8, 6, 5, 4, 3,
];

export const BASE_BREAK_RATES: number[] = [
  0, 0, 0, 3, 5, 8, 11, 14, 18, 22, 26, 30, 34, 38, 42, 45, 48, 50, 52, 55,
];

export const BASE_DAMAGE_RATES: number[] = [
  0, 0, 5, 8, 10, 12, 14, 16, 16, 16, 16, 16, 16, 16, 16, 18, 18, 20, 20, 22,
];

export const BASE_JACKPOT_RATES: number[] = [
  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0,
];

export const TIERS: TierInfo[] = [
  {
    tierIndex: 0,
    minLevel: 0,
    maxLevel: 2,
    name: 'Rusty',
    clubName: 'Rough',
    staffName: 'Apprentice',
    primaryColor: '#8a654c',
    secondaryColor: '#5c4333',
    glowColor: '#a87954',
    hasGem: false,
    hasRunes: false,
    hasFlames: false,
    hasHalo: false,
    hasDiamonds: false,
    hasLightning: false,
    hasColorCycle: false,
  },
  {
    tierIndex: 1,
    minLevel: 3,
    maxLevel: 5,
    name: 'Iron',
    clubName: 'Banded',
    staffName: 'Carved',
    primaryColor: '#9ca3af',
    secondaryColor: '#4b5563',
    glowColor: '#cbd5e1',
    hasGem: false,
    hasRunes: false,
    hasFlames: false,
    hasHalo: false,
    hasDiamonds: false,
    hasLightning: false,
    hasColorCycle: false,
  },
  {
    tierIndex: 2,
    minLevel: 6,
    maxLevel: 8,
    name: 'Steel',
    clubName: 'Spiked',
    staffName: 'Runed',
    primaryColor: '#38bdf8',
    secondaryColor: '#0284c7',
    glowColor: '#7dd3fc',
    hasGem: true,
    hasRunes: false,
    hasFlames: false,
    hasHalo: false,
    hasDiamonds: false,
    hasLightning: false,
    hasColorCycle: false,
  },
  {
    tierIndex: 3,
    minLevel: 9,
    maxLevel: 11,
    name: 'Mythril',
    clubName: 'Heavy Oak',
    staffName: 'Leyline',
    primaryColor: '#a855f7',
    secondaryColor: '#7e22ce',
    glowColor: '#c084fc',
    hasGem: true,
    hasRunes: true,
    hasFlames: false,
    hasHalo: false,
    hasDiamonds: false,
    hasLightning: false,
    hasColorCycle: false,
  },
  {
    tierIndex: 4,
    minLevel: 12,
    maxLevel: 14,
    name: 'Dragonbone',
    clubName: 'Magma',
    staffName: 'Dragonfang',
    primaryColor: '#f97316',
    secondaryColor: '#c2410c',
    glowColor: '#fb923c',
    hasGem: true,
    hasRunes: true,
    hasFlames: true,
    hasHalo: false,
    hasDiamonds: false,
    hasLightning: false,
    hasColorCycle: false,
  },
  {
    tierIndex: 5,
    minLevel: 15,
    maxLevel: 16,
    name: 'Celestial',
    clubName: 'Ancient Wood',
    staffName: 'Astral',
    primaryColor: '#facc15',
    secondaryColor: '#ca8a04',
    glowColor: '#fde047',
    hasGem: true,
    hasRunes: true,
    hasFlames: true,
    hasHalo: true,
    hasDiamonds: false,
    hasLightning: false,
    hasColorCycle: false,
  },
  {
    tierIndex: 6,
    minLevel: 17,
    maxLevel: 19,
    name: 'Mythic',
    clubName: 'World Tree',
    staffName: 'Void',
    primaryColor: '#ec4899',
    secondaryColor: '#be185d',
    glowColor: '#f472b6',
    hasGem: true,
    hasRunes: true,
    hasFlames: true,
    hasHalo: true,
    hasDiamonds: true,
    hasLightning: false,
    hasColorCycle: false,
  },
  {
    tierIndex: 7,
    minLevel: 20,
    maxLevel: 20,
    name: 'Godforged',
    clubName: 'Yggdrasil',
    staffName: 'Cosmic Singularity',
    primaryColor: '#22d3ee',
    secondaryColor: '#0891b2',
    glowColor: '#67e8f9',
    hasGem: true,
    hasRunes: true,
    hasFlames: true,
    hasHalo: true,
    hasDiamonds: true,
    hasLightning: true,
    hasColorCycle: true,
  },
];

export function getTierForLevel(level: number): TierInfo {
  const clamped = Math.max(0, Math.min(20, level));
  for (const tier of TIERS) {
    if (clamped >= tier.minLevel && clamped <= tier.maxLevel) {
      return tier;
    }
  }
  return TIERS[TIERS.length - 1];
}

export function getWeaponDisplayName(weaponId: WeaponId, level: number): string {
  const tier = getTierForLevel(level);
  let prefix = tier.name;
  if (weaponId === 'club') {
    prefix = tier.clubName;
  } else if (weaponId === 'staff') {
    prefix = tier.staffName;
  }
  const baseName = WEAPONS[weaponId].name;
  return `${prefix} ${baseName}`;
}

export interface CalculatedOdds {
  successChance: number;
  breakChance: number;
  damageChance: number;
  jackpotChance: number;
  nothingChance: number;
  baseSuccess: number;
  baseBreak: number;
  baseDamage: number;
  baseJackpot: number;
  pityBonus: number;
  hotStreakBonus: number;
  charmBonus: number;
  whetstoneActive: boolean;
  anvilWardActive: boolean;
  dragonEmberActive: boolean;
  hourglassActive: boolean;
}

export function calculateOdds(
  level: number,
  weaponId: WeaponId,
  pityBonus: number,
  consecutiveSuccesses: number,
  equipped: Record<ItemId, boolean>,
  inventory: Record<ItemId, number>
): CalculatedOdds {
  const safeLevel = Math.max(0, Math.min(19, level));

  const hasWhetstone = (equipped.whetstone && inventory.whetstone > 0) || false;
  const hasWard = (equipped.anvilWard && inventory.anvilWard > 0) || false;
  const hasCharm = (equipped.charm && inventory.charm > 0) || false;
  const hasEmber = (equipped.dragonEmber && inventory.dragonEmber > 0) || false;
  const hasHourglass = (equipped.hourglass && inventory.hourglass > 0) || false;

  const baseSuccess = BASE_SUCCESS_RATES[safeLevel];
  const baseBreak = BASE_BREAK_RATES[safeLevel];
  const baseDamage = BASE_DAMAGE_RATES[safeLevel];
  const baseJackpot = BASE_JACKPOT_RATES[safeLevel];

  if (hasEmber) {
    return {
      successChance: 100,
      breakChance: 0,
      damageChance: 0,
      jackpotChance: 0,
      nothingChance: 0,
      baseSuccess,
      baseBreak,
      baseDamage,
      baseJackpot,
      pityBonus,
      hotStreakBonus: 0,
      charmBonus: 0,
      whetstoneActive: false,
      anvilWardActive: false,
      dragonEmberActive: true,
      hourglassActive: hasHourglass,
    };
  }

  // Break rate: base + weapon modifier ONLY IF baseBreak > 0
  let breakChance = baseBreak;
  if (baseBreak > 0) {
    const weaponMod = WEAPONS[weaponId].breakModifier;
    breakChance = Math.max(0, breakChance + weaponMod);
  }
  if (hasWhetstone && breakChance > 0) {
    breakChance = Math.floor(breakChance * 0.5);
  }

  // Damage rate
  let damageChance = baseDamage;
  if (hasWard) {
    damageChance = 0;
  }

  // Jackpot
  const jackpotChance = baseJackpot;

  // Success modifiers
  const pityVal = Math.min(10, Math.max(0, pityBonus));
  const hotStreakVal = consecutiveSuccesses >= 3 ? 5 : 0;
  const charmVal = hasCharm ? 10 : 0;

  let successChance = baseSuccess + pityVal + hotStreakVal + charmVal;

  // Cap success so total never exceeds 100%
  const nonSuccessTotal = breakChance + damageChance + jackpotChance;
  if (successChance + nonSuccessTotal > 100) {
    successChance = Math.max(0, 100 - nonSuccessTotal);
  }

  const remainder = 100 - (successChance + nonSuccessTotal);
  const nothingChance = Math.max(0, remainder);

  return {
    successChance,
    breakChance,
    damageChance,
    jackpotChance,
    nothingChance,
    baseSuccess,
    baseBreak,
    baseDamage,
    baseJackpot,
    pityBonus: pityVal,
    hotStreakBonus: hotStreakVal,
    charmBonus: charmVal,
    whetstoneActive: hasWhetstone,
    anvilWardActive: hasWard,
    dragonEmberActive: false,
    hourglassActive: hasHourglass,
  };
}

export function calculateSalePrice(
  level: number,
  weaponId: WeaponId,
  consecutiveSuccesses: number
): { salePrice: number; baseValue: number; streakMultiplier: number; weaponMultiplier: number } {
  const safeLevel = Math.max(0, Math.min(20, level));
  const baseValue = BASE_VALUES[safeLevel];
  const weaponMultiplier = WEAPONS[weaponId].saleMultiplier;
  const streakBonus = Math.min(0.50, consecutiveSuccesses * 0.05);
  const streakMultiplier = 1 + streakBonus;
  const salePrice = Math.round(baseValue * weaponMultiplier * streakMultiplier);

  return {
    salePrice,
    baseValue,
    streakMultiplier,
    weaponMultiplier,
  };
}

export function executeForgeRoll(
  currentLevel: number,
  weaponId: WeaponId,
  pityBonus: number,
  consecutiveSuccesses: number,
  equipped: Record<ItemId, boolean>,
  inventory: Record<ItemId, number>
): ForgeResult {
  const odds = calculateOdds(
    currentLevel,
    weaponId,
    pityBonus,
    consecutiveSuccesses,
    equipped,
    inventory
  );

  const roll = Math.random() * 100;
  let rawOutcome: OutcomeType = 'nothing';

  const thresholdJackpot = odds.jackpotChance;
  const thresholdSuccess = thresholdJackpot + odds.successChance;
  const thresholdDamage = thresholdSuccess + odds.damageChance;
  const thresholdBreak = thresholdDamage + odds.breakChance;

  if (roll < thresholdJackpot) {
    rawOutcome = 'jackpot';
  } else if (roll < thresholdSuccess) {
    rawOutcome = 'success';
  } else if (roll < thresholdDamage) {
    rawOutcome = 'damage';
  } else if (roll < thresholdBreak) {
    rawOutcome = 'break';
  } else {
    rawOutcome = 'nothing';
  }

  // Hourglass defense
  let hourglassSaved = false;
  let outcome = rawOutcome;

  if ((outcome === 'break' || outcome === 'damage') && odds.hourglassActive) {
    hourglassSaved = true;
    outcome = 'nothing';
  }

  // Level computation
  let levelDelta = 0;
  if (outcome === 'jackpot') {
    levelDelta = 2;
  } else if (outcome === 'success') {
    levelDelta = 1;
  } else if (outcome === 'damage') {
    levelDelta = -1;
  } else if (outcome === 'break') {
    levelDelta = -currentLevel;
  }

  let finalLevel = Math.max(0, Math.min(20, currentLevel + levelDelta));

  // Surge calculation:
  // "Surge: after any success or jackpot that lands on +10 or higher,
  // there is a 12% chance of 1 to 3 extra levels, capped at +20."
  let surgeDelta = 0;
  if ((rawOutcome === 'success' || rawOutcome === 'jackpot') && finalLevel >= 10 && finalLevel < 20) {
    if (Math.random() < 0.12) {
      const extra = Math.floor(Math.random() * 3) + 1; // 1 to 3
      surgeDelta = Math.min(extra, 20 - finalLevel);
      finalLevel += surgeDelta;
    }
  }

  // Near miss check:
  // "surviving a break chance of 30% or more shows a 'Phew!' message."
  const nearMiss = odds.breakChance >= 30 && rawOutcome !== 'break';

  return {
    outcome,
    levelDelta,
    surgeDelta,
    hourglassSaved,
    nearMiss,
    finalLevel,
    breakChanceAtRoll: odds.breakChance,
    successChanceAtRoll: odds.successChance,
    damageChanceAtRoll: odds.damageChance,
  };
}

export const MILESTONE_REWARDS: Record<number, number> = {
  10: 500,
  15: 3000,
  20: 25000,
};

export const INITIAL_GAME_STATE: GameState = {
  gold: 100,
  weaponId: 'sword',
  level: 0,
  inventory: {
    whetstone: 1,
    anvilWard: 0,
    charm: 1,
    hourglass: 0,
    dragonEmber: 0,
  },
  equipped: {
    whetstone: true,
    anvilWard: false,
    charm: true,
    hourglass: false,
    dragonEmber: false,
  },
  pityBonus: 0,
  consecutiveSuccesses: 0,
  milestonesClaimed: {},
  stats: {
    totalForges: 0,
    totalSuccesses: 0,
    totalJackpots: 0,
    totalDamages: 0,
    totalBreaks: 0,
    totalSurges: 0,
    totalHourglassSaves: 0,
    highestLevel: 0,
    totalGoldEarned: 0,
    totalGoldSpent: 0,
    totalSales: 0,
  },
};

const STORAGE_KEY = 'forge_your_sword_v1';

export function loadSavedState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_GAME_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_GAME_STATE,
      ...parsed,
      inventory: { ...INITIAL_GAME_STATE.inventory, ...(parsed.inventory || {}) },
      equipped: { ...INITIAL_GAME_STATE.equipped, ...(parsed.equipped || {}) },
      stats: { ...INITIAL_GAME_STATE.stats, ...(parsed.stats || {}) },
    };
  } catch (err) {
    console.warn('Failed to load state:', err);
    return INITIAL_GAME_STATE;
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save state:', err);
  }
}
