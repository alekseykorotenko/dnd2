import { AbilityType, calculateModifier } from './dndData';

export type CharacterClassId =
  | "barbarian"
  | "bard"
  | "cleric"
  | "druid"
  | "fighter"
  | "monk"
  | "paladin"
  | "ranger"
  | "rogue"
  | "sorcerer"
  | "warlock"
  | "wizard";

export interface SpellSlots {
  standard?: number[]; 
  warlockPact?: { slotsCount: number; slotLevel: number }; 
}

export interface LevelStats {
  level: number;
  proficiencyBonus: number;
  hitPoints: number;
  spellSlots: SpellSlots | null;
  features: string[];
}

// Таблиці магії (D&D 2024)
const fullCasterSlots = [
  [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

// Напівчаклуни 2024 року починають з магією з 1-го рівня
const halfCasterSlots2024 = [
  [], [2], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2],
  [4, 3, 2], [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1],
  [4, 3, 3, 2], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2]
];

const warlockPactSlots = [
  { slotsCount: 0, slotLevel: 0 },
  { slotsCount: 1, slotLevel: 1 }, { slotsCount: 2, slotLevel: 1 }, { slotsCount: 2, slotLevel: 2 },
  { slotsCount: 2, slotLevel: 2 }, { slotsCount: 2, slotLevel: 3 }, { slotsCount: 2, slotLevel: 3 },
  { slotsCount: 2, slotLevel: 4 }, { slotsCount: 2, slotLevel: 4 }, { slotsCount: 2, slotLevel: 5 },
  { slotsCount: 2, slotLevel: 5 }, { slotsCount: 3, slotLevel: 5 }, { slotsCount: 3, slotLevel: 5 },
  { slotsCount: 3, slotLevel: 5 }, { slotsCount: 3, slotLevel: 5 }, { slotsCount: 3, slotLevel: 5 },
  { slotsCount: 3, slotLevel: 5 }, { slotsCount: 4, slotLevel: 5 }, { slotsCount: 4, slotLevel: 5 },
  { slotsCount: 4, slotLevel: 5 }, { slotsCount: 4, slotLevel: 5 }
];

// Базові здібності класів збираються з масивів прогресії, які повинні бути у JSON
export function calculateLevelStats(
  classId: string,
  level: number,
  hitDie: number,
  conScore: number,
  baseFeaturesByLevel?: Record<string, string[]>,
  subclassFeaturesByLevel?: Record<string, string[]>
): LevelStats {
  // Бонус майстерності
  const proficiencyBonus = Math.ceil(level / 4) + 1;

  // Окуляри здоров'я (HP)
  const conMod = calculateModifier(conScore);
  const hpAtFirstLevel = hitDie + conMod;
  const hpGainPerLevel = Math.floor(hitDie / 2) + 1 + conMod;
  const hitPoints = Math.max(1, hpAtFirstLevel + hpGainPerLevel * (level - 1));

  // Комірки заклинань
  let spellSlots: SpellSlots | null = null;
  switch (classId) {
    case 'bard':
    case 'cleric':
    case 'druid':
    case 'sorcerer':
    case 'wizard':
      spellSlots = { standard: fullCasterSlots[level] };
      break;
    case 'paladin':
    case 'ranger':
      spellSlots = { standard: halfCasterSlots2024[level] };
      break;
    case 'warlock':
      spellSlots = { warlockPact: warlockPactSlots[level] };
      break;
    default:
      spellSlots = null;
  }

  const features: string[] = [];
  const lvlStr = level.toString();
  if (baseFeaturesByLevel && baseFeaturesByLevel[lvlStr]) {
    features.push(...baseFeaturesByLevel[lvlStr]);
  }
  if (subclassFeaturesByLevel && subclassFeaturesByLevel[lvlStr]) {
    features.push(...subclassFeaturesByLevel[lvlStr]);
  }

  return {
    level,
    proficiencyBonus,
    hitPoints,
    spellSlots,
    features
  };
}
