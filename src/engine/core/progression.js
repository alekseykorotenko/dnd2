/**
 * Calculates Proficiency Bonus based on character level.
 * Formula for D&D 5e/2024: 1 + ceil(level / 4)
 * @param {number} level - Character level (1-20)
 * @returns {number}
 */
export function calculateProficiencyBonus(level) {
  if (level < 1) return 2;
  if (level > 20) return 6;
  return Math.ceil(level / 4) + 1;
}

/**
 * Retrieves class and subclass features for a specific level.
 * @param {Object} character - Character object containing class and subclass data
 * @param {number} level - Current level to query
 * @returns {string[]} List of feature IDs
 */
export function applyClassFeatures(character, level) {
  const { classDef, subclassDef } = character;
  let features = [];

  // Get base class features for this level
  if (classDef && classDef.progression && classDef.progression[level]) {
    features = [...features, ...classDef.progression[level]];
  }

  // Get subclass features if applicable (D&D 2024: Subclass starts at Level 3)
  if (level >= 3 && subclassDef && subclassDef.progression && subclassDef.progression[level]) {
    features = [...features, ...subclassDef.progression[level]];
  }

  return features;
}
