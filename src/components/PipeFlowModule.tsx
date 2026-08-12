import React, { useState, useMemo } from 'react';
import {
  FluidPreset,
  FluidProperties
} from '../types';
import { FLUID_PRESETS, PipeFlowEngine } from '../lib/engineeringEngine';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import {
  Waves,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const PipeFlowModule: React.FC = () => {
  const [fluidPreset, setFluidPreset] = useState<FluidPreset>('Water');
  const [density, setDensity] = useState<number>(FLUID_PRESETS.Water.density);
  const [viscosity, setViscosity] = useState<number>(FLUID_PRESETS.Water.dynamicViscosity);

  const [diameterMm, setDiameterMm] = useState<number>(50.0);
  const [lengthM, setLengthM] = useState<number>(100.0);
  const [roughnessMm, setRoughnessMm] = useState<number>(0.045);
  const [flowRateLps, setFlowRateLps] = useState<number>(5.0);

  const [showDetails, setShowDetails] = useState<boolean>(true);

  // Preset switch handler
  const handlePresetChange = (preset: FluidPreset) => {
    setFluidPreset(preset);
    const props = FLUID_PRESETS[preset];
    setDensity(props.density);
    setViscosity(props.dynamicViscosity);
  };

  // Convert inputs to SI
  const diameterM = diameterMm / 1000.0;
  const roughnessM = roughnessMm / 1000.0;
  const flowRateM3s = flowRateLps / 1000.0;

  // Calculation evaluation
  const { results, curveData, errorMessage } = useMemo(() => {
    try {
      const res = PipeFlowEngine.analyze(
        density,
        viscosity,
        diameterM,
        lengthM,
        roughnessM,
        flowRateM3s
      );
      const curve = PipeFlowEngine.generateFlowCurve(
        density,
        viscosity,
        diameterM,
        lengthM,
        roughnessM,
        flowRateM3s,
        25
      );
      return { results: res, curveData: curve, errorMessage: null };
    } catch (err: any) {
      return { results: null, curveData: [], errorMessage: err.message || 'Calculation error' };
    }
  }, [density, viscosity, diameterM, lengthM, roughnessM, flowRateM3s]);

  // CSV Export handler
  const handleExportCsv = () => {
    if (!curveData || curveData.length === 0) return;

    const headers = [
      'Flow_Rate_Lps',
      'Volumetric_Flow_Rate_m3s',
      'Velocity_ms',
      'Reynolds_Number',
      'Flow_Regime',
      'Friction_Factor',
      'Pressure_Drop_Pa',
      'Pressure_Drop_kPa'
    ];

    const rows = curveData.map((pt) => [
      pt.flowRateLps.toFixed(3),
      pt.volumetricFlowRateM3s.toExponential(5),
      pt.velocityMs.toFixed(4),
      pt.reynoldsNumber.toFixed(1),
      pt.flowRegime,
      pt.frictionFactor.toFixed(6),
      pt.pressureDropPa.toFixed(2),
      pt.pressureDropKpa.toFixed(4)
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'petrosolve_pipe_flow_curve.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRegimeBadgeClass = (regime: string) => {
    switch (regime) {
      case 'Laminar':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Transitional':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Turbulent':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-200">
        <div className="p-3 bg-cyan-100 text-cyan-700 rounded-2xl border border-cyan-200">
          <Waves className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Pipe Flow Analyser</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Frictional pressure drop, velocity, Reynolds number, and Darcy friction factor analysis for circular conduits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Settings Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-xs font-bold font-display text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100">
            1. Input Parameters
          </h2>

          {/* Fluid Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Fluid Selection
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Water', 'Air', 'Crude Oil', 'User-defined'] as FluidPreset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetChange(preset)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                    fluidPreset === preset
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            {FLUID_PRESETS[fluidPreset].description && (
              <p className="text-xs text-slate-500 italic">
                Preset note: {FLUID_PRESETS[fluidPreset].description}
              </p>
            )}
          </div>

          {/* Fluid Properties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Fluid Density ρ</label>
                <span className="text-xs text-cyan-700 font-mono font-medium">kg/m³</span>
              </div>
              <input
                type="number"
                value={density}
                disabled={fluidPreset !== 'User-defined'}
                onChange={(e) => setDensity(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Dynamic Viscosity μ</label>
                <span className="text-xs text-cyan-700 font-mono font-medium">Pa·s</span>
              </div>
              <input
                type="number"
                step="0.00001"
                value={viscosity}
                disabled={fluidPreset !== 'User-defined'}
                onChange={(e) => setViscosity(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 font-mono"
              />
            </div>
          </div>

          {/* Pipe Geometry & Flow Rate Inputs */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pipe Geometry & Flow Rate
            </h3>

            {/* Internal Diameter */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">
                  Internal Diameter (D)
                </label>
                <span className="text-xs font-mono font-medium text-cyan-700">mm</span>
              </div>
              <input
                type="number"
                step="1"
                min="0.1"
                value={diameterMm}
                onChange={(e) => setDiameterMm(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Internal diameter of the pipe. Controls cross-sectional flow area and strongly affects velocity and pressure loss.
              </p>
            </div>

            {/* Pipe Length */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">
                  Pipe Length (L)
                </label>
                <span className="text-xs font-mono font-medium text-cyan-700">m</span>
              </div>
              <input
                type="number"
                step="1"
                min="0.1"
                value={lengthM}
                onChange={(e) => setLengthM(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Total length of pipe over which frictional pressure loss is calculated.
              </p>
            </div>

            {/* Pipe Roughness */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">
                  Absolute Wall Roughness (ε)
                </label>
                <span className="text-xs font-mono font-medium text-cyan-700">mm</span>
              </div>
              <input
                type="number"
                step="0.005"
                min="0"
                value={roughnessMm}
                onChange={(e) => setRoughnessMm(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Absolute roughness height of the internal pipe wall material (e.g. 0.045 mm for commercial steel).
              </p>
            </div>

            {/* Volumetric Flow Rate */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">
                  Volumetric Flow Rate (Q)
                </label>
                <span className="text-xs font-mono font-medium text-cyan-700">L/s</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0.001"
                value={flowRateLps}
                onChange={(e) => setFlowRateLps(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Volume of fluid passing through the circular pipe per unit time.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Charts */}
        <div className="lg:col-span-7 space-y-6">
          {errorMessage ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-6 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900">Input Error</h3>
                <p className="text-xs mt-1 text-rose-700">{errorMessage}</p>
              </div>
            </div>
          ) : results ? (
            <>
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Flow Velocity */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium block">Flow Velocity (V)</span>
                  <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {results.velocityMs.toFixed(3)} <span className="text-xs text-slate-500 font-normal">m/s</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">A = {(results.areaM2 * 1e4).toFixed(2)} cm²</span>
                </div>

                {/* Reynolds Number */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium block">Reynolds Number (Re)</span>
                  <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {results.reynoldsNumber.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getRegimeBadgeClass(results.flowRegime)}`}>
                      {results.flowRegime}
                    </span>
                  </div>
                </div>

                {/* Darcy Friction Factor */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium block">Friction Factor (f)</span>
                  <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {results.frictionFactor.toFixed(5)}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block truncate" title={results.frictionFactorMethod}>
                    {results.frictionFactorMethod}
                  </span>
                </div>

                {/* Pressure Drop (kPa) */}
                <div className="bg-cyan-50/80 border border-cyan-200/80 rounded-2xl p-5 shadow-2xs col-span-2 sm:col-span-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-cyan-800 font-bold uppercase tracking-wider block">
                        Darcy-Weisbach Pressure Drop (ΔP)
                      </span>
                      <div className="text-2xl sm:text-3xl font-display font-extrabold text-cyan-950 mt-1 font-mono">
                        {results.pressureDropKpa.toFixed(3)} <span className="text-base text-cyan-700 font-normal">kPa</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-cyan-900 font-mono block">
                        {results.pressureDropPa.toLocaleString(undefined, { maximumFractionDigits: 1 })} Pa
                      </span>
                      <span className="text-[11px] text-cyan-700 block mt-0.5">SI Head Loss Equivalent</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Pressure Drop vs Flow Rate Curve */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-display font-bold text-slate-900">Pressure Drop vs Volumetric Flow Rate</h3>
                    <p className="text-xs text-slate-500">
                      Calculated ΔP across flow rate range [0.1 Q → 2.0 Q]. Operating point highlighted.
                    </p>
                  </div>
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
                    id="export-pipe-flow-csv-btn"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Export CSV Data
                  </button>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={curveData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="flowRateLps"
                        label={{ value: 'Volumetric Flow Rate Q (L/s)', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11 }}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                      />
                      <YAxis
                        label={{ value: 'Pressure Drop ΔP (kPa)', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 11 }}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                        formatter={(value: any) => [
                          `${Number(value).toFixed(3)} kPa`,
                          'Pressure Drop ΔP'
                        ]}
                        labelFormatter={(label: any) => `Flow Rate Q: ${Number(label).toFixed(2)} L/s`}
                      />
                      <Line
                        type="monotone"
                        dataKey="pressureDropKpa"
                        stroke="#0284c7"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      {/* Highlight current operating point */}
                      <ReferenceDot
                        x={flowRateLps}
                        y={results.pressureDropKpa}
                        r={6}
                        fill="#d97706"
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Method & Equations Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-display font-bold text-slate-900 text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-cyan-600" />
                    <span>Method & Governing Equations Breakdown</span>
                  </div>
                  {showDetails ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>

                {showDetails && (
                  <div className="px-6 pb-6 pt-2 text-xs text-slate-700 space-y-3 border-t border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono bg-white p-4 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-500 block">Cross-Sectional Area (A):</span>
                        <p className="font-semibold text-slate-900">A = π·D²/4 = {results.areaM2.toFixed(6)} m²</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Average Velocity (V):</span>
                        <p className="font-semibold text-slate-900">V = Q/A = {results.velocityMs.toFixed(4)} m/s</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Reynolds Number (Re):</span>
                        <p className="font-semibold text-slate-900">Re = ρ·V·D/μ = {results.reynoldsNumber.toFixed(1)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Relative Roughness (ε/D):</span>
                        <p className="font-semibold text-slate-900">ε/D = {results.relativeRoughness.toFixed(6)}</p>
                      </div>
                    </div>

                    <div className="space-y-2 leading-relaxed">
                      <p>
                        <strong>Colebrook-White Equation (Turbulent Solver):</strong><br />
                        <code className="bg-white px-2 py-1 rounded text-slate-800 border border-slate-200">
                          1/√f = -2·log₁₀[ (ε / 3.7D) + (2.51 / Re·√f) ]
                        </code>
                      </p>
                      <p>
                        <strong>Darcy-Weisbach Major Frictional Pressure Loss:</strong><br />
                        <code className="bg-white px-2 py-1 rounded text-slate-800 border border-slate-200">
                          ΔP = f · (L / D) · (ρ · V² / 2) = {results.pressureDropPa.toFixed(1)} Pa ({results.pressureDropKpa.toFixed(3)} kPa)
                        </code>
                      </p>
                      <p className="text-[11px] text-slate-500 pt-1">
                        *Note: Major frictional pipe loss only. Minor fitting losses (elbows, valves) are not included.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
