import { 
  validateBackgroundASI, 
  validateSubclass, 
  validateFeatSelection, 
  validateProficiencyBonus 
} from './validation.js';

console.log("--- ВАЛІДАЦІЯ ПЕРСОНАЖА D&D 2024 ---");

// 1. Тест передісторії (Помилка: Невірний розподіл характеристик)
const badChar = {
  backgroundAsi: { str: 3 }, // Помилка: Неможливо +3 в одну характеристику
  level: 1
};
const farmerBackground = {
  name: 'Farmer',
  asi_options: ['str', 'con', 'wis']
};

console.log("\n1. Перевірка передісторії:");
console.log(validateBackgroundASI(badChar, farmerBackground));

// 2. Тест підкласу (Помилка: Підклас на 1-му рівні)
const prematureSubclass = {
  level: 1,
  subclassId: 'champion'
};

console.log("\n2. Перевірка підкласу:");
console.log(validateSubclass(prematureSubclass));

// 3. Тест Риси (Помилка: Вимоги до рівня)
const epicBoon = {
  name: 'Epic Boon of Fate',
  levelRequirement: 19
};
const midLevelChar = { level: 10 };

console.log("\n3. Перевірка Риси:");
console.log(validateFeatSelection(epicBoon, midLevelChar));

// 4. Тест Бонусу Майстерності
console.log("\n4. Перевірка Бонусу Майстерності (PB):");
console.log(validateProficiencyBonus(3, 1)); // Помилка: PB +3 на 1-му рівні
