import { ABILITIES } from './constants.js';

/**
 * Calculates deterministic ability scores based on base values, background bonuses, and feats.
 * @param {Object} character - The character object
 * @returns {Record<string, number>} Final calculated ability scores
 */
export function calculateAbilityScores(character) {
  const { baseScores, background, chosenFeats = [] } = character;
  
  const finalScores = { ...baseScores };

  // 1. Apply Background Bonuses (+2/+1 or +1/+1/+1)
  if (background && background.asi) {
    Object.entries(background.asi).forEach(([ability, bonus]) => {
      if (ABILITIES.includes(ability)) {
        finalScores[ability] = (finalScores[ability] || 0) + bonus;
      }
    });
  }

  // 2. Apply Feat Bonuses
  chosenFeats.forEach(feat => {
    if (feat.asi) {
      Object.entries(feat.asi).forEach(([ability, bonus]) => {
        if (ABILITIES.includes(ability)) {
          finalScores[ability] = (finalScores[ability] || 0) + bonus;
        }
      });
    }
  });

  return finalScores;
}

/**
 * Calculates the modifier for a given score.
 */
export function calculateModifier(score) {
  return Math.floor((score - 10) / 2);
}
