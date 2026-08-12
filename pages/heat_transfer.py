"""
PETROSOLVE - Heat Transfer Calculator Module
"""

import streamlit as st
import pandas as pd
from engineering import HeatTransferCalculator

st.set_page_config(page_title="Heat Transfer Calculator — PETROSOLVE", layout="wide")

if st.button("← Back to PETROSOLVE"):
    st.switch_page("app.py")

st.title("🔥 Heat Transfer Calculator")
st.caption("Steady-state flat-wall conduction and transient Newton's Law of Cooling.")

calc_mode = st.radio("Calculation Mode", ["1D Steady-State Conduction (Fourier's Law)", "Transient Cooling (Newton's Law of Cooling)"], horizontal=True)

if calc_mode == "1D Steady-State Conduction (Fourier's Law)":
    st.subheader("1D Flat-Wall Conduction")
    c1, c2 = st.columns(2)
    with c1:
        thickness = st.number_input("Wall Thickness L (m)", value=0.2, min_value=0.001, step=0.05, help="Thickness of the solid wall.")
        area = st.number_input("Surface Area A (m²)", value=10.0, min_value=0.01, step=1.0, help="Surface area normal to heat flow.")
        k = st.number_input("Thermal Conductivity k (W/(m·K))", value=0.8, min_value=0.001, step=0.1, help="Material conductivity.")
    with c2:
        t_hot = st.number_input("Hot-side Temperature (°C)", value=100.0, step=5.0)
        t_cold = st.number_input("Cold-side Temperature (°C)", value=20.0, step=5.0)

    try:
        res = HeatTransferCalculator.calculate_conduction(thickness, area, k, t_hot, t_cold)
        m1, m2, m3 = st.columns(3)
        m1.metric("Heat Transfer Rate", f"{res['heat_transfer_rate_kw']:.3f} kW", f"{res['heat_transfer_rate_w']:,.1f} W")
        m2.metric("Heat Flux (q'')", f"{res['heat_flux_w_m2']:.1f} W/m²")
        m3.metric("Temp Difference (ΔT)", f"{res['delta_temperature_k']:.1f} °C")

        with st.expander("📖 Method & Governing Equations"):
            st.markdown(f"""
            **Fourier's Law of Heat Conduction:**
            $$\\dot{{Q}} = \\frac{{k A (T_{{hot}} - T_{{cold}})}}{{L}} = \\frac{{{k} \\times {area} \\times ({t_hot} - {t_cold})}}{{{thickness}}} = {res['heat_transfer_rate_w']:,.1f}\\text{{ W}}$$
            **Heat Flux:**
            $$q'' = \\frac{{\\dot{{Q}}}}{{A}} = {res['heat_flux_w_m2']:.1f}\\text{{ W/m}}^2$$
            """)
    except ValueError as e:
        st.error(f"Calculation Error: {e}")

else:
    st.subheader("Newton's Law of Cooling")
    c1, c2 = st.columns(2)
    with c1:
        t_0 = st.number_input("Initial Temperature T₀ (°C)", value=90.0, step=5.0)
        t_inf = st.number_input("Ambient Temperature T<sub>∞</sub> (°C)", value=20.0, step=5.0)
    with c2:
        t_target = st.number_input("Target Temperature T<sub>target</sub> (°C)", value=40.0, step=5.0)
        k_cool = st.number_input("Cooling Constant k (1/min)", value=0.05, min_value=0.0001, step=0.01)

    try:
        res = HeatTransferCalculator.calculate_newton_cooling(t_0, t_inf, t_target, k_cool)
        m1, m2 = st.columns(2)
        m1.metric("Elapsed Time to Target", f"{res['time_to_target_min']:.2f} min", f"{res['time_to_target_sec']:.1f} sec")
        m2.metric("Target Temperature", f"{t_target:.1f} °C")

        curve = HeatTransferCalculator.generate_cooling_curve(t_0, t_inf, res['time_to_target_min'], k_cool)
        df_curve = pd.DataFrame(curve)
        st.line_chart(df_curve, x="time_min", y="temperature_c")

        with st.expander("📖 Method & Governing Equations"):
            st.markdown(f"""
            **Newton's Law Analytical Solution:**
            $$T(t) = T_\\infty + (T_0 - T_\\infty) e^{{-k t}}$$
            $$t_{{target}} = -\\frac{{\\ln\\left(\\frac{{T_{{target}} - T_\\infty}}{{T_0 - T_\\infty}}\\right)}}{{k}} = {res['time_to_target_min']:.2f}\\text{{ min}}$$
            """)

    except ValueError as e:
        st.error(f"Cooling Error: {e}")
