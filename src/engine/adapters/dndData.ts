import rawClasses from '../../../data/classes.json';
import rawSpecies from '../../../data/species.json';
import rawBackgrounds from '../../../data/backgrounds.json';
import rawFeats from '../../../data/feats.json';
import rawSubclasses from '../../../data/subclasses.json';
import rawSpells from '../../../data/spells.json';
import rawWeaponMasteries from '../../../data/weaponMasteries.json';

export type AbilityType = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

// Українські назви характеристик
export const abilityNames: Record<AbilityType, string> = {
  str: 'Сила',
  dex: 'Спритність',
  con: 'Витривалість',
  int: 'Інтелект',
  wis: 'Мудрість',
  cha: 'Харизма'
};

export const standardArray = [15, 14, 13, 12, 10, 8];

// Map abilities
const mapAbilities = (abilities: string[]): AbilityType[] => {
  return abilities.map(a => a.substring(0, 3) as AbilityType);
};

export interface ClassSubclassDef {
  id: string;
  name: string;
  description: string;
  featuresByLevel: Record<string, string[]>;
}

export interface ClassDef {
  id: string;
  name: string;
  description: string;
  primaryAbility: AbilityType;
  hitDie: number;
  equipmentPacks: { id: string; name: string; items: string[] }[];
  featuresByLevel: Record<string, string[]>;
  subclasses: ClassSubclassDef[];
}

export const classesData: ClassDef[] = rawClasses.map((c: any) => {
  if (!c.equipmentPacks || c.equipmentPacks.length === 0) {
    throw new Error(`Critical Error: Missing equipmentPacks for class ${c.id}. Do not guess data!`);
  }
  if (!c.hit_die) {
    throw new Error(`Critical Error: Missing hit_die for class ${c.id}`);
  }
  if (!c.features_by_level) {
    throw new Error(`Critical Error: Missing features_by_level for class ${c.id}`);
  }
  if (!c.subclasses) {
    throw new Error(`Critical Error: Missing subclasses for class ${c.id}`);
  }

  const normalizeFeatures = (src: any): Record<string, string[]> => {
    if (!src) return {};
    const res: Record<string, string[]> = {};
    for (const key in src) {
      if (Array.isArray(src[key])) {
        const valid = src[key].filter((val: any) => typeof val === 'string' && val.trim().length > 0);
        if (valid.length > 0) res[key] = valid;
      } else if (typeof src[key] === 'string' && src[key].trim().length > 0) {
        res[key] = [src[key]];
      }
    }
    return res;
  };

  return {
    id: c.id,
    name: c.name_ua,
    description: c.description,
    primaryAbility: mapAbilities(c.primary_abilities)[0],
    hitDie: parseInt(c.hit_die.replace('1d', '')),
    equipmentPacks: c.equipmentPacks,
    featuresByLevel: normalizeFeatures(c.features_by_level),
    subclasses: c.subclasses.map((s: any) => ({
      id: s.id,
      name: s.name_ua,
      description: s.description,
      featuresByLevel: normalizeFeatures(s.features_by_level)
    }))
  };
});

export interface SpeciesSubtypeDef {
  id: string;
  name: string;
  traits: string[];
  features: string[];
}

export interface SpeciesDef {
  id: string;
  name: string;
  description: string;
  traits: string[];
  features: string[];
  subtypes: SpeciesSubtypeDef[];
}

export const speciesData: SpeciesDef[] = rawSpecies.map((s: any) => {
  if (!s.traits || s.traits.length === 0) {
    throw new Error(`Critical Error: Missing traits for species ${s.id}`);
  }
  return {
    id: s.id,
    name: s.name_ua,
    description: s.description || (s.features ? s.features.join('. ') : ''),
    traits: s.traits,
    features: s.features || [],
    subtypes: s.subtypes ? s.subtypes.map((sub: any) => ({
      id: sub.id,
      name: sub.name_ua,
      traits: sub.traits || [],
      features: sub.features || []
    })) : []
  };
});

export interface FeatDef {
  id: string;
  name: string;
  description: string;
  category: 'Origin' | 'General' | 'Epic Boon' | 'Fighting Style';
}

export const featsData: FeatDef[] = rawFeats.map((f: any) => ({
  id: f.id,
  name: f.name_ua,
  description: f.description,
  category: (f.category || (f.requirements === 'Рівень: 1' ? 'Origin' : 'General')) as any
}));

export interface BackgroundDef {
  id: string;
  name: string;
  description: string;
  featId: string;
  asiOptions: AbilityType[];
  defaultDistribution: Partial<Record<AbilityType, number>>;
  originFeatName: string;
}

export const backgroundsData: BackgroundDef[] = rawBackgrounds.map((b: any) => {
  if (!b.origin_feat || !b.origin_feat.id || !b.origin_feat.name_ua) {
    throw new Error(`Critical Error: Missing origin_feat for background ${b.id}`);
  }
  if (!b.ability_bonuses || !b.ability_bonuses.options || !b.ability_bonuses.default_distribution) {
    throw new Error(`Critical Error: Missing ability_bonuses for background ${b.id}`);
  }

  const asiOptions = mapAbilities(b.ability_bonuses.options);
  const defaultDistribution: Partial<Record<AbilityType, number>> = {};
  for (const key in b.ability_bonuses.default_distribution) {
    const mappedKey = key.substring(0, 3).toLowerCase() as AbilityType;
    defaultDistribution[mappedKey] = b.ability_bonuses.default_distribution[key];
  }

  return {
    id: b.id,
    name: b.name_ua,
    description: b.description + (b.equipment ? ' Спорядження: ' + b.equipment.join(', ') : ''),
    featId: b.origin_feat.id,
    asiOptions,
    defaultDistribution,
    originFeatName: b.origin_feat.name_ua
  };
});

export interface SpellDef {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string[];
  duration: string;
  description: string;
  classes: string[];
}

export const spellsData: SpellDef[] = (Array.isArray(rawSpells) ? rawSpells : (rawSpells as any).spells || []).map((s: any, idx: number) => ({
  id: s.id || s.name?.toLowerCase().replace(/\s+/g, '-') || `spell-${idx}`,
  name: s.name_ua || s.name,
  level: s.level,
  school: s.school,
  castingTime: s.casting_time || s.castingTime || s.actionType || '1 action',
  range: s.range,
  components: s.components,
  duration: s.duration,
  description: s.description || '',
  classes: Array.isArray(s.classes) ? s.classes : [s.classes]
}));

export interface WeaponMasteryDef {
  id: string;
  name: string;
  description: string;
}

export const weaponMasteriesData: WeaponMasteryDef[] = rawWeaponMasteries.map((m: any) => ({
  id: m.id,
  name: m.name_ua,
  description: m.description
}));

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}
