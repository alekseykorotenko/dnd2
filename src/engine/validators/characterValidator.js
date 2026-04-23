/**
 * D&D 2024 Character Validation Suite
 * 
 * Ensures character sheets strictly follow the revised 2024 rules.
 */

/**
 * Validates Background Ability Score Improvements (ASI).
 * D&D 2024 rules: Background grants either +2/+1 or +1/+1/+1 to three specific attributes.
 */
export function validateBackgroundASI(character, background) {
  const errors = [];
  const chosenBonuses = character.backgroundAsi || {}; // { str: 2, con: 1 }
  const allowedAbilities = background.asi_options || []; // ['str', 'con', 'cha']

  const entries = Object.entries(chosenBonuses);
  const totalBonus = entries.reduce((sum, [_, val]) => sum + val, 0);
  const usedAbilities = entries.map(([ab]) => ab);

  // 1. Total value check
  if (totalBonus !== 3) {
    errors.push(`Очікується сумарний бонус +3 від передісторії, отримано +${totalBonus}.`);
  }

  // 2. Choice check (Must be from background list)
  usedAbilities.forEach(ab => {
    if (!allowedAbilities.includes(ab)) {
      errors.push(`Характеристика '${ab}' не входить до списку дозволених для передісторії '${background.name}'.`);
    }
  });

  // 3. Distribution check (+2/+1 or +1/+1/+1)
  const values = entries.map(([_, v]) => v).sort((a, b) => b - a);
  const isTwoOne = values.length === 2 && values[0] === 2 && values[1] === 1;
  const isOneOneOne = values.length === 3 && values.every(v => v === 1);

  if (!isTwoOne && !isOneOneOne) {
    errors.push("Невірний розподіл бонусів. Дозволено лише +2/+1 або +1/+1/+1.");
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates if the selected subclass is allowed at the current level.
 */
export function validateSubclass(character) {
  const errors = [];
  // D&D 2024 standard: All subclasses unlock at Level 3
  if (character.subclassId && character.level < 3) {
    errors.push(`Підклас не може бути обраний на ${character.level} рівні. Підкласи доступні з 3-го рівня.`);
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates if a feat can be selected based on its requirements.
 */
export function validateFeatSelection(feat, character) {
  const errors = [];

  if (feat.levelRequirement > character.level) {
    errors.push(`Риса '${feat.name}' вимагає ${feat.levelRequirement} рівень. Поточний рівень: ${character.level}.`);
  }

  // Simplified prerequisite check
  if (feat.prerequisites) {
    if (feat.prerequisites.abilities) {
      Object.entries(feat.prerequisites.abilities).forEach(([ab, min]) => {
        if ((character.baseScores[ab] || 0) < min) {
          errors.push(`Недостатньо '${ab.toUpperCase()}'. Вимагається ${min}, є ${character.baseScores[ab] || 0}.`);
        }
      });
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates the Proficiency Bonus (PB) based on level.
 */
export function validateProficiencyBonus(pb, level) {
  const expected = Math.ceil(level / 4) + 1;
  if (pb !== expected) {
    return { 
      isValid: false, 
      errors: [`Невірний бонус майстерності для ${level} рівня. Очікується +${expected}, отримано +${pb}.`] 
    };
  }
  return { isValid: true, errors: [] };
}
