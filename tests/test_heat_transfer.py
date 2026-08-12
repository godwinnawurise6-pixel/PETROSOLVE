"""
Automated unit tests for Heat Transfer Calculator module in PETROSOLVE.
Includes hand-calculated verification test cases for Fourier Conduction and Newton's Cooling.
"""

import unittest
from engineering import HeatTransferCalculator

class TestHeatTransfer(unittest.TestCase):

    def test_hand_calculated_conduction(self):
        """
        Verification Case:
        L = 0.2 m, A = 10.0 m^2, k = 0.8 W/(m.K)
        Thot = 100°C, Tcold = 20°C
        Expected Q_dot = 0.8 * 10 * 80 / 0.2 = 3200 W = 3.2 kW
        Expected q'' = 320 W/m^2
        """
        res = HeatTransferCalculator.calculate_conduction(
            thickness_m=0.2,
            area_m2=10.0,
            conductivity_w_mk=0.8,
            t_hot=100.0,
            t_cold=20.0
        )

        self.assertAlmostEqual(res["heat_transfer_rate_w"], 3200.0, places=4)
        self.assertAlmostEqual(res["heat_transfer_rate_kw"], 3.2, places=4)
        self.assertAlmostEqual(res["heat_flux_w_m2"], 320.0, places=4)

    def test_hand_calculated_newton_cooling(self):
        """
        Verification Case:
        T0 = 90°C, Tambient = 20°C, Ttarget = 40°C, k = 0.05 min^-1
        Expected t = -ln((40-20)/(90-20)) / 0.05 = -ln(2/7) / 0.05 = 25.055 minutes
        """
        res = HeatTransferCalculator.calculate_newton_cooling(
            t_initial=90.0,
            t_ambient=20.0,
            t_target=40.0,
            cooling_constant=0.05
        )

        self.assertAlmostEqual(res["time_to_target_min"], 25.05527, places=4)
        self.assertAlmostEqual(res["time_to_target_sec"], 25.05527 * 60.0, places=2)

    def test_unreachable_cooling_target_raises_error(self):
        """
        Target temperature below ambient or above initial temperature cannot be reached.
        """
        with self.assertRaises(ValueError):
            HeatTransferCalculator.calculate_newton_cooling(
                t_initial=90.0,
                t_ambient=20.0,
                t_target=10.0,  # Below ambient 20°C!
                cooling_constant=0.05
            )

    def test_invalid_conduction_inputs(self):
        """
        Negative thickness or area must raise ValueError.
        """
        with self.assertRaises(ValueError):
            HeatTransferCalculator.calculate_conduction(
                thickness_m=-0.1,
                area_m2=10.0,
                conductivity_w_mk=0.8,
                t_hot=100.0,
                t_cold=20.0
            )

if __name__ == "__main__":
    unittest.main()
