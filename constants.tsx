
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

/**
 * PADRÃO DE CORES ESTREITO (Ciclo de 5):
 * 1. Verde (sa-green)
 * 2. Dourado (sa-gold)
 * 3. Azul (sa-blue)
 * 4. Vermelho (sa-red)
 * 5. Preto (tribal-dark)
 */

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'clima_localizacao', // POS 1: Card Especial (Preto/Ouro)
    title: 'Clima & Local',
    icon: <CloudSun className="w-12 h-12 text-sa-gold" />,
    themeColor: 'black',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'cambio', // POS 2: Verde
    title: 'Câmbio',
    icon: <Banknote className="w-12 h-12 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'checklist', // POS 3: Dourado
    title: 'Checklist Malas',
    icon: <ClipboardList className="w-12 h-12 text-white" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'financeiro', // POS 4: Azul
    title: 'Financeiro',
    icon: <Wallet className="w-12 h-12 text-sa-gold" />,
    themeColor: 'blue',
    gradientClass: 'bg-tribal-blue border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#001489'
  },
  {
    id: 'gastos', // POS 5: Vermelho
    title: 'Gastos',
    icon: <Receipt className="w-12 h-12 text-white" />,
    themeColor: 'red',
    gradientClass: 'bg-tribal-red border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#E03C31'
  },
  {
    id: 'uber_bolt', // POS 6: Dark
    title: 'Uber / Bolt',
    icon: <Car className="w-12 h-12 text-sa-gold" />,
    themeColor: 'black',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'guias', // POS 7: Verde
    title: 'Roteiro',
    icon: <Map className="w-12 h-12 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'hospedagem', // POS 8: Dourado
    title: 'Hospedagem',
    icon: <Hotel className="w-12 h-12 text-white" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'tradutor', // POS 9: Azul
    title: 'Idiomas',
    icon: <Languages className="w-12 h-12 text-sa-gold" />,
    themeColor: 'blue',
    gradientClass: 'bg-tribal-blue border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#001489'
  },
  {
    id: 'melhores_destinos', // POS 10: Vermelho
    title: 'Melhores Destinos',
    icon: <Compass className="w-12 h-12 text-white" />,
    themeColor: 'red',
    gradientClass: 'bg-tribal-red border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#E03C31'
  },
  {
    id: 'onibus', // POS 11: Dark
    title: 'Ônibus',
    icon: <Bus className="w-12 h-12 text-sa-gold" />,
    themeColor: 'black',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'vacinas', // POS 12: Dourado
    title: 'Vacinas (CIVP)',
    icon: <Syringe className="w-12 h-12 text-white" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'voos', // POS 13: Azul
    title: 'Voos',
    icon: <Plane className="w-12 h-12 text-sa-gold" />,
    themeColor: 'blue',
    gradientClass: 'bg-tribal-blue border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#001489'
  },
  {
    id: 'ia_assistant', // POS 14: Vermelho
    title: 'Guia IA',
    icon: <Brain className="w-12 h-12 text-white" />,
    themeColor: 'red',
    gradientClass: 'bg-tribal-red border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#E03C31'
  },
];

export const CACHE_KEY_RATES = 'checkin_go_rates';
export const ONE_HOUR_MS = 3600 * 1000;
export const EXPENSES_STORAGE_KEY = 'checkin_go_expenses_v1';
