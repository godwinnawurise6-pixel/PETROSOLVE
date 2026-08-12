import {
  FluidProperties,
  FluidPreset,
  PipeFlowResults,
  FlowCurvePoint,
  ConductionResults,
  NewtonCoolingResults,
  CoolingCurvePoint,
  ColumnStats,
  RawRowData
} from '../types';

export const FLUID_PRESETS: Record<FluidPreset, FluidProperties> = {
  Water: {
    name: 'Water',
    density: 998.2,
    dynamicViscosity: 0.001002,
    description: 'Pure water at 20°C, 1 atm'
  },
  Air: {
    name: 'Air',
    density: 1.204,
    dynamicViscosity: 1.825e-5,
    description: 'Dry air at 20°C, 1 atm'
  },
  'Crude Oil': {
    name: 'Crude Oil',
    density: 850.0,
    dynamicViscosity: 0.015,
    description: 'Medium crude oil at 15°C'
  },
  'User-defined': {
    name: 'User-defined',
    density: 1000.0,
    dynamicViscosity: 0.001,
    description: 'Custom user fluid'
  }
};

/**
 * Solves Pipe Flow equations
 */
export class PipeFlowEngine {
  static analyze(
    density: number,
    viscosity: number,
    diameterM: number,
    lengthM: number,
    roughnessM: number,
    qM3s: number
  ): PipeFlowResults {
    if (diameterM <= 0) throw new Error('Pipe internal diameter must be greater than zero.');
    if (lengthM <= 0) throw new Error('Pipe length must be greater than zero.');
    if (roughnessM < 0) throw new Error('Pipe roughness cannot be negative.');
    if (density <= 0) throw new Error('Fluid density must be greater than zero.');
    if (viscosity <= 0) throw new Error('Dynamic viscosity must be greater than zero.');
    if (qM3s < 0) throw new Error('Volumetric flow rate cannot be negative.');

    const area = (Math.PI * Math.pow(diameterM, 2)) / 4.0;
    const velocity = qM3s / area;
    const reynolds = (density * velocity * diameterM) / viscosity;
    const relRoughness = roughnessM / diameterM;

    let regime: 'Laminar' | 'Transitional' | 'Turbulent';
    if (reynolds < 2300) {
      regime = 'Laminar';
    } else if (reynolds < 4000) {
      regime = 'Transitional';
    } else {
      regime = 'Turbulent';
    }

    let f = 0.0;
    let method = '';

    if (reynolds <= 0) {
      f = 0.0;
      method = 'Zero flow / Static';
    } else if (reynolds < 2300) {
      f = 64.0 / reynolds;
      method = 'Laminar Exact (f = 64 / Re)';
    } else if (reynolds < 4000) {
      const term = relRoughness / 3.7 + 5.74 / Math.pow(reynolds, 0.9);
      f = 0.25 / Math.pow(Math.log10(term), 2);
      method = 'Transitional Swamee-Jain Approximation';
    } else {
      // Newton-Raphson Colebrook-White solver
      const sjTerm = relRoughness / 3.7 + 5.74 / Math.pow(reynolds, 0.9);
      let fGuess = 0.25 / Math.pow(Math.log10(sjTerm), 2);

      for (let i = 0; i < 50; i++) {
        const sqrtF = Math.sqrt(fGuess);
        const arg = relRoughness / 3.7 + 2.51 / (reynolds * sqrtF);
        if (arg <= 0) break;
        const g = 1.0 / sqrtF + 2.0 * Math.log10(arg);
        const dg =
          -0.5 * Math.pow(fGuess, -1.5) +
          2.51 / (Math.LN10 * reynolds * arg * Math.pow(fGuess, 1.5));
        const fNext = fGuess - g / dg;
        if (Math.abs(fNext - fGuess) < 1e-7) {
          fGuess = fNext;
          break;
        }
        fGuess = fNext > 0 ? fNext : fGuess / 2.0;
      }
      f = fGuess;
      method = 'Colebrook-White Equation (Iterative Newton-Raphson)';
    }

    const pressureDropPa =
      velocity === 0
        ? 0.0
        : f * (lengthM / diameterM) * ((density * Math.pow(velocity, 2)) / 2.0);

    return {
      volumetricFlowRateM3s: qM3s,
      velocityMs: velocity,
      reynoldsNumber: reynolds,
      flowRegime: regime,
      frictionFactor: f,
      frictionFactorMethod: method,
      pressureDropPa: pressureDropPa,
      pressureDropKpa: pressureDropPa / 1000.0,
      areaM2: area,
      relativeRoughness: relRoughness
    };
  }

  static generateFlowCurve(
    density: number,
    viscosity: number,
    diameterM: number,
    lengthM: number,
    roughnessM: number,
    operatingQM3s: number,
    numPoints: number = 25
  ): FlowCurvePoint[] {
    const maxQ = operatingQM3s > 0 ? operatingQM3s * 2.0 : 0.01;
    const points: FlowCurvePoint[] = [];

    for (let i = 0; i < numPoints; i++) {
      let q = (maxQ * i) / (numPoints - 1);
      if (q === 0) q = maxQ * 0.01;
      const res = this.analyze(density, viscosity, diameterM, lengthM, roughnessM, q);
      points.push({
        ...res,
        flowRateLps: q * 1000.0
      });
    }

    return points;
  }
}

/**
 * Solves Heat Transfer equations
 */
export class HeatTransferEngine {
  static calculateConduction(
    thicknessM: number,
    areaM2: number,
    conductivityWMk: number,
    tHot: number,
    tCold: number
  ): ConductionResults {
    if (thicknessM <= 0) throw new Error('Wall thickness must be greater than zero.');
    if (areaM2 <= 0) throw new Error('Wall area must be greater than zero.');
    if (conductivityWMk <= 0) throw new Error('Thermal conductivity must be greater than zero.');
    if (tHot < tCold) throw new Error('Hot-side temperature must be greater than or equal to cold-side temperature.');

    const deltaT = tHot - tCold;
    const qDot = (conductivityWMk * areaM2 * deltaT) / thicknessM;
    const flux = qDot / areaM2;

    return {
      heatTransferRateW: qDot,
      heatTransferRateKw: qDot / 1000.0,
      heatFluxWM2: flux,
      deltaTemperatureK: deltaT,
      assumptions: [
        '1D steady-state thermal conduction',
        'Homogeneous wall material with constant conductivity k',
        'Negligible thermal contact resistance and internal heat generation',
        'Isothermal plane surfaces'
      ]
    };
  }

  static calculateNewtonCooling(
    tInitial: number,
    tAmbient: number,
    tTarget: number,
    coolingConstantPerMin: number
  ): NewtonCoolingResults {
    if (coolingConstantPerMin <= 0) throw new Error('Cooling constant k must be greater than zero.');

    if (tInitial > tAmbient) {
      if (!(tAmbient < tTarget && tTarget <= tInitial)) {
        throw new Error(
          `Target temperature (${tTarget}°C) must be strictly between ambient (${tAmbient}°C) and initial (${tInitial}°C) for cooling.`
        );
      }
    } else if (tInitial < tAmbient) {
      if (!(tInitial <= tTarget && tTarget < tAmbient)) {
        throw new Error(
          `Target temperature (${tTarget}°C) must be strictly between initial (${tInitial}°C) and ambient (${tAmbient}°C) for heating.`
        );
      }
    } else {
      if (tTarget !== tInitial) {
        throw new Error('Initial and ambient temperatures are equal; target temperature cannot change.');
      }
      return {
        timeToTargetMin: 0,
        timeToTargetSec: 0,
        coolingConstantPerMin,
        tInitial,
        tAmbient,
        tTarget
      };
    }

    const ratio = (tTarget - tAmbient) / (tInitial - tAmbient);
    const timeMin = -Math.log(ratio) / coolingConstantPerMin;

    return {
      timeToTargetMin: timeMin,
      timeToTargetSec: timeMin * 60.0,
      coolingConstantPerMin,
      tInitial,
      tAmbient,
      tTarget
    };
  }

  static generateCoolingCurve(
    tInitial: number,
    tAmbient: number,
    targetTimeMin: number,
    coolingConstantPerMin: number,
    numPoints: number = 50
  ): CoolingCurvePoint[] {
    const maxTime = Math.max(targetTimeMin * 2.0, 10.0);
    const dt = maxTime / (numPoints - 1);
    const points: CoolingCurvePoint[] = [];

    for (let i = 0; i < numPoints; i++) {
      const t = i * dt;
      const temp = tAmbient + (tInitial - tAmbient) * Math.exp(-coolingConstantPerMin * t);
      points.push({
        timeMin: Number(t.toFixed(2)),
        temperatureC: Number(temp.toFixed(2))
      });
    }

    return points;
  }
}

/**
 * Data processing engine for rock and fluid datasets
 */
export class DatasetEngine {
  static getNumericColumns(rows: RawRowData[]): string[] {
    if (!rows || rows.length === 0) return [];
    const headers = Object.keys(rows[0]);
    const numCols: string[] = [];

    for (const h of headers) {
      let isNum = true;
      let count = 0;
      for (const r of rows) {
        const val = r[h];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          if (isNaN(Number(val))) {
            isNum = false;
            break;
          }
          count++;
        }
      }
      if (isNum && count > 0) numCols.push(h);
    }

    return numCols;
  }

  static computeSummaryStatistics(rows: RawRowData[]): ColumnStats[] {
    const numCols = this.getNumericColumns(rows);
    const stats: ColumnStats[] = [];

    for (const col of numCols) {
      const vals: number[] = [];
      for (const r of rows) {
        const v = r[col];
        if (v !== undefined && v !== null && String(v).trim() !== '') {
          const num = Number(v);
          if (!isNaN(num)) vals.push(num);
        }
      }
      if (vals.length === 0) continue;

      vals.sort((a, b) => a - b);
      const n = vals.length;
      const mean = vals.reduce((sum, x) => sum + x, 0) / n;
      const variance =
        n > 1
          ? vals.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1)
          : 0;
      const std = Math.sqrt(variance);

      const percentile = (p: number) => {
        const idx = p * (n - 1);
        const i = Math.floor(idx);
        const f = idx - i;
        if (i + 1 < n) return vals[i] + f * (vals[i + 1] - vals[i]);
        return vals[i];
      };

      stats.push({
        column: col,
        count: n,
        mean: Number(mean.toFixed(4)),
        std: Number(std.toFixed(4)),
        min: Number(vals[0].toFixed(4)),
        p25: Number(percentile(0.25).toFixed(4)),
        median: Number(percentile(0.5).toFixed(4)),
        p75: Number(percentile(0.75).toFixed(4)),
        max: Number(vals[n - 1].toFixed(4))
      });
    }

    return stats;
  }

  static filterData(
    rows: RawRowData[],
    filters: Record<string, [number, number]>
  ): RawRowData[] {
    return rows.filter((r) => {
      for (const [col, [minV, maxV]] of Object.entries(filters)) {
        const val = r[col];
        if (val === undefined || val === null || String(val).trim() === '') {
          return false;
        }
        const num = Number(val);
        if (isNaN(num) || num < minV || num > maxV) {
          return false;
        }
      }
      return true;
    });
  }

  static getSampleCoreDataset(): RawRowData[] {
    return [
      { Sample_ID: 'CS-001', Depth_m: 2150.5, Porosity_pct: 18.4, Permeability_mD: 145.2, Grain_Density_gcm3: 2.65, Water_Sat_pct: 25.1 },
      { Sample_ID: 'CS-002', Depth_m: 2152.0, Porosity_pct: 14.2, Permeability_mD: 38.6, Grain_Density_gcm3: 2.66, Water_Sat_pct: 32.0 },
      { Sample_ID: 'CS-003', Depth_m: 2153.5, Porosity_pct: 21.0, Permeability_mD: 312.0, Grain_Density_gcm3: 2.64, Water_Sat_pct: 19.5 },
      { Sample_ID: 'CS-004', Depth_m: 2155.0, Porosity_pct: 8.5, Permeability_mD: 1.2, Grain_Density_gcm3: 2.68, Water_Sat_pct: 55.4 },
      { Sample_ID: 'CS-005', Depth_m: 2156.5, Porosity_pct: 16.8, Permeability_mD: 98.4, Grain_Density_gcm3: 2.65, Water_Sat_pct: 28.3 },
      { Sample_ID: 'CS-006', Depth_m: 2158.0, Porosity_pct: 23.5, Permeability_mD: 620.0, Grain_Density_gcm3: 2.63, Water_Sat_pct: 15.2 },
      { Sample_ID: 'CS-007', Depth_m: 2159.5, Porosity_pct: 11.1, Permeability_mD: 12.8, Grain_Density_gcm3: 2.67, Water_Sat_pct: 42.1 },
      { Sample_ID: 'CS-008', Depth_m: 2161.0, Porosity_pct: 19.2, Permeability_mD: 210.5, Grain_Density_gcm3: 2.65, Water_Sat_pct: 22.0 },
      { Sample_ID: 'CS-009', Depth_m: 2162.5, Porosity_pct: 6.8, Permeability_mD: 0.45, Grain_Density_gcm3: 2.70, Water_Sat_pct: 68.0 },
      { Sample_ID: 'CS-010', Depth_m: 2164.0, Porosity_pct: 15.5, Permeability_mD: 76.0, Grain_Density_gcm3: 2.66, Water_Sat_pct: 30.1 },
      { Sample_ID: 'CS-011', Depth_m: 2165.5, Porosity_pct: 22.1, Permeability_mD: 480.0, Grain_Density_gcm3: 2.64, Water_Sat_pct: 17.8 },
      { Sample_ID: 'CS-012', Depth_m: 2167.0, Porosity_pct: 12.9, Permeability_mD: 24.5, Grain_Density_gcm3: 2.67, Water_Sat_pct: 38.5 }
    ];
  }
}
