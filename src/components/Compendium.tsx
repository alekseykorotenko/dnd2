import React, { useState, useEffect } from 'react';
import { Search, Info, CheckCircle2, Shield, Scroll, Sparkles } from 'lucide-react';

type DataType = 'classes' | 'species' | 'backgrounds' | 'spells';

export default function Compendium() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DataType>('classes');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Логіка виділення (Selection Logic)
  const [selections, setSelections] = useState({
    classes: null as string | null,
    species: null as string | null,
    backgrounds: null as string | null,
    spells: [] as string[]
  });

  // Завантаження даних з backend-у (Node.js/Express)
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Помилка завантаження Кодексу:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-rose-500">Помилка підключення до Бази Даних.</div>;

  // Динамічний рендеринг та Фільтрація (Dynamic Rendering & Filtering)
  const activeDataList = data[activeTab] || [];
  const filteredData = activeDataList.filter((item: any) => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSelection = (itemName: string, category: DataType) => {
    setSelections(prev => {
      // Якщо це масив (як заклинання), дозволяємо обирати декілька
      if (Array.isArray(prev[category])) {
        const arr = prev[category] as string[];
        return { ...prev, [category]: arr.includes(itemName) ? arr.filter(i => i !== itemName) : [...arr, itemName] };
      }
      // Інакше (клас, вид) - обираємо по одному
      return { ...prev, [category]: prev[category] === itemName ? null : itemName };
    });
  };

  const isSelected = (itemName: string, category: DataType) => {
    if (Array.isArray(selections[category])) {
      return (selections[category] as string[]).includes(itemName);
    }
    return selections[category] === itemName;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-8 animate-in fade-in">
      
      {/* Бокове меню (Фільтри та Навігація) */}
      <div className="md:w-64 space-y-6 shrink-0">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-serif font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <Scroll className="w-5 h-5 text-indigo-500" /> Розділи
          </h3>
          <nav className="space-y-1">
            {([
              { id: 'classes', label: 'Класи', icon: Shield },
              { id: 'species', label: 'Види', icon: Info },
              { id: 'backgrounds', label: 'Передісторії', icon: CheckCircle2 },
              { id: 'spells', label: 'Заклинання', icon: Sparkles }
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DataType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Панель обраного (Selection Status) */}
        <div className="bg-indigo-900 text-white p-5 rounded-2xl shadow-lg border border-indigo-800">
           <h3 className="font-bold border-b border-indigo-700 pb-2 mb-3 text-sm uppercase tracking-widest text-indigo-300">Ваш Проект</h3>
           <ul className="space-y-2 text-sm">
             <li><span className="text-indigo-400">Клас:</span> {selections.classes || 'Не обрано'}</li>
             <li><span className="text-indigo-400">Вид:</span> {selections.species || 'Не обрано'}</li>
             <li><span className="text-indigo-400">Передісторія:</span> {selections.backgrounds || 'Не обрано'}</li>
             <li><span className="text-indigo-400">Заклинання:</span> {selections.spells.length} обр.</li>
           </ul>
        </div>
      </div>

      {/* Головна зона змісту */}
      <div className="flex-1 space-y-6">
        {/* Пошук */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={`Пошук у розділі...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all text-slate-700 font-medium"
          />
        </div>

        {/* Динамічний рендеринг списку */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredData.map((item: any, idx: number) => {
            const selected = isSelected(item.name, activeTab);
            
            return (
              <div 
                key={idx} 
                onClick={() => toggleSelection(item.name, activeTab)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col h-full bg-white hover:shadow-md ${
                  selected 
                    ? 'border-indigo-500 shadow-sm ring-1 ring-indigo-500' 
                    : 'border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-serif font-bold text-xl text-slate-900">{item.name}</h4>
                  {selected && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                </div>

                {item.description && <p className="text-sm text-slate-600 mb-4 flex-1">{item.description}</p>}
                
                {/* Кастомний рендеринг залежно від типу */}
                <div className="mt-auto space-y-2 text-xs">
                  {item.hit_dice && (
                    <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">ПЗ: {item.hit_dice}</span>
                  )}
                  {item.subclasses && (
                    <div className="text-slate-500"><span className="font-bold text-slate-700">Підкласи:</span> {item.subclasses.join(', ')}</div>
                  )}
                  {item.skills && (
                    <div className="text-slate-500"><span className="font-bold text-slate-700">Навички:</span> {item.skills.join(', ')}</div>
                  )}
                  {item.traits && (
                    <div className="text-slate-500"><span className="font-bold text-slate-700">Здібності:</span> {item.traits}</div>
                  )}
                  {item.school && (
                    <div className="flex gap-2">
                       <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded-md mb-2">Рівень {item.level}</span>
                       <span className="inline-block bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded-md mb-2">{item.school}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {filteredData.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
              Записів не знайдено. Спробуйте змінити пошуковий запит.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
