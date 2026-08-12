import React, { useState, useMemo } from 'react';
import { HeatTransferEngine } from '../lib/engineeringEngine';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine
} from 'recharts';
import {
  Flame,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Thermometer,
  Clock,
  Layers
} from 'lucide-react';

export const HeatTransferModule: React.FC = () => {
  const [mode, setMode] = useState<'conduction' | 'cooling'>('conduction');

  // Conduction state
  const [thicknessM, setThicknessM] = useState<number>(0.2);
  const [areaM2, setAreaM2] = useState<number>(10.0);
  const [conductivityWMk, setConductivityWMk] = useState<number>(0.8);
  const [tHotC, setTHotC] = useState<number>(100.0);
  const [tColdC, setTColdC] = useState<number>(20.0);

  // Cooling state
  const [tInitialC, setTInitialC] = useState<number>(90.0);
  const [tAmbientC, setTAmbientC] = useState<number>(20.0);
  const [tTargetC, setTTargetC] = useState<number>(40.0);
  const [coolingConstant, setCoolingConstant] = useState<number>(0.05);

  const [showDetails, setShowDetails] = useState<boolean>(true);

  // Conduction evaluation
  const conductionCalc = useMemo(() => {
    try {
      const res = HeatTransferEngine.calculateConduction(
        thicknessM,
        areaM2,
        conductivityWMk,
        tHotC,
        tColdC
      );
      return { results: res, error: null };
    } catch (err: any) {
      return { results: null, error: err.message || 'Conduction calculation error' };
    }
  }, [thicknessM, areaM2, conductivityWMk, tHotC, tColdC]);

  // Cooling evaluation
  const coolingCalc = useMemo(() => {
    try {
      const res = HeatTransferEngine.calculateNewtonCooling(
        tInitialC,
        tAmbientC,
        tTargetC,
        coolingConstant
      );
      const curve = HeatTransferEngine.generateCoolingCurve(
        tInitialC,
        tAmbientC,
        res.timeToTargetMin,
        coolingConstant,
        50
      );
      return { results: res, curveData: curve, error: null };
    } catch (err: any) {
      return { results: null, curveData: [], error: err.message || 'Cooling calculation error' };
    }
  }, [tInitialC, tAmbientC, tTargetC, coolingConstant]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-200">
        <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl border border-amber-200">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Heat Transfer Calculator</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Steady-state wall conduction and transient Newton's Law of Cooling analytical solver.
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 max-w-xl">
        <button
          onClick={() => setMode('conduction')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            mode === 'conduction'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-slate-700 hover:text-amber-600'
          }`}
          id="conduction-tab-btn"
        >
          <Layers className="w-4 h-4" />
          <span>1D Wall Conduction (Fourier)</span>
        </button>
        <button
          onClick={() => setMode('cooling')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            mode === 'cooling'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-slate-700 hover:text-amber-600'
          }`}
          id="cooling-tab-btn"
        >
          <Thermometer className="w-4 h-4" />
          <span>Transient Cooling (Newton)</span>
        </button>
      </div>

      {/* Mode A: Conduction */}
      {mode === 'conduction' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <h2 className="text-xs font-display font-bold text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
              Conduction Inputs
            </h2>

            {/* Thickness */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Wall Thickness (L)</label>
                <span className="text-xs font-mono font-medium text-amber-700">m</span>
              </div>
              <input
                type="number"
                step="0.05"
                min="0.001"
                value={thicknessM}
                onChange={(e) => setThicknessM(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Thickness of the solid plane wall through which thermal conduction occurs.
              </p>
            </div>

            {/* Wall Area */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Wall Surface Area (A)</label>
                <span className="text-xs font-mono font-medium text-amber-700">m²</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0.01"
                value={areaM2}
                onChange={(e) => setAreaM2(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Surface area normal to the direction of heat transfer.
              </p>
            </div>

            {/* Thermal Conductivity */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Thermal Conductivity (k)</label>
                <span className="text-xs font-mono font-medium text-amber-700">W/(m·K)</span>
              </div>
              <input
                type="number"
                step="0.05"
                min="0.001"
                value={conductivityWMk}
                onChange={(e) => setConductivityWMk(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Material thermal property describing rate of conductive heat transfer (e.g. 0.8 W/m·K for brickwork).
              </p>
            </div>

            {/* Temperatures */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-semibold text-slate-800 block">Hot-Side Temp (T_hot)</label>
                <input
                  type="number"
                  value={tHotC}
                  onChange={(e) => setTHotC(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">°C or K</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 block">Cold-Side Temp (T_cold)</label>
                <input
                  type="number"
                  value={tColdC}
                  onChange={(e) => setTColdC(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">°C or K</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-6">
            {conductionCalc.error ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-6 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Calculation Error</h3>
                  <p className="text-xs mt-1 text-rose-700">{conductionCalc.error}</p>
                </div>
              </div>
            ) : conductionCalc.results ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Heat Transfer Rate (kW) */}
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 shadow-2xs col-span-2 sm:col-span-2">
                    <span className="text-xs text-amber-800 font-bold uppercase tracking-wider block">
                      Heat Transfer Rate (Q̇)
                    </span>
                    <div className="text-3xl font-display font-extrabold text-amber-950 mt-1 font-mono">
                      {conductionCalc.results.heatTransferRateKw.toFixed(3)}{' '}
                      <span className="text-lg font-normal text-amber-700">kW</span>
                    </div>
                    <span className="text-xs text-amber-800 block mt-1 font-mono">
                      = {conductionCalc.results.heatTransferRateW.toLocaleString()} W
                    </span>
                  </div>

                  {/* Heat Flux */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                    <span className="text-xs text-slate-500 font-semibold block">Heat Flux (q'')</span>
                    <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
                      {conductionCalc.results.heatFluxWM2.toFixed(1)}{' '}
                      <span className="text-xs font-normal text-slate-500">W/m²</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">q'' = Q̇ / A</span>
                  </div>
                </div>

                {/* Formula breakdown */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-display font-bold text-slate-900 pb-2 border-b border-slate-100">
                    Fourier's Law Governing Calculation
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-xl font-mono text-xs text-slate-800 space-y-2 border border-slate-200">
                    <p className="font-bold text-amber-700">Q̇ = [ k · A · (T_hot - T_cold) ] / L</p>
                    <p>
                      Q̇ = [ {conductivityWMk} W/m·K × {areaM2} m² × ({tHotC} - {tColdC}) K ] / {thicknessM} m
                    </p>
                    <p className="text-slate-900 font-bold">
                      Q̇ = {conductionCalc.results.heatTransferRateW.toFixed(1)} Watts ({conductionCalc.results.heatTransferRateKw.toFixed(3)} kW)
                    </p>
                  </div>

                  <div className="pt-2 space-y-1.5 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Stated Engineering Assumptions:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      {conductionCalc.results.assumptions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Mode B: Transient Cooling */}
      {mode === 'cooling' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <h2 className="text-xs font-display font-bold text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
              Transient Cooling Inputs
            </h2>

            {/* Initial Temp */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Initial Temperature (T₀)</label>
                <span className="text-xs font-mono font-medium text-amber-700">°C</span>
              </div>
              <input
                type="number"
                step="1"
                value={tInitialC}
                onChange={(e) => setTInitialC(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Temperature of object at start of cooling process (t = 0).
              </p>
            </div>

            {/* Ambient Temp */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Ambient Temperature (T_ambient)</label>
                <span className="text-xs font-mono font-medium text-amber-700">°C</span>
              </div>
              <input
                type="number"
                step="1"
                value={tAmbientC}
                onChange={(e) => setTAmbientC(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Surrounding fluid/environment temperature toward which object approaches asymptotically.
              </p>
            </div>

            {/* Target Temp */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Target Temperature (T_target)</label>
                <span className="text-xs font-mono font-medium text-amber-700">°C</span>
              </div>
              <input
                type="number"
                step="1"
                value={tTargetC}
                onChange={(e) => setTTargetC(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Temperature at which elapsed cooling time is evaluated.
              </p>
            </div>

            {/* Cooling Constant */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Cooling Constant (k)</label>
                <span className="text-xs font-mono font-medium text-amber-700">min⁻¹</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0.0001"
                value={coolingConstant}
                onChange={(e) => setCoolingConstant(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                Empirical constant controlling exponential cooling decay rate.
              </p>
            </div>
          </div>

          {/* Results & Cooling Chart */}
          <div className="lg:col-span-7 space-y-6">
            {coolingCalc.error ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-6 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Unreachable Temperature Target</h3>
                  <p className="text-xs mt-1 text-rose-700 leading-relaxed">{coolingCalc.error}</p>
                </div>
              </div>
            ) : coolingCalc.results ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Elapsed Time */}
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 shadow-2xs">
                    <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                      <Clock className="w-4 h-4" />
                      <span>Elapsed Time to Target</span>
                    </div>
                    <div className="text-3xl font-display font-extrabold text-amber-950 mt-1 font-mono">
                      {coolingCalc.results.timeToTargetMin.toFixed(2)}{' '}
                      <span className="text-base font-normal text-amber-700">min</span>
                    </div>
                    <span className="text-xs text-amber-800 block mt-1 font-mono">
                      = {coolingCalc.results.timeToTargetSec.toFixed(1)} seconds
                    </span>
                  </div>

                  {/* Target Condition */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                    <span className="text-xs text-slate-500 font-semibold block">Target State</span>
                    <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
                      {tTargetC.toFixed(1)} °C
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Initial {tInitialC}°C → Ambient {tAmbientC}°C
                    </span>
                  </div>
                </div>

                {/* Analytical Cooling Curve */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-base font-display font-bold text-slate-900">Analytical Cooling Curve T(t)</h3>
                    <p className="text-xs text-slate-500">
                      Exponential approach towards ambient temperature T_ambient = {tAmbientC}°C.
                    </p>
                  </div>

                  <div className="h-72 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={coolingCalc.curveData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="timeMin"
                          label={{ value: 'Time t (minutes)', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11 }}
                          tick={{ fill: '#64748b', fontSize: 11 }}
                        />
                        <YAxis
                          label={{ value: 'Temperature T (°C)', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 11 }}
                          tick={{ fill: '#64748b', fontSize: 11 }}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                          formatter={(value: any) => [`${Number(value).toFixed(2)} °C`, 'Temperature']}
                          labelFormatter={(label: any) => `Time: ${Number(label).toFixed(2)} min`}
                        />
                        <Line
                          type="monotone"
                          dataKey="temperatureC"
                          stroke="#d97706"
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <ReferenceLine y={tAmbientC} stroke="#64748b" strokeDasharray="4 4" label={{ value: `Ambient (${tAmbientC}°C)`, fill: '#64748b', fontSize: 10 }} />
                        <ReferenceDot
                          x={coolingCalc.results.timeToTargetMin}
                          y={tTargetC}
                          r={6}
                          fill="#0284c7"
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
