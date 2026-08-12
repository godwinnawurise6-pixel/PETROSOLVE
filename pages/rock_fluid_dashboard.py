"""
PETROSOLVE - Rock & Fluid Data Dashboard Module
"""

import streamlit as st
import pandas as pd
import io
from engineering import RockFluidDataset

st.set_page_config(page_title="Data Dashboard — PETROSOLVE", layout="wide")

if st.button("← Back to PETROSOLVE"):
    st.switch_page("app.py")

st.title("📊 Rock & Fluid Data Dashboard")
st.caption("Upload, analyse, filter, and visualize rock core or reservoir fluid property datasets.")

uploaded_file = st.file_uploader("Upload Engineering Dataset (.csv)", type=["csv"])

if uploaded_file is not None:
    try:
        df_raw = pd.read_csv(uploaded_file)
        rows_data = df_raw.to_dict(orient="records")
        dataset = RockFluidDataset(rows_data, uploaded_file.name)
        st.success(f"Successfully loaded '{uploaded_file.name}' with {len(df_raw)} rows and {len(df_raw.columns)} columns.")
    except Exception as e:
        st.error(f"Error parsing CSV file: {e}")
        st.stop()
else:
    st.info("Using default sample rock core dataset. Upload a CSV file above to analyse custom data.")
    sample_data = RockFluidDataset.get_sample_rock_data()
    dataset = RockFluidDataset(sample_data, "sample_core_data.csv")
    df_raw = pd.DataFrame(sample_data)

st.subheader("Dataset Preview & Structure")
st.dataframe(df_raw.head(10), use_container_width=True)

st.subheader("Summary Statistics")
stats = dataset.get_summary_statistics()
if stats:
    df_stats = pd.DataFrame(stats).T
    st.dataframe(df_stats, use_container_width=True)

st.subheader("Dynamic Filtering")
filter_col = st.selectbox("Select Numeric Column to Filter", dataset.numeric_columns)
if filter_col:
    min_v = float(df_raw[filter_col].min())
    max_v = float(df_raw[filter_col].max())
    selected_range = st.slider(f"Filter Range for {filter_col}", min_v, max_v, (min_v, max_v))

    filtered_rows = dataset.filter_data({filter_col: selected_range})
    df_filtered = pd.DataFrame(filtered_rows)

    st.write(f"Displaying **{len(df_filtered)}** of **{len(df_raw)}** records.")
    st.dataframe(df_filtered, use_container_width=True)

    csv_data = df_filtered.to_csv(index=False).encode('utf-8')
    st.download_button("📥 Download Filtered CSV", csv_data, "filtered_petrosolve_data.csv", "text/csv")

st.subheader("Engineering Visualizations")
v1, v2 = st.columns(2)

with v1:
    poro_cols = [c for c in dataset.numeric_columns if "poro" in c.lower()]
    if poro_cols:
        p_col = poro_cols[0]
        st.markdown(f"**Porosity Distribution Histogram ({p_col})**")
        counts, bins = pd.cut(df_raw[p_col], bins=8, retbins=True)
        st.bar_chart(counts.value_counts().sort_index())
    else:
        st.info("No Porosity column detected for automatic histogram.")

with v2:
    perm_cols = [c for c in dataset.numeric_columns if "perm" in c.lower()]
    if poro_cols and perm_cols:
        st.markdown(f"**Porosity vs Permeability Crossplot**")
        st.scatter_chart(df_raw, x=poro_cols[0], y=perm_cols[0])
    else:
        st.info("Requires Porosity and Permeability columns for scatter plot.")
