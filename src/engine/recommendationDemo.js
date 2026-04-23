import { recommendFeats, recommendWeapons, recommendSkills } from './recommendationSystem.js';

/**
 * SCENARIO: A Level 1 Fighter with Strength focus
 */
const fighter = {
  classId: 'fighter',
  baseScores: { str: 16, dex: 12, con: 14, int: 8, wis: 10, cha: 10 },
  masteries: ['Topple', 'Cleave']
};

const allFeats = [
  { id: 'tough', name: 'Витривалість', asi_bonus: { options: ['con'] } },
  { id: 'heavy_armor', name: 'Важка броня', asi_bonus: { options: ['str'] } },
  { id: 'keen_mind', name: 'Гострий розум', asi_bonus: { options: ['int'] } }
];

const allWeapons = [
  { name: 'Бойова сокира', masteryProperty: 'Topple' },
  { name: 'Алебарда', masteryProperty: 'Cleave' },
  { name: 'Кинджал', masteryProperty: 'Nick' }
];

const allSkills = [
  { id: 'ath', name: 'Атлетика', ability: 'str' },
  { id: 'arc', name: 'Магія', ability: 'int' },
  { id: 'per', name: 'Уважність', ability: 'wis' }
];

console.log("--- РЕКОМЕНДАЦІЇ ДЛЯ ВОЇНА (СИЛА) ---");

console.log("\n1. Рекомендовані Риси:");
console.table(recommendFeats(fighter, allFeats));

console.log("\n2. Рекомендована Зброя (на основі Майстерності):");
console.table(recommendWeapons(fighter.masteries, allWeapons));

console.log("\n3. Рекомендовані Навички:");
console.table(recommendSkills(fighter, allSkills));
