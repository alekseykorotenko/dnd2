import React from 'react';
import { Shield, Dna, BrainCircuit, Star, Backpack, User, ChevronRight, ChevronLeft, CheckCircle2, Zap, Sword } from 'lucide-react';
import { CharacterProvider, useCharacterContext } from '../context/CharacterContext';
import { 
  StepClass, 
  StepLevel,
  StepOrigin, 
  StepAbilities, 
  StepFeats, 
  StepEquipment, 
  StepWeaponMastery,
  StepSummary 
} from './WizardSteps';

// Конфігурація кроків для навігації
const WIZARD_STEPS_CONFIG = [
  { id: 1, title: 'Клас', icon: Shield, desc: 'Бойова роль' },
  { id: 2, title: 'Рівень', icon: Zap, desc: 'Розвиток та Магія' },
  { id: 3, title: 'Походження', icon: Dna, desc: 'Вид та Передісторія' },
  { id: 4, title: 'Характеристики', icon: BrainCircuit, desc: 'Базові параметри' },
  { id: 5, title: 'Риси', icon: Star, desc: 'Здібності' },
  { id: 6, title: 'Спорядження', icon: Backpack, desc: 'Інвентар' },
  { id: 7, title: 'Майстерність', icon: Sword, desc: 'Бойові прийоми' },
  { id: 8, title: 'Підсумок', icon: User, desc: 'Лист персонажа' },
];

function WizardContent() {
  const { currentStep, setCurrentStep } = useCharacterContext();

  const handleNext = () => setCurrentStep(p => Math.min(8, p + 1));
  const handlePrev = () => setCurrentStep(p => Math.max(1, p - 1));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-serif italic font-bold text-slate-900 mb-3">Майстерня Персонажів</h1>
        <p className="text-slate-500 text-lg">Створіть героя за новими правилами D&D 2024</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Бічна панель навігації */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm md:sticky top-6">
          <div className="space-y-1">
            {WIZARD_STEPS_CONFIG.map((step) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              const Icon = step.icon;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full text-left flex items-center gap-4 p-3.5 rounded-2xl transition-all ${
                    isActive ? 'bg-slate-900 text-white shadow-md' : 
                    isPast ? 'hover:bg-slate-50 text-slate-800' : 'opacity-50 hover:opacity-80 text-slate-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                    isActive ? 'border-slate-700 bg-slate-800 text-amber-400' : 
                    isPast ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-100 text-slate-400'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{step.title}</div>
                    <div className={`text-[11px] uppercase tracking-wider font-bold mt-0.5 ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                      {step.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Головна контентна зона */}
        <div className="lg:col-span-3">
          <div className="min-h-[500px]">
             {currentStep === 1 && <StepClass />}
             {currentStep === 2 && <StepLevel />}
             {currentStep === 3 && <StepOrigin />}
             {currentStep === 4 && <StepAbilities />}
             {currentStep === 5 && <StepFeats />}
             {currentStep === 6 && <StepEquipment />}
             {currentStep === 7 && <StepWeaponMastery />}
             {currentStep === 8 && <StepSummary />}
          </div>

          <div className="mt-8 flex justify-between items-center border-t border-slate-200 pt-6">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" /> Назад
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === 8}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all disabled:opacity-30"
            >
              {currentStep === 7 ? 'Перейти до Підсумку' : 'Далі'} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Експортуємо головний компонент, який огортає все провайдером стану
export default function CharacterWizard() {
  return (
    <CharacterProvider>
      <WizardContent />
    </CharacterProvider>
  );
}
