
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Briefcase, 
  Luggage, 
  ShoppingBag,
  User,
  Save,
  Pencil,
  X,
  Check,
  Cloud,
  Smartphone,
  FileText,
  Plug,
  Ear,
  RefreshCw,
  Tag,
  Sticker
} from 'lucide-react';
import { syncDataToCloud, loadDataFromCloud } from '../services/firebase';

type BagType = 'bag23kg' | 'bag10kg' | 'pouch5kg';
type Person = 'André' | 'Marcelly';

interface Item {
  id: string;
  text: string;
  checked: boolean;
  category?: string;
}

type PackingData = Record<Person, Record<BagType, Item[]>>;

const STORAGE_KEY = 'checkin_go_packing_list_v5';

// --- DICIONÁRIO DE CATEGORIAS (IA LOCAL) ---
const CATEGORY_MAP: Record<string, string[]> = {
  '👕 ROUPAS': ['camisa', 'camiseta', 'calça', 'bermuda', 'short', 'cueca', 'meia', 'casaco', 'jaqueta', 'vestido', 'saia', 'biquíni', 'sunga', 'moletom', 'agasalho', 'roupa', 'blusa', 'pijama'],
  '👟 CALÇADOS': ['tênis', 'sapato', 'chinelo', 'sandália', 'bota', 'crocs', 'pantufa'],
  '🧴 HIGIENE & SAÚDE': ['escova', 'pasta', 'shampoo', 'condicionador', 'sabonete', 'desodorante', 'perfume', 'protetor', 'repelente', 'remédio', 'farmácia', 'curativo', 'band-aid', 'nécessaire', 'maquiagem', 'batom', 'hidratante', 'barbeador', 'lâmina'],
  '🛂 DOCUMENTOS': ['passaporte', 'civp', 'vacina', 'rg', 'cpf', 'visto', 'reserva', 'comprovante', 'seguro', 'cartão', 'dinheiro', 'rand', 'dólar', 'wallet', 'carteira'],
  '🔌 ELETRÔNICOS': ['carregador', 'cabo', 'celular', 'power bank', 'adaptador', 'fone', 'headset', 'câmera', 'go pro', 'laptop', 'tablet', 'kindle'],
  '🎒 ACESSÓRIOS': ['chapéu', 'boné', 'óculos', 'relógio', 'joia', 'brinco', 'colar', 'pulseira', 'vuvuzela', 'protetor auricular', 'tampão'],
  '📦 DIVERSOS': [] // Fallback
};

const identifyCategory = (text: string): string => {
  const normalized = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(k => normalized.includes(k))) {
      return category;
    }
  }
  return '📦 DIVERSOS';
};

const sortItems = (items: Item[]) => {
  return [...items].sort((a, b) => a.text.localeCompare(b.text, 'pt-BR', { sensitivity: 'base', numeric: true }));
};

