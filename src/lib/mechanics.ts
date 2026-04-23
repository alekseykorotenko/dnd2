export type RollAdvantageState = 'normal' | 'advantage' | 'disadvantage';

/**
 * Calculates the ability modifier from a raw ability score.
 * Formula: floor((score - 10) / 2)
 */
export function getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

/**
 * Calculates proficiency bonus based on character's total level.
 * Scaling: +2 at lvl 1, +3 at lvl 5, +4 at lvl 9, +5 at lvl 13, +6 at lvl 17
 * Formula: ceil(level / 4) + 1
 */
export function getProficiencyBonus(level: number): number {
    return Math.ceil(level / 4) + 1;
}

/**
 * A basic D20 roll function that handles state combinations.
 */
export function rollD20(state: RollAdvantageState = 'normal'): { total: number, rolls: number[] } {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;

    if (state === 'advantage') {
        return { total: Math.max(roll1, roll2), rolls: [roll1, roll2] };
    }
    if (state === 'disadvantage') {
        return { total: Math.min(roll1, roll2), rolls: [roll1, roll2] };
    }

    return { total: roll1, rolls: [roll1] };
}

/**
 * Executes the D20 Test System (Ability Check, Saving Throw, Attack Roll).
 * The 2024 rules unify these under a central D20 Test paradigm.
 */
export function performD20Test(
    abilityScore: number, 
    level: number, 
    isProficient: boolean, 
    state: RollAdvantageState = 'normal',
    expertise: boolean = false
): { result: number, natural: number, rolls: number[] } {
    const modifier = getAbilityModifier(abilityScore);
    let profBonus = isProficient ? getProficiencyBonus(level) : 0;
    
    // Expertise doubles the proficiency bonus applied to ability checks.
    if (expertise) profBonus *= 2; 

    const { total: natural, rolls } = rollD20(state);
    const result = natural + modifier + profBonus;

    return { result, natural, rolls };
}

/**
 * Heroic Inspiration (D&D 2024)
 * Allows a player to reroll any D20 test roll and use the new result.
 */
export function applyHeroicInspiration(originalRoll: number): number {
    return Math.floor(Math.random() * 20) + 1;
}

/**
 * Attack Roll Modifier Calculation (Weapon)
 * Finesse weapons can use Str or Dex.
 */
export function getAttackModifier(
    strScore: number, 
    dexScore: number,
    level: number, 
    isProficient: boolean, 
    weaponType: 'melee' | 'ranged' | 'finesse',
    magicBonus: number = 0
): number {
    let relevantScore = strScore;
    if (weaponType === 'ranged') relevantScore = dexScore;
    if (weaponType === 'finesse') relevantScore = Math.max(strScore, dexScore);

    const mod = getAbilityModifier(relevantScore);
    const prof = isProficient ? getProficiencyBonus(level) : 0;
    return mod + prof + magicBonus;
}

/**
 * Calculate Spell Save DC
 * Base 8 + Proficiency + Casting Modifier
 */
export function getSpellSaveDC(castingScore: number, level: number): number {
    const mod = getAbilityModifier(castingScore);
    const prof = getProficiencyBonus(level);
    return 8 + prof + mod;
}

/**
 * Calculate Spell Attack Modifier
 * Proficiency + Casting Modifier
 */
export function getSpellAttackModifier(castingScore: number, level: number): number {
    const mod = getAbilityModifier(castingScore);
    const prof = getProficiencyBonus(level);
    return prof + mod;
}
