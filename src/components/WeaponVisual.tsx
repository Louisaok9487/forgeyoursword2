import React from 'react';
import { WeaponId } from '../types/game';
import { getTierForLevel } from '../utils/gameLogic';

interface WeaponVisualProps {
  weaponId: WeaponId;
  level: number;
  isPulsing?: boolean;
  className?: string;
  size?: number; // width/height in px
}

export const WeaponVisual: React.FC<WeaponVisualProps> = ({
  weaponId,
  level,
  isPulsing = false,
  className = '',
  size = 280,
}) => {
  const tier = getTierForLevel(level);

  // Colors based on tier
  const primary = tier.primaryColor;
  const secondary = tier.secondaryColor;
  const glow = tier.glowColor;

  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-300 ${className} ${
        isPulsing ? 'scale-105' : ''
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] ${
          tier.hasColorCycle ? 'animate-color-cycle' : ''
        }`}
        style={{
          filter: `drop-shadow(0 0 ${tier.tierIndex * 3 + 4}px ${glow}88)`,
        }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={`grad-blade-${tier.tierIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="35%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>

          <linearGradient id={`grad-hilt-${tier.tierIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#3f2e18" />
          </linearGradient>

          <radialGradient id={`glow-radial-${tier.tierIndex}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.8" />
            <stop offset="60%" stopColor={primary} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Filters for glowing rune effect */}
          <filter id="rune-bloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Back Glow */}
        <circle
          cx="100"
          cy="100"
          r={65 + tier.tierIndex * 2}
          fill={`url(#glow-radial-${tier.tierIndex})`}
          className="transition-opacity duration-500 opacity-60"
        />

        {/* Tier 5+ Rotating Celestial Halo & Wings */}
        {tier.hasHalo && (
          <g className="animate-spin-slow origin-center opacity-70">
            <circle
              cx="100"
              cy="100"
              r="76"
              stroke={glow}
              strokeWidth="1.5"
              strokeDasharray="8 6"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r="84"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeDasharray="2 12"
              fill="none"
            />
            {/* Tiny stars around halo */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <circle
                key={deg}
                cx={100 + 76 * Math.cos((deg * Math.PI) / 180)}
                cy={100 + 76 * Math.sin((deg * Math.PI) / 180)}
                r="2"
                fill="#ffffff"
              />
            ))}
          </g>
        )}

        {/* Tier 5+ Wings */}
        {tier.hasHalo && (
          <g opacity="0.65" className="animate-pulse">
            {/* Left Ethereal Wing */}
            <path
              d="M 60 110 C 35 90, 25 60, 45 40 C 40 60, 55 80, 70 95 Z"
              fill={glow}
              opacity="0.5"
            />
            {/* Right Ethereal Wing */}
            <path
              d="M 140 110 C 165 90, 175 60, 155 40 C 160 60, 145 80, 130 95 Z"
              fill={glow}
              opacity="0.5"
            />
          </g>
        )}

        {/* Tier 4+ Animated Flames either side */}
        {tier.hasFlames && (
          <g className="animate-flame-flicker">
            {/* Left Flame */}
            <path
              d="M 68 115 C 55 95, 62 75, 74 65 C 66 80, 78 88, 76 105 Z"
              fill="#f97316"
              opacity="0.8"
              filter="url(#rune-bloom)"
            />
            <path
              d="M 70 110 C 60 98, 66 85, 73 75 C 69 88, 75 95, 75 105 Z"
              fill="#fbbf24"
              opacity="0.9"
            />
            {/* Right Flame */}
            <path
              d="M 132 115 C 145 95, 138 75, 126 65 C 134 80, 122 88, 124 105 Z"
              fill="#f97316"
              opacity="0.8"
              filter="url(#rune-bloom)"
            />
            <path
              d="M 130 110 C 140 98, 134 85, 127 75 C 131 88, 125 95, 125 105 Z"
              fill="#fbbf24"
              opacity="0.9"
            />
          </g>
        )}

        {/* Tier 6+ Orbiting Diamonds */}
        {tier.hasDiamonds && (
          <g className="animate-spin-reverse origin-center">
            {[0, 90, 180, 270].map((deg) => {
              const x = 100 + 72 * Math.cos((deg * Math.PI) / 180);
              const y = 100 + 72 * Math.sin((deg * Math.PI) / 180);
              return (
                <polygon
                  key={deg}
                  points={`${x},${y - 5} ${x + 4},${y} ${x},${y + 5} ${x - 4},${y}`}
                  fill="#ffffff"
                  stroke={glow}
                  strokeWidth="1"
                  filter="url(#rune-bloom)"
                />
              );
            })}
          </g>
        )}

        {/* Tier 7 Lightning Arcs (+20 Godforged) */}
        {tier.hasLightning && (
          <g className="animate-lightning opacity-90">
            <path
              d="M 70 45 L 85 70 L 78 75 L 98 105"
              stroke="#67e8f9"
              strokeWidth="2"
              fill="none"
              filter="url(#rune-bloom)"
            />
            <path
              d="M 130 45 L 115 70 L 122 75 L 102 105"
              stroke="#67e8f9"
              strokeWidth="2"
              fill="none"
              filter="url(#rune-bloom)"
            />
            <path
              d="M 60 130 L 75 145 L 70 148 L 88 165"
              stroke="#38bdf8"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 140 130 L 125 145 L 130 148 L 112 165"
              stroke="#38bdf8"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        )}

        {/* WEAPON SPECIFIC DRAWINGS */}
        {/* ======================================================== */}
        {/* 1. SWORD */}
        {weaponId === 'sword' && (
          <g id="weapon-sword">
            {/* Sword Blade */}
            <path
              d="M 100 24 L 108 55 L 107 140 L 93 140 L 92 55 Z"
              fill={`url(#grad-blade-${tier.tierIndex})`}
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            {/* Blade Ridge / Fuller */}
            <line
              x1="100"
              y1="34"
              x2="100"
              y2="135"
              stroke={secondary}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Crossguard: Swept crossguard on higher levels */}
            {level >= 6 ? (
              <path
                d="M 68 138 C 82 142, 94 136, 100 137 C 106 136, 118 142, 132 138 C 130 144, 118 147, 100 145 C 82 147, 70 144, 68 138 Z"
                fill={`url(#grad-hilt-${tier.tierIndex})`}
                stroke="#1c1917"
                strokeWidth="1.5"
              />
            ) : (
              <rect
                x="76"
                y="138"
                width="48"
                height="7"
                rx="2"
                fill={`url(#grad-hilt-${tier.tierIndex})`}
                stroke="#1c1917"
                strokeWidth="1.2"
              />
            )}

            {/* Handle / Grip */}
            <rect
              x="97"
              y="145"
              width="6"
              height="28"
              rx="1.5"
              fill="#292524"
              stroke="#1c1917"
              strokeWidth="1"
            />
            {/* Handle wire wraps */}
            <line x1="97" y1="151" x2="103" y2="151" stroke="#a8a29e" strokeWidth="1" />
            <line x1="97" y1="158" x2="103" y2="158" stroke="#a8a29e" strokeWidth="1" />
            <line x1="97" y1="165" x2="103" y2="165" stroke="#a8a29e" strokeWidth="1" />

            {/* Pommel */}
            <circle
              cx="100"
              cy="177"
              r="6.5"
              fill={`url(#grad-hilt-${tier.tierIndex})`}
              stroke="#1c1917"
              strokeWidth="1.2"
            />

            {/* Tier 2+ Glowing Gem (in crossguard center) */}
            {tier.hasGem && (
              <circle
                cx="100"
                cy="141"
                r="3.5"
                fill={glow}
                stroke="#ffffff"
                strokeWidth="1"
                filter="url(#rune-bloom)"
              />
            )}

            {/* Tier 3+ Glowing Runes along blade */}
            {tier.hasRunes && (
              <g filter="url(#rune-bloom)" stroke={glow} strokeWidth="1.2" fill="none">
                <path d="M 98 62 L 100 66 L 102 62 M 100 62 L 100 70" />
                <path d="M 98 80 L 102 84 M 102 80 L 98 84" />
                <path d="M 100 95 L 97 99 L 103 99 Z" fill={glow} />
                <path d="M 98 112 L 100 116 L 102 112" />
              </g>
            )}
          </g>
        )}

        {/* 2. WAR HAMMER */}
        {weaponId === 'hammer' && (
          <g id="weapon-hammer">
            {/* Heavy Shaft */}
            <rect
              x="97"
              y="55"
              width="6"
              height="115"
              rx="2"
              fill="#3f2e18"
              stroke="#1c1917"
              strokeWidth="1.2"
            />
            {/* Shaft metal reinforcements */}
            <rect x="96" y="65" width="8" height="18" fill={secondary} stroke="#1c1917" strokeWidth="1" />
            <rect x="96" y="145" width="8" height="20" fill="#292524" stroke="#1c1917" strokeWidth="1" />

            {/* Hammer Head Block (Heavy & Flanged) */}
            <rect
              x="62"
              y="40"
              width="76"
              height="30"
              rx="3"
              fill={`url(#grad-blade-${tier.tierIndex})`}
              stroke="#1c1917"
              strokeWidth="1.8"
            />
            {/* Left striking face */}
            <rect
              x="56"
              y="37"
              width="8"
              height="36"
              rx="2"
              fill={secondary}
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            {/* Right back beak/spike */}
            <polygon
              points="138,42 162,55 138,68"
              fill={`url(#grad-blade-${tier.tierIndex})`}
              stroke="#1c1917"
              strokeWidth="1.5"
            />

            {/* Top Armor Spike */}
            <polygon
              points="96,40 100,18 104,40"
              fill={secondary}
              stroke="#1c1917"
              strokeWidth="1.5"
            />

            {/* Pommel butt cap */}
            <polygon
              points="95,170 100,178 105,170"
              fill={secondary}
              stroke="#1c1917"
              strokeWidth="1.2"
            />

            {/* Tier 2+ Glowing Core Gem */}
            {tier.hasGem && (
              <circle
                cx="100"
                cy="55"
                r="4.5"
                fill={glow}
                stroke="#ffffff"
                strokeWidth="1"
                filter="url(#rune-bloom)"
              />
            )}

            {/* Tier 3+ Runes on hammer face */}
            {tier.hasRunes && (
              <g filter="url(#rune-bloom)" stroke={glow} strokeWidth="1.4" fill="none">
                <path d="M 78 48 L 84 55 L 78 62" />
                <path d="M 116 48 L 122 55 L 116 62" />
              </g>
            )}
          </g>
        )}

        {/* 3. BATTLE AXE */}
        {weaponId === 'axe' && (
          <g id="weapon-axe">
            {/* Shaft */}
            <rect
              x="97"
              y="40"
              width="6"
              height="132"
              rx="2"
              fill="#3e2723"
              stroke="#1c1917"
              strokeWidth="1.2"
            />
            {/* Top spike */}
            <polygon
              points="96,40 100,24 104,40"
              fill={secondary}
              stroke="#1c1917"
              strokeWidth="1.2"
            />

            {/* Left Crescent Bearded Blade */}
            <path
              d="M 97 46 C 75 35, 48 40, 42 66 C 46 95, 78 102, 97 86 Z"
              fill={`url(#grad-blade-${tier.tierIndex})`}
              stroke="#1c1917"
              strokeWidth="1.6"
            />
            {/* Right Symmetrical Double Blade */}
            <path
              d="M 103 46 C 125 35, 152 40, 158 66 C 154 95, 122 102, 103 86 Z"
              fill={`url(#grad-blade-${tier.tierIndex})`}
              stroke="#1c1917"
              strokeWidth="1.6"
            />

            {/* Central reinforced collar */}
            <rect
              x="94"
              y="52"
              width="12"
              height="26"
              rx="2"
              fill={secondary}
              stroke="#1c1917"
              strokeWidth="1.2"
            />

            {/* Grip wrap */}
            <rect x="96" y="130" width="8" height="35" rx="1" fill="#1c1917" />
            <circle cx="100" cy="174" r="5" fill={secondary} stroke="#1c1917" strokeWidth="1" />

            {/* Tier 2+ Gem in axe socket */}
            {tier.hasGem && (
              <circle
                cx="100"
                cy="65"
                r="4"
                fill={glow}
                stroke="#ffffff"
                strokeWidth="1"
                filter="url(#rune-bloom)"
              />
            )}

            {/* Tier 3+ Runes engraved on blades */}
            {tier.hasRunes && (
              <g filter="url(#rune-bloom)" stroke={glow} strokeWidth="1.3" fill="none">
                <path d="M 66 60 L 72 68 L 68 76" />
                <path d="M 134 60 L 128 68 L 132 76" />
              </g>
            )}
          </g>
        )}

        {/* 4. SPEAR */}
        {weaponId === 'spear' && (
          <g id="weapon-spear">
            {/* Long Ash Haft */}
            <rect
              x="98"
              y="52"
              width="4"
              height="124"
              rx="1.5"
              fill="#523a28"
              stroke="#1c1917"
              strokeWidth="1"
            />
            {/* Spear Tip Socket */}
            <polygon
              points="96,52 100,20 104,52"
              fill={`url(#grad-blade-${tier.tierIndex})`}
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            {/* Spear tip spine */}
            <line x1="100" y1="22" x2="100" y2="52" stroke={secondary} strokeWidth="1.2" />

            {/* Winged Barbs */}
            <path
              d="M 96 46 L 82 56 L 96 52 Z"
              fill={secondary}
              stroke="#1c1917"
              strokeWidth="1.2"
            />
            <path
              d="M 104 46 L 118 56 L 104 52 Z"
              fill={secondary}
              stroke="#1c1917"
              strokeWidth="1.2"
            />

            {/* Silk/Battle Tassel */}
            <path
              d="M 97 54 C 92 64, 88 74, 94 85 C 98 75, 102 65, 103 54 Z"
              fill="#dc2626"
              opacity="0.9"
            />

            {/* Butt spike */}
            <polygon points="98,176 100,186 102,176" fill={secondary} stroke="#1c1917" strokeWidth="1" />

            {/* Tier 2+ Gem */}
            {tier.hasGem && (
              <circle
                cx="100"
                cy="44"
                r="3"
                fill={glow}
                stroke="#ffffff"
                strokeWidth="0.8"
                filter="url(#rune-bloom)"
              />
            )}

            {/* Tier 3+ Runes */}
            {tier.hasRunes && (
              <g filter="url(#rune-bloom)" stroke={glow} strokeWidth="1" fill="none">
                <line x1="99" y1="28" x2="101" y2="34" />
                <line x1="101" y1="36" x2="99" y2="42" />
              </g>
            )}
          </g>
        )}

        {/* 5. TRUNK CLUB */}
        {weaponId === 'club' && (
          <g id="weapon-club">
            {/* Massive Gnarled Wooden Trunk Body */}
            <path
              d="M 94 165 C 93 125, 84 90, 80 50 C 80 32, 120 32, 120 50 C 116 90, 107 125, 106 165 Z"
              fill="#452c1e"
              stroke="#1c1917"
              strokeWidth="2"
            />
            {/* Wood Grain & Knots */}
            <path
              d="M 96 70 C 102 85, 98 110, 101 130"
              stroke="#2e1a10"
              strokeWidth="1.5"
              fill="none"
            />
            <ellipse cx="100" cy="55" rx="5" ry="7" fill="#2e1a10" />

            {/* Level 3+ Iron Bands */}
            {level >= 3 && (
              <>
                <rect x="80" y="52" width="40" height="6" rx="2" fill="#71717a" stroke="#1c1917" strokeWidth="1" />
                <rect x="85" y="80" width="30" height="6" rx="2" fill="#71717a" stroke="#1c1917" strokeWidth="1" />
              </>
            )}

            {/* Level 6+ Brutal Forged Iron Spikes */}
            {level >= 6 && (
              <g fill="#a1a1aa" stroke="#1c1917" strokeWidth="1">
                <polygon points="78,54 62,51 78,59" />
                <polygon points="122,54 138,51 122,59" />
                <polygon points="83,82 69,79 83,87" />
                <polygon points="117,82 131,79 117,87" />
                <polygon points="90,34 94,20 102,34" />
                <polygon points="106,34 110,20 114,34" />
              </g>
            )}

            {/* Tier 4+ Molten Lava Cracks */}
            {tier.tierIndex >= 4 && (
              <path
                d="M 94 45 L 102 60 L 96 75 L 105 95 L 98 120"
                stroke="#ff4500"
                strokeWidth="2.5"
                fill="none"
                filter="url(#rune-bloom)"
              />
            )}

            {/* Tier 2+ Embedded Core Crystal */}
            {tier.hasGem && (
              <polygon
                points="100,42 106,50 100,58 94,50"
                fill={glow}
                stroke="#ffffff"
                strokeWidth="1"
                filter="url(#rune-bloom)"
              />
            )}

            {/* Tier 3+ Runes burned into the bark */}
            {tier.hasRunes && (
              <g filter="url(#rune-bloom)" stroke={glow} strokeWidth="1.3" fill="none">
                <path d="M 96 90 L 100 96 L 104 90" />
                <path d="M 98 108 L 102 114" />
              </g>
            )}
          </g>
        )}

        {/* 6. MAGE STAFF */}
        {weaponId === 'staff' && (
          <g id="weapon-staff">
            {/* Twisting Shaft */}
            <path
              d="M 98 174 L 98 62 C 94 58, 92 50, 96 42 C 102 34, 108 42, 104 52 L 102 174 Z"
              fill="#2e1065"
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            {/* Spiral arcane vine wraps */}
            <path
              d="M 96 150 Q 106 142 96 130 Q 106 120 96 105 Q 106 90 96 75 Q 106 60 98 50"
              fill="none"
              stroke={primary}
              strokeWidth="2"
            />

            {/* Staff Crown / Socket */}
            <path
              d="M 88 42 C 84 25, 94 15, 100 15 C 106 15, 116 25, 112 42 C 106 46, 94 46, 88 42 Z"
              fill={secondary}
              stroke="#1c1917"
              strokeWidth="1.5"
            />

            {/* Arcane Mystic Floating Orb at Top */}
            <circle
              cx="100"
              cy="28"
              r={11 + Math.min(6, tier.tierIndex)}
              fill={`url(#glow-radial-${tier.tierIndex})`}
              stroke={glow}
              strokeWidth="1.5"
              filter="url(#rune-bloom)"
              className="animate-pulse"
            />
            <circle cx="97" cy="25" r="3" fill="#ffffff" opacity="0.8" />

            {/* Floating Arcane Shards orbiting orb */}
            {level >= 6 && (
              <g className="animate-spin-slow origin-[100px_28px]">
                <polygon points="100,10 103,13 100,16 97,13" fill={glow} />
                <polygon points="118,28 121,31 118,34 115,31" fill={glow} />
                <polygon points="82,28 85,31 82,34 79,31" fill={glow} />
              </g>
            )}

            {/* Tier 3+ Runes circling shaft */}
            {tier.hasRunes && (
              <g filter="url(#rune-bloom)" stroke={glow} strokeWidth="1.2" fill="none">
                <circle cx="100" cy="80" r="4" />
                <path d="M 97 105 L 103 105 M 100 102 L 100 108" />
                <circle cx="100" cy="130" r="3.5" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
