import React from 'react';
import { 
  Banknote, 
  Bot,
  Bus, 
  ClipboardList,
  Compass,
  Hotel, 
  Languages,
  Map, 
  Plane, 
  Receipt,
  Mic2,
  Star,
  Syringe,
  Wallet,
  Brain
} from 'lucide-react';
import { MenuItem } from './types';

// Matching the textures from the images via custom classes defined in index.html
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'cambio',
    title: 'Câmbio',
    icon: <Banknote className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'checklist',
    title: 'Checklist Malas',
    icon: <ClipboardList className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'financeiro',
    title: 'Financeiro',
    icon: <Wallet className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'gastos',
    title: 'Gastos',
    icon: <Receipt className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'guias', // Re-labeled as Roteiro in UI
    title: 'Roteiro',
    icon: <Map className="w-6 h-6 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'hospedagem',
    title: 'Hospedagem',
    icon: <Hotel className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'tradutor',
    title: 'Idiomas',
    icon: <Languages className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'onibus_star',
    title: 'Ônibus',
    icon: <Star className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'melhores_destinos',
    title: 'Melhores Destinos',
    icon: <Compass className="w-6 h-6 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'onibus',
    title: 'Ônibus',
    icon: <Bus className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'soweto_pro',
    title: 'Soweto Pro',
    icon: <Mic2 className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'vacinas',
    title: 'Vacinas (CIVP)',
    icon: <Syringe className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'voos',
    title: 'Voos',
    icon: <Plane className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white'
  },
  {
    id: 'ia_assistant',
    title: 'Guia IA',
    icon: <Brain className="w-6 h-6 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white'
  },
];

export const CACHE_KEY_RATES = 'checkin_go_rates';
export const ONE_HOUR_MS = 3600 * 1000;
export const EXPENSES_STORAGE_KEY = 'checkin_go_expenses_v1';