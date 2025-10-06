import React, { useState } from 'react';
import { 
  Download, Filter, Search, Calendar, DollarSign, Users, Package, 
  TrendingUp, TrendingDown, BarChart3, PieChart
} from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [filterDate, setFilterDate] = useState('monthly');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data based on ERP features (as of Oct 06, 2025)
  const metrics = {
    totalRevenue: 125000,
    activeUsers: 45,
    inventoryValue: 75000,
    leadsGenerated: 120,
    projectsCompleted: 8,
    employeeAttendance: 98.5,
    budgetUtilization: 72
  };

  const filteredData = { /* Mock filtered based on search - simplified */ };

  const handleExportCSV = () => {
    const csv = [
      'Metric,Value,Trend',
      `Total Revenue,${metrics.totalRevenue},+12%`,
      `Active Users,${metrics.activeUsers},+5%`,
      // ... more rows
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Charts Data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      { label: 'Revenue ($)', data: [20000, 25000, 30000, 28000, 35000, 40000, 38000, 42000, 45000], backgroundColor: 'rgba(59, 130, 246, 0.5)' }
    ]
  };

  const userGrowthData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      { label: 'Active Users', data: [30, 35, 42, 45], borderColor: 'rgba(34, 197, 94, 1)', backgroundColor: 'rgba(34, 197, 94, 0.2)' }
    ]
  };

  const inventoryPieData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      { data: [70, 20, 10], backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)'] }
    ]
  };

  const options = { responsive: true, plugins: { legend: { position: 'top' } } };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Analytics Overview
                </h1>
                <p className="text-blue-200 text-sm">Real-time insights across all ERP modules</p>
              </div>
              <button onClick={handleExportCSV} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <Download size={20} /> Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {/* Summary Cards - Key KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><DollarSign size={24} /></div>
                <TrendingUp size={32} className="opacity-30" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><Users size={24} /></div>
                <TrendingUp size={32} className="opacity-30" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Active Users</p>
              <p className="text-3xl font-bold">{metrics.activeUsers}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><Package size={24} /></div>
                <TrendingDown size={32} className="opacity-30" />
              </div>
              <p className="text-purple-100 text-sm font-medium mb-1">Inventory Value</p>
              <p className="text-3xl font-bold">${metrics.inventoryValue.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><BarChart3 size={24} /></div>
                <TrendingUp size={32} className="opacity-30" />
              </div>
              <p className="text-orange-100 text-sm font-medium mb-1">Leads Generated</p>
              <p className="text-3xl font-bold">{metrics.leadsGenerated}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" placeholder="Search metrics..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Trend - Line Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <DollarSign size={24} /> Revenue Trend
              </h3>
              <Line data={revenueChartData} options={options} />
            </div>

            {/* Inventory Distribution - Pie Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Package size={24} /> Inventory Distribution
              </h3>
              <Pie data={inventoryPieData} options={options} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Growth - Bar Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Users size={24} /> User Growth
              </h3>
              <Bar data={userGrowthData} options={options} />
            </div>

            {/* Projects Overview - Bar Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <BarChart3 size={24} /> Projects Status
              </h3>
              <Bar data={{
                labels: ['Completed', 'In Progress', 'Pending'],
                datasets: [{ label: 'Projects', data: [8, 5, 3], backgroundColor: ['rgba(34, 197, 94, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(239, 68, 68, 0.5)'] }]
              }} options={options} />
            </div>
          </div>

          {/* Detailed Metrics Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mt-8">
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <BarChart3 size={24} /> Detailed Analytics
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Module</th>
                    <th className="px-6 py-4 text-left font-semibold">Metric</th>
                    <th className="px-6 py-4 text-right font-semibold">Value</th>
                    <th className="px-6 py-4 text-right font-semibold">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-gray-700 font-medium">Financial</td>
                    <td className="px-6 py-4 text-gray-900">Budget Utilization</td>
                    <td className="px-6 py-4 text-right text-green-600 font-semibold">{metrics.budgetUtilization}%</td>
                    <td className="px-6 py-4 text-right text-green-600">+8%</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-gray-700 font-medium">HRM</td>
                    <td className="px-6 py-4 text-gray-900">Employee Attendance</td>
                    <td className="px-6 py-4 text-right text-blue-600 font-semibold">{metrics.employeeAttendance}%</td>
                    <td className="px-6 py-4 text-right text-blue-600">+2%</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-gray-700 font-medium">Projects</td>
                    <td className="px-6 py-4 text-gray-900">Projects Completed</td>
                    <td className="px-6 py-4 text-right text-purple-600 font-semibold">{metrics.projectsCompleted}</td>
                    <td className="px-6 py-4 text-right text-purple-600">+3</td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;