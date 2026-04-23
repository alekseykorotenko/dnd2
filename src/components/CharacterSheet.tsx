import React from 'react';
import { Printer } from 'lucide-react';

// Попередньо заповнені дані для демонстрації аркуша (УКР)
const mockCharacter = {
  name: 'Ельдоран',
  classLevel: 'Воїн 3 / Чарівник 1',
  background: 'Оборонець',
  species: 'Вищий Ельф',
  alignment: 'Хаотично Добрий',
  xp: '2700',
  profBonus: '+2',
  ac: '16',
  initiative: '+3',
  speed: '9 метрів',
  hp: { max: 32, current: 32, temp: 0 },
  hitDice: '3d10, 1d6',
  stats: [
    { name: 'Сила', score: 16, mod: '+3', save: true },
    { name: 'Спритність', score: 14, mod: '+2', save: false },
    { name: 'Витривалість', score: 15, mod: '+2', save: true },
    { name: 'Інтелект', score: 14, mod: '+2', save: false },
    { name: 'Мудрість', score: 10, mod: '+0', save: false },
    { name: 'Харизма', score: 8, mod: '-1', save: false },
  ],
  skills: [
    { name: 'Акробатика', stat: 'Спр', mod: '+2', prof: false },
    { name: 'Атлетика', stat: 'Сил', mod: '+5', prof: true },
    { name: 'Виживання', stat: 'Муд', mod: '+0', prof: false },
    { name: 'Виконання', stat: 'Хар', mod: '-1', prof: false },
    { name: 'Догляд за тваринами', stat: 'Муд', mod: '+0', prof: false },
    { name: 'Залякування', stat: 'Хар', mod: '+1', prof: true },
    { name: 'Історія', stat: 'Інт', mod: '+4', prof: true },
    { name: 'Магія', stat: 'Інт', mod: '+2', prof: false },
    { name: 'Медицина', stat: 'Муд', mod: '+0', prof: false },
    { name: 'Непомітність', stat: 'Спр', mod: '+2', prof: false },
    { name: 'Обман', stat: 'Хар', mod: '-1', prof: false },
    { name: 'Переконання', stat: 'Хар', mod: '-1', prof: false },
    { name: 'Природа', stat: 'Інт', mod: '+2', prof: false },
    { name: 'Проникливість', stat: 'Муд', mod: '+2', prof: true },
    { name: 'Релігія', stat: 'Інт', mod: '+2', prof: false },
    { name: 'Розслідування', stat: 'Інт', mod: '+2', prof: false },
    { name: 'Спритність рук', stat: 'Спр', mod: '+2', prof: false },
    { name: 'Уважність', stat: 'Муд', mod: '+2', prof: true },
  ],
  attacks: [
    { name: 'Довгий меч', bonus: '+5', damage: '1d8+3 Руб', type: 'Зброя (Ближня)' },
    { name: 'Довгий лук', bonus: '+4', damage: '1d8+2 Кол', type: 'Зброя (Дальня)' },
    { name: 'Вогняний снаряд', bonus: '+4', damage: '1d10 Вогн', type: 'Фокус' },
  ],
  spells: [
    { name: 'Чарівна стріла', level: '1' },
    { name: 'Щит', level: '1' },
    { name: 'Сон', level: '1' },
  ],
  equipment: 'Ланцюгова сорочка, Довгий меч, Щит, Набір дослідника підземель, 2 зілля лікування, мотузка 15м.',
  features: 'Друге дихання, Сплеск дій, Вміння зброї, Транс, Темний зір, Риса: Пильний.',
  coins: { cp: 0, sp: 20, ep: 0, gp: 45, pp: 0 }
};

export default function CharacterSheet() {
  const printSheet = () => {
    window.print();
  };

  return (
    <div className="bg-slate-200 min-h-screen py-8 px-4 print:p-0 print:bg-white flex justify-center">
      
      {/* Кнопка друку (прихована при друку) */}
      <button 
        onClick={printSheet}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 print:hidden z-50 flex items-center justify-center"
        aria-label="Друк Аркуша"
      >
        <Printer className="w-6 h-6" />
      </button>

      {/* Паперовий контейнер (A4 формат) */}
      <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl print:shadow-none p-6 md:p-10 text-xs sm:text-sm text-black">
        
        {/* Заголовок Персонажа */}
        <div className="border-b-4 border-slate-800 pb-4 mb-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-serif font-bold text-slate-900 border-b-2 border-slate-300 mb-1">{mockCharacter.name}</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ім'я Персонажа</span>
          </div>
          
          <div className="flex-[2] grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <div className="font-bold border-b border-slate-300">{mockCharacter.classLevel}</div>
              <span className="text-[9px] uppercase font-bold text-slate-500">Клас та Рівень</span>
            </div>
            <div>
              <div className="font-bold border-b border-slate-300">{mockCharacter.background}</div>
              <span className="text-[9px] uppercase font-bold text-slate-500">Передісторія</span>
            </div>
            <div>
              <div className="font-bold border-b border-slate-300">{mockCharacter.species}</div>
              <span className="text-[9px] uppercase font-bold text-slate-500">Вид</span>
            </div>
            <div>
              <div className="font-bold border-b border-slate-300">{mockCharacter.alignment}</div>
              <span className="text-[9px] uppercase font-bold text-slate-500">Світогляд</span>
            </div>
            <div>
              <div className="font-bold border-b border-slate-300">{mockCharacter.xp}</div>
              <span className="text-[9px] uppercase font-bold text-slate-500">Досвід</span>
            </div>
          </div>
        </div>

        {/* Тіло Аркуша (3 колонки для друку / широких екранів) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* КОЛОНКА 1: Характеристики та Навички */}
          <div className="space-y-6">
            
            {/* Бонус Майстерності */}
            <div className="border-2 border-slate-800 rounded-xl p-2 flex items-center gap-4 bg-slate-50">
              <div className="w-10 h-10 border-2 border-slate-800 rounded-full flex items-center justify-center font-bold text-lg bg-white">
                {mockCharacter.profBonus}
              </div>
              <span className="font-bold uppercase tracking-wider text-xs">Бонус Майстерності</span>
            </div>

            {/* Характеристики */}
            <div className="space-y-3 p-3 border-2 border-slate-300 rounded-xl">
              {mockCharacter.stats.map(stat => (
                <div key={stat.name} className="flex flex-col items-center border border-slate-200 bg-slate-50 rounded-lg p-2 relative">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{stat.name}</span>
                  <span className="text-2xl font-serif">{stat.score}</span>
                  <div className="absolute -bottom-3 bg-white border-2 border-slate-800 rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                    {stat.mod}
                  </div>
                </div>
              ))}
            </div>

            {/* Рятівні кидки */}
            <div className="border border-slate-300 rounded-xl p-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-center text-slate-500 mb-2 border-b border-slate-200 pb-1">Рятівні кидки</h3>
              {mockCharacter.stats.map(stat => (
                <div key={stat.name + 'save'} className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full border border-slate-800 ${stat.save ? 'bg-slate-800' : 'bg-white'}`} />
                  <span className="w-6 border-b border-slate-400 text-center text-xs font-bold">{stat.save ? stat.mod : ''}</span>
                  <span className="text-xs">{stat.name}</span>
                </div>
              ))}
            </div>

            {/* Навички */}
            <div className="border border-slate-300 rounded-xl p-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-center text-slate-500 mb-2 border-b border-slate-200 pb-1">Навички</h3>
              {mockCharacter.skills.map(skill => (
                <div key={skill.name} className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full border border-slate-800 ${skill.prof ? 'bg-slate-800' : 'bg-white'}`} />
                  <span className="w-5 border-b border-slate-400 text-center text-[10px] font-bold">{skill.mod}</span>
                  <span className="text-[9px] text-slate-500">[{skill.stat}]</span>
                  <span className="text-xs">{skill.name}</span>
                </div>
              ))}
            </div>

            {/* Пасивна Уважність */}
            <div className="border-2 border-slate-800 rounded-xl p-2 flex items-center gap-4 bg-slate-50">
              <div className="w-8 h-8 border border-slate-800 rounded flex items-center justify-center font-bold text-sm bg-white">
                12
              </div>
              <span className="font-bold uppercase text-[10px] items-center">Пасивна Уважність</span>
            </div>

          </div>

          {/* КОЛОНКА 2: Бойова панель */}
          <div className="space-y-6">
            
            <div className="grid grid-cols-3 gap-2">
              <div className="border-2 border-slate-800 rounded-t-xl rounded-b flex flex-col items-center justify-center p-2 bg-slate-50">
                <span className="text-xl font-bold">{mockCharacter.ac}</span>
                <span className="text-[9px] font-bold uppercase">Клас Броні</span>
              </div>
              <div className="border border-slate-400 rounded flex flex-col items-center justify-center p-2">
                <span className="text-xl font-bold">{mockCharacter.initiative}</span>
                <span className="text-[9px] font-bold uppercase">Ініціатива</span>
              </div>
              <div className="border border-slate-400 rounded flex flex-col items-center justify-center p-2">
                <span className="text-xl font-bold">{mockCharacter.speed}</span>
                <span className="text-[9px] font-bold uppercase">Швидкість</span>
              </div>
            </div>

            <div className="border border-slate-400 rounded-xl p-3 bg-slate-50">
              <div className="flex justify-between border-b border-slate-300 pb-1 mb-2">
                <span className="text-[9px] font-bold uppercase">ПЗ (Макс: {mockCharacter.hp.max})</span>
              </div>
              <div className="text-4xl font-bold text-center mb-2">{mockCharacter.hp.current}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-center block text-slate-500">Поточні Пункти Здоров'я</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
               <div className="border border-slate-400 rounded-xl p-3">
                 <span className="text-[9px] font-bold uppercase text-slate-500">Кістки Здоров'я</span>
                 <div className="text-sm font-bold text-center mt-1">{mockCharacter.hitDice}</div>
               </div>
               <div className="border border-slate-400 rounded-xl p-3 flex flex-col items-center">
                 <span className="text-[9px] font-bold uppercase text-slate-500 block mb-1">Кидки від смерті</span>
                 <div className="flex gap-2 text-[10px] items-center mb-1">
                   Усп. <span className="flex gap-1"><div className="w-2 h-2 border border-black rounded-full"/><div className="w-2 h-2 border border-black rounded-full"/><div className="w-2 h-2 border border-black rounded-full"/></span>
                 </div>
                 <div className="flex gap-2 text-[10px] items-center">
                   Пров. <span className="flex gap-1"><div className="w-2 h-2 border border-black rounded-full"/><div className="w-2 h-2 border border-black rounded-full"/><div className="w-2 h-2 border border-black rounded-full"/></span>
                 </div>
               </div>
            </div>

            <div className="border border-slate-400 rounded-xl overflow-hidden shadow-sm print:shadow-none">
              <h3 className="bg-slate-200 p-2 text-center font-bold uppercase text-[10px] tracking-widest border-b border-slate-300">Атаки та Заклинання</h3>
              <div className="p-2 space-y-2">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-50">
                      <th className="py-1">Назва</th>
                      <th className="py-1 text-center">Бонус</th>
                      <th className="py-1">Шкода/Тип</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCharacter.attacks.map(attack => (
                      <tr key={attack.name} className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
                        <td className="py-1.5 font-bold">{attack.name}</td>
                        <td className="py-1.5 text-center">{attack.bonus}</td>
                        <td className="py-1.5">{attack.damage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-slate-50 p-2 rounded border border-slate-200 mt-2 h-24">
                  <span className="text-slate-400 italic text-xs">Додаткові атаки, здібності бойові стилі...</span>
                </div>
              </div>
            </div>

          </div>

          {/* КОЛОНКА 3: Риси, Спорядження, Заклинання */}
          <div className="space-y-6">
            
            <div className="border border-slate-400 rounded-xl overflow-hidden flex flex-col h-1/3 min-h-[200px]">
              <h3 className="bg-slate-200 p-1.5 text-center font-bold uppercase text-[10px] tracking-widest border-b border-slate-300">Особливості та Риси</h3>
              <div className="p-3 text-xs leading-relaxed flex-1">
                {mockCharacter.features}
              </div>
            </div>

            <div className="border border-slate-400 rounded-xl overflow-hidden flex flex-col h-1/3 min-h-[200px] bg-slate-50 relative">
              <h3 className="bg-slate-200 p-1.5 text-center font-bold uppercase text-[10px] tracking-widest border-b border-slate-300">Спорядження</h3>
              
              <div className="absolute left-2 top-8 flex flex-col gap-1 w-8">
                <div className="border border-slate-400 bg-white text-[9px] text-center rounded pb-1">
                  <span className="block border-b border-slate-400 font-bold bg-slate-200 rounded-t">ММ</span>
                  {mockCharacter.coins.cp}
                </div>
                <div className="border border-slate-400 bg-white text-[9px] text-center rounded pb-1">
                  <span className="block border-b border-slate-400 font-bold bg-slate-200 rounded-t">СМ</span>
                  {mockCharacter.coins.sp}
                </div>
                <div className="border border-slate-400 bg-white text-[9px] text-center rounded pb-1">
                  <span className="block border-b border-slate-400 font-bold bg-amber-100 rounded-t">ЗМ</span>
                  {mockCharacter.coins.gp}
                </div>
              </div>

              <div className="pl-12 p-3 text-xs leading-relaxed w-full">
                {mockCharacter.equipment}
              </div>
            </div>

            <div className="border border-slate-400 rounded-xl overflow-hidden flex flex-col h-1/3">
              <h3 className="bg-slate-200 p-1.5 text-center font-bold uppercase text-[10px] tracking-widest border-b border-slate-300">Заклинання</h3>
              <div className="p-2 space-y-1 bg-white">
                <div className="font-bold text-[10px] uppercase border-b border-slate-200 pb-0.5 text-slate-500 mb-1">Фокуси (Змови)</div>
                <div className="text-xs mb-2">Вогняний снаряд, Світло, Мала ілюзія</div>

                <div className="font-bold text-[10px] uppercase border-b border-slate-200 pb-0.5 mt-2 flex justify-between text-slate-500 mb-1">
                  <span>Рівень 1</span>
                  <span>Комірки: О О О</span>
                </div>
                {mockCharacter.spells.map((s, idx) => (
                  <div key={idx} className="text-xs flex items-center gap-2">
                    <div className="w-2 h-2 rounded bg-white border border-slate-400" />
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
