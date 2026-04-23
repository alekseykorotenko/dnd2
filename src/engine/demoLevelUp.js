import { processLevelUp } from './levelUpSystem.js';

// 1. Initial State: Level 1 Fighter
const myHero = {
  name: "Korg the Brave",
  level: 1,
  totalHp: 12, // 10 (HitDie) + 2 (Con Mod)
  conModifier: 2,
  classId: "fighter",
  classDef: {
    hitDie: 10,
    progression: {
      1: ["Fighting Style", "Second Wind"],
      2: ["Action Surge"],
      3: ["Tactical Mind"],
      4: ["Tactical Master"]
    }
  },
  subclassId: null,
  features: ["Fighting Style", "Second Wind"]
};

console.log("--- STARTING JOURNEY ---");
console.log(`${myHero.name} is a Level ${myHero.level} Fighter.`);

// 2. Level Up to 3 (Subclass Unlock)
const level3Hero = processLevelUp(myHero, 3);
console.log("\n--- LEVEL 3 REACHED ---");
console.log(`HP: ${level3Hero.totalHp}`);
console.log(`New Features: ${level3Hero.newFeatures.join(", ")}`);
console.log(`Pending Actions: ${JSON.stringify(level3Hero.pendingChoices[0].message)}`);

// 3. Level Up to 4 (Feat Selection)
const level4Hero = processLevelUp(level3Hero, 4);
console.log("\n--- LEVEL 4 REACHED ---");
console.log(`Pending Actions Count: ${level4Hero.pendingChoices.length}`);
console.log(`Latest Choice: ${level4Hero.pendingChoices[level4Hero.pendingChoices.length - 1].message}`);
