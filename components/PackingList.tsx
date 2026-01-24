
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
  Pencil,
  X,
  Check,
  FileText,
  RefreshCw,
  Tag,
  Sticker,
  CloudLightning
} from 'lucide-react';
import { syncDataToCloud, subscribeToCloudData } from '../services/firebase';

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

const CATEGORY_MAP: Record<string, string[]> = {
  '👕 ROUPAS': ['camisa', 'camiseta', 'calça', 'bermuda', 'short', 'cueca', 'meia', 'casaco', 'jaqueta', 'vestido', 'saia', 'biquíni', 'sunga', 'moletom', 'agasalho', 'roupa', 'blusa', 'pijama'],
  '👟 CALÇADOS': ['tênis', 'sapato', 'chinelo', 'sandália', 'bota', 'crocs', 'pantufa'],
  '🧴 HIGIENE & SAÚDE': ['escova', 'pasta', 'shampoo', 'condicionador', 'sabonete', 'desodorante', 'perfume', 'protetor', 'repelente', 'remédio', 'farmácia', 'curativo', 'band-aid', 'nécessaire', 'maquiagem', 'batom', 'hidratante', 'barbeador', 'lâmina'],
  '🛂 DOCUMENTOS': ['passaporte', 'civp', 'vacina', 'rg', 'cpf', 'visto', 'reserva', 'comprovante', 'seguro', 'cartão', 'dinheiro', 'rand', 'dólar', 'wallet', 'carteira'],
  '🔌 ELETRÔNICOS': ['carregador', 'cabo', 'celular', 'power bank', 'adaptador', 'fone', 'headset', 'câmera', 'go pro', 'laptop', 'tablet', 'kindle'],
  '🎒 ACESSÓRIOS': ['chapéu', 'boné', 'óculos', 'relógio', 'joia', 'brinco', 'colar', 'pulseira', 'vuvuzela', 'protetor auricular', 'tampão'],
  '📦 DIVERSOS': []
};

const identifyCategory = (text: string): string => {
  const normalized = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(k => normalized.includes(k))) return category;
  }
  return '📦 DIVERSOS';
};

const sortItems = (items: Item[]) => {
  return [...items].sort((a, b) => a.text.localeCompare(b.text, 'pt-BR', { sensitivity: 'base', numeric: true }));
};

