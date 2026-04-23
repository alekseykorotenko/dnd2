/**
 * D&D 2024 Game Engine Core
 * A pure logic library for character calculations.
 */

export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface CharacterState {
  level: number;
  baseAbilities: Record<Ability, number>;
  backgroundId?: string;
  classId?: string;
  subclassId?: string;
  featIds: string[];
  chosenMasteries: string[];
}

/**
 * 2024 Rules: Proficiency Bonus scales strictly with total character level.
 */
export function calculateProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

/**
 * Standard Ability Modifier formula: floor((score - 10) / 2)
 */
export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Merges base scores with Background ASI and Feat-based ASI.
 * D&D 2024: Backgrounds provide +2/+1 or +1/+1/+1 to chosen scores.
 */
export function calculateAbilityScores(
  base: Record<Ability, number>,
  backgroundAsi: Partial<Record<Ability, number>> = {},
  featAsi: Partial<Record<Ability, number>> = {}
): Record<Ability, number> {
  const final = { ...base };
  const abilities: Ability[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  
  abilities.forEach(ab => {
    final[ab] = (final[ab] || 10) + (backgroundAsi[ab] || 0) + (featAsi[ab] || 0);
  });
  
  return final;
}

/**
 * Logic for Background application: Origin Feats and Skills.
 */
export function applyBackground(background: any) {
  return {
    originFeatId: background.origin_feat?.id,
    proficiencies: background.skill_proficiencies || [],
    tools: background.tool_proficiencies || []
  };
}

/**
 * Calculates HP, Features, and Spell Slots for the current level.
 */
export function applyClassFeatures(level: number, classData: any, subclassData?: any) {
  const features: string[] = [];
  
  // Aggregate progression
  for (let i = 1; i <= level; i++) {
    if (classData.features_by_level[i]) {
      features.push(...classData.features_by_level[i]);
    }
    if (subclassData && subclassData.features_by_level[i]) {
      features.push(...subclassData.features_by_level[i]);
    }
  }

  // Hit Points: Class Base + ((Level - 1) * Class Growth)
  const hitDie = classData.hit_die || 8;
  const hpBase = hitDie;
  const hpGrowth = (hitDie / 2) + 1;
  const totalRawHp = hpBase + (level - 1) * hpGrowth;

  return {
    features,
    rawHp: totalRawHp,
    proficiencyBonus: calculateProficiencyBonus(level)
  };
}

/**
 * Applies Feat modifiers (e.g. Toughness HP bonus, Ability caps).
 */
export function applyFeats(finalScores: Record<Ability, number>, featIds: string[], level: number) {
  let hpBonus = 0;
  
  // Example: Tough Feat calculation
  if (featIds.includes('tough')) {
    hpBonus += level * 2;
  }

  return {
    hpBonus,
    abilityModifiers: Object.keys(finalScores).reduce((acc, key) => {
      acc[key as Ability] = calculateModifier(finalScores[key as Ability]);
      return acc;
    }, {} as Record<Ability, number>)
  };
}

/**
 * Example Usage of the Engine:
 * 
 * const base = { str: 15, dex: 14, con: 13, int: 10, wis: 10, cha: 8 };
 * const bgAsi = { str: 2, con: 1 };
 * 
 * const finalAbilities = calculateAbilityScores(base, bgAsi);
 * const classStats = applyClassFeatures(5, fighterData);
 * const featEffects = applyFeats(finalAbilities, ['tough'], 5);
 * 
 * const totalHp = classStats.rawHp + featEffects.hpBonus + (featEffects.abilityModifiers.con * 5);
 * console.log(`Active HP: ${totalHp}`);
 */
