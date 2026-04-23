import { getAvailableSpells, getSpellLimits, validateSpellSelection, toggleSpell } from './spellSystem.js';
import allSpells from '../../data/spells.json';

console.log("--- ТЕСТ СИСТЕМИ ВИБОРУ ЗАКЛИНАНЬ D&D 2024 ---");

// Scenario: Level 3 Wizard
let wizard = {
  classId: 'Wizard',
  level: 3,
  selectedCantrips: ['acid_splash', 'fire_bolt', 'mage_hand'], // Limit is 3
  selectedSpells: ['shield', 'magic_missile', 'misty_step', 'mirror_image'] // Limit is level+1 = 4
};

console.log("\n1. Доступні заклинання для Чарівника 3-го рівня:");
const available = getAvailableSpells(wizard, allSpells);
console.log(`Знайдено ${available.length} варіантів (включаючи рівні 0, 1, 2).`);

console.log("\n2. Ліміти заклинань:");
console.log(getSpellLimits(wizard));

console.log("\n3. Валідація поточної збірки:");
console.log(validateSpellSelection(wizard, allSpells));

console.log("\n4. Спроба додати 5-те заклинання (Перевищення ліміту):");
wizard = toggleSpell(wizard, 'web', false);
const result = validateSpellSelection(wizard, allSpells);
console.log("Результат валідації:", result.isValid ? "OK" : "Error");
console.log("Помилки:", result.errors);

console.log("\n5. Спроба додати заклинання не за класом (Eldritch Blast):");
wizard = toggleSpell(wizard, 'eldritch_blast', true);
console.log("Помилки:", validateSpellSelection(wizard, allSpells).errors);
