import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { RawRowData } from '../types';
import { DatasetEngine } from '../lib/engineeringEngine';
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis
} from 'recharts';
import {
  Database,
  Upload,
  Download,
  Filter,
  BarChart2,
  Table,
  FileSpreadsheet,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const RockFluidModule: React.FC = () => {
  const [rows, setRows] = useState<RawRowData[]>(() => DatasetEngine.getSampleCoreDataset());
  const [filename, setFilename] = useState<string>('sample_rock_core_data.csv');
  const [isSampleLoaded, setIsSampleLoaded] = useState<boolean>(true);

  // Filter state: column -> [min, max]
  const [activeFilterCol, setActiveFilterCol] = useState<string>('');
  const [filterMin, setFilterMin] = useState<number>(0);
  const [filterMax, setFilterMax] = useState<number>(100);

  // Custom Chart Builder state
  const [chartXCol, setChartXCol] = useState<string>('');
  const [chartYCol, setChartYCol] = useState<string>('');
  const [useLogY, setUseLogY] = useState<boolean>(false);

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setRows(results.data as RawRowData[]);
          setFilename(file.name);
          setIsSampleLoaded(false);
          setActiveFilterCol('');
        }
      },
      error: (err) => {
        alert('Failed to parse CSV: ' + err.message);
      }
    });
  };

  // Reset to default sample dataset
  const handleResetSample = () => {
    setRows(DatasetEngine.getSampleCoreDataset());
    setFilename('sample_rock_core_data.csv');
    setIsSampleLoaded(true);
    setActiveFilterCol('');
  };

  // Numeric columns and statistics
  const numericCols = useMemo(() => DatasetEngine.getNumericColumns(rows), [rows]);
  const statsList = useMemo(() => DatasetEngine.computeSummaryStatistics(rows), [rows]);

  // Set default filter column when numericCols change
  React.useEffect(() => {
    if (numericCols.length > 0 && !activeFilterCol) {
      const defaultCol = numericCols.find((c) => c.toLowerCase().includes('poro')) || numericCols[0];
      setActiveFilterCol(defaultCol);
      const stat = statsList.find((s) => s.column === defaultCol);
      if (stat) {
        setFilterMin(stat.min);
        setFilterMax(stat.max);
      }
    }
    if (numericCols.length >= 2 && (!chartXCol || !chartYCol)) {
      const poro = numericCols.find((c) => c.toLowerCase().includes('poro')) || numericCols[0];
      const perm = numericCols.find((c) => c.toLowerCase().includes('perm')) || numericCols[1];
      setChartXCol(poro);
      setChartYCol(perm);
    }
  }, [numericCols, statsList]);

  // Handle filter column change
  const handleFilterColChange = (col: string) => {
    setActiveFilterCol(col);
    const stat = statsList.find((s) => s.column === col);
    if (stat) {
      setFilterMin(stat.min);
      setFilterMax(stat.max);
    }
  };

  // Filtered dataset
  const filteredRows = useMemo(() => {
    if (!activeFilterCol) return rows;
    return DatasetEngine.filterData(rows, {
      [activeFilterCol]: [filterMin, filterMax]
    });
  }, [rows, activeFilterCol, filterMin, filterMax]);

  // Export filtered CSV
  const handleExportFilteredCsv = () => {
    if (!filteredRows || filteredRows.length === 0) return;
    const csvStr = Papa.unparse(filteredRows);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered_${filename}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Porosity Histogram Generator
  const porosityCol = useMemo(() => {
    return numericCols.find((c) => c.toLowerCase().includes('poro'));
  }, [numericCols]);

  const histogramData = useMemo(() => {
    if (!porosityCol) return [];
    const vals = rows
      .map((r) => Number(r[porosityCol]))
      .filter((v) => !isNaN(v))
      .sort((a, b) => a - b);

    if (vals.length === 0) return [];
    const min = vals[0];
    const max = vals[vals.length - 1];
    const numBins = 6;
    const step = (max - min) / numBins || 1;

    const bins = Array.from({ length: numBins }, (_, i) => ({
      rangeLabel: `${(min + i * step).toFixed(1)} - ${(min + (i + 1) * step).toFixed(1)}%`,
      count: 0
    }));

    for (const v of vals) {
      let idx = Math.floor((v - min) / step);
      if (idx >= numBins) idx = numBins - 1;
      bins[idx].count++;
    }

    return bins;
  }, [rows, porosityCol]);

  // Scatter plot data
  const scatterData = useMemo(() => {
    if (!chartXCol || !chartYCol) return [];
    return rows
      .map((r) => {
        const x = Number(r[chartXCol]);
        const y = Number(r[chartYCol]);
        return {
          x,
          y: useLogY && y <= 0 ? 0.001 : y,
          label: r['Sample_ID'] || r['ID'] || ''
        };
      })
      .filter((pt) => !isNaN(pt.x) && !isNaN(pt.y));
  }, [rows, chartXCol, chartYCol, useLogY]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Rock & Fluid Data Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Analyse, filter, and visualize rock core samples or reservoir fluid datasets.
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex items-center space-x-3">
          {!isSampleLoaded && (
            <button
              onClick={handleResetSample}
              className="inline-flex items-center px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-full transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Load Sample Data
            </button>
          )}
          <label className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full transition-colors cursor-pointer shadow-2xs">
            <Upload className="w-4 h-4 mr-2" />
            <span>Upload CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Dataset Metadata Bar */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-3">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-xs text-slate-400 block">Active File</span>
            <span className="text-sm font-bold text-white font-mono">{filename}</span>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-xs">
          <div>
            <span className="text-slate-400 block">Total Records</span>
            <span className="text-sm font-bold text-white font-mono">{rows.length} rows</span>
          </div>
          <div>
            <span className="text-slate-400 block">Columns</span>
            <span className="text-sm font-bold text-white font-mono">{Object.keys(rows[0] || {}).length} cols</span>
          </div>
          <div>
            <span className="text-slate-400 block">Numeric Columns</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">{numericCols.length} found</span>
          </div>
        </div>
      </div>

      {/* Data Summary Statistics Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-display font-bold text-slate-900 flex items-center space-x-2">
          <Table className="w-4 h-4 text-emerald-600" />
          <span>Summary Statistics (Numeric Features)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-900">
                <th className="py-2.5 px-3 font-semibold">Column</th>
                <th className="py-2.5 px-3 font-semibold text-right">Count</th>
                <th className="py-2.5 px-3 font-semibold text-right">Mean</th>
                <th className="py-2.5 px-3 font-semibold text-right">Std Dev</th>
                <th className="py-2.5 px-3 font-semibold text-right">Min</th>
                <th className="py-2.5 px-3 font-semibold text-right">25%</th>
                <th className="py-2.5 px-3 font-semibold text-right">Median (50%)</th>
                <th className="py-2.5 px-3 font-semibold text-right">75%</th>
                <th className="py-2.5 px-3 font-semibold text-right">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {statsList.map((st) => (
                <tr key={st.column} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-bold text-slate-900">{st.column}</td>
                  <td className="py-2 px-3 text-right">{st.count}</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">{st.mean}</td>
                  <td className="py-2 px-3 text-right text-slate-500">{st.std}</td>
                  <td className="py-2 px-3 text-right">{st.min}</td>
                  <td className="py-2 px-3 text-right">{st.p25}</td>
                  <td className="py-2 px-3 text-right font-semibold">{st.median}</td>
                  <td className="py-2 px-3 text-right">{st.p75}</td>
                  <td className="py-2 px-3 text-right">{st.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Range Filter Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-display font-bold text-slate-900">Dynamic Feature Filter</h2>
          </div>
          <button
            onClick={handleExportFilteredCsv}
            className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
            id="export-filtered-csv-btn"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download Filtered CSV ({filteredRows.length} rows)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Column selector */}
          <div className="md:col-span-4">
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              Filter Column
            </label>
            <select
              value={activeFilterCol}
              onChange={(e) => handleFilterColChange(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {numericCols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Min input */}
          <div className="md:col-span-4">
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              Minimum Value
            </label>
            <input
              type="number"
              step="any"
              value={filterMin}
              onChange={(e) => setFilterMin(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Max input */}
          <div className="md:col-span-4">
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              Maximum Value
            </label>
            <input
              type="number"
              step="any"
              value={filterMax}
              onChange={(e) => setFilterMax(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filtered Data Table Preview */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing filtered records ({filteredRows.length} of {rows.length})</span>
            {filteredRows.length === 0 && (
              <span className="text-amber-600 font-semibold">No records match the active filter range.</span>
            )}
          </div>
          <div className="overflow-x-auto max-h-60 border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 text-slate-900 sticky top-0">
                <tr>
                  {Object.keys(rows[0] || {}).map((h) => (
                    <th key={h} className="py-2 px-3 border-b border-slate-200 font-bold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRows.slice(0, 50).map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    {Object.keys(rows[0] || {}).map((h) => (
                      <td key={h} className="py-1.5 px-3 whitespace-nowrap text-slate-800">
                        {r[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Engineering Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Porosity Histogram */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-display font-bold text-slate-900 flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                <span>Porosity Distribution Histogram</span>
              </h3>
              <p className="text-xs text-slate-500">
                Frequency distribution of core sample porosity values.
              </p>
            </div>
          </div>

          {porosityCol ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="rangeLabel"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    label={{ value: `Porosity Range (${porosityCol})`, position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11 }}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    label={{ value: 'Sample Count', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs">
              <AlertCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No Porosity Column Detected</p>
              <p className="mt-1">Uploaded dataset must contain a numeric column with 'poro' in its header name to display a porosity histogram.</p>
            </div>
          )}
        </div>

        {/* Chart 2: Porosity vs Permeability Crossplot */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-display font-bold text-slate-900">Feature Scatter Crossplot</h3>
              <p className="text-xs text-slate-500">Interactive property crossplot.</p>
            </div>

            {/* Custom axis selectors */}
            <div className="flex items-center space-x-2 text-xs">
              <select
                value={chartXCol}
                onChange={(e) => setChartXCol(e.target.value)}
                className="px-2 py-1 border border-slate-200 rounded-lg bg-white text-xs font-mono text-slate-800"
              >
                {numericCols.map((c) => (
                  <option key={c} value={c}>
                    X: {c}
                  </option>
                ))}
              </select>
              <select
                value={chartYCol}
                onChange={(e) => setChartYCol(e.target.value)}
                className="px-2 py-1 border border-slate-200 rounded-lg bg-white text-xs font-mono text-slate-800"
              >
                {numericCols.map((c) => (
                  <option key={c} value={c}>
                    Y: {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="x"
                  name={chartXCol}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  label={{ value: chartXCol, position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  dataKey="y"
                  name={chartYCol}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  label={{ value: chartYCol, angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 11 }}
                />
                <ZAxis dataKey="label" name="Sample" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                />
                <Scatter name="Core Samples" data={scatterData} fill="#06b6d4" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
