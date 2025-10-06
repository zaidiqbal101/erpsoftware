import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Calendar, Filter, Download, Plus, Edit2, Trash2, Save, X,
  DollarSign, TrendingUp, TrendingDown, Users
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesForecasting = () => {
  const [forecastData, setForecastData] = useState({
    labels: ['Oct', 'Nov', 'Dec'],
    expected: [20000, 30000, 40000],
    actual: [18000, 28000, 35000],
  });
  const [filterPeriod, setFilterPeriod] = useState('monthly');
  const [forecasts, setForecasts] = useState([
    { id: 1, period: 'Oct 2025', expected: 20000, actual: 18000, rep: 'Alice' },
    { id: 2, period: 'Nov 2025', expected: 30000, actual: 28000, rep: 'Bob' },
    { id: 3, period: 'Dec 2025', expected: 40000, actual: 35000, rep: 'Alice' },
  ]);
  const [newForecast, setNewForecast] = useState({ period: '', expected: '', actual: '', rep: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // API: fetchForecasts()
  }, []);

  const handleAddOrUpdate = () => {
    if (!newForecast.period) return;
    const normalized = { ...newForecast, expected: Number(newForecast.expected) || 0, actual: Number(newForecast.actual) || 0 };
    if (editingId !== null) {
      setForecasts(forecasts.map(f => f.id === editingId ? { ...f, ...normalized } : f));
      setEditingId(null);
    } else {
      setForecasts([...forecasts, { id: Date.now(), ...normalized }]);
    }
    setNewForecast({ period: '', expected: '', actual: '', rep: '' });
  };

  const handleEdit = (forecast) => {
    setEditingId(forecast.id);
    setNewForecast({ ...forecast, expected: String(forecast.expected), actual: String(forecast.actual) });
  };

  const handleDelete = (id) => setForecasts(forecasts.filter(f => f.id !== id));

  const handleExportCSV = () => {
    const csv = ['Period,Expected,Actual,Rep', ...forecasts.map(f => `${f.period},${f.expected},${f.actual},${f.rep}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forecasts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalExpected = forecasts.reduce((sum, f) => sum + f.expected, 0);
  const totalActual = forecasts.reduce((sum, f) => sum + f.actual, 0);
  const achievement = totalExpected > 0 ? ((totalActual / totalExpected) * 100).toFixed(0) : 0;

  const chartData = {
    labels: forecastData.labels,
    datasets: [
      { label: 'Expected', data: forecastData.expected, backgroundColor: 'rgba(59, 130, 246, 0.5)' },
      { label: 'Actual', data: forecastData.actual, backgroundColor: 'rgba(34, 197, 94, 0.5)' },
    ],
  };

  const periods = ['monthly', 'quarterly', 'yearly'];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Sales Forecasting
                </h1>
                <p className="text-blue-200 text-sm">Project revenue and track performance</p>
              </div>
              <button onClick={handleExportCSV} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <Download size={20} /> Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><TrendingUp size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Expected</p>
              <p className="text-3xl font-bold">${totalExpected.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><TrendingDown size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Actual</p>
              <p className="text-3xl font-bold">${totalActual.toLocaleString()}</p>
            </div>
            <div className={`bg-gradient-to-br ${achievement >= 90 ? 'from-green-500 to-emerald-600' : achievement >= 70 ? 'from-yellow-500 to-yellow-600' : 'from-red-500 to-red-600'} rounded-2xl p-6 text-white shadow-xl`}>
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><BarChart3 size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-white/90 text-sm font-medium mb-1">Achievement Rate</p>
              <p className="text-3xl font-bold">{achievement}%</p>
            </div>
          </div>

          {/* Add/Edit Forecast Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                {editingId !== null ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{editingId !== null ? 'Edit Forecast' : 'Add New Forecast'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <input type="text" placeholder="e.g., Oct 2025" value={newForecast.period} onChange={(e) => setNewForecast({ ...newForecast, period: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected ($)</label>
                <input type="number" placeholder="0.00" value={newForecast.expected} onChange={(e) => setNewForecast({ ...newForecast, expected: e.target.value })} min="0" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Actual ($)</label>
                <input type="number" placeholder="0.00" value={newForecast.actual} onChange={(e) => setNewForecast({ ...newForecast, actual: e.target.value })} min="0" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rep</label>
                <input type="text" placeholder="Sales rep" value={newForecast.rep} onChange={(e) => setNewForecast({ ...newForecast, rep: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddOrUpdate} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                {editingId !== null ? <Save size={18} /> : <Plus size={18} />} {editingId !== null ? 'Update' : 'Add'} Forecast
              </button>
              {editingId !== null && (
                <button onClick={() => { setEditingId(null); setNewForecast({ period: '', expected: '', actual: '', rep: '' }); }} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200">
                  <X size={18} /> Cancel
                </button>
              )}
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} className="ml-2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {periods.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <BarChart3 size={24} /> Revenue Forecast
            </h3>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>

          {/* Forecasts Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <DollarSign size={24} /> Forecast Entries
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Period</th>
                    <th className="px-6 py-4 text-right font-semibold">Expected ($)</th>
                    <th className="px-6 py-4 text-right font-semibold">Actual ($)</th>
                    <th className="px-6 py-4 text-left font-semibold">Rep</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {forecasts.map(forecast => (
                    <tr key={forecast.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700 font-medium">{forecast.period}</td>
                      <td className="px-6 py-4 text-right text-blue-600 font-semibold">${forecast.expected.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-green-600 font-semibold">${forecast.actual.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-700">{forecast.rep}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEdit(forecast)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transform hover:scale-110 transition-all duration-200 shadow-md">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(forecast.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-md">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {forecasts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No forecasts found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesForecasting;