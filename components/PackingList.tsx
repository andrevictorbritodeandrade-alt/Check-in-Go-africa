
import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { syncDataToCloud, loadDataFromCloud } from '../services/firebase';

type BagType = '23kg' | '10kg' | 'hand';
type Person = 'André' | 'Marcelly';

interface Item {
  id: string;
  text: string;
  checked: boolean;
}

type PackingData = Record<Person, Record<BagType, Item[]>>;

const STORAGE_KEY = 'checkin_go_packing_list_v3';

const INITIAL_DATA: PackingData = {
  'André': {
    '23kg': [
      { id: '1', text: 'Camisa Oficial Kaizer Chiefs (Amarela/Preta)', checked: true },
      { id: '2', text: 'Roupas de Safari (Cores Bege/Verde Musgo)', checked: true },
      { id: '3', text: 'Chapéu de Abas Largas (Safari)', checked: true },
      { id: '4', text: 'Tênis Confortável (Trilhas e Estádio)', checked: true },
      { id: '5', text: 'Casaco Corta-vento (Cape Doctor)', checked: true },
      { id: '6', text: 'Calça de Sarja / Jeans (Jantares)', checked: false },
      { id: '7', text: '7 Camisetas de Algodão Básicas', checked: false },
      { id: '8', text: '10 Pares de Meia e Cuecas', checked: false },
      { id: '9', text: 'Capa de Chuva Leve (Tempestades JNB)', checked: false },
    ],
    '10kg': [
      { id: 'a10', text: 'Protetor Solar + Labial (Sol forte)', checked: false },
      { id: 'a11', text: 'Repelente (Safari/Lion Park)', checked: false },
      { id: 'a12', text: 'Kit Farmácia (Analgésicos/Curativos)', checked: false },
      { id: 'a13', text: 'Nécessaire de Banho (Shampoo/Barbeador)', checked: false },
    ],
    'hand': [
      { id: 'a14', text: 'Passaporte (+6 meses validade)', checked: false },
      { id: 'a15', text: 'CIVP (Vacina Febre Amarela)', checked: false },
      { id: 'a16', text: 'Comprovantes impressos (Hotéis/Voos)', checked: false },
      { id: 'a17', text: 'Adaptador Tomada Tipo M (3 pinos)', checked: false },
      { id: 'a18', text: 'Power Bank (Carregador Portátil)', checked: false },
      { id: 'a19', text: 'Protetores Auriculares (Vuvuzelas!)', checked: false },
      { id: 'a20', text: 'Cartões Wise/Nomad + Rands espécie', checked: false },
    ]
  },
  'Marcelly': {
    '23kg': [
      { id: 'm1', text: 'Roupas Leves e Frescas', checked: false },
      { id: 'm2', text: 'Casaco Corta-vento (Table Mountain)', checked: false },
      { id: 'm3', text: 'Tênis confortável + Chinelo', checked: false },
      { id: 'm4', text: 'Nécessaire completa (Líquidos)', checked: false },
      { id: 'm5', text: 'Capa de chuva leve', checked: false },
    ],
    '10kg': [
      { id: 'm6', text: 'Protetor Solar + Hidratante Labial', checked: false },
      { id: 'm7', text: 'Repelente Forte', checked: false },
      { id: 'm8', text: 'Maquiagem básica', checked: false },
    ],
    'hand': [
      { id: 'm9', text: 'Passaporte (+6 meses validade)', checked: false },
      { id: 'm10', text: 'CIVP (Vacina Febre Amarela)', checked: false },
      { id: 'm11', text: 'Joias/Bijuterias (Sempre na mão)', checked: false },
      { id: 'm12', text: 'Adaptador Universal / Tipo M', checked: false },
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

        <div className="grid grid-cols-2 gap-3">
             <div className="bg-gray-100 border border-gray-200 rounded-2xl p-3 shadow-sm">
                <h3 className="text-gray-700 font-bold flex items-center gap-2 mb-1 font-display text-[10px] uppercase tracking-wide">
                    <Plug className="w-3 h-3" /> Tomada Tipo M
                </h3>
                <p className="text-[10px] text-gray-600 leading-tight">
                    A África do Sul usa 3 pinos redondos gigantes. Compre um adaptador universal ou específico lá.
                </p>
             </div>
             <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 shadow-sm">
                <h3 className="text-orange-700 font-bold flex items-center gap-2 mb-1 font-display text-[10px] uppercase tracking-wide">
                    <Ear className="w-3 h-3" /> Vuvuzelas
                </h3>
                <p className="text-[10px] text-orange-600 leading-tight">
                    Leve tampões de ouvido! O barulho no estádio é ensurdecedor e constante.
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

      <div className="flex items-center gap-1 shrink-0">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-gray-300 hover:text-blue-500 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
          title="Editar"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="text-gray-300 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
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

  const completedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <div className={`mb-6 rounded-2xl border-2 overflow-hidden ${colorClass} bg-white`}>
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
        <div className="space-y-1">
          {items.map(item => (
            <PackingListItem
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
          {items.length === 0 && (
            <p className="text-center text-gray-300 text-xs italic py-2">Nenhum item nesta lista.</p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Adicionar novo item..."
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

  // Inicialização Robusta: Nuvem -> Local -> Inicial
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoadingCloud(true);
        // 1. Tenta buscar backup da nuvem primeiro (Verdade Absoluta)
        const cloudData = await loadDataFromCloud('packing_list');
        
        if (cloudData) {
          console.log("Backup de mala encontrado na nuvem. Restaurando...");
          setData(cloudData as PackingData);
          // Atualiza o local para ficar sincronizado
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
        } else {
          // 2. Se não tem na nuvem, tenta local
          const localSaved = localStorage.getItem(STORAGE_KEY);
          if (localSaved) {
            setData(JSON.parse(localSaved));
          } else {
            // 3. Se não tem lugar nenhum, usa padrão
            setData(INITIAL_DATA);
          }
        }
      } catch (e) {
        console.error("Erro ao inicializar mala:", e);
        // Fallback para local em caso de erro de rede
        const localSaved = localStorage.getItem(STORAGE_KEY);
        setData(localSaved ? JSON.parse(localSaved) : INITIAL_DATA);
      } finally {
        setIsLoadingCloud(false);
      }
    };

    initData();
  }, []);

  // Sync: Sempre que mudar, salva local e na nuvem
  useEffect(() => {
    if (data && !isLoadingCloud) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Debounce para não floodar o banco
      const timeoutId = setTimeout(() => {
        syncDataToCloud('packing_list', data);
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
      setData(newData);
    }
  };

  const handleDelete = (person: Person, bag: BagType, itemId: string) => {
    if (!data) return;
    const newData = { ...data };
    newData[person][bag] = newData[person][bag].filter(i => i.id !== itemId);
    setData(newData);
  };

  const handleEdit = (person: Person, bag: BagType, itemId: string, newText: string) => {
    if (!data) return;
    const newData = { ...data };
    const itemIndex = newData[person][bag].findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
      newData[person][bag][itemIndex].text = newText;
      setData(newData);
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
    setData(newData);
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
      
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
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
          title="Mala Despachada (23kg)" 
          icon={<Luggage className="w-5 h-5 text-blue-600" />}
          items={data[activePerson]['23kg']}
          colorClass="border-blue-100"
          onToggle={(id) => handleToggle(activePerson, '23kg', id)}
          onDelete={(id) => handleDelete(activePerson, '23kg', id)}
          onEdit={(id, txt) => handleEdit(activePerson, '23kg', id, txt)}
          onAdd={(text) => handleAdd(activePerson, '23kg', text)}
        />

        <BagSection 
          title="Nécessaire / Extra (10kg)" 
          icon={<ShoppingBag className="w-5 h-5 text-orange-600" />}
          items={data[activePerson]['10kg']}
          colorClass="border-orange-100"
          onToggle={(id) => handleToggle(activePerson, '10kg', id)}
          onDelete={(id) => handleDelete(activePerson, '10kg', id)}
          onEdit={(id, txt) => handleEdit(activePerson, '10kg', id, txt)}
          onAdd={(text) => handleAdd(activePerson, '10kg', text)}
        />

        <BagSection 
          title="Mala de Mão (Documentos & Tech)" 
          icon={<Briefcase className="w-5 h-5 text-purple-600" />}
          items={data[activePerson]['hand']}
          colorClass="border-purple-100"
          onToggle={(id) => handleToggle(activePerson, 'hand', id)}
          onDelete={(id) => handleDelete(activePerson, 'hand', id)}
          onEdit={(id, txt) => handleEdit(activePerson, 'hand', id, txt)}
          onAdd={(text) => handleAdd(activePerson, 'hand', text)}
        />
      </div>

      <div className="text-center mt-4">
        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
          <Save className="w-3 h-3" />
          <Cloud className="w-3 h-3" />
          {isLoadingCloud ? 'Sincronizando...' : 'Backup automático na nuvem'}
        </p>
      </div>
    </div>
  );
};

export default PackingList;