const INITIAL_DATA: PackingData = {
  'André': {
    'bag23kg': [
      { id: 'a1', text: '10 Pares de Meia e Cuecas', checked: false },
      { id: 'a2', text: '7 Camisetas de Algodão Básicas', checked: false },
      { id: 'a3', text: 'Calça de Sarja / Jeans (Jantares)', checked: false },
      { id: 'a4', text: 'Camisa Oficial Kaizer Chiefs (Amarela/Preta)', checked: true },
      { id: 'a5', text: 'Capa de Chuva Leve (Tempestades JNB)', checked: false },
      { id: 'a6', text: 'Casaco Corta-vento (Cape Doctor)', checked: true },
      { id: 'a7', text: 'Chapéu de Abas Largas (Safari)', checked: true },
      { id: 'a8', text: 'Roupas de Safari (Cores Bege/Verde Musgo)', checked: true },
      { id: 'a9', text: 'Tênis Confortável (Trilhas e Estádio)', checked: true },
    ],
    'bag10kg': [
      { id: 'a10', text: 'Kit Farmácia (Analgésicos/Curativos)', checked: false },
      { id: 'a11', text: 'Nécessaire de Banho (Shampoo/Barbeador)', checked: false },
      { id: 'a12', text: 'Protetor Solar + Labial (Sol forte)', checked: false },
      { id: 'a13', text: 'Repelente (Safari/Lion Park)', checked: false },
    ],
    'pouch5kg': [
      { id: 'a14', text: 'Adaptador Tomada Tipo M (3 pinos)', checked: false },
      { id: 'a15', text: 'Cartões Wise/Nomad + Rands espécie', checked: false },
      { id: 'a16', text: 'CIVP (Vacina Febre Amarela)', checked: false },
      { id: 'a17', text: 'Comprovantes impressos (Hotéis/Voos)', checked: false },
      { id: 'a18', text: 'Passaporte (+6 meses validade)', checked: false },
      { id: 'a19', text: 'Power Bank (Carregador Portátil)', checked: false },
      { id: 'a20', text: 'Protetores Auriculares (Vuvuzelas!)', checked: false },
    ]
  },
  'Marcelly': {
    'bag23kg': [
      { id: 'm1', text: 'Capa de chuva leve', checked: false },
      { id: 'm2', text: 'Casaco Corta-vento (Table Mountain)', checked: false },
      { id: 'm3', text: 'Nécessaire completa (Líquidos)', checked: false },
      { id: 'm4', text: 'Roupas Leves e Frescas', checked: false },
      { id: 'm5', text: 'Tênis confortável + Chinelo', checked: false },
    ],
    'bag10kg': [
      { id: 'm6', text: 'Maquiagem básica', checked: false },
      { id: 'm7', text: 'Protetor Solar + Hidratante Labial', checked: false },
      { id: 'm8', text: 'Repelente Forte', checked: false },
    ],
    'pouch5kg': [
      { id: 'm9', text: 'Adaptador Universal / Tipo M', checked: false },
      { id: 'm10', text: 'CIVP (Vacina Febre Amarela)', checked: false },
      { id: 'm11', text: 'Joias/Bijuterias (Sempre na mão)', checked: false },
      { id: 'm12', text: 'Passaporte (+6 meses validade)', checked: false },
      { id: 'm13', text: 'Power Bank + Cabos', checked: false },
      { id: 'm14', text: 'Protetores Auriculares (Anti-Vuvuzela)', checked: false },
    ]
  }
};

const PackingTips: React.FC = () => (
    <div className="space-y-4 mb-6">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 shadow-sm">
            <h3 className="text-indigo-800 font-bold flex items-center gap-2 mb-2 font-display text-sm uppercase tracking-wide">
                <Smartphone className="w-4 h-4" /> Baixe no Brasil (Apps)
            </h3>
            <ul className="text-xs text-indigo-700 space-y-1.5 leading-relaxed list-disc pl-4">
                <li><strong>Uber & Bolt:</strong> Tenha os dois. Bolt é mais barato, Uber é mais consistente.</li>
                <li><strong>Google Maps Offline:</strong> Baixe os mapas de CPT e JNB.</li>
                <li><strong>City Sightseeing SA:</strong> Para horários do Red Bus.</li>
                <li><strong>Webtickets / Ticketpro:</strong> Para ingressos de futebol e museus.</li>
            </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 shadow-sm">
            <h3 className="text-yellow-800 font-bold flex items-center gap-2 mb-2 font-display text-sm uppercase tracking-wide">
                <FileText className="w-4 h-4" /> Burocracia Essencial
            </h3>
            <div className="text-xs text-yellow-800 space-y-2 leading-relaxed">
                <p>
                    <strong>CIVP (Febre Amarela):</strong> É a primeira coisa que pedem. Tenha o certificado internacional em mãos (papel ou PDF).
                </p>
                <p>
                    <strong>Seguro Viagem:</strong> Verifique se cobre "atividades de aventura" (ex: Safári/Trilhas).
                </p>
                <p>
                    <strong>Estádios:</strong> Leve o mínimo. Revistas são demoradas. Garrafas de vidro e guarda-chuvas grandes são proibidos.
                </p>
            </div>
        </div>
    </div>
);

