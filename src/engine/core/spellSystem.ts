/**
 * D&D 2024 Spell Selection System
 */

import { SpellDef } from '../adapters/dndData';

interface CharacterSummary {
  classId: string;
  level: number;
  selectedCantrips?: string[];
  selectedSpells?: string[];
}

interface ClassRules {
  type: 'prepared' | 'known';
  base?: number;
  perLevel?: number;
  table?: number[];
  cantrips: number[];
}

// Heuristic limits for D&D 2024 classes (simplified for demo)
const CLASS_SPELL_RULES: Record<string, ClassRules> = {
  Wizard: { type: 'prepared', base: 1, perLevel: 1, cantrips: [3, 3, 3, 3, 4, 4, 4, 4, 5] },
  Sorcerer: { type: 'known', table: [2, 4, 6, 7, 9, 10, 12, 13, 15, 15], cantrips: [4, 4, 4, 4, 5, 5, 5, 5, 6] },
  Cleric: { type: 'prepared', base: 1, perLevel: 1, cantrips: [3, 3, 3, 3, 4, 4, 4, 4, 5] },
  Warlock: { type: 'known', table: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10], cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 4] }
};

/**
 * Filters all spells to find those eligible for the character.
 */
export function getAvailableSpells(character: CharacterSummary, allSpells: SpellDef[]): SpellDef[] {
  const { classId, level } = character;
  if (!classId) return [];
  
  // 1. Calculate max spell level available (Simplified: Full casters get L2 at char level 3, L3 at 5, etc.)
  const maxSpellLevel = Math.min(9, Math.ceil(level / 2));

  return allSpells.filter(spell => {
    // Check if class matches (case-insensitive)
    const classMatch = spell.classes.some(c => c.toLowerCase() === classId.toLowerCase());
    // Check if level is legal
    const levelMatch = spell.level <= maxSpellLevel;
    
    return classMatch && levelMatch;
  });
}

/**
 * Calculates the maximum number of spells a character can have.
 */
export function getSpellLimits(character: CharacterSummary) {
  const rules = CLASS_SPELL_RULES[character.classId] || { type: 'known', table: [2], cantrips: [2] };
  const levelIndex = Math.min(character.level - 1, (rules.table?.length || 20) - 1);
  
  let leveledLimit = 0;
  if (rules.type === 'prepared') {
    leveledLimit = (rules.base || 0) + (rules.perLevel || 1) * character.level;
  } else {
    leveledLimit = rules.table ? rules.table[levelIndex] : 2;
  }

  const cantripLimit = rules.cantrips ? (rules.cantrips[Math.min(character.level - 1, rules.cantrips.length - 1)]) : 2;

  return { leveledLimit, cantripLimit };
}

/**
 * Handles adding/removing a spell from the character's selection.
 */
export function toggleSpell(character: any, spellId: string, isCantrip: boolean) {
  const targetArray = isCantrip ? 'selectedCantrips' : 'selectedSpells';
  const current = character[targetArray] || [];
  
  if (current.includes(spellId)) {
    return {
      ...character,
      [targetArray]: current.filter((id: string) => id !== spellId)
    };
  } else {
    return {
      ...character,
      [targetArray]: [...current, spellId]
    };
  }
}

/**
 * Validates the current selection against class limits.
 */
export function validateSpellSelection(character: CharacterSummary, allSpells: SpellDef[]) {
  const errors: string[] = [];
  const { leveledLimit, cantripLimit } = getSpellLimits(character);
  
  const selectedCantrips = character.selectedCantrips || [];
  const selectedSpells = character.selectedSpells || [];

  if (selectedCantrips.length > cantripLimit) {
    errors.push(`Обрано забагато фокусів: ${selectedCantrips.length}/${cantripLimit}`);
  }

  if (selectedSpells.length > leveledLimit) {
    errors.push(`Обрано забагато заклинаннь: ${selectedSpells.length}/${leveledLimit}`);
  }

  // Cross-verify class and level
  const available = getAvailableSpells(character, allSpells);
  const availableIds = available.map(s => s.id);

  [...selectedCantrips, ...selectedSpells].forEach(id => {
    if (!availableIds.includes(id)) {
      errors.push(`Заклинання '${id}' не є доступним для вашого класу або рівня.`);
    }
  });

  return { isValid: errors.length === 0, errors };
}
