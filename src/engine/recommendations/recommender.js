/**
 * Deterministic Recommendation System for D&D 2024
 * 
 * Rules-based engine to provide quality-of-life suggestions to players
 * without the unpredictability of AI.
 */

const CLASS_PRIMARY_STATS = {
  fighter: ['str', 'dex', 'con'],
  wizard: ['int', 'dex'],
  cleric: ['wis', 'con'],
  rogue: ['dex', 'int', 'cha'],
  paladin: ['str', 'cha', 'con'],
  bard: ['cha', 'dex'],
  druid: ['wis', 'con'],
  ranger: ['dex', 'wis'],
  barbarian: ['str', 'con'],
  monk: ['dex', 'wis'],
  sorcerer: ['cha', 'con'],
  warlock: ['cha', 'con']
};

/**
 * Suggests feats based on class archetype and current ability scores.
 */
export function recommendFeats(character, allFeats) {
  const primaryStats = CLASS_PRIMARY_STATS[character.classId] || [];
  
  return allFeats
    .filter(feat => {
      // 1. Must meet basic requirements (from Rules Engine)
      // (Assuming validation is handled elsewhere, we focus on 'Match' quality)
      
      // 2. Check if the feat enhances a primary stat
      const enhancesPrimary = feat.asi_bonus && 
        feat.asi_bonus.options.some(opt => primaryStats.includes(opt));
      
      // 3. Match specific class IDs if defined in feat metadata
      const matchesClass = feat.recommendedClasses && 
        feat.recommendedClasses.includes(character.classId);

      return enhancesPrimary || matchesClass;
    })
    .slice(0, 3) // Return Top 3 recommendations
    .map(f => ({ id: f.id, name: f.name, reason: "Адаптовано до ваших основних характеристик" }));
}

/**
 * Suggests weapons based on the Weapon Mastery properties the character has unlocked.
 */
export function recommendWeapons(characterMasteries, allWeapons) {
  // characterMasteries: ['Topple', 'Vex', 'Slow', ...]
  return allWeapons
    .filter(w => characterMasteries.includes(w.masteryProperty))
    .map(w => ({
      name: w.name,
      mastery: w.masteryProperty,
      reason: `Ви використовуєте потенціал '${w.masteryProperty}' цієї зброї`
    }))
    .slice(0, 3);
}

/**
 * Suggests skills based on background and class synergy.
 */
export function recommendSkills(character, allSkills) {
  const primaryStats = CLASS_PRIMARY_STATS[character.classId] || [];
  
  return allSkills
    .filter(skill => primaryStats.includes(skill.ability))
    .map(s => ({
      name: s.name,
      reason: `Базується на вашому високому показнику ${s.ability.toUpperCase()}`
    }))
    .slice(0, 5);
}

// --- Example Data Mock ---
const mockSkills = [
  { id: 'ath', name: 'Атлетика', ability: 'str' },
  { id: 'arc', name: 'Магія', ability: 'int' },
  { id: 'ste', name: 'Непомітність', ability: 'dex' },
  { id: 'per', name: 'Уважність', ability: 'wis' }
];

const mockWeapons = [
  { name: 'Бойова сокира', masteryProperty: 'Topple' },
  { name: 'Довгий лук', masteryProperty: 'Slow' },
  { name: 'Рапіра', masteryProperty: 'Vex' }
];
