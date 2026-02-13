
import React from 'react';
import { HistoryItem } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onDelete, onClear, onBack }) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-600';
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Historique</h2>
          <p className="text-slate-500 text-sm mt-1">Retrouvez vos précédentes optimisations.</p>
        </div>
        <div className="flex gap-4">
          {history.length > 0 && (
            <button 
              onClick={onClear}
              className="text-rose-600 hover:text-rose-800 font-semibold text-sm px-4 py-2"
            >
              Tout effacer
            </button>
          )}
          <button 
            onClick={onBack}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            Retour
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <span className="text-5xl mb-4 block">📁</span>
          <h3 className="text-xl font-bold text-slate-800">Aucun historique</h3>
          <p className="text-slate-500 mt-2">Commencez par optimiser un CV pour le voir apparaître ici.</p>
          <button 
            onClick={onBack}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-all"
          >
            Optimiser un CV
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.sort((a, b) => b.timestamp - a.timestamp).map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-lg font-black ${getScoreColor(item.result.atsScore)}`}>
                    {item.result.atsScore}%
                  </span>
                  <h4 className="font-bold text-slate-800">{item.result.finalCV.optimizedTitle}</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium">{formatDate(item.timestamp)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onSelect(item)}
                  className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all"
                >
                  Ouvrir
                </button>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
