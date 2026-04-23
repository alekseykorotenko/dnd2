/**
 * D&D 2024 Spell Selection QA Validator
 * 
 * Provides granular validation for character spell builds.
 */

import { SpellDef } from '../adapters/dndData';
import { getSpellLimits, getAvailableSpells } from '../core/spellSystem';

export interface ValidationError {
  code: 'CLASS_MISMATCH' | 'LEVEL_TOO_HIGH' | 'LIMIT_EXCEEDED' | 'NOT_FOUND';
  message: string;
  context: {
    spellId?: string;
    spellName?: string;
    currentCount?: number;
    limit?: number;
  };
}

/**
 * Validates a single spell against a character's class eligibility.
 */
export function validateSpellClass(spell: SpellDef, classId: string): ValidationError | null {
  const isEligible = spell.classes.some(c => c.toLowerCase() === classId.toLowerCase());
  
  if (!isEligible) {
    return {
      code: 'CLASS_MISMATCH',
      message: `Заклинання "${spell.name}" не належить до списку заклинань класу ${classId}.`,
      context: { spellId: spell.id, spellName: spell.name }
    };
  }
  return null;
}

/**
 * Validates if the character level is high enough to cast the spell.
 */
export function validateSpellLevel(spell: SpellDef, charLevel: number): ValidationError | null {
  const maxSpellLevel = Math.min(9, Math.ceil(charLevel / 2));
  
  if (spell.level > maxSpellLevel) {
    return {
      code: 'LEVEL_TOO_HIGH',
      message: `Заклинання "${spell.name}" (${spell.level}-го рівня) недоступне для персонажа ${charLevel}-го рівня (Максимум: ${maxSpellLevel}).`,
      context: { spellId: spell.id, spellName: spell.name, limit: maxSpellLevel }
    };
  }
  return null;
}

/**
 * Performs a full audit of a character's spellbook.
 */
export function auditSpellSelection(character: any, allSpells: SpellDef[]): { 
  isValid: boolean; 
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];
  const { classId, level, selectedCantrips = [], selectedSpells = [] } = character;
  
  const { leveledLimit, cantripLimit } = getSpellLimits(character);

  // 1. Check Limits
  if (selectedCantrips.length > cantripLimit) {
    errors.push({
      code: 'LIMIT_EXCEEDED',
      message: `Перевищено ліміт фокусів.`,
      context: { currentCount: selectedCantrips.length, limit: cantripLimit }
    });
  }

  if (selectedSpells.length > leveledLimit) {
    errors.push({
      code: 'LIMIT_EXCEEDED',
      message: `Перевищено ліміт підготовлених заклинань.`,
      context: { currentCount: selectedSpells.length, limit: leveledLimit }
    });
  }

  // 2. Validate individual spells
  const validateList = (ids: string[]) => {
    ids.forEach(id => {
      const spell = allSpells.find(s => s.id === id);
      if (!spell) {
        errors.push({
          code: 'NOT_FOUND',
          message: `Заклинання з ID "${id}" не знайдено в базі даних.`,
          context: { spellId: id }
        });
        return;
      }

      // Check Class
      const classErr = validateSpellClass(spell, classId);
      if (classErr) errors.push(classErr);

      // Check Level
      const levelErr = validateSpellLevel(spell, level);
      if (levelErr) errors.push(levelErr);
    });
  };

  validateList(selectedCantrips);
  validateList(selectedSpells);

  return {
    isValid: errors.length === 0,
    errors
  };
}
