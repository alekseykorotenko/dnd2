import React, { useState } from 'react';
import { User, Shield, Dna, BrainCircuit, Wand2, CheckCircle2, ChevronRight, Backpack, Heart, Star } from 'lucide-react';

const steps = [
  { id: 1, title: 'Class', icon: Shield, desc: 'Define your role' },
  { id: 2, title: 'Origin', icon: Dna, desc: 'Species & Background' },
  { id: 3, title: 'Abilities', icon: BrainCircuit, desc: 'Base Attributes' },
  { id: 4, title: 'Feats', icon: Star, desc: 'Origin Talents' },
  { id: 5, title: 'Equipment', icon: Backpack, desc: 'Starting Gear' },
  { id: 6, title: 'Summary', icon: User, desc: 'Final Review' },
];

export default function WizardUXView() {
  const [currentStep, setCurrentStep] = useState(1);

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Step 1: Class Selection",
          uxFocus: "2024 Rules move Class to Step 1. This is critical because it sets the 'Primary Ability' context for the beginner before they roll stats.",
          wireframe: (
            <div className="grid grid-cols-2 gap-3">
              {['Fighter', 'Wizard', 'Rogue', 'Cleric'].map(cls => (
                <div key={cls} className="border-2 border-slate-200 hover:border-indigo-500 rounded-xl p-4 cursor-pointer group transition-all">
                  <h3 className="font-bold text-slate-800 flex justify-between">
                    {cls} <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-indigo-500 group-hover:bg-indigo-500" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Primary: {cls === 'Fighter' ? 'STR/DEX' : cls === 'Wizard' ? 'INT' : cls === 'Rogue' ? 'DEX' : 'WIS'}</p>
                </div>
              ))}
            </div>
          )
        };
      case 2:
        return {
          title: "Step 2: Origin (Species & Background)",
          uxFocus: "Crucial friction point. Unlike 2014, 2024 Backgrounds grant ASIs (+2/+1) and a free Feat. The UI groups them into 'Origin' to keep narrative and mechanical roots together. ASIs are selected *within* the background card.",
          wireframe: (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">1. Select Species</span>
                <div className="flex gap-2">
                  {['Human', 'Elf', 'Dwarf', 'Orc'].map(sp => (
                    <span key={sp} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm">{sp}</span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">*Grants base speed, size, and legacy traits. No ASI.</p>
              </div>
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2 block">2. Select Background (Grants ASI & Feat)</span>
                <div className="bg-white border border-indigo-200 rounded-lg p-3">
                  <h4 className="font-bold text-slate-800">Acolyte</h4>
                  <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-2 text-xs">
                    <span className="text-slate-600">ASI Options: <strong className="text-indigo-600">WIS, INT, CHA</strong></span>
                    <span className="text-slate-600">Feat: <strong>Magic Initiate</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )
        };
      case 3:
        return {
          title: "Step 3: Ability Scores",
          uxFocus: "Visual Math. Beginners struggle with 'Base' vs 'Total'. Provide a drag-and-drop Standard Array interface where Background ASIs are clearly overlaid as +2 or +1 blocks on top.",
          wireframe: (
            <div>
              <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-lg w-fit">
                <button className="bg-white px-3 py-1 text-xs font-medium rounded shadow-sm text-slate-800">Standard Array</button>
                <button className="px-3 py-1 text-xs font-medium rounded text-slate-500">Point Buy</button>
                <button className="px-3 py-1 text-xs font-medium rounded text-slate-500">Roll</button>
              </div>
              <div className="space-y-2">
                {['STR', 'DEX', 'CON'].map((stat, i) => (
                  <div key={stat} className="flex items-center gap-4 bg-white border border-slate-200 p-2 rounded-lg">
                    <div className="w-12 text-center font-bold text-slate-700">{stat}</div>
                    <div className="flex-1 bg-slate-100 h-8 rounded border-dashed border-2 border-slate-300 flex items-center justify-center text-slate-400 text-xs">Drag 15, 14, 13...</div>
                    <div className="w-16 text-center text-xs">
                      {i === 0 ? <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-bold">+2 Origin</span> : <span className="text-slate-300">-</span>}
                    </div>
                    <div className="w-12 text-center text-xl font-serif">10</div>
                  </div>
                ))}
                <p className="text-center text-xs text-slate-400 italic">Showing 3 of 6 abilities...</p>
              </div>
            </div>
          )
        };
      case 4:
        return {
          title: "Step 4: Feats",
          uxFocus: "Contextual filtering. In 2024, at Level 1, players can *only* select 'Origin' category feats. The UI auto-filters this. If their background pre-selected one, this step acts mostly as configuration/confirmation.",
          wireframe: (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm">Background Feat Auto-Applied</h4>
                  <p className="text-xs text-emerald-600 mt-1">Your 'Acolyte' background grants <strong>Magic Initiate (Cleric)</strong>.</p>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-medium text-sm text-slate-800 mb-2">Configure Magic Initiate:</h4>
                <div className="space-y-2">
                  <select className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg p-2"><option>Select Cantrip 1</option></select>
                  <select className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg p-2"><option>Select Cantrip 2</option></select>
                  <select className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg p-2"><option>Select Level 1 Spell</option></select>
                </div>
              </div>
            </div>
          )
        };
      case 5:
        return {
          title: "Step 5: Equipment",
          uxFocus: "Anti-paralysis design. Default to Class 'Packages' (Option A vs Option B) rather than giving a beginner 100 gold and dropping them in a shop.",
          wireframe: (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-700">Choose Fighter Starting Gear</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-indigo-500 bg-indigo-50/30 rounded-xl p-4 relative">
                  <div className="absolute top-2 right-2 bg-indigo-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">Recommended</div>
                  <h4 className="font-bold text-slate-800 mb-2">Defense Pack</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Chain Mail (AC 16)</li>
                    <li>Longsword & Shield</li>
                    <li>Dungeoneer's Pack</li>
                  </ul>
                </div>
                <div className="border-2 border-slate-200 bg-white rounded-xl p-4 opacity-70">
                  <h4 className="font-bold text-slate-800 mb-2">Offense Pack</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Leather Armor & Bow</li>
                    <li>Greatsword</li>
                    <li>Explorer's Pack</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        };
      case 6:
        return {
          title: "Step 6: Summary & Export",
          uxFocus: "The payoff. Show immediately calculated derived stats (AC, HP, Save DCs). Give clear action items to Export to PDF, Save to Database, or push to VTT.",
          wireframe: (
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <div className="flex justify-between items-start border-b border-slate-700 pb-4 mb-4">
                <div>
                  <h2 className="text-2xl font-serif italic text-amber-400">Lyra Dawnstrider</h2>
                  <p className="text-sm text-slate-400">Level 1 Human Fighter (Acolyte)</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center"><div className="text-2xl font-bold bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl border border-slate-700">12</div><span className="text-[10px] text-slate-400 uppercase">Max HP</span></div>
                  <div className="text-center"><div className="text-2xl font-bold bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl border border-slate-700">18</div><span className="text-[10px] text-slate-400 uppercase">Armor (AC)</span></div>
                </div>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2">
                <Wand2 className="w-4 h-4" /> Finalize Character
              </button>
            </div>
          )
        };
      default: return { title: '', uxFocus: '', wireframe: <div/> };
    }
  };

  const content = getStepContent();

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="bg-white/50 backdrop-blur-sm border border-slate-200/60 p-8 rounded-3xl shadow-sm mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Character Wizard UX Design</h1>
          <p className="text-slate-500">
            A frictionless, beginner-friendly onboarding flow fully adapted to the D&D 2024 mechanics.
          </p>
        </div>
        <div className="hidden md:flex bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-100 items-center gap-2">
          <Heart className="w-4 h-4" /> Beginner Focused UI
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Progress Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Creation Flow</h3>
            <div className="space-y-1">
              {steps.map((step) => {
                const isCurrent = currentStep === step.id;
                const isPast = currentStep > step.id;
                const Icon = step.icon;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isCurrent ? 'bg-indigo-50 border border-indigo-100 flexshadow-sm' : 
                      isPast ? 'hover:bg-slate-50 opacity-70' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCurrent ? 'bg-indigo-600 text-white' : 
                      isPast ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isCurrent ? 'text-indigo-900' : 'text-slate-700'}`}>{step.title}</div>
                      <div className="text-[10px] text-slate-500">{step.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          
          <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-serif italic text-indigo-300">
                  {currentStep}
                </div>
                <h2 className="text-2xl font-serif">{content.title}</h2>
             </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Logic & UX Explanation */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">UX & Logic Rationale</h3>
              <p className="text-slate-600 leading-relaxed flex-1">
                {content.uxFocus}
              </p>
              
              <div className="pt-6 mt-4 flex gap-2">
                 <button 
                   onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                   disabled={currentStep === 1}
                   className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-30 transition-all"
                 >
                   Back
                 </button>
                 <button 
                   onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                   disabled={currentStep === 6}
                   className="flex-1 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                 >
                   {currentStep === 6 ? 'Finish' : 'Next Step'} <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            </div>

            {/* Wireframe Mockup */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                 Low-Fi Wireframe
              </h3>
              
              <div className="flex-1">
                {content.wireframe}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
