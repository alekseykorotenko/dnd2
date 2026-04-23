/**
 * Filters a list of feats based on character requirements (level, previous feats, abilities).
 * @param {Object} character - Character context
 * @param {Array} allFeats - Master list of available feats
 * @returns {Array} Filtered list of feats
 */
export function getAvailableFeats(character, allFeats) {
  const { level, baseScores, chosenFeats = [] } = character;
  
  return allFeats.filter(feat => {
    // 1. Level Check
    if (feat.levelRequirement > level) return false;

    // 2. Category Check (D&D 2024 partitions: Origin, General, Epic)
    // Most general feats require level 4+
    if (feat.category === 'General' && level < 4) return false;
    if (feat.category === 'Epic Boon' && level < 19) return false;

    // 3. Duplicate Check
    if (chosenFeats.some(cf => cf.id === feat.id)) return false;

    // 4. Ability Prerequisites (Simplified)
    if (feat.prerequisites && feat.prerequisites.abilities) {
      const failsScore = Object.entries(feat.prerequisites.abilities).some(([ab, min]) => {
        return (baseScores[ab] || 0) < min;
      });
      if (failsScore) return false;
    }

    return true;
  });
}

/**
 * Consolidates feat effects.
 * @param {Object} character - Character object
 * @returns {Object} Cumulative modifiers from feats
 */
export function applyFeats(character) {
  const { chosenFeats = [] } = character;
  
  return chosenFeats.reduce((acc, feat) => {
    if (feat.modifiers) {
      Object.entries(feat.modifiers).forEach(([key, val]) => {
        acc[key] = (acc[key] || 0) + val;
      });
    }
    return acc;
  }, {});
}
