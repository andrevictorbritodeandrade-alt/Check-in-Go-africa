import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Calendar, 
  Utensils, 
  Camera, 
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Bus,
  RefreshCw
} from 'lucide-react';
import { syncDataToCloud, loadDataFromCloud } from '../services/firebase';

export const GUIDE_STORAGE_KEY = 'checkin_go_guides_v1';

interface DayActivity {
  time: string;
  activity: string;
  location: string;
  type: 'food' | 'sight' | 'transport';
  notes?: string;
}

interface DailyPlan {
  day: number;
  date: string;
  title: string;
  activities: DayActivity[];
  budget: {
    food: number;
    transport: number;
    tickets: number;
  };
}

interface GuideData {
  CPT: DailyPlan[];
  JNB: DailyPlan[];
}

const DEFAULT_GUIDE: GuideData = {
  CPT: [
    {
      day: 1,
      date: '26/Jan',
      title: 'Chegada & Waterfront',
      activities: [
        { time: '14:00', activity: 'Check-in Airbnb', location: 'Cidade do Cabo', type: 'transport' },
        { time: '16:00', activity: 'Passeio V&A Waterfront', location: 'Waterfront', type: 'sight', notes: 'Trocar dinheiro e comprar chip' },
        { time: '19:00', activity: 'Jantar no Willoughby & Co', location: 'Waterfront', type: 'food' }
      ],
      budget: { food: 600, transport: 100, tickets: 0 }
    },
    {
      day: 2,
      date: '27/Jan',
      title: 'Table Mountain & Centro',
      activities: [
        { time: '08:00', activity: 'Table Mountain (Bondinho)', location: 'Table Mountain', type: 'sight' },
        { time: '13:00', activity: 'Almoço em Kloof Street', location: 'Gardens', type: 'food' },
        { time: '15:00', activity: 'Bo-Kaap e Company\'s Garden', location: 'Centro', type: 'sight' }
      ],
      budget: { food: 500, transport: 150, tickets: 900 }
    }
  ],
  JNB: [
    {
      day: 1,
      date: '01/Fev',
      title: 'Chegada & Sandton',
      activities: [
        { time: '12:00', activity: 'Chegada em JNB', location: 'OR Tambo', type: 'transport' },
        { time: '14:00', activity: 'Check-in Hotel', location: 'Sandton', type: 'transport' },
        { time: '16:00', activity: 'Nelson Mandela Square', location: 'Sandton City', type: 'sight' }
      ],
      budget: { food: 400, transport: 300, tickets: 0 }
    }
  ]
};

const DayCard: React.FC<{ plan: DailyPlan }> = ({ plan }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="bg-sa-green/10 text-sa-green w-12 h-12 rounded-xl flex flex-col items-center justify-center border border-sa-green/20">
            <span className="text-[10px] font-bold uppercase">Dia</span>
            <span className="text-xl font-black leading-none">{plan.day}</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg">{plan.title}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Calendar className="w-3 h-3" />
              {plan.date}
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          <div className="relative pl-4 space-y-6 border-l-2 border-gray-200 ml-2">
            {plan.activities.map((act, idx) => (
              <div key={idx} className="relative">
                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                  act.type === 'food' ? 'bg-orange-400' : act.type === 'transport' ? 'bg-blue-400' : 'bg-green-400'
                }`}></div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-gray-400 block mb-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {act.time}
                    </span>
                    <h5 className="font-bold text-slate-700 text-sm">{act.activity}</h5>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {act.location}
                    </p>
                    {act.notes && (
                      <p className="text-[10px] text-gray-400 mt-1 italic bg-white p-1.5 rounded border border-gray-100 inline-block">
                        <Info className="w-3 h-3 inline mr-1" />
                        {act.notes}
                      </p>
                    )}
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-gray-100 shadow-sm text-gray-400">
                    {act.type === 'food' && <Utensils className="w-4 h-4" />}
                    {act.type === 'sight' && <Camera className="w-4 h-4" />}
                    {act.type === 'transport' && <Bus className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
            <span className="font-bold uppercase tracking-wide">Orçamento do Dia (Est.)</span>
            <span className="font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded border border-gray-200">
              R$ {plan.budget.food + plan.budget.transport + plan.budget.tickets}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const GuideList: React.FC = () => {
  const [data, setData] = useState<GuideData>(DEFAULT_GUIDE);
  const [activeCity, setActiveCity] = useState<'CPT' | 'JNB'>('CPT');
  const [isLoading, setIsLoading] = useState(true);

  // Cloud First Loading
  useEffect(() => {
    const initData = async () => {
        try {
            const cloudData = await loadDataFromCloud('guides_v1');
            if (cloudData) {
                setData(cloudData as GuideData);
                localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(cloudData));
            } else {
                const saved = localStorage.getItem(GUIDE_STORAGE_KEY);
                if (saved) setData(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Erro sync roteiro", e);
            const saved = localStorage.getItem(GUIDE_STORAGE_KEY);
            if (saved) setData(JSON.parse(saved));
        } finally {
            setIsLoading(false);
        }
    };
    initData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
        // Sync to cloud mainly for backup if data changes
        const t = setTimeout(() => {
            syncDataToCloud('guides_v1', data);
        }, 2000);
        return () => clearTimeout(t);
    }
  }, [data, isLoading]);

  if (isLoading) {
      return (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
              <RefreshCw className="w-8 h-8 animate-spin text-sa-green" />
              <p className="text-xs font-bold uppercase tracking-widest">Carregando Roteiro...</p>
          </div>
      );
  }

  return (
    <div className="pb-12">
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button
            onClick={() => setActiveCity('CPT')}
            className={`flex-1 py-3 px-2 rounded-lg text-xs font-bold font-display transition-all ${
            activeCity === 'CPT' 
                ? 'bg-white text-blue-800 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
        >
            Cidade do Cabo
        </button>
        <button
            onClick={() => setActiveCity('JNB')}
            className={`flex-1 py-3 px-2 rounded-lg text-xs font-bold font-display transition-all ${
            activeCity === 'JNB' 
                ? 'bg-white text-yellow-700 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
        >
            Joanesburgo
        </button>
      </div>

      <div className="space-y-2 animate-in fade-in">
        <div className="flex items-center gap-2 mb-4 px-2">
           <Map className="w-4 h-4 text-gray-400" />
           <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Roteiro Sugerido</span>
        </div>
        
        {data[activeCity].map((plan, i) => (
           <DayCard key={i} plan={plan} />
        ))}

        {data[activeCity].length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">Nenhum roteiro cadastrado para esta cidade.</p>
        )}
      </div>
    </div>
  );
};

export default GuideList;