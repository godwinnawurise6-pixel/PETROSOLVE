export type PageView = 'home' | 'pipe_flow' | 'heat_transfer' | 'rock_fluid_dashboard' | 'hand_calcs';

export type FluidPreset = 'Water' | 'Air' | 'Crude Oil' | 'User-defined';

export interface FluidProperties {
  name: string;
  density: number; // kg/m^3
  dynamicViscosity: number; // Pa.s
  description?: string;
}

export interface PipeFlowResults {
  volumetricFlowRateM3s: number;
  velocityMs: number;
  reynoldsNumber: number;
  flowRegime: 'Laminar' | 'Transitional' | 'Turbulent';
  frictionFactor: number;
  frictionFactorMethod: string;
  pressureDropPa: number;
  pressureDropKpa: number;
  areaM2: number;
  relativeRoughness: number;
}

export interface FlowCurvePoint extends PipeFlowResults {
  flowRateLps: number;
}

export interface ConductionResults {
  heatTransferRateW: number;
  heatTransferRateKw: number;
  heatFluxWM2: number;
  deltaTemperatureK: number;
  assumptions: string[];
}

export interface NewtonCoolingResults {
  timeToTargetMin: number;
  timeToTargetSec: number;
  coolingConstantPerMin: number;
  tInitial: number;
  tAmbient: number;
  tTarget: number;
}

export interface CoolingCurvePoint {
  timeMin: number;
  temperatureC: number;
}

export interface ColumnStats {
  column: string;
  count: number;
  mean: number;
  std: number;
  min: number;
  p25: number;
  median: number;
  p75: number;
  max: number;
}

export interface RawRowData {
  [key: string]: string | number;
}
