
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">CV ATS Optimizer</h1>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-500">
            <span className="text-indigo-600">Assistant IA</span>
            <span>Optimisation ATS</span>
            <span>Expert Recrutement</span>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">CV ATS Optimizer AI</h3>
              <p className="text-sm max-w-sm">
                Optimisez votre carrière grâce à l'IA. Expert en recrutement international et stratégie de positionnement professionnel.
              </p>
            </div>
            <div className="text-sm md:text-right">
              <p>&copy; {new Date().getFullYear()} - Basé sur Gemini 3 Pro</p>
              <p className="mt-1">Garanti sans invention d'expériences.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
