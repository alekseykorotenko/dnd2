import React from 'react';
import { Database, Table, Key, Link as LinkIcon, Server } from 'lucide-react';

export default function DatabaseSchemaView() {
  const sqlContent = `
-- 1. Users & Core Lookups
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    base_speed INT NOT NULL,
    size_category VARCHAR(20) NOT NULL -- Tiny, Small, Medium
);

-- Note: 2024 Feats are strictly categorized
CREATE TABLE feats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL, -- 'Origin', 'General', 'Epic_Boon'
    description TEXT NOT NULL,
    prerequisites JSONB -- JSON for scalable prerequisite parsing (e.g., {"str": 13})
);

CREATE TABLE backgrounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    origin_feat_id UUID REFERENCES feats(id) -- 2024 Rules bind Origin Feats to backgrounds
);

-- 2024 Rules: Backgrounds govern ASIs (+2/+1 or +1/+1/+1), not Species
CREATE TABLE background_asi_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    background_id UUID REFERENCES backgrounds(id) ON DELETE CASCADE,
    ability_score VARCHAR(3) NOT NULL, -- 'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'
    valid_boost INT NOT NULL -- 1 or 2
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    hit_die INT NOT NULL, -- e.g., 8, 10, 12
    description TEXT
);

CREATE TABLE subclasses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- 2. Character Data
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species_id UUID REFERENCES species(id),
    background_id UUID REFERENCES backgrounds(id),
    base_str INT DEFAULT 8, -- Pure ability score buy/roll tracking
    base_dex INT DEFAULT 8,
    base_con INT DEFAULT 8,
    base_int INT DEFAULT 8,
    base_wis INT DEFAULT 8,
    base_cha INT DEFAULT 8,
    xp INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- NOTE: Derived stats (HP, AC) are calculated runtime, not stored
);

-- Multi-classing Junction
CREATE TABLE character_classes (
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subclass_id UUID REFERENCES subclasses(id), -- Nullable: universally chosen at lvl 3 in 2024
    level INT DEFAULT 1,
    PRIMARY KEY (character_id, class_id)
);

CREATE TABLE character_feats (
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    feat_id UUID REFERENCES feats(id) ON DELETE CASCADE,
    acquired_at_level INT NOT NULL,
    PRIMARY KEY (character_id, feat_id)
);

-- 3. Spells & Equipment 
CREATE TABLE spells (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    level INT NOT NULL, -- 0 for Cantrips
    school VARCHAR(50) NOT NULL,
    components JSONB, -- {"V": true, "S": true, "M": "bat guano"}
    description TEXT NOT NULL
);

CREATE TABLE character_spells (
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    spell_id UUID REFERENCES spells(id) ON DELETE CASCADE,
    is_prepared BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (character_id, spell_id)
);

CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    item_type VARCHAR(50) NOT NULL, -- 'Weapon', 'Armor', 'Gear'
    cost_copper INT NOT NULL,
    weight_lbs DECIMAL(5,2) NOT NULL,
    properties JSONB -- Handles 2024 Weapon Masteries e.g., {"mastery": "Cleave"}
);

CREATE TABLE character_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    is_equipped BOOLEAN DEFAULT FALSE
);`;

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/50 backdrop-blur-sm border border-slate-200/60 p-8 rounded-3xl shadow-sm mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">D&D 2024 Database Schema</h1>
        <p className="text-slate-500">
          A normalized PostgreSQL architecture designed for multi-classing, infinite scalability, and strictly enforcing the 2024 Player's Handbook paradigms.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <Server className="w-5 h-5" />
              <h2 className="text-lg font-medium text-slate-900">Design Philosophy</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              This schema completely avoids storing <strong>derived state</strong> (like Max HP, Armor Class, or total Attack Modifiers) in the database. Instead, the database tracks the "commit log" of a character (base stats, class levels, exact equipment). A business logic layer or the frontend client calculates the derived state mathematically. 
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 mb-2">
              <Key className="w-5 h-5" />
              <h2 className="text-lg font-medium text-slate-900">2024 System Compliance</h2>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 list-disc list-inside">
              <li><strong>Species vs Backgrounds:</strong> The 2014 rule where Species granted ASI (Ability Score Increases) is dead. The schema maps ASIs and Origin Feats strictly to the <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">backgrounds</span> table.</li>
              <li><strong>Subclass Deferment:</strong> The <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">character_classes.subclass_id</span> column allows null. This fits the 2024 rule where EVERY class picks their subclass at level 3, meaning a level 1-2 character won't have an ID assigned yet.</li>
              <li><strong>Feat Taxonomies:</strong> Feats have strict 'Category' constraints (Origin vs General vs Epic Boon).</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-amber-600 mb-2">
              <LinkIcon className="w-5 h-5" />
              <h2 className="text-lg font-medium text-slate-900">Normalization & Multi-classing</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Multi-class characters are handled elegantly using the <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">character_classes</span> junction table. 
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Instead of explicitly defining "Class 1", "Class 2", "Level 1", "Level 2" (which breaks normal forms and is hard to query), a Paladin 4 / Warlock 2 simply has two rows in the junction table tied to their Character PK. Total level is derived using a <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">SUM(level)</span> statement.
            </p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-rose-600 mb-2">
              <Table className="w-5 h-5" />
              <h2 className="text-lg font-medium text-slate-900">Scalability Patterns (JSONB)</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Highly variant data formats feature <strong>JSONB columns</strong>. 
              <br/><br/>
              For example, 2024 introduced Weapon Masteries (Cleave, Sap, Vex, etc.). Instead of creating 8 new sparse columns or complex junction tables, those behaviors are housed in the <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">properties JSONB</span> column in the equipment table. Similarly, Feat Prerequisites (which can demand an ability score, a class, another feat, or a level constraint) are stored via JSONB query blocks.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl overflow-hidden flex flex-col h-[800px] border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-300 font-mono text-sm">
              <Database className="w-4 h-4 text-indigo-400" />
              dnd_builder_v2024.sql
            </div>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <div className="overflow-auto flex-1 custom-scrollbar">
            <pre className="text-[13px] leading-relaxed text-blue-200 font-mono tab-size-4">
              <code dangerouslySetInnerHTML={{
                __html: sqlContent
                  .replace(/CREATE TABLE/g, '<span class="text-pink-400">CREATE TABLE</span>')
                  .replace(/PRIMARY KEY/g, '<span class="text-amber-300">PRIMARY KEY</span>')
                  .replace(/FOREIGN KEY/g, '<span class="text-emerald-300">FOREIGN KEY</span>')
                  .replace(/REFERENCES/g, '<span class="text-emerald-300">REFERENCES</span>')
                  .replace(/DEFAULT/g, '<span class="text-purple-300">DEFAULT</span>')
                  .replace(/(UUID|VARCHAR|INT|TEXT|TIMESTAMP|JSONB|BOOLEAN|DECIMAL)/g, '<span class="text-teal-300">$1</span>')
                  .replace(/--.*$/gm, '<span class="text-slate-500 italic">$&</span>')
              }} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
