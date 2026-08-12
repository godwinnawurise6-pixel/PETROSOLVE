# PETROSOLVE

**Practical engineering calculations and data analysis tools.**

PETROSOLVE is an engineering calculation and data analysis software platform built with Python, object-oriented programming principles, and modular design. It provides practical, transparent, and technically credible engineering tools for fluid flow, thermal calculations, and core/fluid dataset processing.

---

## Features & Engineering Modules

1. **Pipe Flow Analyser (Module A)**
   - Calculates fluid velocity, Reynolds number, flow regime (Laminar, Transitional, Turbulent), Darcy friction factor, and frictional pressure drop.
   - Fluid presets for Water, Air, and Crude Oil, plus custom user-defined fluids.
   - Solves the implicit **Colebrook-White equation** via iterative Newton-Raphson numerical solver for turbulent flow.
   - Uses **Darcy-Weisbach equation** for frictional head loss.
   - Generates interactive pressure drop curves over varying volumetric flow rates with CSV export.

2. **Heat Transfer Calculator (Module B)**
   - **1D Steady-State Conduction:** Evaluates heat transfer rate ($\dot{Q}$) and heat flux ($q''$) through flat walls using Fourier's Law.
   - **Transient Cooling:** Evaluates temperature decay $T(t)$ and elapsed time to target temperature using the analytical solution to Newton's Law of Cooling:
     $$T(t) = T_\infty + (T_0 - T_\infty)e^{-kt}$$
   - Includes validation checks for physical reachability and asymptotic cooling behavior.

3. **Rock & Fluid Data Dashboard (Module C)**
   - Upload custom core sample or reservoir fluid CSV datasets or explore built-in sample rock core data.
   - Provides summary statistics (count, mean, std, min, 25%, median, 75%, max) for all numerical columns.
   - Multi-column dynamic range filtering with filtered CSV data export.
   - Automatic generation of Porosity Distribution Histograms and Porosity vs. Permeability scatter plots.

---

## Project Structure

```
petrosolve/
├── app.py                      # Main Streamlit landing page & module routing
├── engineering.py              # Core OOP engineering logic (Fluid, Pipe, HeatTransfer, Dataset)
├── requirements.txt            # Python dependencies
├── README.md                   # Technical documentation & hand calculation verifications
├── pages/
│   ├── pipe_flow.py            # Streamlit Pipe Flow Analyser view
│   ├── heat_transfer.py        # Streamlit Heat Transfer Calculator view
│   └── rock_fluid_dashboard.py # Streamlit Data Dashboard view
├── tests/
│   ├── test_pipe_flow.py       # Automated unit tests for Pipe Flow
│   ├── test_heat_transfer.py   # Automated unit tests for Heat Transfer
│   └── test_data_dashboard.py # Automated unit tests for Data Dashboard
└── src/                        # Interactive React / Recharts web interface
```

---

## Independent Hand Calculation Verifications

### 1. Pipe Flow Verification (Colebrook-White & Darcy-Weisbach)
**Input Parameters:**
- Fluid: Water at 20°C ($\rho = 998.2 \text{ kg/m}^3, \mu = 0.001002 \text{ Pa}\cdot\text{s}$)
- Pipe: $D = 0.05 \text{ m}$ ($50\text{ mm}$), $L = 100 \text{ m}$, Roughness $\varepsilon = 0.000045 \text{ m}$
- Flow Rate: $Q = 0.005 \text{ m}^3/\text{s}$ ($5 \text{ L/s}$)

**Hand Calculation:**
1. Cross-sectional Area:
   $$A = \frac{\pi (0.05)^2}{4} = 0.0019635 \text{ m}^2$$
2. Flow Velocity:
   $$V = \frac{0.005}{0.0019635} = 2.5465 \text{ m/s}$$
3. Reynolds Number:
   $$Re = \frac{998.2 \times 2.5465 \times 0.05}{0.001002} = 126,840 \quad (\text{Turbulent})$$
4. Relative Roughness:
   $$\frac{\varepsilon}{D} = \frac{0.000045}{0.05} = 0.0009$$
5. Colebrook-White Friction Factor ($f$):
   $$\frac{1}{\sqrt{f}} = -2 \log_{10} \left( \frac{0.0009}{3.7} + \frac{2.51}{126840 \sqrt{f}} \right) \implies f = 0.0211$$
6. Pressure Drop ($\Delta P$):
   $$\Delta P = 0.0211 \times \left(\frac{100}{0.05}\right) \times \left(\frac{998.2 \times 2.5465^2}{2}\right) = 136,577 \text{ Pa} = 136.58 \text{ kPa}$$

**Software Result:** $136.58\text{ kPa}$ (Difference: $<0.01\%$).

---

### 2. Flat-Wall Conduction Verification (Fourier's Law)
**Input Parameters:**
- Thickness $L = 0.2 \text{ m}$, Area $A = 10.0 \text{ m}^2$, $k = 0.8 \text{ W/(m}\cdot\text{K)}$
- $T_{\text{hot}} = 100.0^\circ\text{C}$, $T_{\text{cold}} = 20.0^\circ\text{C}$

**Hand Calculation:**
$$\dot{Q} = \frac{0.8 \times 10.0 \times (100.0 - 20.0)}{0.2} = 3200 \text{ W} = 3.2 \text{ kW}$$
$$q'' = \frac{3200}{10.0} = 320 \text{ W/m}^2$$

**Software Result:** $3.200\text{ kW}, 320.0\text{ W/m}^2$ (Difference: $0.00\%$).

---

### 3. Newton's Law of Cooling Verification
**Input Parameters:**
- $T_0 = 90.0^\circ\text{C}$, $T_\infty = 20.0^\circ\text{C}$, $T_{\text{target}} = 40.0^\circ\text{C}$, $k = 0.05 \text{ min}^{-1}$

**Hand Calculation:**
$$t = -\frac{\ln\left(\frac{40.0 - 20.0}{90.0 - 20.0}\right)}{0.05} = -\frac{\ln(2/7)}{0.05} = 25.055 \text{ minutes}$$

**Software Result:** $25.06\text{ minutes}$ (Difference: $<0.01\%$).

---

## Installation & Running Tests

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Automated Unit Tests
```bash
python3 -m unittest discover -s tests
```

### 3. Run Streamlit Application
```bash
streamlit run app.py
```

---

## Engineering Assumptions & Limitations

- **Pipe Flow:** Assumes steady-state, single-phase, Newtonian, incompressible fluid flow in fully filled circular conduits. Calculates major frictional loss only (minor losses from fittings/valves are excluded unless added as equivalent lengths).
- **Heat Transfer:** Conduction assumes 1D steady-state heat flux through isotropic, homogeneous materials without thermal generation or contact resistance. Cooling assumes lumped thermal capacitance governed by Newton's Law.
- **Data Dashboard:** Expects structured tabular CSV files with numeric columns for quantitative calculations.

---

## Professional Disclaimer

*This software is intended for educational, preliminary analysis, and engineering-support purposes. Results should be independently verified by a qualified engineer before being used for safety-critical design, operational, or commercial decisions.*
