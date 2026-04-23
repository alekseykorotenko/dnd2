import React, { useMemo } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { classesData, speciesData, backgroundsData, featsData, spellsData } from '../lib/dndData';
import { calculateLevelStats } from '../lib/classProgression';
import { Shield, Heart, Zap, Dna, BookOpen, Star, Sparkles, Wand2, Sword } from 'lucide-react';
import { weaponMasteriesData } from '../lib/dndData';

export default function ActiveCharacterCard() {
  const { char, setChar, getFinalAbility } = useCharacterContext();
  
  // Здобуваємо необхідні дані з довідників
  const currentClass = classesData.find(c => c.id === char.classId);
  const currentSpecies = speciesData.find(s => s.id === char.speciesId);
  const currentSubtype = currentSpecies?.subtypes?.find(s => s.id === char.subtypeId);
  const currentBackground = backgroundsData.find(b => b.id === char.backgroundId);
  
  // Знаходимо фінальну Витривалість та розраховуємо класову статистику
  const conScore = getFinalAbility('con');
  const currentSubclass = currentClass?.subclasses?.find(s => s.id === char.subclassId);
  const levelStats = currentClass && char.level 
    ? calculateLevelStats(
        currentClass.id, 
        char.level, 
        currentClass.hitDie, 
        conScore, 
        currentClass.featuresByLevel, 
        currentSubclass?.featuresByLevel
      ) 
    : null;

  // Динамічний пошук заклинань
  const maxSpellLevel = useMemo(() => {
    if (!levelStats || !levelStats.spellSlots) return -1;
    if (levelStats.spellSlots.standard && levelStats.spellSlots.standard.length > 0) {
      return levelStats.spellSlots.standard.length;
    }
    if (levelStats.spellSlots.warlockPact) {
      return levelStats.spellSlots.warlockPact.slotLevel;
    }
    return 0;
  }, [levelStats]);

  const availableSpells = useMemo(() => {
    if (!currentClass || maxSpellLevel < 0) return [];
    return spellsData.filter(spell => 
      spell.classes.includes(currentClass.id) && spell.level <= maxSpellLevel
    );
  }, [currentClass, maxSpellLevel]);

  if (!currentClass || !currentSpecies || !currentBackground) {
    return (
      <div className="bg-slate-50 border border-slate-200 text-slate-500 p-6 rounded-xl text-center italic">
        Заповніть попередні кроки (Клас, Вид, Передісторія), щоб побачити картку персонажа.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border-2 border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Шапка Картки */}
      <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-serif font-bold text-amber-400 mb-1">Ваш Герой</h2>
            <div className="flex flex-col items-start gap-1 text-slate-300 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" /> 
                <span className="font-medium text-white">{currentClass.name}</span>
              </div>
              {currentSubclass && (
                <div className="text-xs text-amber-200 bg-amber-900/30 px-2 py-0.5 rounded border border-amber-800/50 mt-1">
                  Підклас: {currentSubclass.name}
                </div>
              )}
            </div>
          </div>

          {/* Вибір Рівня (Dropdown) */}
          <div className="flex flex-col items-end">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Рівень Персонажа</label>
            <select
              value={char.level}
              onChange={(e) => setChar(prev => ({ ...prev, level: parseInt(e.target.value) }))}
              className="bg-slate-800 border box-border border-slate-600 text-amber-400 font-black text-xl rounded-lg px-3 py-1 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer text-center"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(l => (
                <option key={l} value={l}>Рівень {l}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Декоративний елемент фону */}
        <Shield className="absolute -right-4 -bottom-10 w-48 h-48 text-slate-800 opacity-50 z-0 pointer-events-none" />
      </div>

      {/* Тіло Картки */}
      <div className="p-6 space-y-6 bg-slate-50">
        
        {/* Блок: Вид та Передісторія */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Висока картка виду для більшого об'єму даних */}
          <div className="bg-white border border-slate-200 p-4 justify-between flex flex-col rounded-xl shadow-sm">
            <div>
              <div className="text-xs flex items-center gap-1 font-bold text-slate-400 uppercase mb-2">
                <Dna className="w-4 h-4 text-indigo-500" />
                Вид
              </div>
              <div className="text-lg font-bold text-slate-800">{currentSpecies.name}</div>
              {currentSubtype && (
                <div className="text-sm font-medium text-indigo-700 mt-0.5">
                  Підвид: {currentSubtype.name}
                </div>
              )}
            </div>
            
            {/* Особливості виду */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Риси виду:</div>
              <ul className="text-xs text-slate-600 space-y-1">
                {currentSpecies.traits.map((t, i) => <li key={i}>• {t}</li>)}
                {currentSubtype?.traits.map((t, i) => <li key={`sub-${i}`}>• {t}</li>)}
              </ul>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 justify-between flex flex-col rounded-xl shadow-sm">
            <div>
              <div className="text-xs flex items-center gap-1 font-bold text-slate-400 uppercase mb-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Передісторія
              </div>
              <div className="text-lg font-bold text-slate-800 mb-1">{currentBackground.name}</div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Риси (Feats):</div>
              <div className="space-y-1.5">
                {currentBackground.originFeatName && (
                  <div className="text-xs flex items-start gap-1.5 font-medium text-slate-700 bg-slate-50 px-2 py-1.5 rounded-md border border-slate-100">
                    <Star className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Від передісторії:</strong> {currentBackground.originFeatName}</span>
                  </div>
                )}
                {char.extraFeatId && (
                  <div className="text-xs flex items-start gap-1.5 font-medium text-slate-700 bg-slate-50 px-2 py-1.5 rounded-md border border-slate-100">
                    <Star className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Додаткова риса:</strong> {featsData.find(f => f.id === char.extraFeatId)?.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Динамічні Статки (залежать від рівня) */}
        {levelStats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="border border-slate-200 bg-white p-3 flex flex-col items-center justify-center rounded-xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 text-center">Макс. Здоров'я</span>
                <div className="flex items-center gap-1.5 text-2xl font-black text-rose-600">
                  <Heart className="w-5 h-5 fill-rose-600" />
                  {levelStats.hitPoints}
                </div>
              </div>

              <div className="border border-slate-200 bg-white p-3 flex flex-col items-center justify-center rounded-xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 text-center">Бонус Майстерності</span>
                <div className="flex items-center gap-1 text-2xl font-black text-indigo-600">
                  <Zap className="w-5 h-5 fill-indigo-600" />
                  +{levelStats.proficiencyBonus}
                </div>
              </div>

              <div className="border border-slate-200 bg-white p-3 flex flex-col items-center justify-center rounded-xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 text-center">Кістка Здоров'я</span>
                <div className="text-xl font-bold text-slate-800 mt-1">{levelStats.level}d{currentClass.hitDie}</div>
              </div>

              <div className="border border-slate-200 bg-white p-3 flex flex-col items-center justify-center rounded-xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 text-center">Заклинання</span>
                <div className="text-lg font-bold text-slate-800 mt-1">
                  {levelStats.spellSlots ? `Рівень 0-${maxSpellLevel}` : 'Немає'}
                </div>
              </div>
            </div>
            
            {/* Особливості Класу та Підкласу */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Отримані класові здібності (Рівень {char.level})
              </h3>
              {levelStats.features.length > 0 ? (
                <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                  {levelStats.features.map((f, i) => (
                    <li key={i} className="text-sm flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span className="text-slate-700 font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">На цьому рівні ви не отримали нових унікальних класових здібностей.</p>
              )}
            </div>
            
            {/* Майстерність зброї */}
            {char.chosenMasteries && char.chosenMasteries.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2 mb-3">
                  <Sword className="w-4 h-4 text-slate-600" />
                  Майстерність зброї
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {char.chosenMasteries.map(mId => {
                    const mastery = weaponMasteriesData.find(wm => wm.id === mId);
                    return (
                      <div key={mId} className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 italic text-slate-700">
                        <strong className="text-indigo-700 not-italic uppercase tracking-tighter mr-1">{mastery?.name}:</strong> {mastery?.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Доступні Заклинання */}
            {levelStats.spellSlots && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-end mb-4 border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-purple-500" />
                    Доступні заклинання для {currentClass.name}
                  </h3>
                  <div className="text-xs font-medium text-slate-500">Всього у базі: {availableSpells.length}</div>
                </div>
                
                {availableSpells.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableSpells.map(spell => (
                      <span key={spell.id} className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-1 rounded-md font-medium">
                        {spell.name} {spell.level === 0 ? '(0)' : `(${spell.level})`}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">У базі немає заклинань відповідного рівня для цього класу.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
