
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CVForm from './components/CVForm';
import LoadingScreen from './components/LoadingScreen';
import ResultsView from './components/ResultsView';
import HistoryView from './components/HistoryView';
import { optimizeCV } from './services/geminiService';
import { AppStage, OptimizationResult, HistoryItem } from './types';

const STORAGE_KEY = 'cv_optimizer_history';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('INPUT');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleOptimize = async (cv: string, jd: string) => {
    setStage('LOADING');
    setError(null);
    try {
      const data = await optimizeCV(cv, jd);
      setResult(data);
      
      // Save to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        result: data
      };
      setHistory(prev => [newItem, ...prev]);
      
      setStage('RESULT');
    } catch (err) {
      console.error(err);
      setError("Désolé, une erreur est survenue lors de l'analyse. Vérifiez votre connexion ou réessayez plus tard.");
      setStage('INPUT');
    }
  };

  const handleReset = () => {
    setStage('INPUT');
    setResult(null);
    setError(null);
  };

  const handleOpenHistoryItem = (item: HistoryItem) => {
    setResult(item.result);
    setStage('RESULT');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer tout votre historique ?")) {
      setHistory([]);
    }
  };

  return (
    <Layout>
      {stage === 'INPUT' && (
        <div className="animate-fade-in">
          <div className="text-center mb-12 relative">
            {history.length > 0 && (
              <button 
                onClick={() => setStage('HISTORY')}
                className="absolute right-0 top-0 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                📜 Historique ({history.length})
              </button>
            )}
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Passez le filtre des <span className="text-indigo-600">algorithmes ATS</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Optimisez votre CV pour une offre spécifique grâce à notre expert en recrutement assisté par IA. 
              Résultat professionnel, stratégique et 100% lisible par les machines.
            </p>
          </div>
          
          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <CVForm onSubmit={handleOptimize} isLoading={false} />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 font-bold text-lg">1</div>
              <h4 className="font-bold mb-2">Analyse ATS</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Identification automatique des mots-clés et compétences attendus par le logiciel de tri.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 font-bold text-lg">2</div>
              <h4 className="font-bold mb-2">Audit Critique</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Détection des faiblesses, des incohérences et des manques de preuves chiffrées (métriques).</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 font-bold text-lg">3</div>
              <h4 className="font-bold mb-2">Relooking Pro</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Génération d'une version finale épurée, sans emojis, centrée sur l'impact et la lisibilité.</p>
            </div>
          </div>
        </div>
      )}

      {stage === 'LOADING' && <LoadingScreen />}

      {stage === 'RESULT' && result && (
        <ResultsView result={result} onReset={handleReset} />
      )}

      {stage === 'HISTORY' && (
        <HistoryView 
          history={history}
          onSelect={handleOpenHistoryItem}
          onDelete={handleDeleteHistoryItem}
          onClear={handleClearHistory}
          onBack={handleReset}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
};

export default App;
