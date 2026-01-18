import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuCard from './components/MenuCard'; 
import CurrencyConverter from './components/CurrencyConverter';
import FlightList from './components/FlightList';
import PackingList from './components/PackingList';
import GuideList from './components/GuideList';
import MelhoresDestinos from './components/MelhoresDestinos';
import FinancialControl from './components/FinancialControl'; 
import ExpenseTracker from './components/ExpenseTracker';
import Translator from './components/Translator';
import AiAssistant from './components/AiAssistant';
import AccommodationList from './components/AccommodationList'; 
import BusList from './components/BusList';
import SowetoPro from './components/SowetoPro';
import SyncIndicator from './components/SyncIndicator';
import { MENU_ITEMS } from './constants';
import { Construction, ArrowLeft } from 'lucide-react';
import { ThemeColor } from './types';

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.sectionId) {
        setActiveSectionId(event.state.sectionId);
      } else {
        setActiveSectionId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (id: string) => {
    setActiveSectionId(id);
    try {
      window.history.pushState({ sectionId: id }, '', `#${id}`);
    } catch (e) {
      console.warn("Navigation state update skipped", e);
    }
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (window.history.state && window.history.state.sectionId) {
      window.history.back();
    } else {
      setActiveSectionId(null);
      try {
        window.history.replaceState(null, '', ' ');
      } catch (e) {
         console.warn("History replaceState skipped", e);
      }
    }
  };

  const renderContent = (id: string) => {
    switch (id) {
      case 'soweto_pro':
        return <SowetoPro />;
      case 'ia_assistant':
        return <AiAssistant />;
      case 'tradutor':
        return <Translator />;
      case 'cambio':
        return <CurrencyConverter />;
      case 'melhores_destinos':
        return <MelhoresDestinos />;
      case 'voos':
        return <FlightList />;
      case 'checklist':
        return <PackingList />;
      case 'guias':
        return <GuideList />;
      case 'financeiro':
          return <FinancialControl />;
      case 'gastos':
          return <ExpenseTracker />;
      case 'hospedagem': 
          return <AccommodationList />;
      case 'onibus':
      case 'onibus_star':
          return <BusList />;
      case 'vacinas':
          return <div className="p-8 bg-white rounded-3xl text-slate-800 text-center shadow-2xl">
              <h2 className="text-2xl font-black mb-4">VACINA FEBRE AMARELA (CIVP)</h2>
              <p className="mb-4">O Certificado Internacional de Vacinação ou Proporção é obrigatório para brasileiros entrando na África do Sul.</p>
              <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200 text-sm font-bold text-amber-900">
                  Tenha sempre em mãos o documento físico original ou o PDF validado pelo ConecteSUS.
              </div>
          </div>;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Construction className="w-12 h-12 mb-4 opacity-20 text-sa-green" />
            <p className="text-lg font-bold text-sa-green font-display">Em construção</p>
          </div>
        );
    }
  };

  if (activeSectionId) {
    return (
      <div className="min-h-screen bg-black font-sans animate-in slide-in-from-right duration-300">
        <SyncIndicator />
        <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md text-white shadow-md border-b border-sa-gold/30">
          <div className="flex items-center px-4 py-4 max-w-md mx-auto">
            <button onClick={goBack} className="p-3 -ml-2 rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="ml-2 text-xl font-display font-black tracking-widest flex-1 truncate uppercase">
              {MENU_ITEMS.find(i => i.id === activeSectionId)?.title}
            </h2>
          </div>
        </div>
        <main className="max-w-md mx-auto px-4 py-6">
          {renderContent(activeSectionId)}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans animate-in fade-in duration-500 overflow-x-hidden relative">
      <SyncIndicator />
      <Header />
      
      <main className="w-full max-w-4xl mx-auto px-6 py-12 relative z-20">
        {/* The 2-column grid from the user image */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MENU_ITEMS.map((item) => (
            <MenuCard key={item.id} {...item} onClick={() => navigateTo(item.id)} />
          ))}
        </div>
      </main>

      {/* Safari Footer */}
      <footer className="relative w-full overflow-hidden pt-20 pb-12 mt-auto">
        <div className="relative z-20 text-center text-[10px] text-sa-gold font-black font-display tracking-[0.3em] uppercase">
          <p className="mb-2">Developer by André & Marcelly | Versão 1.1.2</p>
          <p className="opacity-50">© 2026 CHECK-IN, GO! ÁFRICA DO SUL 🇿🇦</p>
        </div>
      </footer>
    </div>
  );
};

export default App;