"""
Automated unit tests for Rock & Fluid Data Dashboard module in PETROSOLVE.
Verifies CSV data parsing, summary statistics, filtering, and error safety.
"""

import unittest
from engineering import RockFluidDataset

class TestDataDashboard(unittest.TestCase):

    def setUp(self):
        self.sample_rows = RockFluidDataset.get_sample_rock_data()
        self.dataset = RockFluidDataset(self.sample_rows, "sample_core.csv")

    def test_numeric_columns_detection(self):
        """
        Verify that numeric columns are correctly identified.
        """
        self.assertIn("Porosity_pct", self.dataset.numeric_columns)
        self.assertIn("Permeability_mD", self.dataset.numeric_columns)
        self.assertIn("Depth_m", self.dataset.numeric_columns)

    def test_summary_statistics(self):
        """
        Verify mean, min, max calculation for Porosity_pct.
        Sample porosities: 18.4, 14.2, 21.0, 8.5, 16.8, 23.5, 11.1, 19.2, 6.8, 15.5, 22.1, 12.9
        Total = 190.0, Count = 12 => Mean = 15.8333...
        Min = 6.8, Max = 23.5
        """
        stats = self.dataset.get_summary_statistics()
        self.assertIn("Porosity_pct", stats)

        p_stats = stats["Porosity_pct"]
        self.assertEqual(p_stats["count"], 12)
        self.assertAlmostEqual(p_stats["mean"], 15.833333, places=4)
        self.assertAlmostEqual(p_stats["min"], 6.8, places=2)
        self.assertAlmostEqual(p_stats["max"], 23.5, places=2)

    def test_filtering_porosity(self):
        """
        Filter samples with Porosity_pct >= 15.0.
        Expected matching samples: 18.4, 21.0, 16.8, 23.5, 19.2, 15.5, 22.1 (7 samples).
        """
        filtered = self.dataset.filter_data({"Porosity_pct": (15.0, 100.0)})
        self.assertEqual(len(filtered), 7)
        for r in filtered:
            self.assertGreaterEqual(float(r["Porosity_pct"]), 15.0)

if __name__ == "__main__":
    unittest.main()
