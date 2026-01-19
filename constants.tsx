import React from 'react';
import { 
  Banknote, 
  Bus, 
  ClipboardList,
  Compass,
  Hotel, 
  Languages,
  Map, 
  Plane, 
  Receipt,
  Mic2,
  Syringe,
  Wallet,
  Brain,
  Car,
  CloudSun
} from 'lucide-react';
import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'clima_localizacao',
    title: 'Clima & Local',
    icon: <CloudSun className="w-6 h-6 text-sa-gold" />,
    themeColor: 'blue',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'cambio',
    title: 'Câmbio',
    icon: <Banknote className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'checklist',
    title: 'Checklist Malas',
    icon: <ClipboardList className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'financeiro',
    title: 'Financeiro',
    icon: <Wallet className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'gastos',
    title: 'Gastos',
    icon: <Receipt className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'uber_bolt',
    title: 'Uber / Bolt',
    icon: <Car className="w-6 h-6 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'guias',
    title: 'Roteiro',
    icon: <Map className="w-6 h-6 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'hospedagem',
    title: 'Hospedagem',
    icon: <Hotel className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'tradutor',
    title: 'Idiomas',
    icon: <Languages className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'melhores_destinos',
    title: 'Melhores Destinos',
    icon: <Compass className="w-6 h-6 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'onibus',
    title: 'Ônibus',
    icon: <Bus className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'soweto_pro',
    title: 'Soweto Pro',
    icon: <Mic2 className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'vacinas',
    title: 'Vacinas (CIVP)',
    icon: <Syringe className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'voos',
    title: 'Voos',
    icon: <Plane className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'ia_assistant',
    title: 'Guia IA',
    icon: <Brain className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
];

export const CACHE_KEY_RATES = 'checkin_go_rates';
export const ONE_HOUR_MS = 3600 * 1000;
export const EXPENSES_STORAGE_KEY = 'checkin_go_expenses_v1';