const PackingListItem: React.FC<{
  item: Item;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}> = ({ item, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(item.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(item.text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-200 shadow-sm animate-in fade-in duration-200">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 text-sm outline-none text-slate-700 font-medium bg-transparent min-w-0"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <div className="flex shrink-0 gap-1">
          <button onClick={handleSave} className="text-green-600 p-1.5 hover:bg-green-50 rounded-md transition-colors">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={handleCancel} className="text-gray-400 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
      <button 
        onClick={() => onToggle(item.id)}
        className="mt-0.5 text-gray-300 hover:text-green-500 focus:outline-none transition-colors shrink-0"
      >
        {item.checked ? (
          <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>
      
      <span 
        className={`flex-1 text-sm font-medium transition-all cursor-pointer pt-0.5 ${
          item.checked ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-700'
        }`}
        onClick={() => onToggle(item.id)}
      >
        {item.text}
      </span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-gray-300 hover:text-blue-500 p-1 rounded-md"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="text-gray-300 hover:text-red-500 p-1 rounded-md"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

const BagSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  items: Item[];
  colorClass: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onAdd: (text: string) => void;
}> = ({ title, icon, items, colorClass, onToggle, onDelete, onEdit, onAdd }) => {
  const [newItemText, setNewItemText] = useState('');

  const handleAdd = () => {
    if (newItemText.trim()) {
      onAdd(newItemText.trim());
      setNewItemText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  // --- AGRUPAMENTO E ORDENAÇÃO ---
  // Fix: Explicitly type useMemo and its contents to ensure .map works on returned items
  const groupedItems = useMemo<Record<string, Item[]>>(() => {
    const groups: Record<string, Item[]> = {};
    (items as Item[]).forEach(item => {
      const cat = identifyCategory(item.text);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });

    // Ordena as categorias alfabeticamente
    const sortedCategories = Object.keys(groups).sort();
    
    // Cria um novo objeto ordenado
    const sortedGroups: Record<string, Item[]> = {};
    sortedCategories.forEach(cat => {
      sortedGroups[cat] = sortItems(groups[cat]);
    });
    
    return sortedGroups;
  }, [items]);

  const completedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <div className={`mb-6 rounded-2xl border-2 overflow-hidden ${colorClass} bg-white shadow-sm`}>
      <div className={`p-3 flex items-center justify-between border-b border-gray-100 bg-opacity-30 ${colorClass.replace('border-', 'bg-')}`}>
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-display font-bold text-slate-700">{title}</h3>
        </div>
        <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-100">
          {completedCount}/{totalCount}
        </span>
      </div>

      <div className="h-1 w-full bg-gray-100">
        <div 
          className="h-full transition-all duration-500 ease-out bg-green-500" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-3">
        <div className="space-y-4">
          {/* Fix: Explicitly type categoryItems as Item[] to resolve 'unknown' type error in map function */}
          {Object.entries(groupedItems).map(([category, categoryItems]: [string, Item[]]) => (
            <div key={category} className="animate-in fade-in duration-500">
              <div className="flex items-center gap-2 px-2 mb-2">
                 <Tag className="w-3 h-3 text-slate-300" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{category}</span>
                 <div className="h-[1px] flex-1 bg-slate-50"></div>
              </div>
              <div className="space-y-1">
                {categoryItems.map(item => (
                  <PackingListItem
                    key={item.id}
                    item={item}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            </div>
          ))}
          
          {items.length === 0 && (
            <p className="text-center text-gray-300 text-xs italic py-2">Nenhum item nesta lista.</p>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: 5 Camisas pretas..."
            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all placeholder:text-gray-400"
          />
          <button 
            onClick={handleAdd}
            disabled={!newItemText.trim()}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const PackingList: React.FC = () => {
  const [activePerson, setActivePerson] = useState<Person>('André');
  const [data, setData] = useState<PackingData | null>(null);
  const [isLoadingCloud, setIsLoadingCloud] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoadingCloud(true);
        const cloudData = await loadDataFromCloud('packing_list_v5');
        
        if (cloudData) {
          setData(cloudData as PackingData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
        } else {
          const localSaved = localStorage.getItem(STORAGE_KEY);
          if (localSaved) {
            setData(JSON.parse(localSaved));
          } else {
            setData(INITIAL_DATA);
          }
        }
      } catch (e) {
        setData(INITIAL_DATA);
      } finally {
        setIsLoadingCloud(false);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (data && !isLoadingCloud) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      const timeoutId = setTimeout(() => {
        syncDataToCloud('packing_list_v5', data);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [data, isLoadingCloud]);

  const handleToggle = (person: Person, bag: BagType, itemId: string) => {
    if (!data) return;
    const newData = { ...data };
    const itemIndex = newData[person][bag].findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
      newData[person][bag][itemIndex].checked = !newData[person][bag][itemIndex].checked;
      setData({ ...newData });
    }
  };

  const handleDelete = (person: Person, bag: BagType, itemId: string) => {
    if (!data) return;
    const newData = { ...data };
    newData[person][bag] = newData[person][bag].filter(i => i.id !== itemId);
    setData({ ...newData });
  };

  const handleEdit = (person: Person, bag: BagType, itemId: string, newText: string) => {
    if (!data) return;
    const newData = { ...data };
    const itemIndex = newData[person][bag].findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
      newData[person][bag][itemIndex].text = newText;
      setData({ ...newData });
    }
  };

  const handleAdd = (person: Person, bag: BagType, text: string) => {
    if (!data) return;
    const newData = { ...data };
    newData[person][bag].push({
      id: Date.now().toString(),
      text,
      checked: false
    });
    setData({ ...newData });
  };

  if (!data) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
       <RefreshCw className="w-8 h-8 animate-spin text-sa-green" />
       <p className="text-xs font-bold uppercase tracking-widest">Sincronizando Malas...</p>
    </div>
  );

  return (
    <div>
      <PackingTips />
      
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6 shadow-inner">
        {(['André', 'Marcelly'] as Person[]).map((person) => (
          <button
            key={person}
            onClick={() => setActivePerson(person)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold font-display transition-all ${
              activePerson === person 
                ? 'bg-white text-green-700 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <User className={`w-4 h-4 ${activePerson === person ? 'fill-green-100' : ''}`} />
            {person}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <BagSection 
          title="Mala 23kg (Despachada)" 
          icon={<Luggage className="w-5 h-5 text-blue-600" />}
          items={data[activePerson]['bag23kg']}
          colorClass="border-blue-100"
          onToggle={(id) => handleToggle(activePerson, 'bag23kg', id)}
          onDelete={(id) => handleDelete(activePerson, 'bag23kg', id)}
          onEdit={(id, txt) => handleEdit(activePerson, 'bag23kg', id, txt)}
          onAdd={(text) => handleAdd(activePerson, 'bag23kg', text)}
        />

        <BagSection 
          title="Mala 10kg (Mão)" 
          icon={<ShoppingBag className="w-5 h-5 text-orange-600" />}
          items={data[activePerson]['bag10kg']}
          colorClass="border-orange-100"
          onToggle={(id) => handleToggle(activePerson, 'bag10kg', id)}
          onDelete={(id) => handleDelete(activePerson, 'bag10kg', id)}
          onEdit={(id, txt) => handleEdit(activePerson, 'bag10kg', id, txt)}
          onAdd={(text) => handleAdd(activePerson, 'bag10kg', text)}
        />

        <BagSection 
          title="Frasqueira 5kg (Mão)" 
          icon={<Briefcase className="w-5 h-5 text-purple-600" />}
          items={data[activePerson]['pouch5kg']}
          colorClass="border-purple-100"
          onToggle={(id) => handleToggle(activePerson, 'pouch5kg', id)}
          onDelete={(id) => handleDelete(activePerson, 'pouch5kg', id)}
          onEdit={(id, txt) => handleEdit(activePerson, 'pouch5kg', id, txt)}
          onAdd={(text) => handleAdd(activePerson, 'pouch5kg', text)}
        />
      </div>

      <div className="text-center mt-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5 uppercase font-black tracking-widest">
          <Sticker className="w-3 h-3 text-sa-green" />
          Agrupamento Automático Ativo
        </p>
        <p className="text-[9px] text-gray-400 mt-1">A IA categoriza itens como roupas, eletrônicos e higiene conforme você escreve.</p>
      </div>
    </div>
  );
};

export default PackingList;
