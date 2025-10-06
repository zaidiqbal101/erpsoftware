import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Edit2, Trash2, Save, X, Download, 
  Filter, Search, Calendar, DollarSign, BadgeCheck
} from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Acme Corp', stage: 'Qualified', score: 75, value: 5000, closeDate: '2025-10-15', owner: 'Alice' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'Beta Inc', stage: 'Proposal', score: 90, value: 12000, closeDate: '2025-10-20', owner: 'Bob' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', company: 'Gamma Ltd', stage: 'New', score: 40, value: 3000, closeDate: '2025-11-01', owner: 'Alice' },
  ]);
  const [newLead, setNewLead] = useState({ name: '', email: '', company: '', stage: '', score: '', value: '', closeDate: '', owner: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('All');

  const stages = ['All', 'New', 'Qualified', 'Proposal', 'Closed'];

  useEffect(() => {
    // API: fetchLeads()
  }, []);

  const handleAddOrUpdate = () => {
    if (!newLead.name || !newLead.email) return;
    const normalized = { ...newLead, score: Number(newLead.score) || 0, value: Number(newLead.value) || 0 };
    if (editingId !== null) {
      setLeads(leads.map(lead => lead.id === editingId ? { ...lead, ...normalized } : lead));
      setEditingId(null);
    } else {
      setLeads([...leads, { id: Date.now(), ...normalized }]);
    }
    setNewLead({ name: '', email: '', company: '', stage: '', score: '', value: '', closeDate: '', owner: '' });
  };

  const handleEdit = (lead) => {
    setEditingId(lead.id);
    setNewLead({ ...lead, score: String(lead.score), value: String(lead.value) });
  };

  const handleDelete = (id) => setLeads(leads.filter(lead => lead.id !== id));

  const handleExportCSV = () => {
    const csv = [
      'Name,Email,Company,Stage,Score,Value,Close Date,Owner',
      ...leads.map(lead => `${lead.name},${lead.email},${lead.company},${lead.stage},${lead.score},${lead.value},${lead.closeDate},${lead.owner}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredData = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'All' || lead.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const totalValue = filteredData.reduce((sum, lead) => sum + lead.value, 0);
  const avgScore = filteredData.length ? (filteredData.reduce((sum, lead) => sum + lead.score, 0) / filteredData.length).toFixed(0) : 0;
  const qualifiedCount = filteredData.filter(lead => lead.stage === 'Qualified').length;

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getStageColor = (stage) => {
    switch (stage) {
      case 'New': return 'bg-yellow-100 text-yellow-700';
      case 'Qualified': return 'bg-blue-100 text-blue-700';
      case 'Proposal': return 'bg-purple-100 text-purple-700';
      case 'Closed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Leads & Opportunities
                </h1>
                <p className="text-blue-200 text-sm">Manage your sales pipeline and track progress</p>
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
              <p className="text-blue-100 text-sm font-medium mb-1">Total Pipeline Value</p>
              <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><BadgeCheck size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Avg Lead Score</p>
              <p className="text-3xl font-bold">{avgScore}%</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><Users size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-purple-100 text-sm font-medium mb-1">Qualified Leads</p>
              <p className="text-3xl font-bold">{qualifiedCount}</p>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                {editingId !== null ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{editingId !== null ? 'Edit Lead' : 'Add New Lead'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" placeholder="Lead name" value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" placeholder="email@example.com" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input type="text" placeholder="Company name" value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <select value={newLead.stage} onChange={(e) => setNewLead({ ...newLead, stage: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select stage</option>
                  {stages.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Score (%)</label>
                <input type="number" placeholder="0-100" value={newLead.score} onChange={(e) => setNewLead({ ...newLead, score: e.target.value })} min="0" max="100" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value ($)</label>
                <input type="number" placeholder="0.00" value={newLead.value} onChange={(e) => setNewLead({ ...newLead, value: e.target.value })} min="0" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Close Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input type="date" value={newLead.closeDate} onChange={(e) => setNewLead({ ...newLead, closeDate: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
                <input type="text" placeholder="Assigned rep" value={newLead.owner} onChange={(e) => setNewLead({ ...newLead, owner: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddOrUpdate} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                {editingId !== null ? <Save size={18} /> : <Plus size={18} />} {editingId !== null ? 'Update' : 'Add'} Lead
              </button>
              {editingId !== null && (
                <button onClick={() => { setEditingId(null); setNewLead({ name: '', email: '', company: '', stage: '', score: '', value: '', closeDate: '', owner: '' }); }} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200">
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
                <input type="text" placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Users size={24} /> Lead Entries
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Company</th>
                    <th className="px-6 py-4 text-left font-semibold">Stage</th>
                    <th className="px-6 py-4 text-left font-semibold">Score</th>
                    <th className="px-6 py-4 text-right font-semibold">Value ($)</th>
                    <th className="px-6 py-4 text-left font-semibold">Close Date</th>
                    <th className="px-6 py-4 text-left font-semibold">Owner</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(lead => (
                    <tr key={lead.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700 font-medium">{lead.name}</td>
                      <td className="px-6 py-4 text-gray-900">{lead.company}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStageColor(lead.stage)}`}>{lead.stage}</span>
                      </td>
                      <td className="px-6 py-4 text-blue-600 font-semibold">{lead.score}%</td>
                      <td className="px-6 py-4 text-right text-green-600 font-semibold">${lead.value.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-700">{formatDate(lead.closeDate)}</td>
                      <td className="px-6 py-4 text-gray-700">{lead.owner}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEdit(lead)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transform hover:scale-110 transition-all duration-200 shadow-md">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(lead.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-md">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No leads found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;