const INITIAL_DATA: PackingData = {
  'André': { 'bag23kg': [], 'bag10kg': [], 'pouch5kg': [] },
  'Marcelly': { 'bag23kg': [], 'bag10kg': [], 'pouch5kg': [] }
};

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

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-200 shadow-sm">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 text-sm outline-none text-slate-700 font-medium bg-transparent min-w-0"
          autoFocus
        />
        <div className="flex shrink-0 gap-1">
          <button onClick={handleSave} className="text-green-600 p-1.5 hover:bg-green-50 rounded-md"><Check className="w-4 h-4" /></button>
          <button onClick={() => setIsEditing(false)} className="text-gray-400 p-1.5 hover:bg-gray-100 rounded-md"><X className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
      <button onClick={() => onToggle(item.id)} className="mt-0.5 text-gray-300 hover:text-green-500 transition-colors shrink-0">
        {item.checked ? <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" /> : <Circle className="w-5 h-5" />}
      </button>
      <span className={`flex-1 text-sm font-medium pt-0.5 ${item.checked ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-700'}`} onClick={() => onToggle(item.id)}>
        {item.text}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0">
        <button onClick={() => setIsEditing(true)} className="text-gray-300 hover:text-blue-500 p-1"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => onDelete(item.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
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

  const groupedItems = useMemo(() => {
    const groups: Record<string, Item[]> = {};
    items.forEach(item => {
      const cat = identifyCategory(item.text);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    const sortedGroups: Record<string, Item[]> = {};
    Object.keys(groups).sort().forEach(cat => { sortedGroups[cat] = sortItems(groups[cat]); });
    return sortedGroups;
  }, [items]);

  const completedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <div className={`mb-6 rounded-2xl border-2 overflow-hidden ${colorClass} bg-white shadow-sm`}>
      <div className={`p-3 flex items-center justify-between border-b border-gray-100 ${colorClass.replace('border-', 'bg-').replace('100', '50')}`}>
        <div className="flex items-center gap-2">{icon}<h3 className="font-display font-bold text-slate-700">{title}</h3></div>
        <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-100">{completedCount}/{totalCount}</span>
      </div>
      <div className="h-1 w-full bg-gray-100"><div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
      <div className="p-3">
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, catItems]) => (
            <div key={category}>
              <div className="flex items-center gap-2 px-2 mb-2"><Tag className="w-3 h-3 text-slate-300" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{category}</span><div className="h-[1px] flex-1 bg-slate-50"></div></div>
              <div className="space-y-1">{catItems.map(item => <PackingListItem key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />)}</div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-gray-300 text-xs italic py-2">Nenhum item nesta lista.</p>}
        </div>
        <div className="mt-6 flex gap-2">
          <input type="text" value={newItemText} onChange={(e) => setNewItemText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="Adicionar item..." className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500" />
          <button onClick={handleAdd} disabled={!newItemText.trim()} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50"><Plus className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

const PackingList: React.FC = () => {
  const [activePerson, setActivePerson] = useState<Person>('André');
  const [data, setData] = useState<PackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // SUBSCRIBE TO REAL-TIME UPDATES
  useEffect(() => {
    setIsLoading(true);
    
    // Carregar do cache local primeiro para carregar rápido
    const localSaved = localStorage.getItem(STORAGE_KEY);
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        setData(parsed as PackingData);
      } catch (e) {
        console.error("Erro ao carregar cache local", e);
      }
    }

    // Conectar ao Firebase em Tempo Real
    const unsubscribe = subscribeToCloudData('packing_list_v5', (cloudData) => {
      if (cloudData) {
        setData(cloudData as PackingData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
      } else if (!data) {
        setData(INITIAL_DATA);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateCloud = (newData: PackingData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    syncDataToCloud('packing_list_v5', newData);
  };

  const handleToggle = (person: Person, bag: BagType, itemId: string) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    const itemIndex = newData[person][bag].findIndex((i: any) => i.id === itemId);
    if (itemIndex > -1) {
      newData[person][bag][itemIndex].checked = !newData[person][bag][itemIndex].checked;
      updateCloud(newData);
    }
  };

  const handleDelete = (person: Person, bag: BagType, itemId: string) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    newData[person][bag] = newData[person][bag].filter((i: any) => i.id !== itemId);
    updateCloud(newData);
  };

  const handleEdit = (person: Person, bag: BagType, itemId: string, newText: string) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    const itemIndex = newData[person][bag].findIndex((i: any) => i.id === itemId);
    if (itemIndex > -1) {
      newData[person][bag][itemIndex].text = newText;
      updateCloud(newData);
    }
  };

  const handleAdd = (person: Person, bag: BagType, text: string) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    newData[person][bag].push({ id: Date.now().toString(), text, checked: false });
    updateCloud(newData);
  };

  if (isLoading && !data) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
       <RefreshCw className="w-8 h-8 animate-spin text-sa-green" />
       <p className="text-xs font-bold uppercase tracking-widest">Sincronizando Malas...</p>
    </div>
  );

  // Destructure personData safely to avoid property access on null/undefined
  const personData = data ? data[activePerson] : null;

  return (
    <div>
      <div className="bg-green-900/10 border border-green-200 rounded-2xl p-4 mb-6 flex gap-3 items-start">
        <CloudLightning className="w-5 h-5 text-sa-green shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sa-green font-bold text-sm uppercase">Sincronização Instantânea</h3>
          <p className="text-[10px] text-green-800 leading-relaxed font-medium">As alterações feitas aqui aparecerão automaticamente em todos os seus outros aparelhos conectados.</p>
        </div>
      </div>
      
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6 shadow-inner">
        {(['André', 'Marcelly'] as Person[]).map((person) => (
          <button key={person} onClick={() => setActivePerson(person)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activePerson === person ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            <User className="w-4 h-4" /> {person}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2">
        <BagSection title="Mala 23kg (Despachada)" icon={<Luggage className="w-5 h-5 text-blue-600" />} items={personData?.bag23kg || []} onToggle={(id) => handleToggle(activePerson, 'bag23kg', id)} onDelete={(id) => handleDelete(activePerson, 'bag23kg', id)} onEdit={(id, txt) => handleEdit(activePerson, 'bag23kg', id, txt)} onAdd={(text) => handleAdd(activePerson, 'bag23kg', text)} />
        <BagSection title="Mala 10kg (Mão)" icon={<ShoppingBag className="w-5 h-5 text-orange-600" />} items={personData?.bag10kg || []} onToggle={(id) => handleToggle(activePerson, 'bag10kg', id)} onDelete={(id) => handleDelete(activePerson, 'bag10kg', id)} onEdit={(id, txt) => handleEdit(activePerson, 'bag10kg', id, txt)} onAdd={(text) => handleAdd(activePerson, 'bag10kg', text)} />
        <BagSection title="Frasqueira 5kg (Mão)" icon={<Briefcase className="w-5 h-5 text-purple-600" />} items={personData?.pouch5kg || []} onToggle={(id) => handleToggle(activePerson, 'pouch5kg', id)} onDelete={(id) => handleDelete(activePerson, 'pouch5kg', id)} onEdit={(id, txt) => handleEdit(activePerson, 'pouch5kg', id, txt)} onAdd={(text) => handleAdd(activePerson, 'pouch5kg', text)} />
      </div>
      <div className="text-center mt-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5 uppercase font-black tracking-widest"><Sticker className="w-3 h-3 text-sa-green" /> Modo Multi-Device Ativo</p>
      </div>
    </div>
  );
};

export default PackingList;
