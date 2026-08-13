import React, { useState } from 'react';
import { PageView } from '../types';
import { Waves, Flame, Database, ArrowRight, ShieldAlert, CheckCircle2, LineChart, Cpu, FileCheck, X, ChevronRight, Layers } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: PageView) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [isModuleSelectorOpen, setIsModuleSelectorOpen] = useState(false);

  const handleExploreClick = () => {
    setIsModuleSelectorOpen(true);
    const el = document.getElementById('modules-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectModule = (view: PageView) => {
    setIsModuleSelectorOpen(false);
    onNavigate(view);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Banner with Executive Dark Slate & Cyan Gradient */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-lg">
        <div className="lg:col-span-8 space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-slate-800/90 border border-slate-700/80 rounded-full text-cyan-300 text-xs font-semibold uppercase tracking-widest">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Engineering Software Suite</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight leading-none">
            PETROSOLVE.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
            High-precision computational tools for pipe hydraulics, thermal energy transport, and subsurface dataset analytics. SI-verified governing engines engineered with analytical rigor.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={handleExploreClick}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              id="explore-modules-btn"
            >
              <Layers className="w-4 h-4 mr-2" />
              <span>Explore Engineering Modules</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => onNavigate('hand_calcs')}
              className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
            >
              <FileCheck className="w-4 h-4 mr-2 text-cyan-400" />
              <span>Verified Hand Calculations</span>
            </button>
          </div>
        </div>

        {/* Hero Decorative Stack / Stat Card */}
        <div className="lg:col-span-4 relative flex justify-center items-center">
          <div className="w-full max-w-xs bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                SI Validated
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <span className="font-display text-3xl font-extrabold text-cyan-400">100%</span>
              <p className="text-xs uppercase font-bold text-slate-300 tracking-wider">Analytical Exactness</p>
              <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                Colebrook-White Newton iterative solver, Fourier 1D conduction & Newton cooling kinetics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Hand Calculations Spotlight Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>Audited & Benchmarked</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            Verified Hand Calculations & Worked Solutions
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every module includes step-by-step hand calculation sheets with explicit formula substitutions, intermediate iterative convergence steps, and 0.00% benchmark error validation.
          </p>
        </div>
        <button
          onClick={() => onNavigate('hand_calcs')}
          className="shrink-0 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-2"
          id="spotlight-hand-calcs-btn"
        >
          <span>View Hand Calculations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Feature Header */}
      <div id="modules-section" className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-2 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Calculation Modules</span>
          <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">Core Engineering Modules</h2>
        </div>
        <p className="text-xs text-slate-500 mt-2 sm:mt-0">Select any module below to launch calculations</p>
      </div>

      {/* Module Cards Grid (4 Modules) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Module A Card - Pipe Flow */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-105 transition-transform">
                <Waves className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200/60 px-2.5 py-1 rounded-md">Module A</span>
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">Pipe Flow Analyser</h3>
              <p className="text-xs text-cyan-600 font-semibold mt-0.5">Hydraulics & Friction Solver</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyse fluid flow through circular pipes. Computes flow velocity, Reynolds number, Colebrook-White friction factor, and pressure drop.
            </p>
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <LineChart className="w-3.5 h-3.5 text-cyan-600" />
                <span>ΔP vs Q Flow Curve</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                <span>Colebrook-White Newton Solver</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSelectModule('pipe_flow')}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
              id="open-pipe-flow-btn"
            >
              <span>Open Pipe Flow</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </div>

        {/* Module B Card - Heat Transfer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-md">Module B</span>
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">Heat Transfer Calculator</h3>
              <p className="text-xs text-amber-600 font-semibold mt-0.5">Conduction & Transient Cooling</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Perform steady-state wall conduction using Fourier's Law and transient Newton's Law of Cooling with analytical cooling curves.
            </p>
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <LineChart className="w-3.5 h-3.5 text-amber-600" />
                <span>Transient Cooling Curves</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Fourier Wall Conduction</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSelectModule('heat_transfer')}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
              id="open-heat-transfer-btn"
            >
              <span>Open Heat Transfer</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </div>

        {/* Module C Card - Rock & Fluid Dashboard */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md">Module C</span>
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">Rock & Fluid Data</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">Petrophysical Dataset Analytics</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload, analyse, filter and visualize rock or fluid datasets with automatic statistical summaries, porosity histograms, and crossplots.
            </p>
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <LineChart className="w-3.5 h-3.5 text-emerald-600" />
                <span>Porosity vs Permeability</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>CSV Upload & Filtering</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSelectModule('rock_fluid_dashboard')}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
              id="open-rock-fluid-btn"
            >
              <span>Open Rock & Fluid</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </div>

        {/* Module D Card - Verified Hand Calculations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-105 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-200/60 px-2.5 py-1 rounded-md">Module D</span>
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">Hand Calculations</h3>
              <p className="text-xs text-cyan-600 font-semibold mt-0.5">Audited Worked Solutions</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Step-by-step hand calculation sheets with explicit formula substitutions, intermediate iterative convergence, and 0.00% benchmark validation.
            </p>
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                <span>Step-by-Step Derivations</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                <span>Print & Copy Audit Sheets</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSelectModule('hand_calcs')}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
              id="open-hand-calcs-btn"
            >
              <span>Open Hand Calcs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Module Selector Overlay Modal */}
      {isModuleSelectorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white">Select Engineering Module</h2>
                  <p className="text-xs text-slate-400">Choose an analytical tool to initiate calculation</p>
                </div>
              </div>
              <button
                onClick={() => setIsModuleSelectorOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1 */}
              <div
                onClick={() => handleSelectModule('pipe_flow')}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 rounded-2xl p-5 cursor-pointer transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Waves className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded">Module A</span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">Pipe Flow Analyser</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hydraulics, velocity, Colebrook-White friction factor & pressure drop.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch Module</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Option 2 */}
              <div
                onClick={() => handleSelectModule('heat_transfer')}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-5 cursor-pointer transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Flame className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950 px-2 py-0.5 rounded">Module B</span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">Heat Transfer Calculator</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1D wall conduction Fourier equations & Newton cooling curves.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch Module</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Option 3 */}
              <div
                onClick={() => handleSelectModule('rock_fluid_dashboard')}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-5 cursor-pointer transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Database className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded">Module C</span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">Rock & Fluid Analytics</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Petrophysical data filtering, statistical summaries & porosity scatter plots.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch Module</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Option 4 */}
              <div
                onClick={() => handleSelectModule('hand_calcs')}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/50 rounded-2xl p-5 cursor-pointer transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded">Module D</span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">Hand Calculations</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Step-by-step formula substitutions, iterative steps & 0.00% benchmark audits.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-semibold text-cyan-300 group-hover:translate-x-1 transition-transform">
                  <span>Launch Module</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsModuleSelectorOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel and return to home page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Disclaimer */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 flex items-start space-x-4 text-sm text-slate-800">
        <div className="w-10 h-10 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 text-slate-700">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1 pt-0.5">
          <p className="font-display font-bold text-slate-900">Engineering Safety & Professional Disclaimer</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            This software is intended for educational, preliminary analysis, and engineering-support purposes. Results should be independently verified by a qualified engineer before being used for safety-critical design, operational, or commercial decisions.
          </p>
        </div>
      </div>
    </div>
  );
};
