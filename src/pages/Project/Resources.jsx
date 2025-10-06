import React, { useState } from 'react';
import { 
  Users, Plus, Edit2, Trash2, Save, X, Download, 
  Filter, Search, Calendar, DollarSign, Clock, AlertCircle
} from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Developer', skills: ['React', 'Node.js'], utilization: 80, budget: 5000 },
    { id: 2, name: 'Bob Smith', role: 'Designer', skills: ['UI/UX', 'Figma'], utilization: 60, budget: 3000 },
    { id: 3, name: 'Charlie Lee', role: 'PM', skills: ['Agile', 'Budgeting'], utilization: 90, budget: 4000 },
  ]);
  const [newResource, setNewResource] = useState({ name: '', role: '', skills: '', utilization: '', budget: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const roles = ['All', 'Developer', 'Designer', 'PM', 'QA'];

  const handleAddOrUpdate = () => {
    if (!newResource.name) return;
    const normalized = { ...newResource, utilization: Number(newResource.utilization) || 0, budget: Number(newResource.budget) || 0, skills: newResource.skills.split(',') };
    if (editingId !== null) {
      setResources(resources.map(r => r.id === editingId ? { ...r, ...normalized } : r));
      setEditingId(null);
    } else {
      setResources([...resources, { id: Date.now(), ...normalized }]);
    }
    setNewResource({ name: '', role: '', skills: '', utilization: '', budget: '' });
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setNewResource({ ...resource, skills: resource.skills.join(','), utilization: String(resource.utilization), budget: String(resource.budget) });
  };

  const handleDelete = (id) => setResources(resources.filter(r => r.id !== id));

  const handleExportCSV = () => {
    const csv = ['Name,Role,Skills,Utilization %,Budget', ...resources.map(r => `${r.name},${r.role},${r.skills.join(',')},${r.utilization},${r.budget}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resources.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || resource.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalUtilization = filteredResources.length ? (filteredResources.reduce((sum, r) => sum + r.utilization, 0) / filteredResources.length).toFixed(0) : 0;
  const totalBudget = filteredResources.reduce((sum, r) => sum + r.budget, 0);
  const overloaded = filteredResources.filter(r => r.utilization > 80).length;

  const getUtilizationColor = (util) => util > 80 ? 'bg-red-500' : util > 60 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Resource Allocation
                </h1>
                <p className="text-blue-200 text-sm">Manage team workloads and budgets</p>
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
                <div className="p-3 bg-white/20 rounded-xl"><Users size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Avg Utilization</p>
              <p className="text-3xl font-bold">{totalUtilization}%</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><DollarSign size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Budget</p>
              <p className="text-3xl font-bold">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><AlertCircle size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-red-100 text-sm font-medium mb-1">Overloaded Resources</p>
              <p className="text-3xl font-bold">{overloaded}</p>
            </div>
          </div>

          {/* Add/Edit Resource Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                {editingId !== null ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{editingId !== null ? 'Edit Resource' : 'Add New Resource'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" placeholder="Resource name" value={newResource.name} onChange={(e) => setNewResource({ ...newResource, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select value={newResource.role} onChange={(e) => setNewResource({ ...newResource, role: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select role</option>
                  {roles.filter(r => r !== 'All').map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                <input type="text" placeholder="e.g., React, Node" value={newResource.skills} onChange={(e) => setNewResource({ ...newResource, skills: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Utilization %</label>
                <input type="number" placeholder="0-100" value={newResource.utilization} onChange={(e) => setNewResource({ ...newResource, utilization: e.target.value })} min="0" max="100" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
                <input type="number" placeholder="0.00" value={newResource.budget} onChange={(e) => setNewResource({ ...newResource, budget: e.target.value })} min="0" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddOrUpdate} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                {editingId !== null ? <Save size={18} /> : <Plus size={18} />} {editingId !== null ? 'Update' : 'Add'} Resource
              </button>
              {editingId !== null && (
                <button onClick={() => { setEditingId(null); setNewResource({ name: '', role: '', skills: '', utilization: '', budget: '' }); }} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200">
                  <X size={18} /> Cancel
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Resources Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Users size={24} /> Resource List
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Skills</th>
                    <th className="px-6 py-4 text-right font-semibold">Utilization %</th>
                    <th className="px-6 py-4 text-right font-semibold">Budget ($)</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map(resource => (
                    <tr key={resource.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700 font-medium">{resource.name}</td>
                      <td className="px-6 py-4 text-gray-900">{resource.role}</td>
                      <td className="px-6 py-4 text-gray-700">{resource.skills.join(', ')}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className={`w-20 h-2 rounded-full ${getUtilizationColor(resource.utilization)}`}></div>
                          <span className="font-semibold">{resource.utilization}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-green-600 font-semibold">${resource.budget.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEdit(resource)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transform hover:scale-110 transition-all duration-200 shadow-md">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(resource.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-md">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredResources.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No resources found</p>
              </div>
            )}
          </div>

          {/* Availability Calendar - Placeholder */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Calendar size={24} /> Availability Calendar
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Render calendar grid; integrate react-calendar for full view */}
              <div className="p-4 bg-blue-100 rounded">Oct 6 (Today)</div>
              {/* ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;