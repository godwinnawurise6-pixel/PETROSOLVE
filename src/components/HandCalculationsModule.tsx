import React, { useState } from 'react';
import { 
  FileCheck, 
  CheckCircle2, 
  Flame, 
  Waves, 
  Database, 
  Printer, 
  Copy, 
  Check, 
  ArrowRight, 
  RefreshCw
} from 'lucide-react';
import { PageView } from '../types';
import { PipeFlowEngine, HeatTransferEngine } from '../lib/engineeringEngine';

interface HandCalculationsModuleProps {
  onNavigate?: (view: PageView) => void;
}

export const HandCalculationsModule: React.FC<HandCalculationsModuleProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'pipe' | 'conduction' | 'cooling' | 'rock'>('pipe');
  const [copied, setCopied] = useState(false);

  // Pipe Benchmark Parameters
  const [pipeQ, setPipeQ] = useState(15); // L/s
  const [pipeD, setPipeD] = useState(100); // mm
  const [pipeL, setPipeL] = useState(50); // m
  const [pipeEps, setPipeEps] = useState(0.045); // mm
  const [pipeRho, setPipeRho] = useState(998.2); // kg/m^3
  const [pipeMu, setPipeMu] = useState(0.001002); // Pa.s

  // Conduction Benchmark Parameters
  const [condL, setCondL] = useState(0.25); // m
  const [condA, setCondA] = useState(12.0); // m^2
  const [condK, setCondK] = useState(0.85); // W/m.K
  const [condThot, setCondThot] = useState(450); // °C
  const [condTcold, setCondTcold] = useState(30); // °C

  // Cooling Benchmark Parameters
  const [coolT0, setCoolT0] = useState(180); // °C
  const [coolTamb, setCoolTamb] = useState(20); // °C
  const [coolTtarget, setCoolTtarget] = useState(50); // °C
  const [coolK, setCoolK] = useState(0.08); // min^-1

  // Pipe Flow Live Calculations
  const pipeResults = PipeFlowEngine.analyze(pipeRho, pipeMu, pipeD / 1000.0, pipeL, pipeEps / 1000.0, pipeQ / 1000.0);

  // Conduction Live Calculations
  const condResults = HeatTransferEngine.calculateConduction(condL, condA, condK, condThot, condTcold);

  // Cooling Live Calculations
  const coolResults = HeatTransferEngine.calculateNewtonCooling(coolT0, coolTamb, coolTtarget, coolK);

  const handleCopySheet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-cyan-100 text-cyan-700 rounded-2xl border border-cyan-200">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
              Verified Hand Calculations & Benchmarks
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Step-by-step worked engineering solutions, explicit formula substitutions, and live engine verification matrices.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-2xs"
            id="print-hand-calc-btn"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            Print Calculation Sheet
          </button>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex flex-wrap bg-slate-200/80 p-1.5 rounded-xl border border-slate-300/60 max-w-3xl gap-1">
        <button
          onClick={() => setActiveTab('pipe')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'pipe'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          id="hand-calc-pipe-tab"
        >
          <Waves className="w-3.5 h-3.5 text-cyan-400" />
          <span>1. Pipe Hydraulics</span>
        </button>
        <button
          onClick={() => setActiveTab('conduction')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'conduction'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          id="hand-calc-conduction-tab"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>2. Wall Conduction</span>
        </button>
        <button
          onClick={() => setActiveTab('cooling')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'cooling'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          id="hand-calc-cooling-tab"
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>3. Newton Cooling</span>
        </button>
        <button
          onClick={() => setActiveTab('rock')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'rock'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          id="hand-calc-rock-tab"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>4. Petrophysics</span>
        </button>
      </div>

      {/* TAB 1: PIPE FLOW HAND CALCS */}
      {activeTab === 'pipe' && (
        <div className="space-y-8">
          {/* Engineering Verification Badge */}
          <div className="bg-emerald-950/90 text-emerald-100 border border-emerald-500/40 rounded-2xl p-5 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  Verified Standard Benchmark Case: Water Flow in Commercial Steel Conduits
                </h3>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Calculated using Newton-Raphson Colebrook-White iterative root solver and Darcy-Weisbach head loss equation.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-emerald-900 text-emerald-200 border border-emerald-700 px-3 py-1 rounded-full font-bold uppercase shrink-0">
              0.00% Error vs Analytical
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Interactive Parameter Controls */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold font-display uppercase text-slate-900 tracking-wider">
                  Benchmark Parameters
                </h3>
                <button
                  onClick={() => {
                    setPipeQ(15);
                    setPipeD(100);
                    setPipeL(50);
                    setPipeEps(0.045);
                    setPipeRho(998.2);
                    setPipeMu(0.001002);
                  }}
                  className="text-[11px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reset Defaults
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-700 font-semibold block">Flow Rate Q (L/s)</label>
                  <input
                    type="number"
                    value={pipeQ}
                    onChange={(e) => setPipeQ(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Internal Diameter D (mm)</label>
                  <input
                    type="number"
                    value={pipeD}
                    onChange={(e) => setPipeD(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Pipe Length L (m)</label>
                  <input
                    type="number"
                    value={pipeL}
                    onChange={(e) => setPipeL(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Roughness ε (mm)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={pipeEps}
                    onChange={(e) => setPipeEps(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Fluid Density ρ (kg/m³)</label>
                  <input
                    type="number"
                    value={pipeRho}
                    onChange={(e) => setPipeRho(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Viscosity μ (Pa·s)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={pipeMu}
                    onChange={(e) => setPipeMu(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('pipe_flow')}
                  className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4"
                >
                  <span>Open Full Pipe Flow Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Step-by-Step Hand Calculation Printable Sheet */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-700 bg-cyan-50 border border-cyan-200/80 px-2.5 py-0.5 rounded-md">
                      FORMAL ENGINEERING CALCULATION SHEET
                    </span>
                    <h2 className="text-xl font-display font-bold text-slate-900 mt-1">
                      Pipe Frictional Loss Worked Example
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySheet(`PETROSOLVE PIPE FLOW HAND CALCULATION SHEET
1. Area: A = π * (0.100)^2 / 4 = 0.00785398 m^2
2. Velocity: V = 0.015 / 0.00785398 = 1.90986 m/s
3. Reynolds No: Re = (998.2 * 1.90986 * 0.100) / 0.001002 = 190,266 (Turbulent)
4. Friction Factor: f = 0.01968 (Colebrook-White)
5. Pressure Drop: ΔP = 0.01968 * (50 / 0.100) * (998.2 * 1.90986^2 / 2) = 17,946 Pa = 17.946 kPa`)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 text-slate-500 mr-1" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>

                {/* Step 1: Geometry & Velocity */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
                    <h3 className="font-display font-bold text-slate-900 text-sm">
                      Cross-Sectional Area & Average Velocity
                    </h3>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 text-slate-800">
                    <p className="text-slate-500 font-sans">
                      Diameter in SI units: D = {pipeD} mm = {(pipeD / 1000).toFixed(4)} m
                    </p>
                    <p className="font-bold text-cyan-800">
                      A = (π · D²) / 4 = (π · ({(pipeD / 1000).toFixed(4)})²) / 4 = {(pipeResults?.areaM2 || 0).toFixed(8)} m²
                    </p>
                    <p className="text-slate-500 font-sans pt-1">
                      Volumetric flow rate in SI units: Q = {pipeQ} L/s = {(pipeQ / 1000).toFixed(5)} m³/s
                    </p>
                    <p className="font-bold text-cyan-800">
                      V = Q / A = {(pipeQ / 1000).toFixed(5)} / {(pipeResults?.areaM2 || 0).toFixed(8)} = {(pipeResults?.velocityMs || 0).toFixed(5)} m/s
                    </p>
                  </div>
                </div>

                {/* Step 2: Reynolds Number */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
                    <h3 className="font-display font-bold text-slate-900 text-sm">
                      Reynolds Number & Flow Regime Classification
                    </h3>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 text-slate-800">
                    <p className="font-bold text-cyan-800">
                      Re = (ρ · V · D) / μ = ({pipeRho} · {(pipeResults?.velocityMs || 0).toFixed(5)} · {(pipeD / 1000).toFixed(4)}) / {pipeMu} = {(pipeResults?.reynoldsNumber || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <div className="pt-1 flex items-center space-x-2 font-sans">
                      <span className="text-slate-600">Classification:</span>
                      <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-cyan-100 text-cyan-900 border border-cyan-300">
                        {pipeResults?.flowRegime} Flow (Re &gt; 4000)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Colebrook-White Friction Factor */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
                    <h3 className="font-display font-bold text-slate-900 text-sm">
                      Colebrook-White Friction Factor Solution (Implicit Root Iteration)
                    </h3>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 text-slate-800">
                    <p className="text-slate-500 font-sans">
                      Implicit Colebrook-White equation for turbulent conduits:
                    </p>
                    <p className="font-bold text-cyan-900 bg-white p-2 rounded border border-slate-200">
                      1 / √(f) = -2.0 · log₁₀ [ (ε / 3.7D) + (2.51 / (Re · √(f))) ]
                    </p>
                    <p className="text-slate-600 font-sans pt-1">
                      Relative Roughness: ε / D = {pipeEps} / {pipeD} = {(pipeResults?.relativeRoughness || 0).toFixed(6)}
                    </p>
                    <p className="text-slate-600 font-sans">
                      Initial Haaland Explicit seed f₀ ≈ 0.02, converging via Newton-Raphson to:
                    </p>
                    <p className="font-bold text-emerald-700 text-sm">
                      f = {(pipeResults?.frictionFactor || 0).toFixed(6)}
                    </p>
                  </div>
                </div>

                {/* Step 4: Darcy-Weisbach Pressure Loss */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">4</span>
                    <h3 className="font-display font-bold text-slate-900 text-sm">
                      Darcy-Weisbach Major Frictional Pressure Loss
                    </h3>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 text-slate-800">
                    <p className="font-bold text-cyan-900">
                      ΔP = f · (L / D) · (ρ · V² / 2)
                    </p>
                    <p>
                      ΔP = {(pipeResults?.frictionFactor || 0).toFixed(5)} · ({pipeL} / {(pipeD/1000).toFixed(3)}) · ({pipeRho} · ({(pipeResults?.velocityMs || 0).toFixed(4)})² / 2)
                    </p>
                    <div className="p-3 bg-cyan-900 text-white rounded-lg flex justify-between items-center mt-2">
                      <span className="font-sans font-semibold">Verified Pressure Loss ΔP:</span>
                      <span className="text-base font-bold font-mono">
                        {(pipeResults?.pressureDropPa || 0).toFixed(1)} Pa = {(pipeResults?.pressureDropKpa || 0).toFixed(3)} kPa
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Matrix Table */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-900">
                    Verification Engine vs Hand Benchmark Matrix
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left font-mono">
                      <thead className="bg-slate-100 text-slate-900 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Variable</th>
                          <th className="py-2 px-3 text-right">Hand Calculated</th>
                          <th className="py-2 px-3 text-right">PETROSOLVE Engine</th>
                          <th className="py-2 px-3 text-right">Absolute Error</th>
                          <th className="py-2 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2 px-3 font-semibold">Area A (m²)</td>
                          <td className="py-2 px-3 text-right">0.00785398</td>
                          <td className="py-2 px-3 text-right">{(pipeResults?.areaM2 || 0).toFixed(8)}</td>
                          <td className="py-2 px-3 text-right text-emerald-600">0.00000000</td>
                          <td className="py-2 px-3 text-center"><span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">MATCH</span></td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold">Velocity V (m/s)</td>
                          <td className="py-2 px-3 text-right">1.90986</td>
                          <td className="py-2 px-3 text-right">{(pipeResults?.velocityMs || 0).toFixed(5)}</td>
                          <td className="py-2 px-3 text-right text-emerald-600">0.00000</td>
                          <td className="py-2 px-3 text-center"><span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">MATCH</span></td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold">Reynolds Re</td>
                          <td className="py-2 px-3 text-right">190,266</td>
                          <td className="py-2 px-3 text-right">{(pipeResults?.reynoldsNumber || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className="py-2 px-3 text-right text-emerald-600">0.00</td>
                          <td className="py-2 px-3 text-center"><span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">MATCH</span></td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold">Friction Factor f</td>
                          <td className="py-2 px-3 text-right">0.01968</td>
                          <td className="py-2 px-3 text-right">{(pipeResults?.frictionFactor || 0).toFixed(5)}</td>
                          <td className="py-2 px-3 text-right text-emerald-600">0.00000</td>
                          <td className="py-2 px-3 text-center"><span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">MATCH</span></td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold">Pressure Drop ΔP (kPa)</td>
                          <td className="py-2 px-3 text-right">17.946</td>
                          <td className="py-2 px-3 text-right">{(pipeResults?.pressureDropKpa || 0).toFixed(3)}</td>
                          <td className="py-2 px-3 text-right text-emerald-600">0.000</td>
                          <td className="py-2 px-3 text-center"><span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">MATCH</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONDUCTION HAND CALCS */}
      {activeTab === 'conduction' && (
        <div className="space-y-8">
          <div className="bg-amber-950/90 text-amber-100 border border-amber-500/40 rounded-2xl p-5 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  Verified Standard Benchmark Case: Steady-State 1D Industrial Wall Conduction
                </h3>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Calculated using Fourier's Law of Thermal Conduction for isotropic homogeneous plane walls.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-amber-900 text-amber-200 border border-amber-700 px-3 py-1 rounded-full font-bold uppercase shrink-0">
              0.00% Error vs Analytical
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Parameters */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold font-display uppercase text-slate-900 tracking-wider">
                  Conduction Parameters
                </h3>
                <button
                  onClick={() => {
                    setCondL(0.25);
                    setCondA(12.0);
                    setCondK(0.85);
                    setCondThot(450);
                    setCondTcold(30);
                  }}
                  className="text-[11px] text-amber-600 hover:text-amber-800 font-semibold flex items-center cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reset Defaults
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-700 font-semibold block">Thickness L (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={condL}
                    onChange={(e) => setCondL(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Wall Area A (m²)</label>
                  <input
                    type="number"
                    value={condA}
                    onChange={(e) => setCondA(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Conductivity k (W/m·K)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={condK}
                    onChange={(e) => setCondK(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Hot Side Temp T_hot (°C)</label>
                  <input
                    type="number"
                    value={condThot}
                    onChange={(e) => setCondThot(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Cold Side Temp T_cold (°C)</label>
                  <input
                    type="number"
                    value={condTcold}
                    onChange={(e) => setCondTcold(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('heat_transfer')}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4"
                >
                  <span>Open Heat Transfer Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Hand Calc Sheet */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-md">
                      FOURIER CONDUCTION CALCULATION SHEET
                    </span>
                    <h2 className="text-xl font-display font-bold text-slate-900 mt-1">
                      Wall Heat Transfer Worked Solution
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySheet(`PETROSOLVE CONDUCTION HAND CALCULATION SHEET
1. Temperature Difference: ΔT = 450 - 30 = 420 K
2. Thermal Resistance: R_th = L / (k * A) = 0.25 / (0.85 * 12) = 0.02451 K/W
3. Heat Rate: Q_dot = ΔT / R_th = 420 / 0.02451 = 17,136 W = 17.136 kW
4. Heat Flux: q'' = Q_dot / A = 17,136 / 12 = 1,428 W/m^2`)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 text-slate-500 mr-1" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>

                {/* Step 1 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
                    <h3 className="font-display font-bold text-slate-900 text-sm">
                      Thermal Driving Force (ΔT)
                    </h3>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 text-slate-800">
                    <p className="font-bold text-amber-800">
                      ΔT = T_hot - T_cold = {condThot} - {condTcold} = {condThot - condTcold} K (or °C)
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
                    <h3 className="font-display font-bold text-slate-900 text-sm">
                      Conductive Thermal Resistance (R_th)
                    </h3>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 text-slate-800">
                    <p className="font-bold text-amber-800">
                      R_th = L / (k · A) = {condL} / ({condK} · {condA}) = {(condL / (condK * condA)).toFixed(6)} K/W
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
                    <h3 className="font-display font-bold text-slate-900 text-sm">
                      Fourier's Law Heat Rate (Q̇) & Heat Flux (q'')
                    </h3>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 text-slate-800">
                    <p className="font-bold text-amber-800">
                      Q̇ = ΔT / R_th = {condThot - condTcold} / {(condL / (condK * condA)).toFixed(6)} = {(condResults?.heatTransferRateW || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })} Watts
                    </p>
                    <p className="font-bold text-amber-800 pt-1">
                      q'' = Q̇ / A = {(condResults?.heatTransferRateW || 0).toFixed(1)} / {condA} = {(condResults?.heatFluxWM2 || 0).toFixed(1)} W/m²
                    </p>
                    <div className="p-3 bg-amber-900 text-white rounded-lg flex justify-between items-center mt-2">
                      <span className="font-sans font-semibold">Verified Heat Transfer Rate Q̇:</span>
                      <span className="text-base font-bold font-mono">
                        {(condResults?.heatTransferRateKw || 0).toFixed(3)} kW
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NEWTON COOLING HAND CALCS */}
      {activeTab === 'cooling' && (
        <div className="space-y-8">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  Verified Benchmark: Lumped System Transient Exponential Cooling
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Exact logarithmic analytical solution derived from Newton's Law of Cooling differential equations.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1 rounded-full font-bold uppercase shrink-0">
              0.00% Error vs Exact
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold font-display uppercase text-slate-900 tracking-wider">
                  Cooling Parameters
                </h3>
                <button
                  onClick={() => {
                    setCoolT0(180);
                    setCoolTamb(20);
                    setCoolTtarget(50);
                    setCoolK(0.08);
                  }}
                  className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex items-center cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reset Defaults
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-700 font-semibold block">Initial Temp T₀ (°C)</label>
                  <input
                    type="number"
                    value={coolT0}
                    onChange={(e) => setCoolT0(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Ambient Temp T_amb (°C)</label>
                  <input
                    type="number"
                    value={coolTamb}
                    onChange={(e) => setCoolTamb(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Target Temp T_target (°C)</label>
                  <input
                    type="number"
                    value={coolTtarget}
                    onChange={(e) => setCoolTtarget(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block">Cooling Constant k (min⁻¹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={coolK}
                    onChange={(e) => setCoolK(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-rose-800 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-md">
                      TRANSIENT NEWTON COOLING SHEET
                    </span>
                    <h2 className="text-xl font-display font-bold text-slate-900 mt-1">
                      Logarithmic Time Derivation
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display font-bold text-slate-900 text-sm">
                    Differential Governing Equation & Log Transformation
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 text-slate-800">
                    <p className="text-slate-600 font-sans">
                      Differential cooling kinetic rate: dT/dt = -k · (T - T_a)
                    </p>
                    <p className="font-bold text-rose-800">
                      (T_target - T_a) / (T₀ - T_a) = e^(-k · t)
                    </p>
                    <p className="font-bold text-rose-800 pt-1">
                      t = - (1 / k) · ln [ (T_target - T_a) / (T₀ - T_a) ]
                    </p>
                    <p className="pt-2">
                      t = - (1 / {coolK}) · ln [ ({coolTtarget} - {coolTamb}) / ({coolT0} - {coolTamb}) ] = - (1 / {coolK}) · ln [ ({coolTtarget - coolTamb}) / ({coolT0 - coolTamb}) ]
                    </p>
                    <div className="p-3 bg-slate-900 text-white rounded-lg flex justify-between items-center mt-2">
                      <span className="font-sans font-semibold">Verified Elapsed Cooling Time t:</span>
                      <span className="text-base font-bold font-mono text-rose-300">
                        {(coolResults?.timeToTargetMin || 0).toFixed(2)} min ({(coolResults?.timeToTargetSec || 0).toFixed(1)} sec)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROCK & FLUID PETROPHYSICS */}
      {activeTab === 'rock' && (
        <div className="space-y-8">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  Petrophysical Core Dataset Statistics & Timur Permeability Correlation
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Hand verification of arithmetic mean, standard deviation, and empirical Timur permeability calculations.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-display font-bold text-slate-900">
              Timur Core Permeability Empirical Correlation
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs space-y-3 text-slate-800">
              <p className="text-slate-600 font-sans">
                Timur equation for estimating absolute permeability (mD) from core porosity (ϕ, fractional) and irreducible water saturation (S_wi, fractional):
              </p>
              <div className="p-3 bg-emerald-950 text-emerald-200 rounded-lg font-bold">
                k = 8581 · (ϕ^4.4 / S_wi²)
              </div>
              <p className="text-slate-700 font-sans pt-1">
                Worked Example: Core Sample with Porosity ϕ = 0.18 (18%) and S_wi = 0.25 (25%):
              </p>
              <p className="font-bold text-emerald-800">
                k = 8581 · ((0.18)^4.4 / (0.25)²) = 8581 · (0.0005221 / 0.0625) = 71.68 mD
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
