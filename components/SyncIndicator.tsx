import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, CloudOff } from 'lucide-react';

type SyncStatus = 'idle' | 'saving' | 'saved' | 'error';

const SyncIndicator: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus>('idle');

  useEffect(() => {
    const handleSyncChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setStatus(customEvent.detail);
      
      if (customEvent.detail === 'saved') {
        setTimeout(() => setStatus('idle'), 3000);
      }
    };

    window.addEventListener('sync-status', handleSyncChange);
    return () => window.removeEventListener('sync-status', handleSyncChange);
  }, []);

  if (status === 'idle') return null;

  return (
    <div className="fixed top-4 right-4 z-[100] bg-white/90 backdrop-blur-md shadow-lg rounded-full px-3 py-1.5 flex items-center gap-2 border border-gray-100 animate-in fade-in slide-in-from-top-2">
      {status === 'saving' && (
        <>
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-[10px] font-bold text-blue-800 uppercase">Salvando...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-[10px] font-bold text-green-800 uppercase">Salvo na Nuvem</span>
        </>
      )}
      {status === 'error' && (
        <>
          <CloudOff className="w-4 h-4 text-red-500" />
          <span className="text-[10px] font-bold text-red-800 uppercase">Erro ao Salvar</span>
        </>
      )}
    </div>
  );
};

export default SyncIndicator;