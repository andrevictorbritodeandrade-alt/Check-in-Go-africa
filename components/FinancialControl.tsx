import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Landmark, 
  Bus, 
  Hotel, 
  TrendingDown,
  Cloud,
  MapPin,
  Receipt,
  Banknote
} from 'lucide-react';
import { GUIDE_STORAGE_KEY } from './GuideList';
import { EXPENSES_STORAGE_KEY } from '../constants';
import { syncDataToCloud } from '../services/firebase';

const toBRL = (val: number) => {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// --- BANK LOGOS COMPONENTS ---
const WiseLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-[#9FE870]" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.555 18.736l3.473-13.473h5.922l-1.077 4.975h3.94l-3.326 8.498h-4.32l.732-3.136H6.676l-.88 3.136H3.555z"/>
  </svg>
);

const NomadLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-[#FFD700]" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="black"/>
    <path d="M7 17V7l5 6 5-6v10" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const InterLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" className="fill-[#FF7A00]"/>
    <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const CashLogo = () => (
  <div className="w-6 h-6 bg-green-700 rounded text-white flex items-center justify-center">
    <Banknote className="w-4 h-4" />
  </div>
);

interface Wallets {
  wise: number;
  nomad: number;
  inter: number;
  cash: number;
}

const WalletInput: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (val: string) => void;
  colorClass: string;
}> = ({ label, icon, value, onChange, colorClass }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border ${colorClass} bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-200`}>
    <div className="shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-gray-400 text-xs font-bold">R$</span>
        <input 
          type="number" 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full text-sm font-bold text-gray-800 outline-none bg-transparent"
        />
      </div>
    </div>
  </div>
);

const FinancialControl: React.FC = () => {
  // --- STATE ---
  const [wallets, setWallets] = useState<Wallets>({
    wise: 0,
    nomad: 0,
    inter: 0,
    cash: 0
  });
  
  const [hotelCost, setHotelCost] = useState<number>(0);
  const [busCost, setBusCost] = useState<number>(0);
  
  // Totals
  const [totalCPT, setTotalCPT] = useState<number>(0);
  const [totalJNB, setTotalJNB] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  // Load user inputs
  useEffect(() => {
    const savedFinance = localStorage.getItem('checkin_go_finance_v1');
    if (savedFinance) {
      try {
        const parsed = JSON.parse(savedFinance);
        
        // Migration logic: if old 'balance' exists but 'wallets' doesn't
        if (parsed.wallets) {
          setWallets(parsed.wallets);
        } else if (parsed.balance !== undefined) {
          setWallets(prev => ({ ...prev, wise: parsed.balance })); // Default old balance to Wise
        }

        setHotelCost(parsed.hotelCost || 0);
        setBusCost(parsed.busCost || 0);
      } catch (e) { console.error(e); }
    }
  }, []);

  // Load Estimated Costs from GuideList
  useEffect(() => {
    const savedGuide = localStorage.getItem(GUIDE_STORAGE_KEY);
    if (savedGuide) {
      try {
        const parsed = JSON.parse(savedGuide);
        let cpt = 0;
        let jnb = 0;
        if (parsed.CPT) {
           parsed.CPT.forEach((day: any) => cpt += (day.budget.food + day.budget.transport + day.budget.tickets));
        }
        if (parsed.JNB) {
           parsed.JNB.forEach((day: any) => jnb += (day.budget.food + day.budget.transport + day.budget.tickets));
        }
        setTotalCPT(cpt);
        setTotalJNB(jnb);
      } catch (e) { console.error(e); }
    }
  }, []);

  // Load Real Expenses
  useEffect(() => {
      const savedExpenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (savedExpenses) {
          try {
              const list = JSON.parse(savedExpenses);
              const total = list.reduce((acc: number, curr: any) => acc + curr.amountInBRL, 0);
              setTotalExpenses(total);
          } catch(e) { console.error(e); }
      }
  }, []);

  useEffect(() => {
    const dataToSave = { wallets, hotelCost, busCost };
    localStorage.setItem('checkin_go_finance_v1', JSON.stringify(dataToSave));
    const timeoutId = setTimeout(() => {
      syncDataToCloud('financial_data', dataToSave);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [wallets, hotelCost, busCost]);

  // Wallet Handlers
  const updateWallet = (key: keyof Wallets, value: string) => {
    const num = parseFloat(value) || 0;
    setWallets(prev => ({ ...prev, [key]: num }));
  };

  // Calculations
  const totalBalance = wallets.wise + wallets.nomad + wallets.inter + wallets.cash;
  const totalGuideEstimated = totalCPT + totalJNB;
  const totalPending = hotelCost + busCost; 
  const totalEstimatedTripCost = totalPending + totalGuideEstimated;
  
  // Real Wallet Balance Logic (Total Available - Expenses)
  const currentWalletBalance = totalBalance - totalExpenses;

  return (
    <div className="space-y-6">
      
      {/* 1. BALANÇO GERAL (WALLET) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-1 shadow-lg overflow-hidden">
        <div className="bg-slate-800/50 p-4 pb-2">
           <div className="flex justify-between items-start mb-4">
             <label className="text-blue-200 text-xs font-bold uppercase tracking-wider block flex items-center gap-2">
               <Wallet className="w-4 h-4" /> Minhas Carteiras
             </label>
             <Cloud className="w-3 h-3 text-blue-300 opacity-50" />
          </div>

          {/* Wallet Inputs Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <WalletInput 
              label="Wise" 
              icon={<WiseLogo />} 
              value={wallets.wise} 
              onChange={(v) => updateWallet('wise', v)}
              colorClass="border-[#9FE870]/30"
            />
            <WalletInput 
              label="Nomad" 
              icon={<NomadLogo />} 
              value={wallets.nomad} 
              onChange={(v) => updateWallet('nomad', v)}
              colorClass="border-[#FFD700]/30"
            />
            <WalletInput 
              label="Banco Inter" 
              icon={<InterLogo />} 
              value={wallets.inter} 
              onChange={(v) => updateWallet('inter', v)}
              colorClass="border-[#FF7A00]/30"
            />
            <WalletInput 
              label="Em Espécie" 
              icon={<CashLogo />} 
              value={wallets.cash} 
              onChange={(v) => updateWallet('cash', v)}
              colorClass="border-green-200"
            />
          </div>
        </div>

        {/* Totals Summary */}
        <div className="bg-white m-1 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
             <span className="text-xs font-bold text-gray-400">Total Acumulado</span>
             <span className="text-sm font-bold text-slate-700">{toBRL(totalBalance)}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-bold text-red-400 flex items-center gap-1">
               <Receipt className="w-3 h-3" /> Gastos
             </span>
             <span className="text-sm font-bold text-red-500">- {toBRL(totalExpenses)}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-end">
              <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Saldo Líquido</span>
              <span className={`text-2xl font-black font-display tracking-tight ${currentWalletBalance < 0 ? 'text-red-500' : 'text-green-600'}`}>
                {toBRL(currentWalletBalance)}
              </span>
          </div>
        </div>
      </div>

       {/* 2. COMPARAÇÃO DE ESTIMATIVAS */}
       <div className="bg-green-50 rounded-3xl border border-green-200 p-5 shadow-sm">
         <h3 className="text-green-800 font-bold flex items-center gap-2 mb-4 font-display">
             <Landmark className="w-5 h-5 text-green-600" />
             Planejamento x Realidade
         </h3>

         <div className="grid grid-cols-2 gap-3 mb-4">
             <div className="bg-white p-3 rounded-xl border border-green-100">
                 <div className="flex items-center gap-1.5 mb-1">
                     <MapPin className="w-3 h-3 text-blue-600" />
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Cidade do Cabo</span>
                 </div>
                 <span className="block text-xl font-black text-blue-800">{toBRL(totalCPT)}</span>
             </div>
             <div className="bg-white p-3 rounded-xl border border-green-100">
                 <div className="flex items-center gap-1.5 mb-1">
                     <MapPin className="w-3 h-3 text-yellow-600" />
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Joanesburgo</span>
                 </div>
                 <span className="block text-xl font-black text-yellow-800">{toBRL(totalJNB)}</span>
             </div>
         </div>

         <div className="bg-white p-4 rounded-xl border border-dashed border-green-300">
             <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-gray-500 uppercase">Meta da Viagem</span>
                 <span className="text-lg font-black text-gray-800">{toBRL(totalEstimatedTripCost)}</span>
             </div>
             <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 mb-1 overflow-hidden">
                  <div 
                    className={`h-full ${totalBalance >= totalEstimatedTripCost ? 'bg-green-500' : 'bg-red-500'}`} 
                    style={{ width: `${Math.min(100, (totalBalance / totalEstimatedTripCost) * 100)}%` }}
                  ></div>
             </div>
             <p className="text-[10px] text-right text-gray-400">
                 {totalBalance >= totalEstimatedTripCost 
                    ? 'Seu saldo cobre a estimativa do guia.' 
                    : `Faltam ${toBRL(totalEstimatedTripCost - totalBalance)} para cobrir o guia.`}
             </p>
         </div>
       </div>

      {/* 3. CUSTOS PENDENTES (INPUTS) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-gray-800 font-bold flex items-center gap-2 mb-4 font-display">
          <TrendingDown className="w-5 h-5 text-orange-500" />
          Custos Extras (Pendentes)
        </h3>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Estes valores são somados à meta da viagem, mas não são descontados do saldo até você pagar.
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
              <Hotel className="w-3.5 h-3.5" /> Hospedagem (A Pagar)
            </label>
            <div className="flex items-center bg-gray-50 rounded-xl px-3 border border-gray-200 focus-within:border-orange-400 transition-colors">
              <span className="text-gray-400 text-sm font-bold mr-2">R$</span>
              <input 
                type="number"
                value={hotelCost || ''}
                onChange={(e) => setHotelCost(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="bg-transparent w-full py-3 text-gray-700 font-bold outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
              <Bus className="w-3.5 h-3.5" /> Ônibus / Transfers Extras
            </label>
             <div className="flex items-center bg-gray-50 rounded-xl px-3 border border-gray-200 focus-within:border-orange-400 transition-colors">
              <span className="text-gray-400 text-sm font-bold mr-2">R$</span>
              <input 
                type="number"
                value={busCost || ''}
                onChange={(e) => setBusCost(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="bg-transparent w-full py-3 text-gray-700 font-bold outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialControl;