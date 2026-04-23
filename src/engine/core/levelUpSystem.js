/**
 * D&D 2024 Level-Up System
 * 
 * This module handles the logic of progressing a character from one level to the next,
 * managing subclass unlocks, feat discovery, and stat scaling.
 */

const ASI_LEVELS = [4, 8, 12, 16, 19];

/**
 * Calculates the HP increase for a specific level up.
 * 
 * @param {number} hitDie - The class hit die (e.g., 10 for Fighter)
 * @param {number} conModifier - The character's Constitution modifier
 * @returns {number} The HP gained (using fixed average + modifier)
 */
export function calculateHPGain(hitDie, conModifier) {
  // D&D standard: (HitDie / 2) + 1 + modifier
  const fixedGain = Math.floor(hitDie / 2) + 1;
  return Math.max(1, fixedGain + conModifier);
}

/**
 * Processes a level up for a character.
 * 
 * @param {Object} character - The current character state
 * @param {number} newLevel - The target level
 * @returns {Object} Updated character state with pending actions
 */
export function processLevelUp(character, newLevel) {
  const updates = {
    level: newLevel,
    pendingChoices: [],
    newFeatures: []
  };

  // 1. Subclass Selection (D&D 2024: Mandatory at Level 3)
  if (newLevel >= 3 && !character.subclassId) {
    updates.pendingChoices.push({
      type: 'SUBCLASS_CHOICE',
      message: 'You have reached level 3! Choose your subclass.'
    });
  }

  // 2. Feat / ASI Progression
  // Check if any ASI levels were reached between current level and new level
  ASI_LEVELS.forEach(lvl => {
    if (lvl > character.level && lvl <= newLevel) {
      updates.pendingChoices.push({
        type: 'FEAT_CHOICE',
        level: lvl,
        category: 'General',
        message: `Level ${lvl} reached: Choose a General Feat or Ability Score Improvement.`
      });
    }
  });

  // 3. Class Feature Collation
  // This would typically involve looking up the classDef from JSON
  if (character.classDef && character.classDef.progression) {
    for (let i = character.level + 1; i <= newLevel; i++) {
      const levelFeatures = character.classDef.progression[i] || [];
      updates.newFeatures.push(...levelFeatures);
    }
  }

  return {
    ...character,
    ...updates,
    totalHp: character.totalHp + calculateHPGain(character.classDef.hitDie, character.conModifier) * (newLevel - character.level)
  };
}

/**
 * Example Character Data Structure for Progression
 */
export const EXAMPLE_PROGRESSION_DATA = {
  class: "Fighter",
  levels: {
    1: { features: ["Fighting Style", "Second Wind"], feats: ["Origin Feat"] },
    2: { features: ["Action Surge"] },
    3: { features: ["Subclass Feature"], triggersSubclass: true },
    4: { features: ["Feat/ASI"] }
  }
};
