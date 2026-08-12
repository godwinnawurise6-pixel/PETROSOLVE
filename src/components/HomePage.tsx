import React from 'react';
import { PageView } from '../types';
import { Waves, Flame, Database, ArrowRight, ShieldAlert, CheckCircle2, LineChart, Cpu, FileCheck } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: PageView) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
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
              onClick={() => onNavigate('pipe_flow')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer"
            >
              <span>Explore Pipe Flow</span>
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
            Includes Step-by-Step Verified Hand Calculations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every module includes audited step-by-step hand calculation sheets with explicit formula substitutions, intermediate iterative convergence steps, and 0.00% benchmark error validation.
          </p>
        </div>
        <button
          onClick={() => onNavigate('hand_calcs')}
          className="shrink-0 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-2"
          id="spotlight-hand-calcs-btn"
        >
          <span>View Hand Worked Solutions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Feature Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-2 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Calculation Modules</span>
          <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">Core Technical Engineering Engines</h2>
        </div>
        <p className="text-xs text-slate-500 mt-2 sm:mt-0">Select a module to initiate calculations</p>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Module A Card - Pipe Flow */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-105 transition-transform">
                <Waves className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200/60 px-3 py-1 rounded-md">Module A</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">Pipe Flow Analyser</h3>
              <p className="text-xs text-cyan-600 font-semibold mt-0.5">Hydraulics & Friction Solver</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Analyse flow through circular pipes using fluid properties, pipe geometry and flow rate. Computes flow velocity, Reynolds number, Colebrook-White friction factor, and Darcy-Weisbach pressure drop.
            </p>
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <LineChart className="w-3.5 h-3.5 text-cyan-600" />
                <span>Interactive ΔP vs Q Flow Curve</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                <span>Colebrook-White Newton Solver</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('pipe_flow')}
              className="w-full inline-flex items-center justify-center px-5 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
              id="open-pipe-flow-btn"
            >
              <span>Open Pipe Flow</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Module B Card - Heat Transfer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-md">Module B</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">Heat Transfer Calculator</h3>
              <p className="text-xs text-amber-600 font-semibold mt-0.5">Conduction & Transient Cooling</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Perform steady-state wall conduction using Fourier's Law and transient Newton's Law of Cooling calculations with exact analytical solutions and interactive cooling curves.
            </p>
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <LineChart className="w-3.5 h-3.5 text-amber-600" />
                <span>Transient Cooling Curve Plots</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Fourier Wall Conduction</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('heat_transfer')}
              className="w-full inline-flex items-center justify-center px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
              id="open-heat-transfer-btn"
            >
              <span>Open Heat Transfer</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Module C Card - Rock & Fluid Dashboard */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-md">Module C</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">Rock & Fluid Data</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">Petrophysical Dataset Analytics</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upload, analyse, filter and visualize engineering rock or fluid datasets. Features automatic statistical summaries, porosity distribution histograms, and crossplots.
            </p>
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <LineChart className="w-3.5 h-3.5 text-emerald-600" />
                <span>Porosity vs Permeability Scatter</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>CSV Upload & Filtering</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('rock_fluid_dashboard')}
              className="w-full inline-flex items-center justify-center px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
              id="open-rock-fluid-btn"
            >
              <span>Open Rock & Fluid</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

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
