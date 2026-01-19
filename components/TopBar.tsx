import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  CloudCheck, 
  CloudOff,
  RefreshCw
} from 'lucide-react';

interface TopBarProps {
  variant?: 'home' | 'minimal';
}

const TopBar: React.FC<TopBarProps> = ({ variant = 'home' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed top-2 right-2 z-[70] pointer-events-none flex gap-2">
      {/* Sync Indicator Minimalista */}
      <div className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md border shadow-lg transition-all duration-500 ${
        isOnline ? 'bg-black/40 border-green-500/30 text-green-400' : 'bg-red-950/40 border-red-500/50 text-red-400'
      }`}>
         {isOnline ? (
           <RefreshCw className="w-4 h-4 animate-[spin_3s_linear_infinite]" />
         ) : (
           <CloudOff className="w-4 h-4" />
         )}
      </div>
    </div>
  );
};

export default TopBar;