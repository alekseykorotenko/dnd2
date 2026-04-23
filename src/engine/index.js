import { calculateAbilityScores, calculateModifier } from './core/abilityScores.js';
import { calculateProficiencyBonus, applyClassFeatures } from './core/progression.js';
import { getAvailableFeats, applyFeats } from './core/feats.js';
import { processLevelUp } from './core/levelUpSystem.js';
import { validateBackgroundASI, validateSubclass } from './validators/characterValidator.js';
import { recommendFeats, recommendWeapons } from './recommendations/recommender.js';

const RulesEngine = {
  calculateAbilityScores,
  calculateModifier,
  calculateProficiencyBonus,
  applyClassFeatures,
  getAvailableFeats,
  applyFeats,
  processLevelUp,
  validateBackgroundASI,
  validateSubclass,
  recommendFeats,
  recommendWeapons
};

export default RulesEngine;

// --- Example Usage ---

/*
const character = {
  level: 1,
  baseScores: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
  background: {
    id: 'farmer',
    asi: { str: 2, con: 1 } // D&D 2024 Background ASI
  },
  classDef: {
    id: 'fighter',
    progression: {
      1: ['fighting_style', 'second_wind'],
      2: ['action_surge']
    }
  },
  chosenFeats: []
};

const finalScores = RulesEngine.calculateAbilityScores(character);
const pb = RulesEngine.calculateProficiencyBonus(character.level);
const features = RulesEngine.applyClassFeatures(character, 1);

console.log('Final Scores:', finalScores); // { str: 17, dex: 14, con: 14, ... }
console.log('Proficiency Bonus:', pb); // 2
console.log('Level 1 Features:', features); // ['fighting_style', 'second_wind']
*/
