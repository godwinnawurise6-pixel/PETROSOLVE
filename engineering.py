"""
PETROSOLVE - Core Engineering Logic Module
Provides object-oriented models, calculation engines, and data processors for:
- Pipe Flow Analysis (Fluid, Pipe, Darcy-Weisbach, Colebrook-White)
- Heat Transfer Calculations (1D Steady Conduction, Newton's Law of Cooling)
- Rock & Fluid Dataset Processing and Filtering
"""

import math
from typing import Dict, List, Tuple, Any, Optional

class Fluid:
    """
    Represents a Newtonian fluid with physical properties.
    """
    PRESETS = {
        "Water": {"density": 998.2, "dynamic_viscosity": 0.001002, "description": "Pure water at 20°C, 1 atm"},
        "Air": {"density": 1.204, "dynamic_viscosity": 1.825e-5, "description": "Dry air at 20°C, 1 atm"},
        "Crude Oil": {"density": 850.0, "dynamic_viscosity": 0.015, "description": "Medium crude oil at 15°C"}
    }

    def __init__(self, name: str, density: float, dynamic_viscosity: float):
        """
        Initialize fluid properties.
        :param name: Name of the fluid.
        :param density: Density in kg/m^3.
        :param dynamic_viscosity: Dynamic viscosity in Pa.s (kg/(m.s)).
        """
        if density <= 0:
            raise ValueError("Fluid density must be greater than zero.")
        if dynamic_viscosity <= 0:
            raise ValueError("Dynamic viscosity must be greater than zero.")
            
        self.name = name
        self.density = density  # kg/m^3
        self.dynamic_viscosity = dynamic_viscosity  # Pa.s

    @classmethod
    def from_preset(cls, preset_name: str) -> "Fluid":
        """
        Create a Fluid object from standard engineering presets.
        """
        if preset_name not in cls.PRESETS:
            raise ValueError(f"Unknown preset '{preset_name}'. Available: {list(cls.PRESETS.keys())}")
        info = cls.PRESETS[preset_name]
        return cls(name=preset_name, density=info["density"], dynamic_viscosity=info["dynamic_viscosity"])

    def __repr__(self) -> str:
        return f"Fluid('{self.name}', ρ={self.density} kg/m³, μ={self.dynamic_viscosity} Pa·s)"


class Pipe:
    """
    Represents circular pipe geometry and surface roughness.
    """
    def __init__(self, diameter: float, length: float, roughness: float):
        """
        Initialize pipe geometry.
        :param diameter: Internal diameter in meters (m).
        :param length: Pipe length in meters (m).
        :param roughness: Absolute internal wall roughness in meters (m).
        """
        if diameter <= 0:
            raise ValueError("Pipe internal diameter must be greater than zero.")
        if length <= 0:
            raise ValueError("Pipe length must be greater than zero.")
        if roughness < 0:
            raise ValueError("Pipe roughness cannot be negative.")

        self.diameter = diameter  # m
        self.length = length  # m
        self.roughness = roughness  # m

    @property
    def cross_sectional_area(self) -> float:
        """Calculate circular cross-sectional area A = π * D^2 / 4 in m^2."""
        return math.pi * (self.diameter ** 2) / 4.0

    @property
    def relative_roughness(self) -> float:
        """Calculate relative roughness ε / D (dimensionless)."""
        return self.roughness / self.diameter

    def __repr__(self) -> str:
        return f"Pipe(D={self.diameter}m, L={self.length}m, ε={self.roughness}m)"


class PipeFlowAnalyzer:
    """
    Solves fluid mechanics pipe flow equations including Reynolds number,
    friction factor (Laminar & Colebrook-White / Swamee-Jain), and major head loss.
    """
    def __init__(self, fluid: Fluid, pipe: Pipe):
        self.fluid = fluid
        self.pipe = pipe

    def calculate_velocity(self, volumetric_flow_rate: float) -> float:
        """
        Calculate average flow velocity V = Q / A in m/s.
        :param volumetric_flow_rate: Flow rate Q in m^3/s.
        """
        if volumetric_flow_rate < 0:
            raise ValueError("Volumetric flow rate cannot be negative.")
        return volumetric_flow_rate / self.pipe.cross_sectional_area

    def calculate_reynolds_number(self, velocity: float) -> float:
        """
        Calculate Reynolds number Re = (ρ * V * D) / μ.
        """
        if velocity < 0:
            raise ValueError("Velocity cannot be negative.")
        return (self.fluid.density * velocity * self.pipe.diameter) / self.fluid.dynamic_viscosity

    @staticmethod
    def get_flow_regime(reynolds_number: float) -> str:
        """
        Classify flow regime based on Reynolds number.
        - Laminar: Re < 2300
        - Transitional: 2300 <= Re < 4000
        - Turbulent: Re >= 4000
        """
        if reynolds_number < 2300:
            return "Laminar"
        elif reynolds_number < 4000:
            return "Transitional"
        else:
            return "Turbulent"

    def calculate_darcy_friction_factor(self, reynolds_number: float) -> Tuple[float, str]:
        """
        Calculate Darcy friction factor f.
        Uses f = 64 / Re for Laminar flow.
        Uses Colebrook-White implicit iterative solution (Newton-Raphson) for Turbulent flow.
        Uses Swamee-Jain explicit approximation for Transitional flow.
        Returns tuple of (friction_factor, method_description).
        """
        if reynolds_number <= 0:
            return 0.0, "Zero flow / Static"

        if reynolds_number < 2300:
            # Laminar flow
            f = 64.0 / reynolds_number
            return f, "Laminar Exact (f = 64 / Re)"

        rel_roughness = self.pipe.relative_roughness

        if reynolds_number < 4000:
            # Transitional - Swamee-Jain approximation
            term = (rel_roughness / 3.7) + (5.74 / (reynolds_number ** 0.9))
            f = 0.25 / ((math.log10(term)) ** 2)
            return f, "Transitional Swamee-Jain Explicit Approximation"

        # Turbulent - Colebrook-White via Newton-Raphson iteration
        # Initial guess via Swamee-Jain
        sj_term = (rel_roughness / 3.7) + (5.74 / (reynolds_number ** 0.9))
        f_guess = 0.25 / ((math.log10(sj_term)) ** 2)

        # Iterative solver for 1/sqrt(f) = -2 * log10( (rel_roughness / 3.7) + (2.51 / (Re * sqrt(f))) )
        f = f_guess
        for _ in range(50):
            sqrt_f = math.sqrt(f)
            arg = (rel_roughness / 3.7) + (2.51 / (reynolds_number * sqrt_f))
            if arg <= 0:
                break
            # g(f) = 1/sqrt(f) + 2*log10(arg)
            g = (1.0 / sqrt_f) + 2.0 * math.log10(arg)
            # Derivative dg/df = -0.5*f^(-1.5) - 2 * (1 / (arg * ln(10))) * ( -1.255 / (Re * f^(1.5)) )
            dg = -0.5 * (f ** -1.5) + (2.51 / (math.log(10) * reynolds_number * arg * (f ** 1.5)))
            f_next = f - (g / dg)
            if f_next <= 0:
                f_next = f / 2.0
            if abs(f_next - f) < 1e-7:
                f = f_next
                break
            f = f_next

        return f, "Colebrook-White Equation (Iterative Newton-Raphson)"

    def calculate_pressure_drop(self, velocity: float, friction_factor: float) -> float:
        """
        Calculate Darcy-Weisbach frictional pressure drop ΔP = f * (L / D) * (ρ * V^2 / 2) in Pa.
        """
        if velocity == 0:
            return 0.0
        return friction_factor * (self.pipe.length / self.pipe.diameter) * (self.fluid.density * (velocity ** 2) / 2.0)

    def analyze(self, volumetric_flow_rate: float) -> Dict[str, Any]:
        """
        Comprehensive pipe flow evaluation.
        """
        v = self.calculate_velocity(volumetric_flow_rate)
        re = self.calculate_reynolds_number(v)
        regime = self.get_flow_regime(re)
        f, method = self.calculate_darcy_friction_factor(re)
        delta_p = self.calculate_pressure_drop(v, f)

        return {
            "volumetric_flow_rate_m3s": volumetric_flow_rate,
            "velocity_ms": v,
            "reynolds_number": re,
            "flow_regime": regime,
            "friction_factor": f,
            "friction_factor_method": method,
            "pressure_drop_pa": delta_p,
            "pressure_drop_kpa": delta_p / 1000.0,
            "area_m2": self.pipe.cross_sectional_area,
            "relative_roughness": self.pipe.relative_roughness
        }

    def generate_flow_curve(self, operating_flow_rate: float, num_points: int = 25) -> List[Dict[str, Any]]:
        """
        Generate pressure drop vs flow rate data for plotting and CSV export.
        """
        if operating_flow_rate <= 0:
            max_q = 0.1  # default max flow rate m^3/s
        else:
            max_q = operating_flow_rate * 2.0

        q_steps = [ (max_q * i) / (num_points - 1) for i in range(num_points) ]
        if q_steps[0] == 0:
            q_steps[0] = max_q * 0.01  # small positive non-zero value

        curve_data = []
        for q in q_steps:
            res = self.analyze(q)
            curve_data.append(res)

        return curve_data


class HeatTransferCalculator:
    """
    Handles steady-state conduction and transient cooling calculations.
    """
    @staticmethod
    def calculate_conduction(thickness_m: float, area_m2: float, conductivity_w_mk: float, t_hot: float, t_cold: float) -> Dict[str, Any]:
        """
        Fourier's Law for 1D steady state conduction through a flat wall:
        Q_dot = k * A * (T_hot - T_cold) / L
        Heat flux q'' = Q_dot / A = k * (T_hot - T_cold) / L
        """
        if thickness_m <= 0:
            raise ValueError("Wall thickness must be greater than zero.")
        if area_m2 <= 0:
            raise ValueError("Wall area must be greater than zero.")
        if conductivity_w_mk <= 0:
            raise ValueError("Thermal conductivity must be greater than zero.")
        if t_hot < t_cold:
            raise ValueError("Hot-side temperature must be greater than or equal to cold-side temperature.")

        delta_t = t_hot - t_cold
        q_dot = (conductivity_w_mk * area_m2 * delta_t) / thickness_m
        heat_flux = q_dot / area_m2

        return {
            "heat_transfer_rate_w": q_dot,
            "heat_transfer_rate_kw": q_dot / 1000.0,
            "heat_flux_w_m2": heat_flux,
            "delta_temperature_k": delta_t,
            "assumptions": [
                "1D steady-state thermal conduction",
                "Homogeneous wall material with constant conductivity k",
                "Negligible thermal contact resistance and internal heat generation",
                "Isothermal plane surfaces"
            ]
        }

    @staticmethod
    def calculate_newton_cooling(t_initial: float, t_ambient: float, t_target: float, cooling_constant: float) -> Dict[str, Any]:
        """
        Newton's Law of Cooling analytical solution:
        T(t) = T_ambient + (T_initial - T_ambient) * exp(-k * t)
        Time to target: t = -ln((T_target - T_ambient)/(T_initial - T_ambient)) / k
        """
        if cooling_constant <= 0:
            raise ValueError("Cooling constant k must be greater than zero.")

        # Physical reachability validation
        if t_initial > t_ambient:
            # Cooling process
            if not (t_ambient < t_target <= t_initial):
                raise ValueError(
                    f"Target temperature ({t_target}°C) must be strictly between ambient ({t_ambient}°C) "
                    f"and initial ({t_initial}°C) for cooling."
                )
        elif t_initial < t_ambient:
            # Heating process
            if not (t_initial <= t_target < t_ambient):
                raise ValueError(
                    f"Target temperature ({t_target}°C) must be strictly between initial ({t_initial}°C) "
                    f"and ambient ({t_ambient}°C) for heating."
                )
        else:
            # Equal temperatures
            if t_target != t_initial:
                raise ValueError("Initial and ambient temperatures are equal; target temperature cannot change.")
            return {
                "time_to_target_min": 0.0,
                "time_to_target_sec": 0.0,
                "status": "Thermal equilibrium already reached."
            }

        ratio = (t_target - t_ambient) / (t_initial - t_ambient)
        time_min = -math.log(ratio) / cooling_constant

        return {
            "time_to_target_min": time_min,
            "time_to_target_sec": time_min * 60.0,
            "cooling_constant_per_min": cooling_constant,
            "t_initial": t_initial,
            "t_ambient": t_ambient,
            "t_target": t_target
        }

    @staticmethod
    def generate_cooling_curve(t_initial: float, t_ambient: float, target_time_min: float, cooling_constant: float, num_points: int = 50) -> List[Dict[str, float]]:
        """
        Generate time vs temperature points for plotting cooling curve.
        """
        max_time = max(target_time_min * 2.0, 10.0)
        dt = max_time / (num_points - 1)

        points = []
        for i in range(num_points):
            t = i * dt
            temp = t_ambient + (t_initial - t_ambient) * math.exp(-cooling_constant * t)
            points.append({"time_min": t, "temperature_c": temp})

        return points


class RockFluidDataset:
    """
    Data analysis module for core rock and fluid properties.
    """
    def __init__(self, raw_rows: List[Dict[str, Any]], filename: str = "dataset.csv"):
        self.filename = filename
        self.raw_rows = raw_rows
        self.headers = list(raw_rows[0].keys()) if raw_rows else []
        self._parse_numeric_columns()

    def _parse_numeric_columns(self):
        """Identify which columns can be treated as numeric."""
        self.numeric_columns = []
        if not self.raw_rows:
            return

        for col in self.headers:
            is_num = True
            count = 0
            for row in self.raw_rows:
                val = row.get(col)
                if val is not None and str(val).strip() != "":
                    try:
                        float(val)
                        count += 1
                    except ValueError:
                        is_num = False
                        break
            if is_num and count > 0:
                self.numeric_columns.append(col)

    def get_summary_statistics(self) -> Dict[str, Dict[str, float]]:
        """
        Compute summary statistics for all numeric columns.
        """
        stats = {}
        for col in self.numeric_columns:
            vals = []
            for r in self.raw_rows:
                v = r.get(col)
                if v is not None and str(v).strip() != "":
                    try:
                        vals.append(float(v))
                    except ValueError:
                        pass
            if not vals:
                continue

            vals.sort()
            n = len(vals)
            mean_val = sum(vals) / n
            variance = sum((x - mean_val) ** 2 for x in vals) / (n - 1) if n > 1 else 0.0
            std_val = math.sqrt(variance)

            # Percentiles
            def percentile(p: float) -> float:
                idx = p * (n - 1)
                i = int(idx)
                f = idx - i
                if i + 1 < n:
                    return vals[i] + f * (vals[i+1] - vals[i])
                return vals[i]

            stats[col] = {
                "count": n,
                "mean": mean_val,
                "std": std_val,
                "min": vals[0],
                "p25": percentile(0.25),
                "median": percentile(0.50),
                "p75": percentile(0.75),
                "max": vals[-1]
            }
        return stats

    def filter_data(self, column_ranges: Dict[str, Tuple[float, float]]) -> List[Dict[str, Any]]:
        """
        Filter dataset based on min/max ranges for specified columns.
        """
        filtered = []
        for row in self.raw_rows:
            keep = True
            for col, (min_v, max_v) in column_ranges.items():
                val = row.get(col)
                if val is None or str(val).strip() == "":
                    keep = False
                    break
                try:
                    fval = float(val)
                    if not (min_v <= fval <= max_v):
                        keep = False
                        break
                except ValueError:
                    keep = False
                    break
            if keep:
                filtered.append(row)
        return filtered

    @staticmethod
    def get_sample_rock_data() -> List[Dict[str, Any]]:
        """
        Provides default sample rock core dataset if user hasn't uploaded a CSV yet.
        """
        return [
            {"Sample_ID": "CS-001", "Depth_m": 2150.5, "Porosity_pct": 18.4, "Permeability_mD": 145.2, "Grain_Density_gcm3": 2.65, "Water_Sat_pct": 25.1},
            {"Sample_ID": "CS-002", "Depth_m": 2152.0, "Porosity_pct": 14.2, "Permeability_mD": 38.6, "Grain_Density_gcm3": 2.66, "Water_Sat_pct": 32.0},
            {"Sample_ID": "CS-003", "Depth_m": 2153.5, "Porosity_pct": 21.0, "Permeability_mD": 312.0, "Grain_Density_gcm3": 2.64, "Water_Sat_pct": 19.5},
            {"Sample_ID": "CS-004", "Depth_m": 2155.0, "Porosity_pct": 8.5, "Permeability_mD": 1.2, "Grain_Density_gcm3": 2.68, "Water_Sat_pct": 55.4},
            {"Sample_ID": "CS-005", "Depth_m": 2156.5, "Porosity_pct": 16.8, "Permeability_mD": 98.4, "Grain_Density_gcm3": 2.65, "Water_Sat_pct": 28.3},
            {"Sample_ID": "CS-006", "Depth_m": 2158.0, "Porosity_pct": 23.5, "Permeability_mD": 620.0, "Grain_Density_gcm3": 2.63, "Water_Sat_pct": 15.2},
            {"Sample_ID": "CS-007", "Depth_m": 2159.5, "Porosity_pct": 11.1, "Permeability_mD": 12.8, "Grain_Density_gcm3": 2.67, "Water_Sat_pct": 42.1},
            {"Sample_ID": "CS-008", "Depth_m": 2161.0, "Porosity_pct": 19.2, "Permeability_mD": 210.5, "Grain_Density_gcm3": 2.65, "Water_Sat_pct": 22.0},
            {"Sample_ID": "CS-009", "Depth_m": 2162.5, "Porosity_pct": 6.8, "Permeability_mD": 0.45, "Grain_Density_gcm3": 2.70, "Water_Sat_pct": 68.0},
            {"Sample_ID": "CS-010", "Depth_m": 2164.0, "Porosity_pct": 15.5, "Permeability_mD": 76.0, "Grain_Density_gcm3": 2.66, "Water_Sat_pct": 30.1},
            {"Sample_ID": "CS-011", "Depth_m": 2165.5, "Porosity_pct": 22.1, "Permeability_mD": 480.0, "Grain_Density_gcm3": 2.64, "Water_Sat_pct": 17.8},
            {"Sample_ID": "CS-012", "Depth_m": 2167.0, "Porosity_pct": 12.9, "Permeability_mD": 24.5, "Grain_Density_gcm3": 2.67, "Water_Sat_pct": 38.5}
        ]
