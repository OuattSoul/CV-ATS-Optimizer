
import React from 'react';
import { OptimizationResult } from '../types';

interface ResultsViewProps {
  result: OptimizationResult;
  onReset: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; icon?: string }> = ({ title, children, icon }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
      {icon && <span className="text-xl">{icon}</span>}
      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const { atsScore, atsAnalysis, cvAudit, recommendations, advancedTips, finalCV } = result;

  const copyToClipboard = () => {
    const cvText = `
${finalCV.optimizedTitle}

RÉSUMÉ PROFESSIONNEL
${finalCV.professionalSummary}

COMPÉTENCES CLÉS
${finalCV.keySkills.join(' | ')}

EXPÉRIENCES PROFESSIONNELLES
${finalCV.professionalExperience.map(exp => `
${exp.role} @ ${exp.company} (${exp.period})
${exp.bullets.map(b => `- ${b}`).join('\n')}
`).join('\n')}

FORMATION
${finalCV.education.join('\n')}

OUTILS & TECHNOLOGIES
${finalCV.toolsAndTech.join(' | ')}
    `.trim();
    
    navigator.clipboard.writeText(cvText);
    alert('CV copié dans le presse-papier !');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-600';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-600';
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Analyse & Optimisation</h2>
          <p className="text-slate-500 text-sm mt-1">Audit complet basé sur les critères de recrutement modernes.</p>
        </div>
        <button 
          onClick={onReset}
          className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center gap-2 px-4 py-2 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-all"
        >
          ← Recommencer l'analyse
        </button>
      </div>

      {/* ATS Compatibility Score Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={364.4}
              strokeDashoffset={364.4 - (364.4 * atsScore) / 100}
              strokeLinecap="round"
              className={`${getScoreColor(atsScore)} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${getScoreColor(atsScore)}`}>{atsScore}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score ATS</span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Compatibilité Initiale</h3>
          <p className="text-slate-600 text-sm leading-relaxed max-w-lg">
            Ce score représente l'adéquation actuelle de votre CV avec l'offre d'emploi avant notre intervention. 
            Une version optimisée vise un score de <span className="font-bold text-emerald-600">95%+</span>.
          </p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getScoreBg(atsScore)}`}></div>
              <span className="text-xs font-bold text-slate-700 uppercase">{atsScore >= 80 ? 'Excellent Match' : atsScore >= 50 ? 'Match Moyen' : 'Match Faible'}</span>
            </div>
          </div>
        </div>
      </div>

      <Section title="1. Analyse ATS de l'offre" icon="🎯">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-xs text-slate-400 mb-2 uppercase">Mots-clés Cruciaux</h4>
            <div className="flex flex-wrap gap-2">
              {atsAnalysis.keywords.map((k, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium border border-indigo-100">{k}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-400 mb-2 uppercase">Technologies Mentionnées</h4>
            <div className="flex flex-wrap gap-2">
              {atsAnalysis.technologies.map((t, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">{t}</span>
              ))}
            </div>
          </div>
          <div className="col-span-full">
            <h4 className="font-bold text-xs text-slate-400 mb-2 uppercase">Priorités du Recruteur</h4>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              {atsAnalysis.priorities.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
          <div className="col-span-full">
             <h4 className="font-bold text-xs text-slate-400 mb-2 uppercase">Niveau Attendu</h4>
             <p className="text-sm text-slate-700 font-semibold">{atsAnalysis.experienceLevel}</p>
          </div>
        </div>
      </Section>

      <Section title="2. Audit du CV Actuel" icon="🔍">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <h4 className="font-bold text-xs text-emerald-600 mb-2 uppercase">Forces</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  {cvAudit.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-xs text-rose-600 mb-2 uppercase">Faiblesses / Manques</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  {cvAudit.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
             </div>
          </div>
          <div>
             <h4 className="font-bold text-xs text-amber-600 mb-2 uppercase">Métriques Manquantes</h4>
             <p className="text-sm text-slate-600 italic">Le recruteur cherche des preuves de performance :</p>
             <ul className="list-disc list-inside text-sm text-slate-600 mt-1 space-y-1">
                {cvAudit.missingMetrics.map((m, i) => <li key={i}>{m}</li>)}
             </ul>
          </div>
        </div>
      </Section>

      <Section title="3. Recommandations Stratégiques" icon="💡">
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
            <h4 className="text-indigo-900 font-bold text-sm">Nouveau Titre Professionnel Suggéré</h4>
            <p className="text-lg font-bold text-indigo-700 mt-1">{recommendations.title}</p>
          </div>
          <ul className="space-y-3">
            {recommendations.strategicPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-indigo-500 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="4. Conseils Avancés" icon="🚀">
        <div className="grid grid-cols-1 gap-3">
           {advancedTips.map((tip, i) => (
             <div key={i} className="p-4 border border-slate-100 rounded-xl bg-slate-50 text-sm text-slate-700">
               {tip}
             </div>
           ))}
        </div>
      </Section>

      <div className="mt-12 mb-8 flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-900">5. Version Finale Optimisée (ATS Ready)</h2>
         <button 
           onClick={copyToClipboard}
           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2"
         >
           📋 Copier le CV Texte
         </button>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-lg p-10 font-mono text-xs leading-relaxed text-slate-800 shadow-2xl relative">
        <div className="absolute top-4 right-4 text-[10px] text-slate-400 uppercase font-bold tracking-widest">Format ATS Strict</div>
        
        <div className="text-center mb-8">
           <h1 className="text-2xl font-bold mb-2">{finalCV.optimizedTitle}</h1>
           <div className="w-16 h-1 bg-slate-900 mx-auto"></div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold border-b border-slate-300 pb-1 mb-2 uppercase text-[11px]">Résumé Professionnel</h2>
          <p>{finalCV.professionalSummary}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-bold border-b border-slate-300 pb-1 mb-2 uppercase text-[11px]">Compétences Clés</h2>
          <p className="font-bold">{finalCV.keySkills.join(' | ')}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-bold border-b border-slate-300 pb-1 mb-2 uppercase text-[11px]">Expériences Professionnelles</h2>
          {finalCV.professionalExperience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify