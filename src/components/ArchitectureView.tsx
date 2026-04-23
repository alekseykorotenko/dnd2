import React from 'react';
import { Database, Layout, Shield, Swords, Users } from 'lucide-react';

export default function ArchitectureView() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/50 backdrop-blur-sm border border-slate-200/60 p-8 rounded-3xl shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">D&D 2024 Character Builder Architecture</h1>
        <p className="text-slate-500">
          A high-level architecture and data model adapting to the D&D 2024 Player's Handbook ruleset, 
          transitioning away from the 2014 system constraints.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-indigo-600 mb-4">
            <Layout className="w-6 h-6" />
            <h2 className="text-xl font-medium text-slate-900">1. High-Level Architecture</h2>
          </div>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li><strong>Client (React/Vite):</strong> A state-driven SPA with strict sequential flow for new characters.</li>
            <li><strong>State Management:</strong> Centralized store (Zustand/Redux) ensuring rule validation at each step (e.g., verifying prerequisites for Feats).</li>
            <li><strong>Rules Engine (Typescript):</strong> A decoupled directory containing static rules (species, classes, backgrounds, feats) and validation pure functions.</li>
            <li><strong>Backend (Node/Express):</strong> Handles persistence, user accounts, and homebrew content storage via REST/GraphQL.</li>
            <li><strong>Database (PostgreSQL/NoSQL):</strong> Stores user character sheets (JSON blobs for flexibility, relational maps for metadata).</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-emerald-600 mb-4">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-medium text-slate-900">2. Core Modules</h2>
          </div>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li><strong>Creation Wizard:</strong> Step-by-step flow (Class &rarr; Origin (Background/Species) &rarr; Stats &rarr; Equipment). Note the 2024 shift prioritizing Class early.</li>
            <li><strong>Validator Module:</strong> Checks feat prerequisites, stat bounds (max 20), and selection limitations dynamically.</li>
            <li><strong>Digital Sheet Viewer:</strong> The real-time output calculating Modifiers, Saving Throws, AC, and HP.</li>
            <li><strong>Inventory System:</strong> Weapon mastery handler, encumbrance, and equipment definitions.</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-amber-600 mb-4">
            <Database className="w-6 h-6" />
            <h2 className="text-xl font-medium text-slate-900">3. Data Relationships</h2>
          </div>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li><strong>Character &rarr; Background:</strong> Backgrounds now drive Ability Score Increases (ASIs) and an Origin Feat (massive change from 2014).</li>
            <li><strong>Character &rarr; Species:</strong> Species now grant base traits but NO ASIs (half-elf/half-orc are out as distinct base species, represented via aesthetics or flavor).</li>
            <li><strong>Character &rarr; Class:</strong> Subclass selection is universally moved to Level 3.</li>
            <li><strong>Character &rarr; Feats:</strong> Categorized strictly into Origin (Lvl 1), General (Lvl 4+), and Epic Boon (Lvl 19) feats.</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-rose-600 mb-4">
            <Swords className="w-6 h-6" />
            <h2 className="text-xl font-medium text-slate-900">4. Key Logic Changes (2014 &rarr; 2024)</h2>
          </div>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li><strong>ASI Overhaul:</strong> The logic module that handles "+2/+1" or "+1/+1/+1" now hooks into the Background entity instead of Species.</li>
            <li><strong>Subclass Normalization:</strong> The leveling module must conditionally lock subclass UI until Character Level 3 for all classes (Clerics/Warlocks/Sorcerers no longer pick at 1).</li>
            <li><strong>Weapon Masteries:</strong> A new property array on martial classes dictating which weapon special properties (Cleave, Sap, Push) they can unlock.</li>
            <li><strong>Spell Preparation:</strong> Bards, Rangers, and Paladins prepare spells dynamically rather than known spell constraints.</li>
            <li><strong>Exhaustion:</strong> New linear tracked value (-1 penalty to d20 rolls per level up to 10) instead of the 2014 table.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
