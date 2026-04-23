import React, { useState, useMemo } from 'react';
import { spellsData } from '../lib/dndData';
import { Search, Filter, BookOpen } from 'lucide-react';

const PAGE_SIZE = 10;

export default function SpellsCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Отримуємо унікальні класи для фільтру
  const availableClasses = useMemo(() => {
    const classes = new Set<string>();
    spellsData.forEach(spell => {
      spell.classes.forEach(c => classes.add(c));
    });
    return Array.from(classes).sort();
  }, []);
  
  const availableSchools = useMemo(() => {
    const schools = new Set<string>();
    spellsData.forEach(spell => schools.add(spell.school));
    return Array.from(schools).sort();
  }, []);

  // Фільтрація заклинань
  const filteredSpells = useMemo(() => {
    return spellsData.filter(spell => {
      const matchesSearch = spell.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            spell.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || spell.level === selectedLevel;
      const matchesClass = selectedClass === 'all' || spell.classes.includes(selectedClass);
      const matchesSchool = selectedSchool === 'all' || spell.school === selectedSchool;
      
      return matchesSearch && matchesLevel && matchesClass && matchesSchool;
    });
  }, [searchTerm, selectedLevel, selectedClass, selectedSchool]);

  // Групування за рівнем (для поточної сторінки)
  const totalPages = Math.ceil(filteredSpells.length / PAGE_SIZE);
  
  const paginatedSpells = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredSpells.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredSpells, currentPage]);

  const spellsByLevel = useMemo(() => {
    const grouped: Record<number, typeof spellsData> = {};
    paginatedSpells.forEach(spell => {
      if (!grouped[spell.level]) grouped[spell.level] = [];
      grouped[spell.level].push(spell);
    });
    return grouped;
  }, [paginatedSpells]);

  // Зкидання сторінки при зміні фільтрів
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel, selectedClass, selectedSchool]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-serif italic font-bold text-slate-900 justify-center flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-indigo-600" />
          Каталог Заклинань
        </h1>
        <p className="text-slate-500 mt-2">D&D 2024</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Пошук заклинання..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <select 
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full md:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            >
              <option value="all">Усі рівні</option>
              <option value={0}>Фокуси (Змови)</option>
              {[1,2,3,4,5,6,7,8,9].map(lvl => (
                <option key={lvl} value={lvl}>{lvl} рівень</option>
              ))}
            </select>

            <select 
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium capitalize"
            >
              <option value="all">Усі класи</option>
              {availableClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            
            <select 
              value={selectedSchool}
              onChange={e => setSelectedSchool(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium capitalize"
            >
              <option value="all">Усі школи (типи)</option>
              {availableSchools.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredSpells.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
          За вашими критеріями не знайдено жодного заклинання.
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.entries(spellsByLevel) as [string, any[]][]).sort(([a], [b]) => Number(a) - Number(b)).map(([level, spells]) => (
            <div key={level} className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-slate-300 pb-2 text-indigo-900 flex items-center gap-2">
                {Number(level) === 0 ? 'Фокуси (Змови)' : `Заклинання ${level}-го рівня`}
                <span className="text-sm font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                  {spells.length}
                </span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                {spells.map(spell => (
                  <div key={spell.id} className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900">{spell.name}</h3>
                      <span className="text-xs uppercase tracking-wider font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                        {spell.school}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div><strong className="text-slate-800">Час:</strong> {spell.castingTime}</div>
                      <div><strong className="text-slate-800">Дальність:</strong> {spell.range}</div>
                      <div><strong className="text-slate-800">Компоненти:</strong> {spell.components.join(', ')}</div>
                      <div><strong className="text-slate-800">Тривалість:</strong> {spell.duration}</div>
                    </div>
                    
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {spell.description}
                    </p>
                    
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                      {spell.classes.map(c => (
                        <span key={c} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-6 mt-6 border-t border-slate-200">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50 font-medium"
              >
                Попередня
              </button>
              <span className="text-sm font-medium text-slate-600">
                Сторінка {currentPage} з {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-500 font-medium shadow-sm transition-all"
              >
                Наступна
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
