import React from 'react';
import { ArrowLeft, Cpu, Activity, FileCheck } from 'lucide-react';
import { PageView } from '../types';

interface HeaderProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const getModuleTitle = () => {
    switch (currentView) {
      case 'pipe_flow':
        return 'Pipe Flow Analyser';
      case 'heat_transfer':
        return 'Heat Transfer Calculator';
      case 'rock_fluid_dashboard':
        return 'Rock & Fluid Data Dashboard';
      case 'hand_calcs':
        return 'Hand Calculations & Benchmarks';
      default:
        return 'PETROSOLVE Platform';
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {currentView !== 'home' && (
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center px-3.5 py-1.5 border border-slate-700 text-xs font-semibold rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all cursor-pointer shadow-xs"
              id="back-to-home-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Overview
            </button>
          )}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                PETROSOLVE
              </span>
              {currentView !== 'home' && (
                <span className="ml-2.5 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700/80">
                  {getModuleTitle()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-300">
          <button
            onClick={() => onNavigate('hand_calcs')}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'hand_calcs'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-xs'
                : 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            id="nav-hand-calcs-btn"
          >
            <FileCheck className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            <span>Hand Calculations</span>
          </button>

          <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>SI Verified: <strong className="text-emerald-300 font-semibold">100%</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};
