"""
PETROSOLVE - Pipe Flow Analyser Module
"""

import streamlit as st
import pandas as pd
import numpy as np
from engineering import Fluid, Pipe, PipeFlowAnalyzer

st.set_page_config(page_title="Pipe Flow Analyser — PETROSOLVE", layout="wide")

if st.button("← Back to PETROSOLVE"):
    st.switch_page("app.py")

st.title("🌊 Pipe Flow Analyser")
st.caption("Frictional pressure drop, velocity, Reynolds number, and Darcy friction factor analysis for circular pipes.")

st.sidebar.header("Fluid & Pipe Settings")

fluid_option = st.sidebar.selectbox("Select Fluid", ["Water", "Air", "Crude Oil", "User-defined"])

if fluid_option in ["Water", "Air", "Crude Oil"]:
    fluid = Fluid.from_preset(fluid_option)
    st.sidebar.info(f"Preset loaded: ρ = {fluid.density} kg/m³, μ = {fluid.dynamic_viscosity} Pa·s")
else:
    density = st.sidebar.number_input("Fluid Density ρ (kg/m³)", value=1000.0, min_value=0.1, step=10.0, help="Mass per unit volume of fluid.")
    viscosity = st.sidebar.number_input("Dynamic Viscosity μ (Pa·s)", value=0.001, min_value=1e-7, format="%.6f", step=0.0001, help="Fluid resistance to flow.")
    fluid = Fluid(name="User-defined", density=density, dynamic_viscosity=viscosity)

st.sidebar.subheader("Pipe Geometry & Flow Rate")

d_mm = st.sidebar.number_input("Internal Diameter D (mm)", value=50.0, min_value=1.0, step=5.0, help="Internal diameter of the pipe. Controls flow area and velocity.")
l_m = st.sidebar.number_input("Pipe Length L (m)", value=100.0, min_value=0.1, step=10.0, help="Length of pipe over which frictional loss is evaluated.")
roughness_mm = st.sidebar.number_input("Pipe Roughness ε (mm)", value=0.045, min_value=0.0, step=0.005, format="%.4f", help="Absolute roughness of internal pipe wall.")
q_lps = st.sidebar.number_input("Volumetric Flow Rate Q (L/s)", value=5.0, min_value=0.01, step=0.5, help="Volume of fluid passing through pipe per second.")

# Unit conversions to SI
d_m = d_mm / 1000.0
roughness_m = roughness_mm / 1000.0
q_m3s = q_lps / 1000.0

try:
    pipe = Pipe(diameter=d_m, length=l_m, roughness=roughness_m)
    analyzer = PipeFlowAnalyzer(fluid, pipe)
    results = analyzer.analyze(q_m3s)

    m1, m2, m3, m4, m5 = st.columns(5)
    m1.metric("Flow Velocity", f"{results['velocity_ms']:.3f} m/s")
    m2.metric("Reynolds Number", f"{results['reynolds_number']:,.1f}")
    m3.metric("Flow Regime", results['flow_regime'])
    m4.metric("Friction Factor (f)", f"{results['friction_factor']:.5f}")
    m5.metric("Pressure Drop", f"{results['pressure_drop_kpa']:.2f} kPa", help=f"{results['pressure_drop_pa']:,.1f} Pa")

    st.subheader("Interactive Pressure Drop Curve")
    curve_data = analyzer.generate_flow_curve(q_m3s)
    df_curve = pd.DataFrame(curve_data)

    st.line_chart(df_curve, x="volumetric_flow_rate_m3s", y="pressure_drop_kpa")

    # CSV Download
    csv_bytes = df_curve.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Export Flow Curve CSV",
        data=csv_bytes,
        file_name="petrosolve_pipe_flow_results.csv",
        mime="text/csv"
    )

    with st.expander("📖 Method & Governing Equations"):
        st.markdown(f"""
        **Method used:** {results['friction_factor_method']}
        - **Cross-sectional area:** $A = \\frac{{\\pi D^2}}{{4}} = {results['area_m2']:.6f}\\text{{ m}}^2$
        - **Velocity:** $V = \\frac{{Q}}{{A}} = {results['velocity_ms']:.4f}\\text{{ m/s}}$
        - **Reynolds number:** $Re = \\frac{{\\rho V D}}{{\\mu}} = {results['reynolds_number']:,.1f}$
        - **Relative roughness:** $\\varepsilon / D = {results['relative_roughness']:.6f}$
        - **Darcy-Weisbach Equation:** $\\Delta P = f \\left(\\frac{{L}}{{D}}\\right) \\left(\\frac{{\\rho V^2}}{{2}}\\right) = {results['pressure_drop_pa']:,.1f}\\text{{ Pa}}$
        """)

except ValueError as e:
    st.error(f"Input Error: {e}")
