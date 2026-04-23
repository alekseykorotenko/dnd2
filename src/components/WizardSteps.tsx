import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { 
  classesData, speciesData, backgroundsData, featsData, spellsData,
  abilityNames, AbilityType, standardArray, calculateModifier, skillsList, weaponMasteriesData 
} from '../lib/dndData';
import { calculateLevelStats } from '../lib/classProgression';
import { CheckCircle2, Star, Backpack, User, Zap, BookOpen, UserPlus, GraduationCap, Sword, AlertTriangle, Download } from 'lucide-react';
import ActiveCharacterCard from './ActiveCharacterCard';
import CharacterSheetPDF from './CharacterSheetPDF';

export function StepClass() {
  const { char, setChar } = useCharacterContext();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200 text-sm">
        <strong className="font-bold">Правила 2024:</strong> Клас обирається першим. Це задає вектор розвитку та вказує, які характеристики є "Головними".
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {classesData.map(cls => (
          <button
            key={cls.id}
            onClick={() => setChar({ ...char, classId: cls.id, equipmentPackId: null })}
            className={`text-left p-6 rounded-2xl border-2 transition-all ${
              char.classId === cls.id 
                ? 'border-indigo-600 bg-indigo-50/50 shadow-md transform scale-[1.02]' 
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
              {char.classId === cls.id && <CheckCircle2 className="text-indigo-600 w-6 h-6" />}
            </div>
            <p className="text-sm text-slate-600 mb-4">{cls.description}</p>
            <div className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded font-medium">
              Головна Характеристика: {abilityNames[cls.primaryAbility]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepLevel() {
  const { char, setChar, getFinalAbility } = useCharacterContext();
  const currentClass = classesData.find(c => c.id === char.classId);
  const conScore = getFinalAbility('con');
  
  const currentSubclass = currentClass?.subclasses?.find(s => s.id === char.subclassId);
  const stats = currentClass ? calculateLevelStats(currentClass.id, char.level, currentClass.hitDie, conScore, currentClass.featuresByLevel, currentSubclass?.featuresByLevel) : null;

  // У D&D 2024 всі класи отримують підклас на 3 рівні
  const needsSubclass = char.level >= 3 && currentClass;

  // Автоматичний скид або вибір підкласу при зміні рівня
  React.useEffect(() => {
    if (char.level < 3 && char.subclassId !== null) {
      setChar(prev => ({ ...prev, subclassId: null }));
    } else if (char.level >= 3 && char.subclassId === null && currentClass?.subclasses?.length) {
      setChar(prev => ({ ...prev, subclassId: currentClass.subclasses[0].id }));
    }
  }, [char.level, char.subclassId, currentClass, setChar]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200 text-sm">
        <strong className="font-bold">Рівень Персонажа:</strong> Виберіть рівень (від 1 до 20). Характеристики автоматично підлаштуються під ваш вибір.
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-bold text-slate-700 mb-3">Оберіть рівень:</label>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={char.level}
            onChange={(e) => setChar({ ...char, level: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="text-2xl font-black text-indigo-600 w-12 text-center">{char.level}</div>
        </div>
      </div>

      {needsSubclass && (
        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <label className="block text-sm font-bold text-slate-700 mb-3">
            Підклас ({currentClass.name}):
          </label>
          <select 
            value={char.subclassId || ''}
            onChange={(e) => setChar({ ...char, subclassId: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800 shadow-sm"
          >
            <option value="" disabled>Оберіть підклас...</option>
            {currentClass.subclasses?.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
          {currentSubclass && (
            <p className="mt-3 text-sm text-slate-600">
              {currentSubclass.description}
            </p>
          )}
        </div>
      )}

      {stats && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Статистика на {char.level} рівні
            </h4>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-medium">Бонус Майстерності:</span> 
                <span className="font-bold text-indigo-600">+{stats.proficiencyBonus}</span>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-medium">Очки Здоров'я (HP):</span> 
                <span className="font-bold text-emerald-600">{stats.hitPoints}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-indigo-500" /> Особливості {char.level} рівня
            </h4>
            {stats.features.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                {stats.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">На цьому рівні немає нових класових здібностей.</p>
            )}
          </div>

          {stats.spellSlots && (
            <div className="md:col-span-2 bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <div className="flex justify-between items-center mb-4 border-b border-indigo-200 pb-2">
                 <h4 className="font-bold text-indigo-900">Комірки Заклинань та Доступна Магія</h4>
                 <div className="text-xs font-bold text-indigo-600 uppercase bg-white px-2 py-1 rounded shadow-sm">
                    {currentClass.name}
                 </div>
              </div>
              <div className="flex flex-wrap gap-2 text-sm mb-4">
                {stats.spellSlots.standard && stats.spellSlots.standard.map((slots, i) => (
                  <div key={i} className="bg-white border border-indigo-200 px-3 py-1.5 rounded-lg flex flex-col items-center">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase">Рівень {i + 1}</span>
                    <span className="font-black text-indigo-700">{slots}</span>
                  </div>
                ))}
                {stats.spellSlots.warlockPact && stats.spellSlots.warlockPact.slotsCount > 0 && (
                  <div className="bg-purple-100 border border-purple-300 px-4 py-2 rounded-lg flex flex-col items-center">
                    <span className="text-[10px] text-purple-600 font-bold uppercase">Магія {stats.spellSlots.warlockPact.slotLevel} рівня</span>
                    <span className="font-black text-purple-900">{stats.spellSlots.warlockPact.slotsCount} комірок</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-indigo-200/50">
                <p className="text-xs font-bold text-indigo-800 uppercase mb-2">Заклинання у вашому розпорядженні:</p>
                <div className="flex flex-wrap gap-1.5">
                   {spellsData
                     .filter(s => s.classes.includes(currentClass.id) && 
                        s.level <= (stats.spellSlots?.standard?.length || stats.spellSlots?.warlockPact?.slotLevel || 0))
                     .map(spell => (
                       <span key={spell.id} className="text-[10px] bg-white text-indigo-700 border border-indigo-100 px-2 py-1 rounded font-medium">
                         {spell.name} {spell.level === 0 ? '(Фокус)' : `(${spell.level})`}
                       </span>
                     ))
                   }
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function StepOrigin() {
  const { char, setChar } = useCharacterContext();
  const currentBackground = backgroundsData.find(b => b.id === char.backgroundId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">1. Оберіть Вид (Species)</h3>
        <p className="text-sm text-slate-600 mb-2">Нові правила: Вид впливає на риси, але <strong>не підвищує характеристики</strong>.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {speciesData.map(sp => (
            <button
              key={sp.id}
              onClick={() => {
                const firstSubtype = sp.subtypes && sp.subtypes.length > 0 ? sp.subtypes[0].id : null;
                setChar(prev => ({ 
                  ...prev, 
                  speciesId: sp.id, 
                  subtypeId: firstSubtype,
                  extraFeatId: sp.id === 'human' ? prev.extraFeatId : null 
                }));
              }}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                char.speciesId === sp.id ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-200'
              }`}
            >
              <div className="font-bold text-slate-900">{sp.name}</div>
              <div className="text-xs text-slate-600 mt-1">{sp.description}</div>
            </button>
          ))}
        </div>
      </div>

      {char.speciesId && speciesData.find(s => s.id === char.speciesId)?.subtypes && speciesData.find(s => s.id === char.speciesId)!.subtypes.length > 0 && (
        <div className="space-y-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200 animate-in fade-in slide-in-from-top-4">
          <h4 className="font-bold text-slate-800">Підвид ({speciesData.find(s => s.id === char.speciesId)?.name})</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {speciesData.find(s => s.id === char.speciesId)?.subtypes.map(sub => (
              <button
                key={sub.id}
                onClick={() => setChar(prev => ({ ...prev, subtypeId: sub.id }))}
                className={`text-left p-3 rounded-lg border-2 transition-all ${
                  char.subtypeId === sub.id ? 'border-amber-500 bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="font-bold text-sm text-slate-900">{sub.name}</div>
                <ul className="mt-2 text-xs text-slate-600 space-y-1">
                  {sub.traits.map((t: string, i: number) => <li key={i}>• {t}</li>)}
                </ul>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">2. Оберіть Передісторію (Background)</h3>
        <p className="text-sm text-slate-600 mb-2">Передісторія дозволяє підвищити характеристики та дає <strong>Рису Походження</strong>.</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {backgroundsData.map(bg => (
            <button
              key={bg.id}
              onClick={() => setChar({ ...char, backgroundId: bg.id, backgroundAsi: {} })}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                char.backgroundId === bg.id ? 'border-emerald-500 bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div className="font-bold text-slate-900">{bg.name}</div>
              <div className="text-[10px] uppercase text-emerald-600 font-bold mt-2">Дає рису:</div>
              <div className="text-xs text-slate-700">{bg.originFeatName}</div>
            </button>
          ))}
        </div>

        {currentBackground && (
          <div className="bg-white p-5 rounded-xl border-2 border-emerald-500 shadow-sm animate-in zoom-in-95">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Star className="w-6 h-6 text-emerald-500" /> Бонуси характеристик
              </h4>
              <button
                onClick={() => setChar(prev => ({ ...prev, backgroundAsi: currentBackground.defaultDistribution }))}
                className="text-xs bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl hover:bg-emerald-200 transition-all font-bold border border-emerald-200 shadow-sm flex items-center gap-2"
              >
                <span>Використати шаблон:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-emerald-100">
                  {Object.entries(currentBackground.defaultDistribution).map(([k, v]) => `+${v} ${abilityNames[k as AbilityType]}`).join(', ')}
                </span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 uppercase tracking-widest font-bold text-center">
                Оберіть опції вашої передісторії (макс. +3 бонуси разом, не більше +2 в одну характеристику)
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {currentBackground.asiOptions.map(opt => {
                  const currentVal = char.backgroundAsi[opt] || 0;
                  const totalUsed = (Object.values(char.backgroundAsi) as number[]).reduce((a, b) => a + (b || 0), 0);
                  const isMaxed = currentVal >= 2 || totalUsed >= 3;
                  
                  return (
                    <div key={opt} className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${currentVal > 0 ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50'}`}>
                      <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{abilityNames[opt]}</span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setChar(prev => {
                            const newVal = Math.max(0, (prev.backgroundAsi[opt] || 0) - 1);
                            const nextAsi = { ...prev.backgroundAsi };
                            if (newVal === 0) delete nextAsi[opt];
                            else nextAsi[opt] = newVal;
                            return { ...prev, backgroundAsi: nextAsi };
                          })}
                          className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-white hover:border-emerald-300 transition-all text-xl font-bold text-slate-400 hover:text-emerald-600 bg-white/50"
                        >
                          -
                        </button>
                        <div className="w-12 text-center font-black text-3xl text-emerald-600 drop-shadow-sm">
                          +{currentVal}
                        </div>
                        <button
                          disabled={isMaxed}
                          onClick={() => setChar(prev => ({
                            ...prev,
                            backgroundAsi: { ...prev.backgroundAsi, [opt]: (prev.backgroundAsi[opt] || 0) + 1 }
                          }))}
                          className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-white hover:border-emerald-300 transition-all text-xl font-bold text-slate-400 hover:text-emerald-600 bg-white/50 disabled:opacity-20 disabled:hover:border-slate-200 disabled:hover:text-slate-400 disabled:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="h-px flex-1 bg-slate-100" />
                <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                  Залишилося балів: <span className={3 - (Object.values(char.backgroundAsi) as number[]).reduce((a, b) => a + (b || 0), 0) > 0 ? "text-indigo-600" : "text-emerald-600"}>{3 - (Object.values(char.backgroundAsi) as number[]).reduce((a, b) => a + (b || 0), 0)}</span>
                </div>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function StepAbilities() {
  const { char, setChar, getFinalAbility } = useCharacterContext();
  const currentClass = classesData.find(c => c.id === char.classId);
  const usedValues = Object.values(char.baseAbilities).filter(v => v !== null) as number[];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
        <p className="text-sm text-purple-800">Розподіліть <strong>Стандартний набір</strong> (15, 14, 13, 12, 10, 8).</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center p-6">
        <div className="w-full max-w-2xl space-y-3">
          {Object.entries(abilityNames).map(([abKey, abName]) => {
            const ab = abKey as AbilityType;
            const isPrimary = currentClass?.primaryAbility === ab;
            const bonusTotal = char.backgroundAsi[ab] || 0;
            const finalScore = getFinalAbility(ab);
            const mod = calculateModifier(finalScore);
            
            return (
              <div key={ab} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${isPrimary ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-100 bg-slate-50'}`}>
                <div className="w-32 flex flex-col">
                  <span className="font-bold text-slate-800 uppercase text-xs tracking-wider">{abName}</span>
                  {isPrimary && <span className="text-[10px] text-indigo-600 font-bold">ГОЛОВНА</span>}
                </div>
                
                <div className="flex-1">
                  <select
                    value={char.baseAbilities[ab] || ''}
                    onChange={(e) => setChar(prev => ({
                      ...prev,
                      baseAbilities: { ...prev.baseAbilities, [ab]: e.target.value === '' ? null : Number(e.target.value) }
                    }))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none"
                  >
                    <option value="">- оберіть -</option>
                    {standardArray.map(val => (
                      <option key={val} value={val} disabled={usedValues.includes(val) && char.baseAbilities[ab] !== val}>{val}</option>
                    ))}
                  </select>
                </div>
                
                <div className="w-24 text-center text-xs text-slate-500 font-medium">
                  {bonusTotal > 0 ? <span className="text-emerald-600">+{bonusTotal} Походж.</span> : '--'}
                </div>

                <div className="w-16 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center text-xl font-serif">
                  {char.baseAbilities[ab] ? finalScore : '-'}
                </div>
                
                <div className="w-12 h-12 bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center font-bold">
                  {char.baseAbilities[ab] ? (mod >= 0 ? `+${mod}` : mod) : '-'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeatChoicesUI({ featId, type }: { featId: string, type: 'primary' | 'extra' }) {
  const { char, setChar } = useCharacterContext();
  const feat = featsData.find(f => f.id === featId);
  const data = char.featData[type] || {};

  const updateData = (newData: any) => {
    setChar(prev => ({
      ...prev,
      featData: {
        ...prev.featData,
        [type]: { ...(prev.featData[type] || {}), ...newData }
      }
    }));
  };

  if (featId === 'magic_initiate') {
    const spellLists = [
      { id: 'cleric', name: 'Жрець (Cleric)' },
      { id: 'druid', name: 'Друїд (Druid)' },
      { id: 'wizard', name: 'Маг (Wizard)' }
    ];
    
    const abilities = [
      { id: 'int', name: 'Інтелект' },
      { id: 'wis', name: 'Мудрість' },
      { id: 'cha', name: 'Харизма' }
    ];

    const currentList = data.spellList || '';
    const currentAbility = data.ability || '';

    const availableCantrips = spellsData.filter(s => s.level === 0 && s.classes.includes(currentList));
    const availableLvl1 = spellsData.filter(s => s.level === 1 && s.classes.includes(currentList));

    const selectedCantrips = data.cantrips || [];
    const selectedSpell = data.spell || '';

    return (
      <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-indigo-900 uppercase mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Список заклинань
            </label>
            <select 
              value={currentList}
              onChange={(e) => updateData({ spellList: e.target.value, cantrips: [], spell: '' })}
              className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm outline-none"
            >
              <option value="">— Оберіть клас —</option>
              {spellLists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-indigo-900 uppercase mb-1.5 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> Характеристика касту
            </label>
            <select 
              value={currentAbility}
              onChange={(e) => updateData({ ability: e.target.value })}
              className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm outline-none"
            >
              <option value="">— Оберіть параметр —</option>
              {abilities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        {currentList && (
          <div className="space-y-4 pt-2 border-t border-indigo-100">
            <div className="space-y-2">
               <label className="block text-[10px] font-bold text-indigo-900 uppercase">Оберіть 2 фокуси ({selectedCantrips.length}/2):</label>
               <div className="flex flex-wrap gap-2">
                 {availableCantrips.map(s => {
                   const isSelected = selectedCantrips.includes(s.id);
                   return (
                     <button
                       key={s.id}
                       disabled={!isSelected && selectedCantrips.length >= 2}
                       onClick={() => {
                         const next = isSelected 
                           ? selectedCantrips.filter((i: string) => i !== s.id)
                           : [...selectedCantrips, s.id];
                         updateData({ cantrips: next });
                       }}
                       className={`px-3 py-1 rounded-full text-xs transition-all border ${
                         isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-700 border-indigo-200 hover:border-indigo-400 disabled:opacity-30'
                       }`}
                     >
                       {s.name}
                     </button>
                   );
                 })}
               </div>
            </div>
            <div className="space-y-2">
               <label className="block text-[10px] font-bold text-indigo-900 uppercase">Оберіть 1 заклинання 1-го рівня:</label>
               <div className="flex flex-wrap gap-2">
                 {availableLvl1.map(s => {
                   const isSelected = selectedSpell === s.id;
                   return (
                     <button
                       key={s.id}
                       onClick={() => updateData({ spell: s.id })}
                       className={`px-3 py-1 rounded-full text-xs transition-all border ${
                         isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-700 border-indigo-200 hover:border-indigo-400'
                       }`}
                     >
                       {s.name}
                     </button>
                   );
                 })}
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (featId === 'skilled') {
    const selected = data.skills || [];
    return (
      <div className="mt-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
        <label className="block text-[10px] font-bold text-emerald-900 uppercase flex items-center gap-1">
          <UserPlus className="w-3 h-3" /> Оберіть 3 нові володіння ({selected.length}/3):
        </label>
        <div className="flex flex-wrap gap-2">
          {skillsList.map(skill => {
            const isSelected = selected.includes(skill.id);
            return (
              <button
                key={skill.id}
                disabled={!isSelected && selected.length >= 3}
                onClick={() => {
                  const next = isSelected 
                    ? selected.filter((i: string) => i !== skill.id)
                    : [...selected, skill.id];
                  updateData({ skills: next });
                }}
                className={`px-3 py-1 rounded-full text-xs transition-all border ${
                  isSelected ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400 disabled:opacity-30'
                }`}
              >
                {skill.name_ua}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

export function StepFeats() {
  const { char, setChar } = useCharacterContext();
  const currentBackground = backgroundsData.find(b => b.id === char.backgroundId);
  const primaryFeat = featsData.find(f => f.id === currentBackground?.featId);
  const currentSpecies = speciesData.find(s => s.id === char.speciesId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm text-amber-900 font-medium">
        У редакції 2024 року ви гарантовано отримуєте одну <strong>Рису Походження (Origin Feat)</strong> від вашої Передісторії.
      </div>
      
      {currentBackground && primaryFeat ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{primaryFeat.name}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Отримано від Передісторії: {currentBackground.name}</p>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm mb-2">{primaryFeat.description}</p>
          
          <FeatChoicesUI featId={primaryFeat.id} type="primary" />
        </div>
      ) : (
        <p className="text-rose-500 text-center py-10 font-medium bg-rose-50 rounded-xl">Будь ласка, оберіть Передісторію на кроці "Походження".</p>
      )}

      {currentSpecies?.id === 'human' && (
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200 shadow-sm mt-6">
          <div className="flex items-center gap-2 mb-2">
            <Sword className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-indigo-900">Гнучкість Людини (Додаткова Риса)</h3>
          </div>
          <p className="text-sm text-indigo-700 mb-4">Представники виду "Людина" отримують ще одну Рису Походження на вибір.</p>
          <select 
            value={char.extraFeatId || ''}
            onChange={(e) => setChar(prev => ({...prev, extraFeatId: e.target.value}))}
            className="w-full bg-white border border-indigo-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-4 font-bold text-slate-800"
          >
            <option value="" disabled>— Оберіть додаткову рису —</option>
            {featsData.filter(f => f.category === 'Origin' && f.id !== primaryFeat?.id).map(feat => (
              <option key={feat.id} value={feat.id}>{feat.name}</option>
            ))}
          </select>
          {char.extraFeatId && (
            <div className="p-4 bg-white rounded-xl shadow-sm border border-indigo-200 animate-in zoom-in-95">
              <h4 className="font-bold text-slate-900 mb-1">{featsData.find(f => f.id === char.extraFeatId)?.name}</h4>
              <p className="text-xs text-slate-700 mb-0">{featsData.find(f => f.id === char.extraFeatId)?.description}</p>
              
              <FeatChoicesUI featId={char.extraFeatId} type="extra" />
            </div>
          )}
        </div>
      )}

      {/* Риси загального розвитку (Level 4, 8, 12, 16, 19) */}
      {[4, 8, 12, 16, 19].map(lvl => {
        if (char.level < lvl) return null;
        const selectedId = char.levelFeatIds[lvl];
        const feat = featsData.find(f => f.id === selectedId);

        return (
          <div key={lvl} className="bg-purple-50 p-6 rounded-2xl border border-purple-200 shadow-sm mt-6 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-purple-900">Риса {lvl}-го рівня (General Feat)</h3>
            </div>
            <select 
              value={selectedId || ''}
              onChange={(e) => setChar(prev => ({
                ...prev, 
                levelFeatIds: { ...prev.levelFeatIds, [lvl]: e.target.value } 
              }))}
              className="w-full bg-white border border-purple-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 mb-4 font-bold text-slate-800"
            >
              <option value="">— Оберіть рису рівня —</option>
              {featsData.filter(f => f.category === 'General').map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            {feat && (
              <div className="p-4 bg-white rounded-xl shadow-sm border border-purple-200">
                <h4 className="font-bold text-slate-900 mb-1">{feat.name}</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{feat.description}</p>
                <FeatChoicesUI featId={feat.id} type={`level-${lvl}` as any} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function StepEquipment() {
  const { char, setChar } = useCharacterContext();
  const currentClass = classesData.find(c => c.id === char.classId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700">
        У 2024 році класи пропонують "Пакети Спорядження", щоб прискорити процес.
      </div>
      {currentClass ? (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Оберіть стартовий набір для класу: {currentClass.name}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {currentClass.equipmentPacks.map(pack => (
              <button
                key={pack.id}
                onClick={() => setChar(prev => ({...prev, equipmentPackId: pack.id}))}
                className={`text-left p-6 rounded-2xl border-2 transition-all ${
                  char.equipmentPackId === pack.id ? 'border-amber-500 bg-white shadow-md transform scale-[1.02]' : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                  <h4 className="font-bold text-slate-800 text-lg">{pack.name}</h4>
                  {char.equipmentPackId === pack.id && <CheckCircle2 className="text-amber-500 w-6 h-6" />}
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  {pack.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> {item}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-rose-500 text-center py-10 font-medium bg-rose-50 rounded-xl">Будь ласка, оберіть Клас на 1 кроці.</p>
      )}
    </div>
  );
}

export function StepWeaponMastery() {
  const { char, setChar } = useCharacterContext();
  const currentClass = classesData.find(c => c.id === char.classId);
  const masteryAllowedClasses = ['barbarian', 'fighter', 'paladin', 'ranger', 'rogue'];
  const isEligible = masteryAllowedClasses.includes(char.classId || '');
  
  const count = char.classId === 'fighter' ? 3 : 2;
  const selected = char.chosenMasteries || [];

  const toggleMastery = (id: string) => {
    if (selected.includes(id)) {
      setChar(prev => ({ ...prev, chosenMasteries: prev.chosenMasteries?.filter(m => m !== id) }));
    } else if (selected.length < count) {
      setChar(prev => ({ ...prev, chosenMasteries: [...(prev.chosenMasteries || []), id] }));
    }
  };

  if (!isEligible) {
    return (
      <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-10 text-center text-slate-500">
        Ваш клас ({currentClass?.name}) не володіє Майстерністю зброї. Ви можете пропустити цей крок.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm text-amber-900 flex items-start gap-3">
        <Sword className="w-5 h-5 mt-0.5 shrink-0" />
        <div>
          <strong className="font-bold">Майстерність зброї (D&D 2024):</strong> Ваш клас дозволяє обрати <strong>{count}</strong> властивості майстерності. Ці властивості відкривають специфічні бойові прийоми при використанні відповідної зброї.
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {weaponMasteriesData.map(mastery => {
          const isSelected = selected.includes(mastery.id);
          const isDisabled = !isSelected && selected.length >= count;
          
          return (
            <button
              key={mastery.id}
              disabled={isDisabled}
              onClick={() => toggleMastery(mastery.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                  : isDisabled ? 'opacity-40 cursor-not-allowed border-slate-100 bg-slate-50' : 'border-slate-200 hover:border-indigo-300 bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-slate-900 uppercase text-xs tracking-wider">{mastery.name}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-600 leading-tight">{mastery.description}</p>
            </button>
          );
        })}
      </div>
      
      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
        Обрано {selected.length} з {count}
      </div>
    </div>
  );
}

export function StepSummary() {
  const { char } = useCharacterContext();

  const currentSpecies = speciesData.find(s => s.id === char.speciesId);
  const needsSubtype = currentSpecies && currentSpecies.subtypes && currentSpecies.subtypes.length > 0;
  const needsSubclass = char.level >= 3 && char.classId !== null;
  
  const isComplete = Boolean(
    char.classId && 
    char.speciesId && 
    char.backgroundId && 
    char.equipmentPackId && 
    !Object.values(char.baseAbilities).includes(null) &&
    (!needsSubtype || char.subtypeId) &&
    (!needsSubclass || char.subclassId)
  );

  const handleDownloadPDF = () => {
    // Тригеримо стандартне вікно друку браузера
    // В налаштуваннях друку користувач може обрати "Зберегти як PDF"
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {!isComplete && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200 text-sm font-medium">
          Ви заповнили не всі обов'язкові поля. Будь ласка, перевірте попередні кроки.
        </div>
      )}

      {isComplete ? (
        <div className="space-y-8">
          <div className="print:hidden">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4 flex items-center gap-3">
              <Star className="w-5 h-5 text-indigo-500" />
              <p className="text-xs text-indigo-800 font-medium tracking-tight">
                Ваш персонаж готовий! Натисніть кнопку нижче, щоб сформувати лист у форматі PDF. 
                <span className="block mt-1 text-[10px] text-indigo-400">Порада: У вікні друку оберіть "Зберегти як PDF".</span>
              </p>
            </div>
          </div>
          
          {/* Сам лист персонажа */}
          <CharacterSheetPDF />
          
          {/* Кнопка завантаження внизу */}
          <div className="pt-8 border-t border-slate-200 print:hidden">
             <button 
                onClick={handleDownloadPDF}
                className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-950 text-white font-black py-5 rounded-2xl text-xl shadow-2xl transition-all flex justify-center items-center gap-3 group active:scale-[0.98]"
             >
                <Download className="w-7 h-7 text-indigo-400 group-hover:scale-110 transition-transform" /> 
                <span>ЗАВАНТАЖИТИ PDF</span>
             </button>
             <div className="mt-4 flex flex-col items-center">
               <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                 ГЕНЕРОВАНО НА DNDME.CLUB
               </p>
               <p className="text-[9px] text-slate-300 mt-1 uppercase font-medium">
                 Відповідає стандартам DnD 2024
               </p>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-10 text-center text-slate-500">
          Лист персонажа з'явиться тут, щойно ви заповните всі основні дані на попередніх етапах.
        </div>
      )}
    </div>
  );
}
