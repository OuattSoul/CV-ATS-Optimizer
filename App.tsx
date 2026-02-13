
import React, { useState } from 'react';
import Layout from './components/Layout';
import CVForm from './components/CVForm';
import LoadingScreen from './components/LoadingScreen';
import ResultsView from './components/ResultsView';
import { optimizeCV } from './services/geminiService';
import { AppStage, OptimizationResult } from './types';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('INPUT');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const handleOptimize = async (cv: string, jd: string) => {
    setStage('LOADING');
    setError(null);
    try {
      const data = await optimizeCV(cv, jd);
      setResult(data);
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

  return (
    <Layout>
      {stage === 'INPUT' && (
        <div className="animate-fade-in">
          <div className="text-center mb-12">
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
