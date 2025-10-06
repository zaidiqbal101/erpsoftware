// pages/users/Users.jsx
import React, { useState } from 'react';
import { 
  Users as UsersIcon, Plus, Edit2, Trash2, Save, X, Download, 
  Filter, Search, User, Shield, Upload, AlertCircle, FileText, CheckCircle, DollarSign
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@flyweis.com', role: 'Admin', department: 'IT', status: 'Active', lastLogin: '2025-10-05' },
    { id: 2, name: 'Jane Smith', email: 'jane@flyweis.com', role: 'Manager', department: 'Sales', status: 'Active', lastLogin: '2025-10-06' },
    { id: 3, name: 'Bob Johnson', email: 'bob@flyweis.com', role: 'Employee', department: 'HR', status: 'Suspended', lastLogin: '2025-10-04' },
  ]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', department: '', status: 'Active' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const roles = ['All', 'Admin', 'Manager', 'Employee'];
  const departments = ['IT', 'Sales', 'HR', 'Finance', 'Inventory'];
  const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

  const handleAddOrUpdate = () => {
    if (!newUser.name || !newUser.email) return;
    if (editingId !== null) {
      setUsers(users.map(user => user.id === editingId ? { ...user, ...newUser } : user));
      setEditingId(null);
    } else {
      setUsers([...users, { id: Date.now(), ...newUser, lastLogin: 'Just Now' }]);
    }
    setNewUser({ name: '', email: '', role: '', department: '', status: 'Active' });
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setNewUser({ ...user });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert('Bulk upload simulated. Added 5 users.');
      setShowBulkUpload(false);
    }
  };

  const handleExportCSV = () => {
    const csv = ['Name,Email,Role,Department,Status,Last Login', ...users.map(u => `${u.name},${u.email},${u.role},${u.department},${u.status},${u.lastLogin}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const suspendedUsers = users.filter(u => u.status === 'Suspended').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Inactive': return 'bg-gray-100 text-gray-700';
      case 'Suspended': return 'bg-red-100 text-red-700';
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
                  User Management
                </h1>
                <p className="text-blue-200 text-sm">Manage users, roles, and permissions</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowBulkUpload(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  <Upload size={18} /> Bulk Upload
                </button>
                <button onClick={handleExportCSV} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  <Download size={18} /> Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><UsersIcon size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
              <p className="text-3xl font-bold">{totalUsers}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><CheckCircle size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Active Users</p>
              <p className="text-3xl font-bold">{activeUsers}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><AlertCircle size={24} /></div>
                <DollarSign size={32} className="opacity-30" />
              </div>
              <p className="text-red-100 text-sm font-medium mb-1">Suspended Users</p>
              <p className="text-3xl font-bold">{suspendedUsers}</p>
            </div>
          </div>

          {/* Add/Edit User Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                {editingId !== null ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{editingId !== null ? 'Edit User' : 'Add New User'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" placeholder="Full name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" placeholder="user@flyweis.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={newUser.status} onChange={(e) => setNewUser({ ...newUser, status: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddOrUpdate} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                {editingId !== null ? <Save size={18} /> : <Plus size={18} />} {editingId !== null ? 'Update' : 'Add'} User
              </button>
              {editingId !== null && (
                <button onClick={() => { setEditingId(null); setNewUser({ name: '', email: '', role: '', department: '', status: 'Active' }); }} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200">
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
                <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full md:w-32 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:w-32 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <UsersIcon size={24} /> Users List
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Department</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Last Login</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700 font-medium flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.lastLogin}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEdit(user)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transform hover:scale-110 transition-all duration-200 shadow-md">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-md">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <UsersIcon size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No users found</p>
              </div>
            )}
          </div>

          {/* Bulk Upload Modal */}
          {showBulkUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Bulk Upload Users</h3>
                <input type="file" accept=".csv" onChange={handleBulkUpload} className="w-full px-4 py-2 border border-gray-300 rounded-xl mb-4" />
                <div className="flex gap-3">
                  <button onClick={handleBulkUpload} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold">Upload</button>
                  <button onClick={() => setShowBulkUpload(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FileText size={24} /> Audit Logs
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Recent user activity and changes (last 7 days).</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date/Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm text-gray-900">Role updated</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Admin (john@flyweis.com)</td>
                      <td className="px-4 py-3 text-sm text-gray-700">2025-10-06 10:30 AM</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm text-gray-900">User suspended</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Manager (jane@flyweis.com)</td>
                      <td className="px-4 py-3 text-sm text-gray-700">2025-10-05 3:15 PM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Users;
