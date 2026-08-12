"""
PETROSOLVE - Main Streamlit Application
Multi-page engineering calculation & data analysis platform.
"""

import streamlit as st

st.set_page_config(
    page_title="PETROSOLVE — Engineering Tools",
    page_icon="⚙️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for polished engineering presentation
st.markdown("""
<style>
    .main-title {
        font-size: 2.4rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        font-size: 1.1rem;
        color: #64748b;
        margin-bottom: 2rem;
    }
    .module-card {
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .module-card:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .card-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 8px;
    }
    .card-desc {
        font-size: 0.95rem;
        color: #475569;
        margin-bottom: 16px;
        line-height: 1.5;
    }
    .disclaimer-box {
        background-color: #f8fafc;
        border-left: 4px solid #3b82f6;
        padding: 14px 18px;
        border-radius: 4px;
        margin-top: 30px;
        font-size: 0.88rem;
        color: #475569;
    }
</style>
""", unsafe_allow_html=iFrame=True if hasattr(st, "markdown") else False)

st.markdown('<div class="main-title">PETROSOLVE</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Practical engineering calculations and data analysis tools.</div>', unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("""
    <div class="module-card">
        <div class="card-title">🌊 PIPE FLOW ANALYSER</div>
        <div class="card-desc">Analyse flow through circular pipes using fluid properties, pipe geometry and flow rate. Calculates velocity, Reynolds number, Colebrook-White friction factor, and Darcy-Weisbach pressure drop.</div>
    </div>
    """, unsafe_allow_html=True)
    if st.button("Open Pipe Flow Analyser", key="btn_pipe"):
        st.switch_page("pages/pipe_flow.py")

with col2:
    st.markdown("""
    <div class="module-card">
        <div class="card-title">🔥 HEAT TRANSFER CALCULATOR</div>
        <div class="card-desc">Perform steady-state wall conduction using Fourier's Law and transient Newton's Law of Cooling calculations with interactive analytical curves.</div>
    </div>
    """, unsafe_allow_html=True)
    if st.button("Open Heat Transfer Calculator", key="btn_heat"):
        st.switch_page("pages/heat_transfer.py")

with col3:
    st.markdown("""
    <div class="module-card">
        <div class="card-title">📊 ROCK & FLUID DATA DASHBOARD</div>
        <div class="card-desc">Upload, analyse, filter and visualize engineering rock or fluid datasets with automatic summary statistics, histograms, and porosity-permeability scatterplots.</div>
    </div>
    """, unsafe_allow_html=True)
    if st.button("Open Data Dashboard", key="btn_dashboard"):
        st.switch_page("pages/rock_fluid_dashboard.py")

st.markdown("""
<div class="disclaimer-box">
    <strong>Engineering Safety & Professional Disclaimer:</strong><br/>
    This software is intended for educational, preliminary analysis, and engineering-support purposes. Results should be independently verified by a qualified engineer before being used for safety-critical design, operational, or commercial decisions.
</div>
""", unsafe_allow_html=True)
