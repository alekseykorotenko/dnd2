import React, { useState } from 'react';
import { Settings2, Dices, ChevronRight, Activity, Zap } from 'lucide-react';
import { 
  getAbilityModifier, 
  getProficiencyBonus, 
  performD20Test, 
  getAttackModifier, 
  getSpellSaveDC, 
  getSpellAttackModifier,
  RollAdvantageState
} from '../lib/mechanics';

export default function EngineMechanicsView() {
  const [level, setLevel] = useState<number>(5);
  const [score, setScore] = useState<number>(18);
  
  // D20 Test State
  const [testState, setTestState] = useState<RollAdvantageState>('normal');
  const [isProficient, setIsProficient] = useState<boolean>(true);
  const [lastRoll, setLastRoll] = useState<{ result: number, natural: number, rolls: number[] } | null>(null);

  const handleRoll = () => {
    setLastRoll(performD20Test(score, level, isProficient, testState, false));
  };

  const getRollStatus = (natural: number) => {
    if (natural === 20) return <span className="text-emerald-600 font-bold ml-2">Crítical Success!</span>;
    if (natural === 1) return <span className="text-rose-600 font-bold ml-2">Automatic Failure</span>;
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="bg-white/50 backdrop-blur-sm border border-slate-200/60 p-8 rounded-3xl shadow-sm mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Game Engine Core</h1>
        <p className="text-slate-500">
          Modular JavaScript engine functions encapsulating D&D 2024 logic limits, scaling, and the unified d20 Test system. 
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Sandbox */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-indigo-600 pb-4 border-b border-slate-100">
              <Settings2 className="w-5 h-5" />
              <h2 className="text-lg font-medium text-slate-900">Variables Emulator</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-sm font-medium text-slate-700">Character Level ({level})</label>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">Prof Bonus: +{getProficiencyBonus(level)}</span>
                </div>
                <input 
                  type="range" min="1" max="20" 
                  value={level} onChange={(e) => setLevel(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-sm font-medium text-slate-700">Ability Score ({score})</label>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">Modifier: {getAbilityModifier(score) >= 0 ? '+' : ''}{getAbilityModifier(score)}</span>
                </div>
                <input 
                  type="range" min="1" max="30" 
                  value={score} onChange={(e) => setScore(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Calculated Output (2024 Rules)</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center text-center">
                  <span className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Melee ATK</span>
                  <span className="text-2xl font-serif text-slate-900">+{getAttackModifier(score, 10, level, true, 'melee', 0)}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center text-center">
                  <span className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Spell ATK</span>
                  <span className="text-2xl font-serif text-slate-900">+{getSpellAttackModifier(score, level)}</span>
                </div>
                <div className="col-span-2 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 flex flex-col items-center text-center">
                  <span className="text-indigo-600/70 mb-1 text-xs uppercase tracking-wider font-semibold">Spell Save DC</span>
                  <span className="text-2xl font-serif text-indigo-900">{getSpellSaveDC(score, level)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-5">
            <div className="flex items-center gap-3 text-emerald-600 pb-3 border-b border-slate-100">
              <Dices className="w-5 h-5" />
              <h2 className="text-lg font-medium text-slate-900 text-slate-900">Unified d20 Test</h2>
            </div>
            
            <div className="flex bg-slate-100/50 p-1 rounded-xl">
              <button onClick={() => setTestState('disadvantage')} className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all ${testState === 'disadvantage' ? 'bg-white shadow-sm border border-slate-200 text-rose-600' : 'text-slate-500 hover:text-slate-800'}`}>Disadvantage</button>
              <button onClick={() => setTestState('normal')} className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all ${testState === 'normal' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Normal</button>
              <button onClick={() => setTestState('advantage')} className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all ${testState === 'advantage' ? 'bg-white shadow-sm border border-slate-200 text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>Advantage</button>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isProficient} onChange={(e) => setIsProficient(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <span className="text-sm text-slate-700">Add Proficiency Bonus?</span>
            </label>

            <button onClick={handleRoll} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 px-4 font-medium transition-all flex justify-center items-center gap-2 shadow-md">
              <Dices className="w-5 h-5" /> Roll d20
            </button>

            {lastRoll && (
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Total Result <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded ml-2">Raw d20: [{lastRoll.rolls.join(', ')}]</span></div>
                  <div className="text-3xl font-serif text-slate-900">{lastRoll.result} {getRollStatus(lastRoll.natural)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-sm mb-4">
              <Zap className="w-4 h-4" />
              mechanics.ts
            </div>
            
            <div className="space-y-6">
              
              <div className="space-y-2">
                <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold border-b border-slate-800 pb-2">1. The Math Primitives</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">Both formulas heavily lean on <code className="text-teal-300 bg-teal-900/30 px-1 rounded">Math.floor</code> and <code className="text-teal-300 bg-teal-900/30 px-1 rounded">Math.ceil</code>. By decoupling these two small pieces of logic, every action output naturally inherits its properties without repetition.</p>
                <pre className="text-sm bg-black/40 p-4 rounded-xl text-blue-200 font-mono overflow-auto border border-white/5 custom-scrollbar">
{`export function getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

export function getProficiencyBonus(level: number): number {
    // 2024 scaling: Level 1-4 = +2, 5-8 = +3, etc.
    return Math.ceil(level / 4) + 1;
}`}
                </pre>
              </div>

              <div className="space-y-2 pt-4">
                <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold border-b border-slate-800 pb-2">2. Unified Actions (Weapons & Spells)</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">Instead of having magic logic spread throughout a codebase, properties like <code className="text-teal-300 bg-teal-900/30 px-1 rounded">getAttackModifier</code> process weapon behaviors directly. For instance, the 'finesse' property simply forces <code className="text-teal-300 bg-teal-900/30 px-1 rounded">Math.max(str, dex)</code>. </p>
                <pre className="text-sm bg-black/40 p-4 rounded-xl text-blue-200 font-mono overflow-auto border border-white/5 custom-scrollbar">
{`export function getAttackModifier(
    strScore: number, 
    dexScore: number,
    level: number, 
    isProficient: boolean, 
    weaponType: 'melee' | 'ranged' | 'finesse',
    magicBonus: number = 0
): number {
    let relevantScore = strScore;
    if (weaponType === 'ranged') relevantScore = dexScore;
    if (weaponType === 'finesse') relevantScore = Math.max(strScore, dexScore);

    const mod = getAbilityModifier(relevantScore);
    const prof = isProficient ? getProficiencyBonus(level) : 0;
    
    return mod + prof + magicBonus;
}

export function getSpellSaveDC(castingScore: number, level: number): number {
    const mod = getAbilityModifier(castingScore);
    const prof = getProficiencyBonus(level);
    return 8 + prof + mod; // Magic base value + logic
}`}
                </pre>
              </div>

              <div className="space-y-2 pt-4">
                <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold border-b border-slate-800 pb-2">3. The D20 Test Evaluation</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">Roll states are normalized into <code className="bg-slate-800 px-1 rounded">normal | advantage | disadvantage</code>. Using an evaluation hook guarantees natural 20 criticals always propagate outward.</p>
                <pre className="text-sm bg-black/40 p-4 rounded-xl text-blue-200 font-mono overflow-auto border border-white/5 custom-scrollbar">
{`export function performD20Test(
    ability: number, level: number, isProficient: boolean, 
    state: RollAdvantageState = 'normal'
) {
    const mod = getAbilityModifier(ability);
    const prof = isProficient ? getProficiencyBonus(level) : 0;
    
    const { total: raw, rolls } = rollD20(state);
    
    // Result is the sum of raw dice, modifier, and proficiency
    return { result: raw + mod + prof, natural: raw, rolls };
}`}
                </pre>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
