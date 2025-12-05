import React from 'react';
import { History, Clock } from 'lucide-react';
import { GenerationResult } from '../types';

interface HistoryBarProps {
  history: GenerationResult[];
  onSelect: (item: GenerationResult) => void;
  selectedId?: string;
}

const HistoryBar: React.FC<HistoryBarProps> = ({ history, onSelect, selectedId }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-800 pt-6">
      <div className="flex items-center space-x-2 mb-4 text-gray-400">
        <History size={18} />
        <span className="text-sm font-medium uppercase tracking-wider">Recent Sessions</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`group relative flex-shrink-0 w-32 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              selectedId === item.id 
                ? 'border-brand-500 ring-2 ring-brand-500/20' 
                : 'border-transparent hover:border-gray-600'
            }`}
          >
            <img 
              src={item.imageUrl} 
              alt="History thumbnail" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
              <p className="text-[10px] text-white line-clamp-2 text-left">{item.prompt}</p>
              <div className="flex items-center mt-1 text-[9px] text-gray-400">
                 <Clock size={8} className="mr-1" />
                 {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryBar;