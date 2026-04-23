import { auditSpellSelection } from './spellValidator';
import allSpells from '../../../data/spells.json';

console.log("=== QA SPELL VALIDATION TEST SUITE ===");

const problematicCharacter = {
  classId: 'Wizard',
  level: 1,
  selectedCantrips: ['acid_splash', 'fire_bolt', 'mage_hand', 'guidance'], // Limit 3
  selectedSpells: ['magic_missile', 'misty_step', 'eldritch_blast'] // Misty step is L2 (illegal for L1 Wizard), Eldritch Blast is for Warlocks
};

const report = auditSpellSelection(problematicCharacter, allSpells as any);

console.log("\n[TEST RESULT]");
console.log("Is Valid:", report.isValid);
console.log("Errors Found:", report.errors.length);

report.errors.forEach((err, idx) => {
  console.log(`\nError ${idx + 1}: [${err.code}]`);
  console.log(`Message: ${err.message}`);
  console.log(`Context:`, err.context);
});
