import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Clock, Plus, Edit2, Trash2, Save, X, Download,
  Filter, User, Mail, Phone, Calendar
} from 'lucide-react';

const CustomerHistory = () => {
  const [customer, setCustomer] = useState({ id: 1, name: 'Acme Corp', email: 'info@acme.com', phone: '+1-555-0123', company: 'Acme Corp', industry: 'Tech', totalSpend: 25000 });
  const [logs, setLogs] = useState([
    { id: 1, type: 'email', timestamp: '2025-10-01T10:00:00', content: 'Follow-up on proposal sent', user: 'Alice' },
    { id: 2, type: 'call', timestamp: '2025-10-03T14:30:00', content: 'Discussed requirements and next steps', user: 'Bob' },
    { id: 3, type: 'meeting', timestamp: '2025-10-05T09:00:00', content: 'In-person demo scheduled', user: 'Alice' },
  ]);
  const [newLog, setNewLog] = useState({ type: '', content: '', user: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // API: fetchCustomerHistory(customer.id)
  }, []);

  const handleAddOrUpdateLog = () => {
    if (!newLog.content) return;
    const normalized = { ...newLog, timestamp: new Date().toISOString() };
    if (editingId !== null) {
      setLogs(logs.map(log => log.id === editingId ? { ...log, ...normalized } : log));
      setEditingId(null);
    } else {
      setLogs([...logs, { id: Date.now(), ...normalized }]);
    }
    setNewLog({ type: '', content: '', user: '' });
  };

  const handleEdit = (log) => {
    setEditingId(log.id);
    setNewLog({ type: log.type, content: log.content, user: log.user });
  };

  const handleDelete = (id) => setLogs(logs.filter(log => log.id !== id));

  const handleExportCSV = () => {
    const csv = ['Type,Timestamp,Content,User', ...logs.map(log => `${log.type},${log.timestamp},${log.content},${log.user}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log => log.content.toLowerCase().includes(search.toLowerCase())).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const totalInteractions = logs.length;
  const recentActivity = logs.slice(0, 1)[0]?.timestamp ? new Date(logs[0].timestamp).toLocaleDateString() : 'None';
  const emailCount = logs.filter(log => log.type === 'email').length;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return <Mail size={20} className="text-blue-500" />;
      case 'call': return <Phone size={20} className="text-green-500" />;
      case 'meeting': return <Calendar size={20} className="text-purple-500" />;
      default: return <Clock size={20} className="text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'email': return 'bg-blue-50 text-blue-700';
      case 'call': return 'bg-green-50 text-green-700';
      case 'meeting': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
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
                  {customer.name} History
                </h1>
                <p className="text-blue-200 text-sm">Communication logs and activity timeline</p>
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
                <div className="p-3 bg-white/20 rounded-xl"><User size={24} /></div>
                <FileText size={32} className="opacity-30" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Spend</p>
              <p className="text-3xl font-bold">${customer.totalSpend.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><Clock size={24} /></div>
                <FileText size={32} className="opacity-30" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Interactions</p>
              <p className="text-3xl font-bold">{totalInteractions}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><Mail size={24} /></div>
                <FileText size={32} className="opacity-30" />
              </div>
              <p className="text-purple-100 text-sm font-medium mb-1">Email Count</p>
              <p className="text-3xl font-bold">{emailCount}</p>
            </div>
          </div>

          {/* Customer Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <User size={24} /> Profile Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Name</label><p className="text-lg font-semibold">{customer.name}</p></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><p>{customer.email}</p></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone</label><p>{customer.phone}</p></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Industry</label><span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{customer.industry}</span></div>
            </div>
          </div>

          {/* Add/Edit Log Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                {editingId !== null ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{editingId !== null ? 'Edit Log' : 'Add New Log'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select value={newLog.type} onChange={(e) => setNewLog({ ...newLog, type: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select type</option>
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <input type="text" placeholder="Log details" value={newLog.content} onChange={(e) => setNewLog({ ...newLog, content: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <input type="text" placeholder="Assigned user" value={newLog.user} onChange={(e) => setNewLog({ ...newLog, user: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddOrUpdateLog} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                {editingId !== null ? <Save size={18} /> : <Plus size={18} />} {editingId !== null ? 'Update' : 'Add'} Log
              </button>
              {editingId !== null && (
                <button onClick={() => { setEditingId(null); setNewLog({ type: '', content: '', user: '' }); }} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200">
                  <X size={18} /> Cancel
                </button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <Clock size={24} /> Activity Timeline
            </h3>
            {filteredLogs.map(log => (
              <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-white rounded-full shadow">{getTypeIcon(log.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(log.type)}`}>{log.type.toUpperCase()}</span>
                    <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <p className="text-gray-900 mb-2">{log.content}</p>
                  <p className="text-sm text-gray-600">By {log.user}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEdit(log)} className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transform hover:scale-110 transition-all duration-200">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(log.id)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transform hover:scale-110 transition-all duration-200">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Clock size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No logs found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHistory;