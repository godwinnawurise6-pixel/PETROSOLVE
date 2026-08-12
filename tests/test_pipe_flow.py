"""
Automated unit tests for Pipe Flow Analyser module in PETROSOLVE.
Includes hand-calculated verification test case.
"""

import unittest
import math
from engineering import Fluid, Pipe, PipeFlowAnalyzer

class TestPipeFlow(unittest.TestCase):

    def test_hand_calculated_turbulent_water_case(self):
        """
        Verification Case:
        Water at 20°C: ρ = 998.2 kg/m^3, μ = 0.001002 Pa.s
        Pipe: D = 0.05 m, L = 100 m, ε = 0.000045 m
        Flow Rate Q = 0.005 m^3/s
        """
        water = Fluid.from_preset("Water")
        pipe = Pipe(diameter=0.05, length=100.0, roughness=0.000045)
        analyzer = PipeFlowAnalyzer(water, pipe)

        res = analyzer.analyze(0.005)

        # Expected Area: pi * 0.05^2 / 4 = 0.0019634954 m^2
        expected_area = math.pi * 0.0025 / 4.0
        self.assertAlmostEqual(res["area_m2"], expected_area, places=6)

        # Expected Velocity: 0.005 / 0.0019634954 = 2.546479 m/s
        expected_velocity = 0.005 / expected_area
        self.assertAlmostEqual(res["velocity_ms"], expected_velocity, places=4)

        # Expected Reynolds: 998.2 * 2.546479 * 0.05 / 0.001002 = 126840.4
        expected_reynolds = (998.2 * expected_velocity * 0.05) / 0.001002
        self.assertAlmostEqual(res["reynolds_number"], expected_reynolds, places=1)
        self.assertEqual(res["flow_regime"], "Turbulent")

        # Check Colebrook-White friction factor (expected ~0.0211)
        f = res["friction_factor"]
        self.assertTrue(0.020 <= f <= 0.022, f"Friction factor {f} out of expected range 0.020-0.022")

        # Pressure drop should be ~136.5 kPa
        dp_kpa = res["pressure_drop_kpa"]
        self.assertTrue(130.0 <= dp_kpa <= 145.0, f"Pressure drop {dp_kpa} kPa out of expected range")

    def test_laminar_flow_case(self):
        """
        Laminar Flow Verification:
        Re < 2300 => f = 64 / Re
        """
        crude = Fluid.from_preset("Crude Oil")  # high viscosity
        pipe = Pipe(diameter=0.1, length=50.0, roughness=0.0001)
        analyzer = PipeFlowAnalyzer(crude, pipe)

        res = analyzer.analyze(0.0001)  # slow flow => low Re
        self.assertEqual(res["flow_regime"], "Laminar")
        expected_f = 64.0 / res["reynolds_number"]
        self.assertAlmostEqual(res["friction_factor"], expected_f, places=6)

    def test_invalid_inputs(self):
        """
        Test that invalid inputs raise controlled ValueErrors.
        """
        water = Fluid.from_preset("Water")
        pipe = Pipe(diameter=0.05, length=100.0, roughness=0.0)

        # Negative diameter
        with self.assertRaises(ValueError):
            Pipe(diameter=-0.05, length=100.0, roughness=0.0)

        # Zero length
        with self.assertRaises(ValueError):
            Pipe(diameter=0.05, length=0.0, roughness=0.0)

        # Negative flow rate
        analyzer = PipeFlowAnalyzer(water, pipe)
        with self.assertRaises(ValueError):
            analyzer.analyze(-0.001)

if __name__ == "__main__":
    unittest.main()
