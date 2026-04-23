/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import CharacterWizard from './components/CharacterWizard';
import CharacterSheet from './components/CharacterSheet';
import SpellsCatalog from './components/SpellsCatalog';
import { LayoutTemplate, Settings2, FileText, Book } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<'manual' | 'sheet' | 'spells'>('manual');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm font-serif italic text-xl">
                24
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-slate-900 tracking-tight hidden lg:inline">D&D Майстерня</span>
              </div>
            </div>
            
            <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 text-sm overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setMode('manual')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  mode === 'manual' 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <LayoutTemplate className="w-4 h-4" />
                <span className="hidden sm:inline">Створення</span>
                <span className="sm:hidden">Мануал</span>
              </button>
              <button
                onClick={() => setMode('sheet')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  mode === 'sheet' 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Аркуш Персонажа</span>
                <span className="sm:hidden">Аркуш</span>
              </button>
              <button
                onClick={() => setMode('spells')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  mode === 'spells' 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <Book className="w-4 h-4" />
                <span className="hidden sm:inline">Заклинання</span>
                <span className="sm:hidden">Магія</span>
              </button>
            </nav>

            <div className="text-right hidden md:block">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 flex items-center gap-2">
                <Settings2 className="w-3 h-3" /> Укр
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full bg-slate-50/50 print:bg-white text-slate-900">
        {mode === 'manual' && <CharacterWizard />}
        {mode === 'sheet' && <CharacterSheet />}
        {mode === 'spells' && <SpellsCatalog />}
      </main>
      
      <footer className="py-6 text-center text-slate-400 text-xs font-medium uppercase tracking-widest bg-white border-t border-slate-200 print:hidden">
        <p>Побудовано з дотриманням нової архітектури 5e 2024</p>
      </footer>
    </div>
  );
}
