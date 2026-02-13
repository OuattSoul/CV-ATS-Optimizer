
import React, { useState, useEffect } from 'react';

const messages = [
  "Extraction des mots-clés ATS de l'offre...",
  "Analyse comparative de votre profil...",
  "Identification des compétences manquantes...",
  "Réécriture stratégique des bullet points...",
  "Vérification de la compatibilité machine...",
  "Optimisation de la structure professionnelle...",
  "Finalisation de votre nouveau CV..."
];

const LoadingScreen: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-pulse">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Expert IA en action</h2>
        <p className="text-slate-500 font-medium transition-all duration-500">
          {messages[msgIndex]}
        </p>
      </div>
      <div className="max-w-md w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className="bg-indigo-600 h-full w-1/2 animate-[loading_2s_infinite]"></div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
