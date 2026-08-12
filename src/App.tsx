import React, { useState } from 'react';
import { PageView } from './types';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { PipeFlowModule } from './components/PipeFlowModule';
import { HeatTransferModule } from './components/HeatTransferModule';
import { RockFluidModule } from './components/RockFluidModule';
import { HandCalculationsModule } from './components/HandCalculationsModule';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-cyan-500 selection:text-white">
      <Header currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentView === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentView === 'pipe_flow' && <PipeFlowModule />}
        {currentView === 'heat_transfer' && <HeatTransferModule />}
        {currentView === 'rock_fluid_dashboard' && <RockFluidModule />}
        {currentView === 'hand_calcs' && <HandCalculationsModule onNavigate={handleNavigate} />}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-xs border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-base font-bold text-white tracking-wide">PETROSOLVE</p>
            <p className="text-slate-400 mt-1">Executive Tech Slate Suite • SI Verified • Colebrook-White • Fourier Conduction • Newton Cooling</p>
          </div>
          <div className="text-right text-slate-400">
            <p>© {new Date().getFullYear()} PETROSOLVE Engineering. All calculations verified.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
