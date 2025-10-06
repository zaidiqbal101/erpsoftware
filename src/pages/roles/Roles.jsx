import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import { 
  Shield, Plus, Edit2, Trash2, Save, X, Download, Search, Check, AlertCircle
} from 'lucide-react';

const Roles = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', hierarchy: 'Top', permissions: ['All Modules - Full Access'], usersCount: 5 },
    { id: 2, name: 'Manager', hierarchy: 'Mid', permissions: ['Finance (CRUD), CRM (Read/Update), Projects (Full)'], usersCount: 12 },
    { id: 3, name: 'Employee', hierarchy: 'Base', permissions: ['HR (Read), Inventory (Read)'], usersCount: 20 },
  ]);

  const [newRole, setNewRole] = useState({ name: '', hierarchy: 'Mid', permissions: [] });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHierarchy, setFilterHierarchy] = useState('All');

  const hierarchies = ['All', 'Top', 'Mid', 'Base'];
  const modules = ['Financial', 'HRM', 'Inventory', 'CRM', 'Projects', 'User Management'];

  const handleAddOrUpdate = () => {
    if (!newRole.name) return;
    if (editingId !== null) {
      setRoles(roles.map(role => role.id === editingId ? { ...role, ...newRole } : role));
      setEditingId(null);
    } else {
      setRoles([...roles, { id: Date.now(), ...newRole, usersCount: 0 }]);
    }
    setNewRole({ name: '', hierarchy: 'Mid', permissions: [] });
  };

  const handleEdit = (role) => {
    setEditingId(role.id);
    setNewRole({ ...role });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure? This will affect all assigned users.')) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  const handleTogglePermission = (module) => {
    const current = newRole.permissions;
    const updated = current.includes(module) 
      ? current.filter(p => p !== module)
      : [...current, module];
    setNewRole({ ...newRole, permissions: updated });
  };

  const handleExportCSV = () => {
    const csv = ['Name,Hierarchy,Permissions,Users Count', ...roles.map(r => `${r.name},${r.hierarchy},"${r.permissions.join('; ')}",${r.usersCount}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roles.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterHierarchy === 'All' || role.hierarchy === filterHierarchy)
  );

  const totalRoles = roles.length;
  const customRoles = roles.filter(r => !['Admin', 'Manager', 'Employee'].includes(r.name)).length;

  const getHierarchyColor = (hierarchy) => {
    switch (hierarchy) {
      case 'Top': return 'bg-red-100 text-red-700';
      case 'Mid': return 'bg-blue-100 text-blue-700';
      case 'Base': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 fixed h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent flex items-center gap-3">
            <Shield size={32} /> Role & Permission Management
          </h1>
          <p className="text-blue-200 text-sm">
            Manage roles, hierarchies, permissions, and user assignments
          </p>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Total Roles</h2>
            <p className="text-2xl font-bold text-blue-600">{totalRoles}</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Custom Roles</h2>
            <p className="text-2xl font-bold text-green-600">{customRoles}</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Top Hierarchy Roles</h2>
            <p className="text-2xl font-bold text-red-600">{roles.filter(r => r.hierarchy === 'Top').length}</p>
          </div>
        </div>

        {/* Add/Edit Role Form */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 max-w-4xl">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            {editingId ? <Edit2 size={20} /> : <Plus size={20} />} {editingId ? "Edit Role" : "Add New Role"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Role Name *" 
              value={newRole.name} 
              onChange={e => setNewRole({...newRole, name: e.target.value})} 
              className="border p-2 rounded"
            />
            <select 
              value={newRole.hierarchy} 
              onChange={e => setNewRole({...newRole, hierarchy: e.target.value})} 
              className="border p-2 rounded"
            >
              {hierarchies.filter(h => h !== 'All').map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <div className="md:col-span-2 flex flex-wrap gap-2">
              {modules.map(m => (
                <button 
                  key={m} 
                  onClick={() => handleTogglePermission(m)}
                  className={`px-3 py-1 rounded border ${newRole.permissions.includes(m) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button 
                onClick={handleAddOrUpdate} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingId ? "Update Role" : "Add Role"}
              </button>
              {editingId && (
                <button 
                  onClick={() => { setEditingId(null); setNewRole({ name: '', hierarchy: 'Mid', permissions: [] }) }} 
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Hierarchy</th>
                <th className="p-2 border">Permissions</th>
                <th className="p-2 border">Users Count</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map(role => (
                <tr key={role.id} className="hover:bg-blue-50 transition">
                  <td className="border px-4 py-2">{role.name}</td>
                  <td className={`border px-4 py-2 font-semibold ${getHierarchyColor(role.hierarchy)}`}>{role.hierarchy}</td>
                  <td className="border px-4 py-2">{role.permissions.join(', ')}</td>
                  <td className="border px-4 py-2">{role.usersCount}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button onClick={() => handleEdit(role)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(role.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredRoles.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">No roles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Roles;
