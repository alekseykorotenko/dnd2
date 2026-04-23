import React, { useMemo, useRef } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { classesData, speciesData, backgroundsData, abilityNames, calculateModifier, skillsList } from '../lib/dndData';
import { calculateLevelStats } from '../lib/classProgression';
import { Download, Camera, User, Pencil } from 'lucide-react';

export default function CharacterSheetPDF() {
  const { char, setChar, getFinalAbility } = useCharacterContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentClass = classesData.find(c => c.id === char.classId);
  const currentSpecies = speciesData.find(s => s.id === char.speciesId);
  const currentSubtype = currentSpecies?.subtypes?.find(s => s.id === char.subtypeId);
  const currentBackground = backgroundsData.find(b => b.id === char.backgroundId);
  const currentSubclass = currentClass?.subclasses?.find(s => s.id === char.subclassId);

  const conScore = getFinalAbility('con');
  const levelStats = currentClass 
    ? calculateLevelStats(
        currentClass.id, 
        char.level, 
        currentClass.hitDie, 
        conScore, 
        currentClass.featuresByLevel, 
        currentSubclass?.featuresByLevel
      ) 
    : null;

  const stats = useMemo(() => {
    const scores: Record<string, number> = {
      str: getFinalAbility('str'),
      dex: getFinalAbility('dex'),
      con: getFinalAbility('con'),
      int: getFinalAbility('int'),
      wis: getFinalAbility('wis'),
      cha: getFinalAbility('cha'),
    };
    const mods: Record<string, number> = {
      str: calculateModifier(scores.str),
      dex: calculateModifier(scores.dex),
      con: calculateModifier(scores.con),
      int: calculateModifier(scores.int),
      wis: calculateModifier(scores.wis),
      cha: calculateModifier(scores.cha),
    };
    return { scores, mods };
  }, [char, getFinalAbility]);

  if (!currentClass || !currentSpecies || !currentBackground) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChar(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto bg-white shadow-2xl p-0 font-sans text-slate-900 print:shadow-none print:m-0 print:p-0">
      <div id="pdf-content" className="p-10 space-y-8 bg-white min-h-[1414px]">
        {/* Page 1 Header - Biography */}
        <div className="flex gap-6">
          <div className="w-2/5 space-y-4">
            <div className="border-[3px] border-slate-900 p-6 h-32 flex flex-col justify-center relative group">
              <input 
                type="text" 
                value={char.name}
                onChange={(e) => setChar(prev => ({ ...prev, name: e.target.value }))}
                className="text-2xl font-black uppercase tracking-tighter text-slate-900 bg-transparent border-none outline-none w-full focus:ring-2 focus:ring-indigo-200 rounded px-1 transition-all"
                placeholder="ІМ'Я ГЕРОЯ"
              />
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-30 transition-opacity print:hidden">
                <Pencil className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0 border-[2px] border-slate-900">
               <div className="p-2 border-r border-b border-slate-900">
                 <div className="text-xs font-bold text-slate-900">{currentSpecies.name}</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400">Раса</div>
               </div>
               <div className="p-2 border-b border-slate-900">
                 <div className="text-xs font-bold text-slate-900">{currentSubtype?.name || '—'}</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400">Етнос</div>
               </div>
               <div className="p-2 border-r border-b border-slate-900">
                 <div className="text-xs font-bold text-slate-900">{currentClass.name}</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400">Клас</div>
               </div>
               <div className="p-2 border-b border-slate-900">
                 <div className="text-xs font-bold text-slate-900">{currentSubclass?.name || '—'}</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400">Спеціалізація</div>
               </div>
               <div className="p-2 border-r border-slate-900">
                 <div className="text-xs font-bold text-slate-900">{currentBackground.name}</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400">Типаж</div>
               </div>
               <div className="p-2">
                 <div className="text-xs font-bold text-slate-900">Мудрий</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400">Головна риса</div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-0 border-[2px] border-slate-900 grayscale">
               <div className="p-2 border-r border-b border-slate-900">
                 <div className="text-xs font-bold text-slate-900">Чоловік</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400">Гендер фіз</div>
               </div>
               <div className="p-2 border-b border-slate-900">
                 <div className="text-xs font-bold text-slate-900">Цисгендер</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400">Самоприйняття</div>
               </div>
               <div className="p-2 border-r border-slate-900">
                 <div className="text-xs font-bold text-slate-900">25 років</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400">Вік</div>
               </div>
               <div className="p-2">
                 <div className="text-xs font-bold text-slate-900">180 см / 75 кг</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400">Зріст / Вага</div>
               </div>
            </div>

            <div className="border-[2px] border-slate-900 p-3 space-y-4">
              <div>
                <div className="text-[9px] uppercase font-black text-slate-400 border-b border-slate-200 mb-1">Володіння зброєю</div>
                <div className="text-[10px] font-bold text-slate-900">
                  {currentClass.id === 'fighter' || currentClass.id === 'paladin' || currentClass.id === 'barbarian' || currentClass.id === 'ranger' 
                    ? 'Проста зброя, Військова зброя' : 'Проста зброя'}
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-black text-slate-400 border-b border-slate-200 mb-1">Володіння мовами</div>
                <div className="text-[10px] font-bold text-slate-900">Спільна, Ельфійська, Драконяча</div>
              </div>
            </div>
          </div>

          <div className="w-3/5 flex flex-col">
            <div className="flex justify-end gap-4 mb-4">
               <div className="border-[3px] border-slate-900 p-2 text-center w-16 h-20 flex flex-col justify-center bg-slate-50">
                  <div className="text-2xl font-black leading-none">{char.level}</div>
                  <div className="text-[8px] uppercase font-black text-slate-500 mt-1">Рівень</div>
               </div>
               <div className="border-[3px] border-slate-900 p-2 text-center w-16 h-20 flex flex-col justify-center bg-slate-50">
                  <div className="text-2xl font-black leading-none">+{levelStats?.proficiencyBonus}</div>
                  <div className="text-[8px] uppercase font-black text-slate-500 mt-1">БМ</div>
               </div>
            </div>
            <div 
              className="flex-1 bg-slate-50 border-[3px] border-slate-900 relative min-h-[300px] cursor-pointer group overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
               {char.avatar ? (
                 <img src={char.avatar} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                   <User className="w-24 h-24 mb-2" />
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 transition-colors print:hidden">Завантажити фото</div>
                 </div>
               )}
               <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center print:hidden">
                 <Camera className="w-12 h-12 text-white" />
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleAvatarUpload} 
                 className="hidden" 
                 accept="image/*"
               />
            </div>
          </div>
        </div>

        {/* Core Stats Section */}
        <div className="grid grid-cols-12 gap-0 border-[3px] border-slate-900">
          <div className="col-span-2 p-4 border-r-[2px] border-slate-900 flex flex-col items-center justify-center grayscale">
            <div className="text-[9px] uppercase font-black text-slate-500 mb-1">БРОНЯ</div>
            <div className="text-5xl font-black">14</div>
          </div>
          <div className="col-span-2 p-4 border-r-[2px] border-slate-900 flex flex-col items-center justify-center grayscale">
            <div className="text-[9px] uppercase font-black text-slate-500 mb-1">ІНІЦІАТИВА</div>
            <div className="text-5xl font-black">{stats.mods.dex >= 0 ? `+${stats.mods.dex}` : stats.mods.dex}</div>
          </div>
          <div className="col-span-3 p-4 border-r-[2px] border-slate-900 flex flex-col items-center justify-center">
             <div className="text-[9px] uppercase font-black text-slate-500 mb-1">ЗДОРОВ'Я <span className="text-slate-300 ml-1">/ {levelStats?.hitPoints}</span></div>
             <div className="text-5xl font-black text-slate-900">{levelStats?.hitPoints}</div>
          </div>
          <div className="col-span-2 p-4 border-r-[2px] border-slate-900 flex flex-col items-center justify-center grayscale">
            <div className="text-[9px] uppercase font-black text-slate-500 mb-1">ШВИДКІСТЬ</div>
            <div className="text-5xl font-black">30</div>
          </div>
          <div className="col-span-3 p-4 flex flex-col items-center justify-center grayscale">
            <div className="text-[9px] uppercase font-black text-slate-500 mb-1">КІСТКА ХП</div>
            <div className="text-4xl font-black">d{currentClass.hitDie}</div>
          </div>
        </div>

        {/* Ability Scores Grid */}
        <div className="grid grid-cols-6 gap-2">
          {(Object.entries(abilityNames) as Array<[keyof typeof abilityNames, string]>).map(([key, name]) => (
            <div key={key} className="border-[2px] border-slate-900 p-2 text-center flex flex-col items-center h-28 justify-between relative overflow-hidden">
               <div className="text-[8px] font-black uppercase text-slate-400 z-10">{name}</div>
               <div className="text-4xl font-black z-10">{stats.mods[key] >= 0 ? `+${stats.mods[key]}` : stats.mods[key]}</div>
               <div className="bg-slate-50 border-t border-slate-900 w-full pt-1 px-1 flex justify-between items-center z-10">
                 <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">БАЗ:</span>
                 <span className="text-xs font-black leading-none">{stats.scores[key]}</span>
               </div>
               {/* Decorative faint letters */}
               <div className="absolute top-2 left-1/2 -translate-x-1/2 text-7xl font-black text-slate-50 opacity-[0.03] pointer-events-none uppercase">{key}</div>
            </div>
          ))}
        </div>

        {/* Skills & Features Section */}
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-4 border-[2px] border-slate-900 p-4">
            <h3 className="text-[10px] font-black uppercase border-b-2 border-slate-900 mb-2">Навички та Вміння</h3>
            <div className="space-y-1">
              {skillsList.map(skill => {
                const skillAbMap: Record<string, string> = {
                  acrobatics: 'dex', animal_handling: 'wis', arcana: 'int', athletics: 'str', deception: 'cha', history: 'int',
                  insight: 'wis', intimidation: 'cha', investigation: 'int', medicine: 'wis', nature: 'int', perception: 'wis',
                  performance: 'cha', persuasion: 'cha', religion: 'int', sleight_of_hand: 'dex', stealth: 'dex', survival: 'wis'
                };
                const abKey = skillAbMap[skill.id];
                const mod = stats.mods[abKey];
                return (
                  <div key={skill.id} className="flex justify-between items-center py-0.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{skill.name_ua}</span>
                    <span className="text-xs font-black">{mod >= 0 ? `+${mod}` : mod}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-span-8 space-y-6">
            <div className="border-[2px] border-slate-900 p-4">
              <h3 className="text-[10px] font-black uppercase border-b-2 border-slate-900 mb-2 tracking-widest text-slate-400">Особливості та риси</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                   <div className="text-[8px] font-black uppercase text-indigo-600 mb-1">Риси виду</div>
                   <div className="flex flex-wrap gap-1">
                     {[...(currentSpecies.traits || []), ...(currentSubtype?.traits || [])].map((t, i) => (
                       <span key={i} className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-sm border border-indigo-100">{t}</span>
                     ))}
                   </div>
                </div>
                <div>
                   <div className="text-[8px] font-black uppercase text-emerald-600 mb-1">Риси походження</div>
                   <div className="text-[10px] font-bold text-slate-800">{currentBackground.originFeatName}</div>
                </div>
                {char.chosenMasteries && char.chosenMasteries.length > 0 && (
                  <div className="col-span-1">
                    <div className="text-[8px] font-black uppercase text-slate-600 mb-1">Майстерність зброї</div>
                    <div className="flex flex-wrap gap-1">
                       {char.chosenMasteries.map(m => (
                         <span key={m} className="text-[9px] px-2 py-0.5 bg-slate-100 font-bold uppercase tracking-tighter border border-slate-200">{m}</span>
                       ))}
                    </div>
                  </div>
                )}
                {levelStats?.features && levelStats.features.length > 0 && (
                  <div className="col-span-2">
                    <div className="text-[8px] font-black uppercase text-amber-600 mb-1">Здібності {currentClass.name} (Рівень {char.level})</div>
                    <div className="grid grid-cols-2 gap-1 gap-x-4">
                      {levelStats.features.map((f, i) => (
                        <div key={i} className="text-[9px] flex gap-2 items-center">
                          <span className="w-1 h-1 bg-amber-500 rounded-full" />
                          <span className="font-medium">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Equipment Preview */}
            <div className="border-[2px] border-slate-900 p-4">
               <h3 className="text-[10px] font-black uppercase border-b-2 border-slate-900 mb-2">Спорядження (Стартовий пакет)</h3>
               <div className="text-[10px] font-medium text-slate-700 italic">
                 {currentClass.equipmentPacks.find(p => p.id === char.equipmentPackId)?.items.join(', ') || '—'}
               </div>
            </div>
          </div>
        </div>

        {/* Page Footer / Stats Info */}
        <div className="mt-auto pt-8 flex items-end justify-between border-t-2 border-slate-100 opacity-30">
          <div className="text-[10px] font-black uppercase tracking-[0.4em]">DNDME.CLUB</div>
          <div className="text-[8px] font-bold text-slate-400">Сторінка 1 / 1</div>
        </div>
      </div>
      
      {/* Styles for print-to-pdf */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          @page {
            size: A4;
            margin: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          #pdf-content {
            box-shadow: none;
            border: none;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}

